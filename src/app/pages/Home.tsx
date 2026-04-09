import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HeroCarousel } from "../components/HeroCarousel";
import { EventCard } from "../components/EventCard";
import { EVENTS, CATEGORIES } from "../data";
import { Calendar, ChevronRight } from "lucide-react";
import { Link } from "react-router";

export function Home() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredEvents = activeCategory === "all" 
    ? EVENTS 
    : EVENTS.filter(e => e.categoryId === activeCategory);

  return (
    <div className="w-full flex flex-col gap-12 pb-24 bg-black">
      {/* Hero Section */}
      <section className="px-4 md:px-6">
        <HeroCarousel />
      </section>

      {/* Categories & Main Content */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-6 flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
              Trending Near You
            </h2>
            <p className="text-slate-400 mt-2">Discover the best events happening around you.</p>
          </div>
          
          <Link to="/explore" className="group flex items-center gap-2 text-sm font-semibold text-white hover:text-slate-300 transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            View All on Map <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x -mx-4 px-4 md:mx-0 md:px-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`snap-start flex-none flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-white border-white text-black font-bold"
                  : "bg-transparent border-white/20 hover:bg-white/10 text-white"
              }`}
            >
              <span>{cat.icon}</span>
              <span className="whitespace-nowrap">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Event Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredEvents.map(event => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <EventCard {...event} />
              </motion.div>
            ))}
            {filteredEvents.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/20 rounded-3xl bg-white/5"
              >
                <Calendar className="w-12 h-12 mb-4 text-slate-600" />
                <p className="text-xl font-medium text-slate-400">No events found in this category.</p>
                <button onClick={() => setActiveCategory("all")} className="mt-4 text-white hover:text-slate-300 underline">
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </section>
    </div>
  );
}
