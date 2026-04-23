import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Edit2, Plus, Ticket, Trash2, Users, WalletCards } from "lucide-react";
import api, { getApiError } from "../lib/api";
import { useEvents } from "../context/EventsContext";
import { formatPrice } from "../lib/formatters";
import type { ApiEnvelope, EventBooking, EventRecord } from "../types";

interface AdminOverview {
  stats: {
    totalRevenue: number;
    ticketsSold: number;
    activeEvents: number;
    registeredUsers: number;
  };
  recentBookings: EventBooking[];
  events: EventRecord[];
}

export function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { deleteEvent, refreshEvents } = useEvents();

  async function loadOverview() {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.get<ApiEnvelope<AdminOverview>>("/admin/overview");
      setOverview(response.data.data);
    } catch (loadError) {
      setError(getApiError(loadError, "Unable to load admin panel right now."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOverview();
  }, []);

  async function handleDelete(eventId: string) {
    if (!window.confirm("Delete this event from the platform?")) {
      return;
    }

    try {
      await deleteEvent(eventId);
      await Promise.all([refreshEvents(), loadOverview()]);
    } catch (deleteError) {
      setError(getApiError(deleteError, "Unable to delete this event."));
    }
  }

  const stats = overview
    ? [
        {
          label: "Total Revenue",
          value: formatPrice(overview.stats.totalRevenue),
          icon: WalletCards,
        },
        {
          label: "Tickets Sold",
          value: String(overview.stats.ticketsSold),
          icon: Ticket,
        },
        {
          label: "Active Events",
          value: String(overview.stats.activeEvents),
          icon: Users,
        },
        {
          label: "Registered Users",
          value: String(overview.stats.registeredUsers),
          icon: Users,
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400">
            Manage platform events, bookings, and revenue.
          </p>
        </div>
        <Link
          to="/my-events"
          className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-semibold hover:bg-slate-200 transition-colors"
        >
          <Plus className="w-5 h-5" /> Create Event
        </Link>
      </div>

      <div className="flex items-center gap-4 border-b border-white/10 mb-8">
        {["dashboard", "events"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-medium capitalize transition-colors relative ${
              activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="admin-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
              />
            )}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-slate-400">
          Loading admin data...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-100">
          <p>{error}</p>
          <button onClick={loadOverview} className="mt-4 text-white underline">
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && overview && activeTab === "dashboard" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
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
            <h2 className="text-xl font-bold text-white mb-6">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-white/10">
                    <th className="pb-4 font-medium">Booking ID</th>
                    <th className="pb-4 font-medium">Event</th>
                    <th className="pb-4 font-medium">Customer</th>
                    <th className="pb-4 font-medium">Tickets</th>
                    <th className="pb-4 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300 divide-y divide-white/5">
                  {overview.recentBookings.length === 0 && (
                    <tr>
                      <td className="py-6 text-slate-500" colSpan={5}>
                        No bookings yet.
                      </td>
                    </tr>
                  )}
                  {overview.recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-white/[0.02]">
                      <td className="py-4 font-mono">{booking.bookingCode}</td>
                      <td className="py-4 truncate max-w-[220px]">
                        {booking.eventTitle}
                      </td>
                      <td className="py-4">{booking.userEmail}</td>
                      <td className="py-4">{booking.ticketCount}</td>
                      <td className="py-4 font-medium text-white">
                        {formatPrice(booking.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && overview && activeTab === "events" && (
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
              {overview.events.map((event) => (
                <tr key={event.id} className="hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={event.image}
                        alt=""
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
                      <Link
                        to={`/my-events?edit=${encodeURIComponent(event.id)}`}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                        aria-label={`Edit ${event.title}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                        aria-label={`Delete ${event.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
