import { Link } from "react-router";
import { MapPin, Calendar } from "lucide-react";
import { motion } from "motion/react";

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
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
