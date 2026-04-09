import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { HERO_BANNERS } from "../data";
import { MapPin } from "lucide-react";

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto h-[60vh] min-h-[400px] mt-8 rounded-3xl overflow-hidden border border-white/10 group grayscale-[0.3]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
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
          </div>
        </motion.div>
      </AnimatePresence>

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
            }`}
          />
        ))}
      </div>
    </div>
  );
}
