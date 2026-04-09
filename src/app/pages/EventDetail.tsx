<<<<<<< HEAD
<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { EVENTS } from "../data";
import { MapPin, Calendar, Clock, Share2, Heart, CheckCircle2, Ticket, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function EventDetail() {
  const { id } = useParams();
  const event = EVENTS.find(e => e.id === id);
=======
=======
>>>>>>> e91372e (initial commit)
import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router";
import {
  MapPin,
  Calendar,
  Share2,
  Heart,
  CheckCircle2,
  Ticket,
  QrCode,
  MessageSquare,
  PenSquare,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEvents } from "../context/EventsContext";
import { formatPrice } from "../lib/formatters";
import { useAuth } from "../context/AuthContext";
import { useUserActivity } from "../context/UserActivityContext";
import { toast } from "sonner";
import type { EventBooking } from "../types";

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { events, isLoading, rateEvent } = useEvents();
  const { addRecentView, createBooking, isFavorite, toggleFavorite } =
    useUserActivity();
  const event = events.find((entry) => entry.id === id);
  const ratings = event?.ratings ?? [];
  const existingRating = user
    ? ratings.find((rating) => rating.userId === user.id)
    : undefined;
  const favoriteActive = event ? isFavorite(event.id) : false;
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)

  const [isBooking, setIsBooking] = useState(false);
  const [step, setStep] = useState(1);
  const [tickets, setTickets] = useState(1);
<<<<<<< HEAD
<<<<<<< HEAD
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!event) return;
    
    // Mock future date for the hackathon (e.g., 14 days from now)
    const mockFutureDate = new Date();
    mockFutureDate.setDate(mockFutureDate.getDate() + 14);
    
=======
=======
>>>>>>> e91372e (initial commit)
  const [confirmedBooking, setConfirmedBooking] = useState<EventBooking | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!event) {
      return;
    }

    addRecentView(event.id);

    const mockFutureDate = new Date();
    mockFutureDate.setDate(mockFutureDate.getDate() + 14);

