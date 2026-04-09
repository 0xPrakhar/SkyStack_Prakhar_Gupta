import { Link } from "react-router";
<<<<<<< HEAD
<<<<<<< HEAD
import { MapPin, Calendar } from "lucide-react";
import { motion } from "motion/react";
=======
import { MapPin, Calendar, Navigation, Sparkles, Star } from "lucide-react";
import { motion } from "motion/react";
import { formatPrice } from "../lib/formatters";
>>>>>>> e91372e (initial commit)
=======
import { MapPin, Calendar, Navigation, Sparkles, Star } from "lucide-react";
import { motion } from "motion/react";
import { formatPrice } from "../lib/formatters";
>>>>>>> e91372e (initial commit)

interface EventCardProps {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  date: string;
  time: string;
  city: string;
  venue: string;
  price: number;
  image: string;
<<<<<<< HEAD
<<<<<<< HEAD
}

export function EventCard({ id, title, categoryName, date, time, city, venue, price, image }: EventCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group flex flex-col bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300"
    >
      {/* Image Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradients Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full flex items-center gap-1.5">
          <span className="text-xs font-semibold tracking-wide uppercase text-white">
            {categoryName}
          </span>
        </div>
        
        {/* Price Tag */}
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full">
          <span className="text-sm font-bold text-black">
            {price === 0 ? "FREE" : `₹${price}`}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="text-xl font-bold leading-tight mb-2 text-white group-hover:text-slate-300 transition-colors line-clamp-2">
            {title}
          </h3>
          <div className="flex flex-col gap-1.5 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>{date} • {time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span className="truncate">{venue}, {city}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
          <Link 
            to={`/event/${id}`}
            className="w-full text-center py-2.5 rounded-xl bg-white/5 hover:bg-white text-sm font-semibold tracking-wide text-white hover:text-black border border-white/20 transition-all duration-300"
          >
            Book Ticket
=======
=======
>>>>>>> e91372e (initial commit)
  featured?: boolean;
  distanceKm?: number | null;
  ratingAverage?: number;
  ratingCount?: number;
}

export function EventCard({
  id,
  title,
  categoryName,
  date,
  time,
  city,
  venue,
  price,
  image,
  featured = false,
  distanceKm,
  ratingAverage = 0,
  ratingCount = 0,
}: EventCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
        featured
          ? "border-white/30 bg-white/[0.04] shadow-[0_12px_45px_rgba(255,255,255,0.06)]"
          : "border-white/10 bg-white/[0.02] hover:border-white/30"
      }`}
    >
      <div className="relative h-48 w-full overflow-hidden grayscale-[0.1] group-hover:grayscale-0 transition-all duration-500">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="text-xs font-semibold tracking-wide uppercase text-white">
              {categoryName}
            </span>
          </div>
          {featured && (
            <div className="bg-white text-black px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Featured
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full">
          <span className="text-sm font-bold text-black">{formatPrice(price)}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="text-xl font-bold leading-tight mb-2 text-white group-hover:text-slate-200 transition-colors line-clamp-2">
            {title}
          </h3>
          <div className="flex flex-col gap-1.5 text-sm text-slate-400">
            {ratingCount > 0 && (
              <div className="flex items-center gap-2 text-amber-200">
                <Star className="w-4 h-4 fill-current text-amber-300" />
                <span>
                  {ratingAverage.toFixed(1)} from {ratingCount} rating
                  {ratingCount > 1 ? "s" : ""}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>
                {date} | {time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span className="truncate">
                {venue}, {city}
              </span>
            </div>
            {typeof distanceKm === "number" && (
              <div className="flex items-center gap-2 text-emerald-200">
                <Navigation className="w-4 h-4 text-emerald-300" />
                <span>{formatDistance(distanceKm)} away from your selected point</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
          <Link
            to={`/event/${id}`}
            className="w-full text-center py-2.5 rounded-xl bg-white/5 hover:bg-white text-sm font-semibold tracking-wide text-white hover:text-black border border-white/20 transition-all duration-300"
          >
            View Details
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> e91372e (initial commit)

function formatDistance(distanceKm: number) {
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km`;
  }

  return `${Math.round(distanceKm)} km`;
}
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
