import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { Calendar, MapPin, PencilLine, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, CITIES } from "../data";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventsContext";
import { useNotifications } from "../context/NotificationsContext";
import { getApiError } from "../lib/api";
import { formatPrice } from "../lib/formatters";
import { getCityLocation } from "../lib/india-locations";
import type { EventRecord } from "../types";

const eventFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters long."),
  categoryId: z.string().min(2, "Please select a category."),
  date: z.string().trim().min(3, "Date is required."),
  time: z.string().trim().min(2, "Time is required."),
  city: z.string().min(2, "Please select a city."),
  venue: z.string().trim().min(2, "Venue is required."),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  image: z.string().url("Please enter a valid image URL."),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters long."),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const defaultValues: EventFormValues = {
  title: "",
  categoryId: "concerts",
  date: "",
  time: "",
  city: "New Delhi",
  venue: "",
  price: 0,
  image: "",
  description: "",
};

export function MyEvents() {
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { isBootstrapping, isAuthenticated, user } = useAuth();
  const { pushNotification } = useNotifications();
  const { events, createEvent, updateEvent, deleteEvent } = useEvents();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
  });
  const selectedCity = watch("city");
  const selectedLocation = getCityLocation(selectedCity);
  const isAdmin = user?.role === "admin";
  const editEventId = searchParams.get("edit");
  const manageableEvents = isAdmin
    ? events
    : events.filter((event) => event.createdBy === user?.id);

  useEffect(() => {
    if (!editingEvent) {
      reset(defaultValues);
      return;
    }

    reset({
      title: editingEvent.title,
      categoryId: editingEvent.categoryId,
      date: editingEvent.date,
      time: editingEvent.time,
      city: editingEvent.city,
      venue: editingEvent.venue,
      price: editingEvent.price,
      image: editingEvent.image,
      description: editingEvent.description,
    });
  }, [editingEvent, reset]);

  useEffect(() => {
    if (!editEventId) {
      return;
    }

    const eventToEdit = manageableEvents.find((event) => event.id === editEventId);

    if (eventToEdit) {
      setEditingEvent(eventToEdit);
    }
  }, [editEventId, manageableEvents]);

  function updateEditParam(eventId: string | null) {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (eventId) {
      nextSearchParams.set("edit", eventId);
    } else {
      nextSearchParams.delete("edit");
    }

    setSearchParams(nextSearchParams, { replace: true });
  }

  function openCreateForm() {
    setEditingEvent(null);
    reset(defaultValues);
    updateEditParam(null);
  }

  function openEditForm(event: EventRecord) {
    setEditingEvent(event);
    updateEditParam(event.id);
  }

  async function onSubmit(values: EventFormValues) {
    const category = CATEGORIES.find((entry) => entry.id === values.categoryId);
    const cityLocation = getCityLocation(values.city);
    const payload = {
      ...values,
      categoryName: category?.name ?? values.categoryId,
      lat: cityLocation?.lat,
      lng: cityLocation?.lng,
    };

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, payload);
        toast.success("Your event was updated.");
        pushNotification({
          title: "Event updated",
          body: `${values.title} is live with your latest changes.`,
          href: `/event/${editingEvent.id}`,
        });
      } else {
        const createdEvent = await createEvent(payload);
        toast.success("Your event is now live.");
        pushNotification({
          title: "Event published",
          body: `${values.title} is now available for bookings.`,
          href: `/event/${createdEvent.id}`,
        });
      }

      setEditingEvent(null);
      reset(defaultValues);
      updateEditParam(null);
    } catch (error) {
      toast.error(getApiError(error, "Unable to save your event right now."));
    }
  }

  async function handleDelete(eventId: string) {
    if (!window.confirm("Delete this event from the platform?")) {
      return;
    }

    try {
      const deletedEvent = manageableEvents.find((event) => event.id === eventId);
      await deleteEvent(eventId);
      toast.success("Event removed successfully.");
      pushNotification({
        title: "Event removed",
        body: deletedEvent
          ? `${deletedEvent.title} was removed from the platform.`
          : "The event was removed from the platform.",
      });

      if (editingEvent?.id === eventId) {
        setEditingEvent(null);
        reset(defaultValues);
      }

      if (editEventId === eventId) {
        updateEditParam(null);
      }
    } catch (error) {
      toast.error(getApiError(error, "Unable to delete your event right now."));
    }
  }

  if (isBootstrapping) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 text-slate-300">
        Loading your event workspace...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-16">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center">
          <h1 className="text-3xl font-bold text-white">Sign in to add your event</h1>
          <p className="mt-3 text-slate-400">
            Create an account, publish your own event, and start collecting ratings
            from attendees.
          </p>
          <Link
            to="/signin?redirect=%2Fmy-events"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-slate-200 transition-colors"
          >
            Open Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%),rgba(255,255,255,0.03)] p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-300">
              <Sparkles className="w-3.5 h-3.5" />
              {isAdmin ? "Event Control" : "Your Events"}
            </div>
            <h1 className="mt-5 text-4xl font-black text-white">
              {isAdmin
                ? "Manage events across the platform"
                : "Add an event people can actually book"}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              {isAdmin
                ? "Create, update, and review live events without leaving the dashboard."
                : "Fill in the basics, pick a city, and we will place it in the app with reviews and map discovery ready to go."}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <StatCard label="Live now" value={String(manageableEvents.length)} />
              <StatCard
                label="Avg rating"
                value={formatAverageRating(manageableEvents)}
              />
              <StatCard
                label="Cities"
                value={String(new Set(manageableEvents.map((event) => event.city)).size)}
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {editingEvent ? "Edit your event" : "Create a new event"}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Pick a city and we will place it on the India map for you.
                </p>
              </div>

              {editingEvent && (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Create another event
                </button>
              )}
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <FieldError error={errors.title?.message}>
                <input
                  {...register("title")}
                  placeholder="Event title"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </FieldError>

              <FieldError error={errors.categoryId?.message}>
                <select
                  {...register("categoryId")}
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
                >
                  {CATEGORIES.filter((entry) => entry.id !== "all").map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-black text-white"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </FieldError>

              <FieldError error={errors.date?.message}>
                <input
                  {...register("date")}
                  placeholder="Sep 30, 2026"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </FieldError>

              <FieldError error={errors.time?.message}>
                <input
                  {...register("time")}
                  placeholder="18:00 - 22:00"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </FieldError>

              <div>
                <select
                  {...register("city")}
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city} className="bg-black text-white">
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-2 text-sm text-red-400">{errors.city.message}</p>
                )}
                {selectedLocation && (
                  <p className="mt-2 text-xs text-slate-500">
                    We&apos;ll place this near {selectedLocation.city}, {selectedLocation.state}.
                  </p>
                )}
              </div>

              <FieldError error={errors.venue?.message}>
                <input
                  {...register("venue")}
                  placeholder="Venue"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </FieldError>

              <FieldError error={errors.price?.message}>
                <input
                  {...register("price")}
                  type="number"
                  min="0"
                  placeholder="Price"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </FieldError>

              <FieldError error={errors.image?.message}>
                <input
                  {...register("image")}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </FieldError>

              <div className="md:col-span-2">
                <textarea
                  {...register("description")}
                  rows={5}
                  placeholder="Write it the way you would explain it to a real attendee."
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-400">{errors.description.message}</p>
                )}
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-slate-200 transition-colors disabled:opacity-70"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingEvent
                      ? "Update Event"
                      : "Publish Event"}
                </button>
              </div>
            </form>
          </section>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isAdmin ? "Platform events" : "Your live events"}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {isAdmin
                  ? "Jump into any live event, adjust it, or remove it from the platform."
                  : "Edit what you posted and keep an eye on ratings."}
              </p>
            </div>
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                Open admin
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {manageableEvents.length === 0 && (
              <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-black/30 p-6 text-center">
                <Plus className="mx-auto h-10 w-10 text-slate-500" />
                <p className="mt-4 text-lg font-semibold text-white">
                  {isAdmin
                    ? "There are no live events yet"
                    : "You haven&apos;t posted an event yet"}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {isAdmin
                    ? "Create the first one and it will appear here immediately."
                    : "Fill out the form and your first event will appear here."}
                </p>
              </div>
            )}

            {manageableEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/35"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        {event.categoryName}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-white">{event.title}</h3>
                    </div>
                    <div className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-100">
                      {event.ratingCount ? `${event.ratingAverage}/5` : "No ratings yet"}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span>
                        {event.date} | {event.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span>
                        {event.venue}, {event.city}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">Starting price</p>
                      <p className="text-lg font-semibold text-white">
                        {formatPrice(event.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/event/${event.id}`}
                        className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditForm(event)}
                        className="rounded-full border border-white/10 p-2 text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                        aria-label={`Edit ${event.title}`}
                      >
                        <PencilLine className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(event.id)}
                        className="rounded-full border border-white/10 p-2 text-slate-300 hover:border-red-400/30 hover:text-red-300 transition-colors"
                        aria-label={`Delete ${event.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function FieldError({
  children,
  error,
}: {
  children: ReactNode;
  error?: string;
}) {
  return (
    <div>
      {children}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}

function formatAverageRating(events: EventRecord[]) {
  const ratedEvents = events.filter((event) => (event.ratingCount ?? 0) > 0);

  if (ratedEvents.length === 0) {
    return "New";
  }

  const average =
    ratedEvents.reduce((total, event) => total + (event.ratingAverage ?? 0), 0) /
    ratedEvents.length;

  return `${average.toFixed(1)} / 5`;
}
