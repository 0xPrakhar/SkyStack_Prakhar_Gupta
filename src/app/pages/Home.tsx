import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HeroCarousel } from "../components/HeroCarousel";
import { EventCard } from "../components/EventCard";
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> e91372e (initial commit)
import { CATEGORIES } from "../data";
import { Calendar, ChevronRight, Sparkles, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useEvents } from "../context/EventsContext";
import { formatPrice } from "../lib/formatters";

export function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { events, featuredEvents, isLoading, error } = useEvents();

  const filteredEvents =
    activeCategory === "all"
      ? events
      : events.filter((event) => event.categoryId === activeCategory);

  const spotlightEvents =
    featuredEvents.length > 0 ? featuredEvents.slice(0, 3) : events.slice(0, 3);
  const freeOrLowCostEvents = events.filter((event) => event.price <= 750).slice(0, 4);
  const demoEvents = events.slice(0, 6);

  return (
    <div className="w-full flex flex-col gap-12 pb-24 bg-black">
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
      <section className="px-4 md:px-6">
        <HeroCarousel />
      </section>

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> e91372e (initial commit)
      {!isLoading && !error && demoEvents.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                Try The App
              </p>
              <h2 className="text-3xl font-bold text-white">Sample Events</h2>
              <p className="text-slate-400 mt-2">
                These are already loaded for you, so you can browse the site, test
                bookings, and see how the full flow feels.
              </p>
            </div>

            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Browse All Events <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {demoEvents.map((event) => (
              <EventCard key={`demo-${event.id}`} {...event} />
            ))}
          </div>
        </section>
      )}

      {!isLoading && !error && spotlightEvents.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 md:px-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                A Few Good Picks
              </p>
              <h2 className="text-3xl font-bold text-white">Start Here</h2>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Explore More <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-5">
            <Link
              to={`/event/${spotlightEvents[0].id}`}
              className="group relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/10"
            >
              <img
                src={spotlightEvents[0].image}
                alt={spotlightEvents[0].title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_40%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-black">
                  <Sparkles className="w-3.5 h-3.5" />
                  Worth Checking
                </div>
                <h3 className="max-w-2xl text-3xl md:text-4xl font-black text-white mb-3">
                  {spotlightEvents[0].title}
                </h3>
                <p className="max-w-2xl text-slate-200/90 mb-4 line-clamp-2">
                  {spotlightEvents[0].description}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
                  <span>{spotlightEvents[0].city}</span>
                  <span className="text-slate-500">|</span>
                  <span>{spotlightEvents[0].date}</span>
                  <span className="text-slate-500">|</span>
                  <span>{formatPrice(spotlightEvents[0].price)}</span>
                </div>
              </div>
            </Link>

            <div className="grid gap-5">
              {spotlightEvents.slice(1).map((event) => (
                <Link
                  key={event.id}
                  to={`/event/${event.id}`}
                  className="group relative min-h-[205px] overflow-hidden rounded-[1.75rem] border border-white/10"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300 mb-2">
                      {event.categoryName}
                    </p>
                    <h3 className="text-2xl font-black text-white mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-200">
                      <span>{event.city}</span>
                      <span className="text-slate-500">|</span>
                      <span>{formatPrice(event.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto w-full px-4 md:px-6 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
              Browse By Category
            </h2>
            <p className="text-slate-400 mt-2">
              Start broad, then narrow things down once something catches your eye.
            </p>
          </div>

          <Link
            to="/explore"
            className="group flex items-center gap-2 text-sm font-semibold text-white hover:text-slate-300 transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/10"
          >
            View All on Map{" "}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x -mx-4 px-4 md:mx-0 md:px-0">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`snap-start flex-none flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 ${
                activeCategory === category.id
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
                  ? "bg-white border-white text-black font-bold"
                  : "bg-transparent border-white/20 hover:bg-white/10 text-white"
              }`}
            >
<<<<<<< HEAD
<<<<<<< HEAD
              <span>{cat.icon}</span>
              <span className="whitespace-nowrap">{cat.name}</span>
=======
              <span>{category.icon}</span>
              <span className="whitespace-nowrap">{category.name}</span>
>>>>>>> e91372e (initial commit)
=======
              <span>{category.icon}</span>
              <span className="whitespace-nowrap">{category.name}</span>
>>>>>>> e91372e (initial commit)
            </button>
          ))}
        </div>

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> e91372e (initial commit)
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <AnimatePresence mode="popLayout">
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/20 rounded-3xl bg-white/5"
              >
                Loading events...
              </motion.div>
            )}

            {!isLoading &&
              !error &&
              filteredEvents.map((event) => (
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

            {!isLoading && error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/20 rounded-3xl bg-white/5"
              >
                <p className="text-xl font-medium text-slate-300">{error}</p>
              </motion.div>
            )}

            {!isLoading && !error && filteredEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
                animate={{ opacity: 1 }}
                className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/20 rounded-3xl bg-white/5"
              >
                <Calendar className="w-12 h-12 mb-4 text-slate-600" />
<<<<<<< HEAD
<<<<<<< HEAD
                <p className="text-xl font-medium text-slate-400">No events found in this category.</p>
                <button onClick={() => setActiveCategory("all")} className="mt-4 text-white hover:text-slate-300 underline">
=======
=======
>>>>>>> e91372e (initial commit)
                <p className="text-xl font-medium text-slate-400">
                  Nothing is showing in this category yet.
                </p>
                <button
                  onClick={() => setActiveCategory("all")}
                  className="mt-4 text-white hover:text-slate-300 underline"
                >
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
<<<<<<< HEAD
<<<<<<< HEAD

      </section>
=======
=======
>>>>>>> e91372e (initial commit)
      </section>

      {!isLoading && !error && freeOrLowCostEvents.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 md:px-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                Easy Plans
              </p>
              <h2 className="text-3xl font-bold text-white">Good Options Under Rs 750</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-xl text-right">
              A smaller set of lower-priced events for days when you want something
              simple, local, and easy to say yes to.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {freeOrLowCostEvents.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="group rounded-[1.5rem] overflow-hidden border border-white/10 bg-white/[0.03]"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-black">
                    {formatPrice(event.price)}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">
                    {event.categoryName}
                  </p>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {event.city} | {event.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
    </div>
  );
}
