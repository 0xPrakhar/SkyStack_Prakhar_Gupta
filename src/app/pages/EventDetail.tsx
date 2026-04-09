import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { EVENTS } from "../data";
import { MapPin, Calendar, Clock, Share2, Heart, CheckCircle2, Ticket, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function EventDetail() {
  const { id } = useParams();
  const event = EVENTS.find(e => e.id === id);

  const [isBooking, setIsBooking] = useState(false);
  const [step, setStep] = useState(1);
  const [tickets, setTickets] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!event) return;
    
    // Mock future date for the hackathon (e.g., 14 days from now)
    const mockFutureDate = new Date();
    mockFutureDate.setDate(mockFutureDate.getDate() + 14);
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = mockFutureDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [event]);

  if (!event) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-slate-400 bg-black">
        <h2 className="text-2xl font-bold mb-4 text-white">Event Not Found</h2>
        <Link to="/" className="text-white hover:underline">Return to Home</Link>
      </div>
    );
  }

  const handleBooking = () => {
    setIsBooking(true);
    setStep(1);
  };

  return (
    <div className="relative pb-32 lg:pb-0 bg-black min-h-screen">
      
      {/* Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh] w-full grayscale-[0.2]">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        {/* Top Actions */}
        <div className="absolute top-6 right-6 flex gap-3 z-10">
          <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors shadow-lg">
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border flex items-center justify-center transition-colors shadow-lg ${isFavorite ? "border-white bg-white" : "border-white/20 hover:bg-white hover:text-black text-white"}`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-black text-black" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative -mt-32 z-20 flex flex-col lg:flex-row gap-8 items-start pb-20">
        
        {/* Left Col: Details */}
        <div className="flex-1 w-full flex flex-col gap-8">
          
          {/* Title Area */}
          <div className="bg-zinc-950/80 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-white rounded-full text-xs font-bold tracking-wide uppercase text-black mb-4">
              {event.categoryName}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              {event.title}
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-slate-300 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">{event.date}</p>
                  <p className="text-sm text-slate-400">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">{event.venue}</p>
                  <p className="text-sm text-slate-400">{event.city}</p>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="border-t border-white/10 pt-6">
              <p className="text-sm text-slate-400 font-medium mb-3 uppercase tracking-wider">Event Starts In</p>
              <div className="flex gap-4">
                 {[
                   { label: "Days", value: timeLeft.days },
                   { label: "Hours", value: timeLeft.hours },
                   { label: "Mins", value: timeLeft.minutes },
                   { label: "Secs", value: timeLeft.seconds }
                 ].map((t, i) => (
                   <div key={i} className="flex flex-col items-center">
                     <div className="w-14 h-14 md:w-16 md:h-16 bg-white/5 border border-white/20 rounded-xl flex items-center justify-center text-xl md:text-2xl font-black text-white mb-1">
                       {t.value.toString().padStart(2, '0')}
                     </div>
                     <span className="text-xs text-slate-500 font-medium">{t.label}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* About */}
          <div className="p-6 md:p-8 border border-white/10 rounded-3xl bg-zinc-950/50">
            <h3 className="text-xl font-bold text-white mb-4">About Event</h3>
            <p className="text-slate-400 leading-relaxed text-lg">
              {event.description}
            </p>
          </div>

          {/* Map Preview */}
          <div className="bg-zinc-950 border border-white/20 p-2 rounded-3xl overflow-hidden h-64 relative">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black z-0 opacity-50" />
             <div className="absolute inset-0 flex items-center justify-center z-10">
               <div className="relative flex flex-col items-center group">
                 <div className="w-16 h-16 bg-black/80 backdrop-blur-md rounded-full border-2 border-white flex items-center justify-center animate-pulse group-hover:animate-none group-hover:scale-110 transition-transform cursor-pointer">
                    <MapPin className="w-8 h-8 text-white" />
                 </div>
                 <div className="mt-2 bg-black px-4 py-1 rounded-full text-xs font-bold text-white border border-white/20 shadow-lg uppercase tracking-wider">
                   {event.venue}
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Col: Sticky Booking Panel */}
        <div className="w-full lg:w-96 lg:sticky lg:top-24">
          <div className="bg-zinc-950/90 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col gap-6">
            <div className="flex items-end justify-between border-b border-white/10 pb-6">
              <div>
                <p className="text-slate-400 text-sm font-semibold mb-1">Starting from</p>
                <div className="text-4xl font-black text-white flex items-center gap-1">
                  ₹{event.price} <span className="text-lg font-medium text-slate-500 line-through ml-2">₹{(event.price * 1.5).toFixed(0)}</span>
                </div>
              </div>
              <div className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
                Selling Fast
              </div>
            </div>

            <div className="flex flex-col gap-4">
               <div className="flex items-center justify-between text-slate-300 p-4 rounded-2xl bg-white/5 border border-white/20">
                 <div className="flex items-center gap-3">
                   <Ticket className="w-5 h-5 text-white" />
                   <span className="font-medium">General Access</span>
                 </div>
                 <span className="font-bold text-white">₹{event.price}</span>
               </div>
            </div>

            <button 
              onClick={handleBooking}
              className="w-full py-4 mt-2 bg-white hover:bg-slate-200 text-black rounded-2xl font-black tracking-widest uppercase text-sm transition-all transform hover:-translate-y-1"
            >
              Book Tickets
            </button>
            <p className="text-center text-xs text-slate-500 font-medium">Includes all taxes and convenience fees</p>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsBooking(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-zinc-950 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl z-10 overflow-hidden"
            >
              {step === 1 ? (
                <div className="flex flex-col gap-6 relative z-10">
                  <div>
                    <h2 className="text-2xl font-black text-white mb-2 uppercase">Select Tickets</h2>
                    <p className="text-sm text-slate-400 font-medium">{event.title}</p>
                  </div>

                  <div className="bg-white/5 border border-white/20 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">General Access</p>
                      <p className="text-sm text-slate-400">₹{event.price}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-black rounded-full p-1 border border-white/20">
                      <button 
                        onClick={() => setTickets(Math.max(1, tickets - 1))}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors font-bold"
                      >-</button>
                      <span className="font-black text-lg w-4 text-center text-white">{tickets}</span>
                      <button 
                        onClick={() => setTickets(Math.min(5, tickets + 1))}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors font-bold"
                      >+</button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 text-right -mt-4">Max 5 tickets per user</p>

                  <div className="border-t border-white/20 pt-4 mt-2">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-slate-400 font-medium uppercase tracking-wider text-sm">Total Amount</span>
                      <span className="text-3xl font-black text-white">₹{event.price * tickets}</span>
                    </div>
                    <button 
                      onClick={() => setStep(2)}
                      className="w-full py-4 bg-white hover:bg-slate-200 text-black rounded-2xl font-black uppercase tracking-widest transition-all transform hover:scale-[1.02]"
                    >
                      Proceed to Pay
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-4 relative z-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-2"
                  >
                    <CheckCircle2 className="w-8 h-8 text-black" />
                  </motion.div>
                  <h2 className="text-2xl font-black text-white uppercase">Booking Confirmed</h2>
                  <p className="text-slate-400 max-w-[250px] text-sm">
                    {tickets} ticket(s) for <strong className="text-white">{event.title}</strong> booked successfully.
                  </p>
                  
                  {/* Mock QR Code */}
                  <div className="bg-white p-4 rounded-2xl my-4">
                    <QrCode className="w-32 h-32 text-black" strokeWidth={1.5} />
                  </div>

                  <div className="bg-white/5 border border-white/20 px-6 py-3 rounded-xl w-full">
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Booking ID</p>
                    <p className="font-mono text-lg font-bold text-white tracking-widest">EV-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
                  </div>
                  <button 
                    onClick={() => setIsBooking(false)}
                    className="w-full py-3 mt-4 bg-transparent hover:bg-white/10 border border-white/20 rounded-xl text-white font-bold uppercase tracking-wider transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
