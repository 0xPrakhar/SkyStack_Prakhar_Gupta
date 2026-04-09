<<<<<<< HEAD
<<<<<<< HEAD
import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Users, Ticket, IndianRupee, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { EVENTS } from "../data";

export function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = [
    { label: "Total Revenue", value: "₹2,45,000", icon: IndianRupee },
    { label: "Tickets Sold", value: "842", icon: Ticket },
    { label: "Active Events", value: EVENTS.length.toString(), icon: Users },
  ];

=======
=======
>>>>>>> e91372e (initial commit)
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Plus,
  Users,
  Ticket,
  Wallet,
  Edit2,
  Trash2,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, CITIES } from "../data";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventsContext";
import { formatPrice } from "../lib/formatters";
import { getApiError } from "../lib/api";
import { getCityLocation } from "../lib/india-locations";
import type { EventRecord } from "../types";

const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  categoryId: z.string().min(2, "Please select a category."),
  date: z.string().min(3, "Date is required."),
  time: z.string().min(2, "Time is required."),
  city: z.string().min(2, "Please select a city."),
  venue: z.string().min(2, "Venue is required."),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  image: z.string().url("Please enter a valid image URL."),
  description: z
    .string()
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

export function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
  const { isBootstrapping, user } = useAuth();
  const { createEvent, deleteEvent, events, isLoading, updateEvent } = useEvents();
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
  const selectedFormCity = watch("city");
  const selectedCityLocation = getCityLocation(selectedFormCity);

  const stats = [
    {
      label: "Potential Revenue",
      value: formatPrice(events.reduce((total, event) => total + event.price, 0)),
      icon: Wallet,
    },
    {
      label: "Free Events",
      value: events.filter((event) => event.price === 0).length.toString(),
      icon: Ticket,
    },
    {
      label: "Active Events",
      value: events.length.toString(),
      icon: Users,
    },
  ];

  const cityCount = new Set(events.map((event) => event.city)).size;

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

  function openCreateForm() {
    setEditingEvent(null);
    setIsEditorOpen(true);
    reset(defaultValues);
  }

  function openEditForm(event: EventRecord) {
    setEditingEvent(event);
    setIsEditorOpen(true);
  }

  function closeEditor() {
    setEditingEvent(null);
    setIsEditorOpen(false);
    reset(defaultValues);
  }

  async function onSubmit(values: EventFormValues) {
    const category = CATEGORIES.find((entry) => entry.id === values.categoryId);
    const cityLocation = getCityLocation(values.city);
    const payload = {
      ...values,
      categoryName: category?.name ?? values.categoryId,
      lat: cityLocation?.lat ?? editingEvent?.lat,
      lng: cityLocation?.lng ?? editingEvent?.lng,
    };

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, payload);
        toast.success("Event updated successfully.");
      } else {
        await createEvent(payload);
        toast.success("Event created successfully.");
      }

      closeEditor();
      setActiveTab("events");
    } catch (error) {
      toast.error(getApiError(error, "Unable to save the event right now."));
    }
  }

  async function handleDelete(eventId: string) {
    const confirmed = window.confirm("Delete this event permanently?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteEvent(eventId);
      toast.success("Event deleted successfully.");
    } catch (error) {
      toast.error(getApiError(error, "Unable to delete the event right now."));
    }
  }

  if (isBootstrapping) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 text-slate-300">
        Loading admin workspace...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">
            Sign in to manage events
          </h1>
          <p className="text-slate-400 mb-6">
            You need an administrator account to create, edit, and delete events.
          </p>
          <Link
            to="/signin?redirect=%2Fadmin"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-slate-200 transition-colors"
          >
            Open Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">
            Admin access required
          </h1>
          <p className="text-slate-400">
            Your account is signed in, but it does not have administrator
            permissions.
          </p>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
<<<<<<< HEAD
<<<<<<< HEAD
          <p className="text-slate-400">Manage your events and track performance.</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-semibold hover:bg-slate-200 transition-colors">
=======
=======
>>>>>>> e91372e (initial commit)
          <p className="text-slate-400">
            Manage live events and authenticated user activity.
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-semibold hover:bg-slate-200 transition-colors"
        >
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
          <Plus className="w-5 h-5" /> Create Event
        </button>
      </div>

<<<<<<< HEAD
<<<<<<< HEAD
      {/* Tabs */}
