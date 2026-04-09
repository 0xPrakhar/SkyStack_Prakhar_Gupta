import { Link } from "react-router";
import { Bookmark, Clock3, History, Ticket } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventsContext";
import { useUserActivity } from "../context/UserActivityContext";
import { formatPrice } from "../lib/formatters";

export function Library() {
  const { isAuthenticated, user } = useAuth();
  const { events } = useEvents();
  const {
    bookings,
    favorites,
    recentEventIds,
    toggleFavorite,
    clearRecentViews,
  } = useUserActivity();

  const favoriteEvents = favorites
    .map((eventId) => events.find((event) => event.id === eventId))
    .filter(isPresent);
  const recentEvents = recentEventIds
    .map((eventId) => events.find((event) => event.id === eventId))
    .filter(isPresent);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),rgba(255,255,255,0.03)] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Your Space
        </p>
        <h1 className="mt-3 text-4xl font-black text-white">
          Tickets, saved events, and recent views
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Everything you may want to come back to later.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
          <LibraryStat label="Tickets" value={String(bookings.length)} />
          <LibraryStat label="Saved" value={String(favoriteEvents.length)} />
          <LibraryStat label="Recent" value={String(recentEvents.length)} />
        </div>
        <p className="mt-5 text-sm text-slate-400">
          {isAuthenticated && user
            ? `Signed in as ${user.name}.`
            : "You can browse as a guest, but sign in if you want this tied to your account."}
        </p>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Ticket Wallet</h2>
              <p className="mt-2 text-sm text-slate-400">
                Your bookings stay here even after refresh.
              </p>
            </div>
            <Ticket className="w-5 h-5 text-slate-500" />
          </div>

          <div className="space-y-4">
            {bookings.length === 0 && (
              <EmptyState
                icon={Ticket}
                title="No tickets yet"
                body="Book an event and it will appear here with its booking code."
                ctaLabel="Explore events"
                ctaTo="/explore"
              />
            )}

            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-[1.75rem] border border-white/10 bg-black/35 p-5"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={booking.eventImage}
                    alt={booking.eventTitle}
                    className="h-24 w-full sm:w-24 rounded-[1.25rem] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {booking.eventTitle}
                        </h3>
                        <p className="mt-2 text-sm text-slate-400">
                          {booking.city} | {booking.date} | {booking.time}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {booking.venue}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-right">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                          Booking code
                        </p>
                        <p className="mt-1 font-mono text-sm font-bold text-white">
                          {booking.bookingCode}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-slate-400">
                        {booking.ticketCount} ticket(s) | {formatPrice(booking.totalAmount)}
                      </p>
                      <Link
                        to={`/event/${booking.eventId}`}
                        className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        View event
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-8">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
              <h2 className="text-2xl font-bold text-white">Saved Events</h2>
              <p className="mt-2 text-sm text-slate-400">
                Events you wanted to come back to.
              </p>
            </div>
              <Bookmark className="w-5 h-5 text-slate-500" />
            </div>

            <div className="space-y-3">
              {favoriteEvents.length === 0 && (
                <EmptyState
                  icon={Bookmark}
                  title="Nothing saved yet"
                  body="Use the heart on an event page to save it here."
                  ctaLabel="Browse events"
                  ctaTo="/explore"
                />
              )}

              {favoriteEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 rounded-[1.5rem] border border-white/10 bg-black/35 p-3"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-20 w-20 rounded-[1rem] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      {event.categoryName}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-white line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {event.city} | {event.date}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/event/${event.id}`}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      Open
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(event.id)}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
              <h2 className="text-2xl font-bold text-white">Recently Viewed</h2>
              <p className="mt-2 text-sm text-slate-400">
                The event pages you opened most recently.
              </p>
            </div>
              {recentEvents.length > 0 && (
                <button
                  type="button"
                  onClick={clearRecentViews}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-3">
              {recentEvents.length === 0 && (
                <EmptyState
                  icon={History}
                  title="No recent views"
                  body="Open an event page and it will appear here."
                  ctaLabel="Start exploring"
                  ctaTo="/explore"
                />
              )}

              {recentEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/event/${event.id}`}
                  className="flex items-center gap-3 rounded-[1.5rem] border border-white/10 bg-black/35 p-3 hover:border-white/20 hover:bg-white/[0.04] transition-colors"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-20 w-20 rounded-[1rem] object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      {event.categoryName}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-white line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <Clock3 className="w-3.5 h-3.5" />
                      {event.city} | {event.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function LibraryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-black/30 px-4 py-3 text-center">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
  ctaLabel,
  ctaTo,
}: {
  icon: typeof Ticket;
  title: string;
  body: string;
  ctaLabel: string;
  ctaTo: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-black/30 p-6 text-center">
      <Icon className="mx-auto h-8 w-8 text-slate-500" />
      <p className="mt-3 text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{body}</p>
      <Link
        to={ctaTo}
        className="mt-4 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

function isPresent<T>(value: T | undefined): value is T {
  return Boolean(value);
}
