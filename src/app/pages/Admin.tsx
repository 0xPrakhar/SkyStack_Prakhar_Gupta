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

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400">Manage your events and track performance.</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-semibold hover:bg-slate-200 transition-colors">
          <Plus className="w-5 h-5" /> Create Event
        </button>
      </div>

      {/* Tabs */}
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

      {activeTab === "dashboard" ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
