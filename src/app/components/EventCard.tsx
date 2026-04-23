import { Link } from "react-router";
import { Calendar, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { formatPrice } from "../lib/formatters";

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
}: EventCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-white/30"
    >
      <div className="relative h-48 w-full overflow-hidden grayscale-[0.2] transition-all duration-500 group-hover:grayscale-0">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 backdrop-blur-md">
          <span className="text-xs font-semibold uppercase tracking-wide text-white">
            {categoryName}
          </span>
        </div>

        <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1">
          <span className="text-sm font-bold text-black">{formatPrice(price)}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="mb-2 line-clamp-2 text-xl font-bold leading-tight text-white transition-colors group-hover:text-slate-300">
            {title}
          </h3>
          <div className="flex flex-col gap-1.5 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>
                {date} • {time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-500" />
              <span className="truncate">
                {venue}, {city}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
          <Link
            to={`/event/${id}`}
            className="w-full rounded-xl border border-white/20 bg-white/5 py-2.5 text-center text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            Book Ticket
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
