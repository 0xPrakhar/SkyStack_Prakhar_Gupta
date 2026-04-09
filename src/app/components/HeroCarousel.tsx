<<<<<<< HEAD
<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { HERO_BANNERS } from "../data";
import { MapPin } from "lucide-react";

export function HeroCarousel() {
=======
=======
>>>>>>> e91372e (initial commit)
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Sparkles, CalendarDays } from "lucide-react";
import { useEvents } from "../context/EventsContext";
import { formatPrice } from "../lib/formatters";

export function HeroCarousel() {
  const { featuredEvents, isLoading } = useEvents();
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
<<<<<<< HEAD
<<<<<<< HEAD
    if (isHovered) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto h-[60vh] min-h-[400px] mt-8 rounded-3xl overflow-hidden border border-white/10 group grayscale-[0.3]"
=======
=======
>>>>>>> e91372e (initial commit)
    if (isHovered || featuredEvents.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setIndex((previousIndex) => (previousIndex + 1) % featuredEvents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredEvents.length, isHovered]);

  useEffect(() => {
    if (index >= featuredEvents.length) {
      setIndex(0);
    }
  }, [featuredEvents.length, index]);

  if (isLoading) {
    return (
      <div className="relative w-full max-w-7xl mx-auto h-[60vh] min-h-[440px] mt-8 rounded-[2rem] overflow-hidden border border-white/10 bg-white/[0.03] animate-pulse" />
    );
  }

  if (featuredEvents.length === 0) {
    return (
      <div className="relative w-full max-w-7xl mx-auto h-[60vh] min-h-[440px] mt-8 rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-950 flex items-center justify-center text-slate-400">
        Featured events will show up here soon.
      </div>
    );
  }

  const currentEvent = featuredEvents[index];

  return (
    <div
      className="relative w-full max-w-7xl mx-auto min-h-[440px] mt-8 rounded-[2rem] overflow-hidden border border-white/10 group"
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
<<<<<<< HEAD
<<<<<<< HEAD
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={HERO_BANNERS[index].image} 
              alt={HERO_BANNERS[index].title}
              className="w-full h-full object-cover object-center scale-105"
            />
            {/* Grayscale overlays for mono-color aesthetic */}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent w-3/4 md:w-1/2" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-end h-full p-10 md:p-16 lg:w-2/3 max-w-3xl">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
                {HERO_BANNERS[index].category}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-300 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <MapPin className="w-3.5 h-3.5" />
                <span>{HERO_BANNERS[index].date}</span>
              </div>
            </motion.div>

            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-6"
            >
              {HERO_BANNERS[index].title}
            </motion.h1>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link 
                to={HERO_BANNERS[index].link}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-bold tracking-wide hover:bg-slate-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                Book Now
              </Link>
            </motion.div>
=======
=======
>>>>>>> e91372e (initial commit)
          key={currentEvent.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 z-0">
            <img
              src={currentEvent.image}
              alt={currentEvent.title}
              className="w-full h-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          <div className="relative z-10 grid min-h-[440px] lg:grid-cols-[1.4fr_0.8fr]">
            <div className="flex flex-col justify-end p-8 md:p-12 lg:p-16">
              <motion.div
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-3 mb-5"
              >
                <div className="px-3 py-1 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.18em] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Happening Now
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wide">
                  {currentEvent.categoryName}
                </div>
              </motion.div>

              <motion.h1
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-black text-white leading-[1.02] mb-5 max-w-4xl"
              >
                {currentEvent.title}
              </motion.h1>

              <motion.p
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.38 }}
                className="max-w-2xl text-base md:text-lg text-slate-200/90 leading-relaxed mb-8"
              >
                {currentEvent.description}
              </motion.p>

              <motion.div
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.46 }}
                className="flex flex-wrap items-center gap-3 mb-8 text-sm"
              >
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white">
                  <CalendarDays className="w-4 h-4" />
                  <span>{currentEvent.date}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {currentEvent.venue}, {currentEvent.city}
                  </span>
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black">
                  {formatPrice(currentEvent.price)}
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.54 }}
                className="flex flex-wrap items-center gap-3"
              >
                <Link
                  to={`/event/${currentEvent.id}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-bold tracking-wide hover:bg-slate-200 transition-all duration-300 transform hover:-translate-y-1"
                >
                  See Details
                </Link>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl font-semibold tracking-wide text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Browse Events
                </Link>
              </motion.div>
            </div>

            <div className="hidden lg:flex items-end justify-end p-8">
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-sm rounded-[1.75rem] border border-white/15 bg-black/35 backdrop-blur-xl p-4 shadow-2xl"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300 mb-4">
                  More This Week
                </p>
                <div className="space-y-3">
                  {featuredEvents.slice(0, 4).map((event, eventIndex) => (
                    <button
                      key={event.id}
                      onClick={() => setIndex(eventIndex)}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all ${
                        event.id === currentEvent.id
                          ? "border-white/30 bg-white/10"
                          : "border-transparent bg-white/[0.03] hover:bg-white/[0.08]"
                      }`}
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {event.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {event.city} | {event.date}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
          </div>
        </motion.div>
      </AnimatePresence>

<<<<<<< HEAD
<<<<<<< HEAD
      {/* Progress Indicators */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        {HERO_BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index 
                ? "w-8 bg-white" 
                : "w-4 bg-white/30 hover:bg-white/50"
=======
=======
>>>>>>> e91372e (initial commit)
      <div className="absolute bottom-6 left-8 z-20 flex gap-2 lg:hidden">
        {featuredEvents.map((event, eventIndex) => (
          <button
            key={event.id}
            onClick={() => setIndex(eventIndex)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              eventIndex === index ? "w-10 bg-white" : "w-4 bg-white/30 hover:bg-white/50"
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
            }`}
          />
        ))}
      </div>
    </div>
  );
}
