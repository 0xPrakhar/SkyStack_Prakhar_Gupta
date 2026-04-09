import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import type { EventBooking, EventRecord } from "../types";

interface UserActivityState {
  favorites: string[];
  recentEventIds: string[];
  bookings: EventBooking[];
}

interface UserActivityContextValue extends UserActivityState {
  isFavorite: (eventId: string) => boolean;
  toggleFavorite: (event: EventRecord | string) => boolean;
  addRecentView: (eventId: string) => void;
  createBooking: (event: EventRecord, ticketCount: number) => EventBooking;
  clearRecentViews: () => void;
}

const STORAGE_VERSION = 1;
const MAX_RECENT_EVENTS = 8;
const MAX_BOOKINGS = 12;
const defaultState: UserActivityState = {
  favorites: [],
  recentEventIds: [],
  bookings: [],
};

const UserActivityContext = createContext<UserActivityContextValue | undefined>(
  undefined,
);

export function UserActivityProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storageKey = `eventify:activity:${user?.id ?? "guest"}`;
  const [activity, setActivity] = useState<UserActivityState>(defaultState);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const rawState = window.localStorage.getItem(storageKey);

      if (!rawState) {
        setActivity(defaultState);
        return;
      }

      const parsedState = JSON.parse(rawState);
      setActivity({
        favorites: Array.isArray(parsedState.favorites) ? parsedState.favorites : [],
        recentEventIds: Array.isArray(parsedState.recentEventIds)
          ? parsedState.recentEventIds
          : [],
        bookings: Array.isArray(parsedState.bookings) ? parsedState.bookings : [],
      });
    } catch (_error) {
      setActivity(defaultState);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: STORAGE_VERSION,
        ...activity,
      }),
    );
  }, [activity, storageKey]);

  function isFavorite(eventId: string) {
    return activity.favorites.includes(eventId);
  }

  function toggleFavorite(event: EventRecord | string) {
    const eventId = typeof event === "string" ? event : event.id;
    let nextIsFavorite = false;

    setActivity((currentActivity) => {
      const alreadySaved = currentActivity.favorites.includes(eventId);
      nextIsFavorite = !alreadySaved;

      return {
        ...currentActivity,
        favorites: alreadySaved
          ? currentActivity.favorites.filter((entry) => entry !== eventId)
          : [eventId, ...currentActivity.favorites],
      };
    });

    return nextIsFavorite;
  }

  function addRecentView(eventId: string) {
    setActivity((currentActivity) => ({
      ...currentActivity,
      recentEventIds: [
        eventId,
        ...currentActivity.recentEventIds.filter((entry) => entry !== eventId),
      ].slice(0, MAX_RECENT_EVENTS),
    }));
  }

  function createBooking(event: EventRecord, ticketCount: number) {
    const booking: EventBooking = {
      id: crypto.randomUUID(),
      eventId: event.id,
      eventTitle: event.title,
      eventImage: event.image,
      city: event.city,
      venue: event.venue,
      date: event.date,
      time: event.time,
      ticketCount,
      totalAmount: event.price * ticketCount,
      bookedAt: new Date().toISOString(),
      bookingCode: `EV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    };

    setActivity((currentActivity) => ({
      ...currentActivity,
      bookings: [booking, ...currentActivity.bookings].slice(0, MAX_BOOKINGS),
    }));

    return booking;
  }

  function clearRecentViews() {
    setActivity((currentActivity) => ({
      ...currentActivity,
      recentEventIds: [],
    }));
  }

  return (
    <UserActivityContext.Provider
      value={{
        ...activity,
        isFavorite,
        toggleFavorite,
        addRecentView,
        createBooking,
        clearRecentViews,
      }}
    >
      {children}
    </UserActivityContext.Provider>
  );
}

export function useUserActivity() {
  const context = useContext(UserActivityContext);

  if (!context) {
    throw new Error("useUserActivity must be used within a UserActivityProvider.");
  }

  return context;
}