<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = mockFutureDate.getTime() - now;

      setTimeLeft({
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> e91372e (initial commit)
        days: Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))),
        hours: Math.max(
          0,
          Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        ),
        minutes: Math.max(
          0,
          Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        ),
        seconds: Math.max(0, Math.floor((distance % (1000 * 60)) / 1000)),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [event?.id]);

  useEffect(() => {
    if (!user || !event) {
      setUserRating(0);
      setReviewComment("");
      return;
    }

    setUserRating(existingRating?.rating ?? 0);
    setReviewComment(existingRating?.comment ?? "");
  }, [event?.id, existingRating?.updatedAt, existingRating?.rating, existingRating?.comment, user]);

  if (isLoading && !event) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-slate-400 bg-black">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Loading event details...
        </h2>
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
      </div>
    );
  }

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> e91372e (initial commit)
  if (!event) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-slate-400 bg-black">
        <h2 className="text-2xl font-bold mb-4 text-white">We couldn&apos;t find this event</h2>
        <Link to="/" className="text-white hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  function closeBooking() {
    setIsBooking(false);
    setStep(1);
    setConfirmedBooking(null);
    setTickets(1);
  }

  function handleBooking() {
    if (!isAuthenticated) {
      const redirectTarget = encodeURIComponent(location.pathname);
      navigate(`/signin?redirect=${redirectTarget}`);
      return;
    }

    setIsBooking(true);
    setStep(1);
  }

  function handleFavoriteToggle() {
    const nextIsFavorite = toggleFavorite(event.id);

    toast.success(nextIsFavorite ? "Saved to your library." : "Removed from your library.");
  }

  async function handleShare() {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: `${event.title} | ${event.city} | ${event.date}`,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success("Event link copied to clipboard.");
    } catch (_error) {
      toast.error("Unable to share this event right now.");
    }
  }

  function handleConfirmBooking() {
    const booking = createBooking(event, tickets);

    setConfirmedBooking(booking);
    setStep(2);
    toast.success("Tickets added to your library.");
  }

  async function handleSubmitRating() {
    if (!event) {
      return;
    }

    if (!isAuthenticated) {
      const redirectTarget = encodeURIComponent(location.pathname);
      navigate(`/signin?redirect=${redirectTarget}`);
      return;
    }

    if (userRating < 1 || userRating > 5) {
      toast.error("Choose a star rating before submitting.");
      return;
    }

    setIsSubmittingRating(true);

    try {
      await rateEvent(event.id, {
        rating: userRating,
        comment: reviewComment,
      });
      toast.success(
        existingRating ? "Your rating was updated." : "Thanks for rating this event.",
      );
    } catch (error) {
      toast.error("Unable to save your rating right now.");
    } finally {
      setIsSubmittingRating(false);
    }
  }

  return (
    <div className="relative pb-32 lg:pb-0 bg-black min-h-screen">
      <div className="relative h-[40vh] md:h-[50vh] w-full grayscale-[0.2]">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="absolute top-6 right-6 flex gap-3 z-10">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors shadow-lg"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleFavoriteToggle}
            className={`w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border flex items-center justify-center transition-colors shadow-lg ${
              favoriteActive
                ? "border-white bg-white text-black"
                : "border-white/20 hover:bg-white hover:text-black text-white"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${favoriteActive ? "fill-current" : ""}`}
            />
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
          </button>
        </div>
      </div>

<<<<<<< HEAD
<<<<<<< HEAD
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative -mt-32 z-20 flex flex-col lg:flex-row gap-8 items-start pb-20">
        
        {/* Left Col: Details */}
        <div className="flex-1 w-full flex flex-col gap-8">
          
          {/* Title Area */}
=======
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative -mt-32 z-20 flex flex-col lg:flex-row gap-8 items-start pb-20">
        <div className="flex-1 w-full flex flex-col gap-8">
>>>>>>> e91372e (initial commit)
=======
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative -mt-32 z-20 flex flex-col lg:flex-row gap-8 items-start pb-20">
        <div className="flex-1 w-full flex flex-col gap-8">
>>>>>>> e91372e (initial commit)
          <div className="bg-zinc-950/80 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-white rounded-full text-xs font-bold tracking-wide uppercase text-black mb-4">
              {event.categoryName}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              {event.title}
            </h1>
<<<<<<< HEAD
<<<<<<< HEAD
            
=======

>>>>>>> e91372e (initial commit)
=======

>>>>>>> e91372e (initial commit)
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

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> e91372e (initial commit)
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Event rating
                </p>
                <div className="mt-3 flex items-end gap-3">
                  <p className="text-4xl font-black text-white">
                    {event.ratingCount ? event.ratingAverage?.toFixed(1) : "New"}
                  </p>
                  <div className="pb-1">
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(event.ratingAverage ?? 0), "h-4 w-4")}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {event.ratingCount
                        ? `${event.ratingCount} attendee rating${event.ratingCount > 1 ? "s" : ""}`
                        : "Be the first to review"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Hosted by
                </p>
                <p className="mt-3 text-xl font-bold text-white">
                  {event.createdByName ?? "Eventify team"}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Hosted on Eventify. Sign in if you want to leave a rating.
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="text-sm text-slate-400 font-medium mb-3 uppercase tracking-wider">
                Starts In
              </p>
              <div className="flex gap-4">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Mins", value: timeLeft.minutes },
                  { label: "Secs", value: timeLeft.seconds },
                ].map((timeBlock) => (
                  <div key={timeBlock.label} className="flex flex-col items-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white/5 border border-white/20 rounded-xl flex items-center justify-center text-xl md:text-2xl font-black text-white mb-1">
                      {timeBlock.value.toString().padStart(2, "0")}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {timeBlock.label}
                    </span>
                  </div>
                ))}
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
              </div>
            </div>
          </div>

<<<<<<< HEAD
<<<<<<< HEAD
          {/* About */}
          <div className="p-6 md:p-8 border border-white/10 rounded-3xl bg-zinc-950/50">
            <h3 className="text-xl font-bold text-white mb-4">About Event</h3>
=======
          <div className="p-6 md:p-8 border border-white/10 rounded-3xl bg-zinc-950/50">
            <h3 className="text-xl font-bold text-white mb-4">About This Event</h3>
>>>>>>> e91372e (initial commit)
=======
          <div className="p-6 md:p-8 border border-white/10 rounded-3xl bg-zinc-950/50">
            <h3 className="text-xl font-bold text-white mb-4">About This Event</h3>