=======
=======
>>>>>>> e91372e (initial commit)
      {isEditorOpen && (
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                {editingEvent ? "Edit Event" : "Create Event"}
              </h2>
              <p className="text-slate-400 text-sm">
                Changes are saved directly to the live events API.
              </p>
            </div>
            <button
              onClick={closeEditor}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Close
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <input
                {...register("title")}
                placeholder="Event title"
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div>
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
              {errors.categoryId && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("date")}
                placeholder="Sep 30, 2026"
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
              />
              {errors.date && (
                <p className="mt-2 text-sm text-red-400">{errors.date.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("time")}
                placeholder="18:00 - 22:00"
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
              />
              {errors.time && (
                <p className="mt-2 text-sm text-red-400">{errors.time.message}</p>
              )}
            </div>

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
              {selectedCityLocation && (
                <p className="mt-2 text-xs text-slate-500">
                  Map coordinates linked for {selectedCityLocation.city},{" "}
                  {selectedCityLocation.state}.
                </p>
              )}
            </div>

            <div>
              <input
                {...register("venue")}
                placeholder="Venue"
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
              />
              {errors.venue && (
                <p className="mt-2 text-sm text-red-400">{errors.venue.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("price")}
                type="number"
                min="0"
                placeholder="Price"
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
              />
              {errors.price && (
                <p className="mt-2 text-sm text-red-400">{errors.price.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("image")}
                placeholder="https://example.com/banner.jpg"
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
              />
              {errors.image && (
                <p className="mt-2 text-sm text-red-400">{errors.image.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <textarea
                {...register("description")}
                placeholder="Describe the event"
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeEditor}
                className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
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
                    : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      )}

<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
      <div className="flex items-center gap-4 border-b border-white/10 mb-8">
        {["dashboard", "events"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-medium capitalize transition-colors relative ${
<<<<<<< HEAD
<<<<<<< HEAD
              activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-300"
=======
              activeTab === tab
                ? "text-white"
                : "text-slate-500 hover:text-slate-300"
>>>>>>> e91372e (initial commit)
=======
              activeTab === tab
                ? "text-white"
                : "text-slate-500 hover:text-slate-300"
>>>>>>> e91372e (initial commit)
            }`}
          >
            {tab}
            {activeTab === tab && (
<<<<<<< HEAD
<<<<<<< HEAD
              <motion.div 
=======
              <motion.div
>>>>>>> e91372e (initial commit)
=======
              <motion.div
>>>>>>> e91372e (initial commit)
                layoutId="admin-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
              />
            )}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<<<<<<< HEAD
<<<<<<< HEAD
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
=======
=======
>>>>>>> e91372e (initial commit)
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl"
              >
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 font-medium">{stat.label}</span>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
<<<<<<< HEAD
<<<<<<< HEAD
            <h2 className="text-xl font-bold text-white mb-6">Recent Bookings</h2>
=======
            <h2 className="text-xl font-bold text-white mb-6">Live Event Snapshot</h2>
>>>>>>> e91372e (initial commit)
=======
            <h2 className="text-xl font-bold text-white mb-6">Live Event Snapshot</h2>
>>>>>>> e91372e (initial commit)
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-white/10">
<<<<<<< HEAD
<<<<<<< HEAD
                    <th className="pb-4 font-medium">Order ID</th>
                    <th className="pb-4 font-medium">Event</th>
                    <th className="pb-4 font-medium">Customer</th>
                    <th className="pb-4 font-medium">Tickets</th>
                    <th className="pb-4 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300 divide-y divide-white/5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="py-4">#{Math.random().toString(36).substring(2,8).toUpperCase()}</td>
                      <td className="py-4 truncate max-w-[200px]">{EVENTS[i%EVENTS.length].title}</td>
                      <td className="py-4">user{i}@example.com</td>
                      <td className="py-4">{Math.floor(Math.random() * 4) + 1}</td>
                      <td className="py-4 font-medium text-white">₹{EVENTS[i%EVENTS.length].price * 2}</td>
=======
=======
>>>>>>> e91372e (initial commit)
                    <th className="pb-4 font-medium">Admin</th>
                    <th className="pb-4 font-medium">Event</th>
                    <th className="pb-4 font-medium">City</th>
                    <th className="pb-4 font-medium">Venue</th>
                    <th className="pb-4 font-medium">Price</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300 divide-y divide-white/5">
                  {events.slice(0, 5).map((event) => (
                    <tr key={event.id} className="hover:bg-white/[0.02]">
                      <td className="py-4">{user.name}</td>
                      <td className="py-4 truncate max-w-[200px]">{event.title}</td>
                      <td className="py-4">{event.city}</td>
                      <td className="py-4">{event.venue}</td>
                      <td className="py-4 font-medium text-white">
                        {formatPrice(event.price)}
                      </td>
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> e91372e (initial commit)
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm text-slate-400 mb-1">Cities covered</p>
                <p className="text-2xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {cityCount}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm text-slate-400 mb-1">Signed in as</p>
                <p className="text-2xl font-bold text-white">{user.email}</p>
              </div>
            </div>
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white/[0.02] text-slate-400 border-b border-white/10">
                <th className="p-4 font-medium">Event Details</th>
                <th className="p-4 font-medium">Date & City</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
<<<<<<< HEAD
<<<<<<< HEAD
              {EVENTS.map((event) => (
                <tr key={event.id} className="hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={event.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-white/10" />
                      <div>
                        <div className="font-bold text-white">{event.title}</div>
                        <div className="text-xs text-slate-500">{event.categoryName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>{event.date}</div>
                    <div className="text-slate-500 text-xs">{event.city}</div>
                  </td>
                  <td className="p-4 font-medium">₹{event.price}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
=======
=======
>>>>>>> e91372e (initial commit)
              {isLoading && (
                <tr>
                  <td className="p-6 text-slate-400" colSpan={4}>
                    Loading live events...
                  </td>
                </tr>
              )}

              {!isLoading &&
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-12 h-12 rounded-lg object-cover bg-white/10"
                        />
                        <div>
                          <div className="font-bold text-white">{event.title}</div>
                          <div className="text-xs text-slate-500">
                            {event.categoryName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>{event.date}</div>
                      <div className="text-slate-500 text-xs">{event.city}</div>
                    </td>
                    <td className="p-4 font-medium">{formatPrice(event.price)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(event)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!isLoading && events.length === 0 && (
                <tr>
                  <td className="p-6 text-slate-400" colSpan={4}>
                    No events available yet. Create one to populate the platform.
                  </td>
                </tr>
              )}
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
