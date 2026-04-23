import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HeroCarousel } from "../components/HeroCarousel";
import { EventCard } from "../components/EventCard";
import { CATEGORIES, HERO_BANNERS } from "../data";
import { Calendar, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { useEvents } from "../context/EventsContext";

export function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { error, events, featuredEvents, isLoading, refreshEvents } = useEvents();

  const filteredEvents = activeCategory === "all" 
    ? events
    : events.filter(e => e.categoryId === activeCategory);

  return (
    <div className="w-full flex flex-col gap-12 pb-24 bg-black">
      {/* Hero Section */}
      <section className="px-4 md:px-6">
        <HeroCarousel events={featuredEvents} />
      </section>

      {/* Categories & Main Content */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-6 flex flex-col gap-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Demo Spotlight
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">Featured promo ads</h2>
              <p className="mt-2 max-w-2xl text-slate-400">
                A few demo campaigns to make the home page feel alive before users start
                exploring.
              </p>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-slate-300 transition-colors"
            >
              Explore all events <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {HERO_BANNERS.map((banner) => (
              <Link
                key={banner.id}
                to={banner.link}
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40"
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  loading="lazy"
                  className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                    {banner.category}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-white line-clamp-2">
                    {banner.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">{banner.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
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
            {isLoading && (
              <div className="col-span-full py-16 text-center text-slate-400">
                Loading events...
              </div>
            )}
            {!isLoading && error && (
              <div className="col-span-full py-16 text-center text-slate-400 border border-white/10 rounded-3xl bg-white/5">
                <p>{error}</p>
                <button onClick={refreshEvents} className="mt-4 text-white hover:text-slate-300 underline">
                  Try again
                </button>
              </div>
            )}
            {!isLoading && !error && filteredEvents.map(event => (
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
            {!isLoading && !error && filteredEvents.length === 0 && (
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