>>>>>>> e91372e (initial commit)
            <p className="text-slate-400 leading-relaxed text-lg">
              {event.description}
            </p>
          </div>

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> e91372e (initial commit)
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <Star className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Rate this event</h3>
                  <p className="text-sm text-slate-400">
                    A quick note here helps the next person decide if it is worth going.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setUserRating(value)}
                    className={`rounded-2xl border px-3 py-3 transition-colors ${
                      value <= userRating
                        ? "border-amber-300/40 bg-amber-400/10 text-amber-200"
                        : "border-white/10 bg-white/[0.03] text-slate-500 hover:text-white"
                    }`}
                    aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`h-6 w-6 ${value <= userRating ? "fill-current" : ""}`}
                    />
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Quick review
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  rows={5}
                  placeholder="What stood out to you? Crowd, venue, sound, value, or anything else that would help."
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
                />
              </div>

              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleSubmitRating}
                  disabled={isSubmittingRating}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-slate-200 transition-colors disabled:opacity-70"
                >
                  <PenSquare className="h-4 w-4" />
                  {isSubmittingRating
                    ? "Saving rating..."
                    : existingRating
                      ? "Update your rating"
                      : "Submit rating"}
                </button>

                {!isAuthenticated && (
                  <p className="text-sm text-slate-400">
                    <Link
                      to={`/signin?redirect=${encodeURIComponent(location.pathname)}`}
                      className="font-semibold text-white hover:underline"
                    >
                      Sign in
                    </Link>{" "}
                    to leave a rating.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">What People Are Saying</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Reviews from signed-in attendees.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Review volume
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {event.ratingCount ?? 0}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {ratings.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-black/30 p-6 text-center">
                    <MessageSquare className="mx-auto h-8 w-8 text-slate-500" />
                    <p className="mt-3 text-white font-semibold">No reviews yet</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Be the first person to rate this event.
                    </p>
                  </div>
                )}

                {ratings.map((rating) => (
                  <div
                    key={rating.id}
                    className="rounded-2xl border border-white/10 bg-black/30 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{rating.userName}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                          {formatReviewDate(rating.updatedAt ?? rating.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-300">
                        {renderStars(rating.rating, "h-4 w-4")}
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-slate-300">
                      {rating.comment || "Rated this event without leaving a written review."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

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

<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
        <div className="w-full lg:w-96 lg:sticky lg:top-24">
          <div className="bg-zinc-950/90 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col gap-6">
            <div className="flex items-end justify-between border-b border-white/10 pb-6">
              <div>
<<<<<<< HEAD
<<<<<<< HEAD
                <p className="text-slate-400 text-sm font-semibold mb-1">Starting from</p>
                <div className="text-4xl font-black text-white flex items-center gap-1">
                  ₹{event.price} <span className="text-lg font-medium text-slate-500 line-through ml-2">₹{(event.price * 1.5).toFixed(0)}</span>
                </div>
              </div>
              <div className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
                Selling Fast
=======
=======
>>>>>>> e91372e (initial commit)
                <p className="text-slate-400 text-sm font-semibold mb-1">
                  Starting from
                </p>
                <div className="text-4xl font-black text-white flex items-center gap-1">
                  {formatPrice(event.price)}
                  <span className="text-lg font-medium text-slate-500 line-through ml-2">
                    {formatPrice(Math.round(event.price * 1.5))}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                  <div className="flex items-center gap-1 text-amber-300">
                    {renderStars(Math.round(event.ratingAverage ?? 0), "h-3.5 w-3.5")}
                  </div>
                  <span>
                    {event.ratingCount
                      ? `${event.ratingAverage?.toFixed(1)} from ${event.ratingCount} rating${event.ratingCount > 1 ? "s" : ""}`
                      : "No ratings yet"}
                  </span>
                </div>
              </div>
              <div className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
                Entry Pass
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
              </div>
            </div>

            <div className="flex flex-col gap-4">
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> e91372e (initial commit)
              <div className="flex items-center justify-between text-slate-300 p-4 rounded-2xl bg-white/5 border border-white/20">
                <div className="flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-white" />
                  <span className="font-medium">General Access</span>
                </div>
                <span className="font-bold text-white">
                  {formatPrice(event.price)}
                </span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              className="w-full py-4 mt-2 bg-white hover:bg-slate-200 text-black rounded-2xl font-black tracking-widest uppercase text-sm transition-all transform hover:-translate-y-1"
            >
              {isAuthenticated ? "Book Tickets" : "Sign In to Book"}
            </button>
            <Link
              to="/library"
              className="w-full text-center py-3 border border-white/10 rounded-2xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              Open Library
            </Link>
            <p className="text-center text-xs text-slate-500 font-medium">
              Taxes and convenience fees included
            </p>
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
          </div>
        </div>
      </div>

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> e91372e (initial commit)
      <AnimatePresence>
        {isBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeBooking}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-zinc-950 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl z-10 overflow-hidden"
            >
              {step === 1 ? (
                <div className="flex flex-col gap-6 relative z-10">
                  <div>
<<<<<<< HEAD
<<<<<<< HEAD
                    <h2 className="text-2xl font-black text-white mb-2 uppercase">Select Tickets</h2>
                    <p className="text-sm text-slate-400 font-medium">{event.title}</p>
=======
=======
>>>>>>> e91372e (initial commit)
                    <h2 className="text-2xl font-black text-white mb-2 uppercase">
                      Choose Tickets
                    </h2>
                    <p className="text-sm text-slate-400 font-medium">
                      {event.title}
                    </p>
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
                  </div>

                  <div className="bg-white/5 border border-white/20 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">General Access</p>
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> e91372e (initial commit)
                      <p className="text-sm text-slate-400">
                        {formatPrice(event.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 bg-black rounded-full p-1 border border-white/20">
                      <button
                        onClick={() => setTickets(Math.max(1, tickets - 1))}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors font-bold"
                      >
                        -
                      </button>
                      <span className="font-black text-lg w-4 text-center text-white">
                        {tickets}
                      </span>
                      <button
                        onClick={() => setTickets(Math.min(5, tickets + 1))}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 text-right -mt-4">
                    Max 5 tickets per user
                  </p>

                  <div className="border-t border-white/20 pt-4 mt-2">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-slate-400 font-medium uppercase tracking-wider text-sm">
                        Total
                      </span>
                      <span className="text-3xl font-black text-white">
                        {formatPrice(event.price * tickets)}
                      </span>
                    </div>
                    <button
                      onClick={handleConfirmBooking}
                      className="w-full py-4 bg-white hover:bg-slate-200 text-black rounded-2xl font-black uppercase tracking-widest transition-all transform hover:scale-[1.02]"
                    >
                      Confirm Booking
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
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
<<<<<<< HEAD
<<<<<<< HEAD
                  <h2 className="text-2xl font-black text-white uppercase">Booking Confirmed</h2>
                  <p className="text-slate-400 max-w-[250px] text-sm">
                    {tickets} ticket(s) for <strong className="text-white">{event.title}</strong> booked successfully.
                  </p>
                  
                  {/* Mock QR Code */}
=======
=======
>>>>>>> e91372e (initial commit)
                  <h2 className="text-2xl font-black text-white uppercase">
                    Booking Confirmed
                  </h2>
                  <p className="text-slate-400 max-w-[250px] text-sm">
                    {confirmedBooking?.ticketCount ?? tickets} ticket(s) for{" "}
                    <strong className="text-white">{event.title}</strong> booked
                    and saved to your library.
                  </p>

<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
                  <div className="bg-white p-4 rounded-2xl my-4">
                    <QrCode className="w-32 h-32 text-black" strokeWidth={1.5} />
                  </div>

                  <div className="bg-white/5 border border-white/20 px-6 py-3 rounded-xl w-full">
<<<<<<< HEAD
<<<<<<< HEAD
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Booking ID</p>
                    <p className="font-mono text-lg font-bold text-white tracking-widest">EV-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
                  </div>
                  <button 
                    onClick={() => setIsBooking(false)}
                    className="w-full py-3 mt-4 bg-transparent hover:bg-white/10 border border-white/20 rounded-xl text-white font-bold uppercase tracking-wider transition-colors"
                  >
                    Done
                  </button>
=======
=======
>>>>>>> e91372e (initial commit)
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
                      Booking ID
                    </p>
                    <p className="font-mono text-lg font-bold text-white tracking-widest">
                      {confirmedBooking?.bookingCode}
                    </p>
                  </div>
                  <div className="flex w-full gap-3">
                    <Link
                      to="/library"
                      onClick={closeBooking}
                      className="flex-1 py-3 bg-white text-black rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-slate-200 transition-colors"
                    >
                      Open Library
                    </Link>
                    <button
                      onClick={closeBooking}
                      className="flex-1 py-3 bg-transparent hover:bg-white/10 border border-white/20 rounded-xl text-white font-bold uppercase tracking-wider transition-colors"
                    >
                      Done
                    </button>
                  </div>
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> e91372e (initial commit)

function renderStars(rating: number, className: string) {
  return [1, 2, 3, 4, 5].map((value) => (
    <Star
      key={`${className}-${value}`}
      className={`${className} ${value <= rating ? "fill-current" : ""}`}
    />
  ));
}

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
