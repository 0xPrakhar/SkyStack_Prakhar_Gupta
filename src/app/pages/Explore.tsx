import { useState } from "react";
import { EVENTS, CITIES, CATEGORIES } from "../data";
import { EventCard } from "../components/EventCard";
import { Search, MapPin, Map as MapIcon, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Explore() {
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Fake coordinates for the map view (normalized 0-100% for absolute positioning)
  const cityCoordinates: Record<string, { x: number, y: number }> = {
    "New Delhi": { x: 45, y: 30 },
    "Mumbai": { x: 35, y: 60 },
    "Bengaluru": { x: 45, y: 80 },
    "Hyderabad": { x: 50, y: 65 },
    "Chennai": { x: 55, y: 85 },
    "Kolkata": { x: 75, y: 55 },
    "Jaipur": { x: 40, y: 35 },
    "Lucknow": { x: 55, y: 40 },
  };

  const filteredEvents = EVENTS.filter(event => {
    const matchCity = selectedCity === "All" || event.city === selectedCity;
    const matchCat = selectedCategory === "all" || event.categoryId === selectedCategory;
    return matchCity && matchCat;
  });

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-72px)] overflow-hidden bg-black">
      
      {/* LEFT PANEL: 40% - MAP VIEW */}
      <div className="hidden lg:flex w-[40%] bg-zinc-950 border-r border-white/10 relative overflow-hidden flex-col items-center justify-center">
        {/* Minimal Map Background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Floating Map Controls */}
        <div className="absolute top-6 left-6 z-20 flex gap-2">
          <div className="bg-black/80 backdrop-blur-md border border-white/20 p-2 rounded-xl text-white">
             <MapIcon className="w-5 h-5" />
          </div>
          <div className="bg-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black">
             India Map View
          </div>
        </div>

        {/* Map Dots container */}
        <div className="relative w-full max-w-sm aspect-[3/4] z-10 mx-auto opacity-80">
          {/* Base SVG Map of India Outline (simplified abstract polygon) */}
          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800 absolute inset-0">
             <polygon points="40,10 55,20 60,35 85,45 80,60 55,90 45,90 35,65 25,55 35,30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          </svg>

          {/* City Markers */}
          {Object.entries(cityCoordinates).map(([city, coords]) => {
            const isActive = selectedCity === city;
            const hasEvents = EVENTS.some(e => e.city === city && (selectedCategory === "all" || e.categoryId === selectedCategory));
            
            if (!hasEvents && selectedCity !== city) return null;

            return (
              <motion.div
                key={city}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                onClick={() => setSelectedCity(city)}
                whileHover={{ scale: 1.2 }}
              >
                <div className={`relative flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${isActive ? "bg-white/20" : "bg-white/5"}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-white shadow-[0_0_15px_rgba(255,255,255,1)]" : "bg-slate-500"} animate-pulse`} />
                  {isActive && (
                    <div className="absolute -inset-2 border-2 border-white/50 rounded-full animate-ping opacity-75" />
                  )}
                </div>
                {/* Tooltip */}
                <div className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black border border-white/20 rounded-md text-xs font-bold whitespace-nowrap transition-opacity ${isActive ? "opacity-100 text-white" : "opacity-0 group-hover:opacity-100 text-slate-300"}`}>
                  {city}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* RIGHT PANEL: 60% - EXPLORE LIST */}
      <div className="flex-1 lg:w-[60%] bg-black flex flex-col h-full relative z-10">
        
        {/* Header Filters (Sticky) */}
        <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Discover Events
            </h1>
            
            {/* Search/Filter Bar */}
            <div className="flex bg-white/5 border border-white/20 rounded-xl overflow-hidden shadow-inner">
              <div className="flex items-center gap-2 px-4 py-2 border-r border-white/20 text-sm">
                <MapPin className="w-4 h-4 text-white" />
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent border-none outline-none text-white cursor-pointer max-w-[120px]"
                >
                  <option value="All" className="bg-black text-white">All Cities</option>
                  {CITIES.map(c => <option key={c} value={c} className="bg-black text-white">{c}</option>)}
                </select>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 text-sm">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-none outline-none text-white cursor-pointer max-w-[150px]"
                >
                  {CATEGORIES.map(c => <option key={c.id} value={c.id} className="bg-black text-white">{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <p className="text-slate-400 text-sm">
            Showing <strong className="text-white">{filteredEvents.length}</strong> events 
            {selectedCity !== "All" && <span> in <strong className="text-white">{selectedCity}</strong></span>}
          </p>
        </div>

        {/* Scrollable Event List */}
        <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20"
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map(event => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventCard {...event} />
                </motion.div>
              ))}
              {filteredEvents.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="col-span-full h-64 flex flex-col items-center justify-center text-slate-500 bg-white/[0.02] rounded-3xl border border-white/20 border-dashed"
                >
                  <Search className="w-10 h-10 mb-4 text-slate-600" />
                  <p className="text-lg text-slate-400">No events found in this area.</p>
                  <button 
                    onClick={() => { setSelectedCity("All"); setSelectedCategory("all"); }}
                    className="mt-4 px-6 py-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-full text-sm font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
