import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNotifications } from "./NotificationsContext";
import api from "../lib/api";
import type { ApiEnvelope, EventBooking, EventRecord } from "../types";

interface UserActivityState {
  favorites: string[];
  recentEventIds: string[];
  bookings: EventBooking[];
}

interface UserActivityContextValue extends UserActivityState {
  isFavorite: (eventId: string) => boolean;
  toggleFavorite: (event: EventRecord | string) => boolean;
  addRecentView: (eventId: string) => void;
  createBooking: (event: EventRecord, ticketCount: number) => Promise<EventBooking>;
  clearRecentViews: () => void;
}

const STORAGE_VERSION = 2;
const MAX_RECENT_EVENTS = 8;
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
  const { pushNotification } = useNotifications();
  const storageKey = `eventify:activity:${user?.id ?? "guest"}`;
  const [activity, setActivity] = useState<UserActivityState>(defaultState);
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setLoadedStorageKey(null);

    try {
      const rawState = window.localStorage.getItem(storageKey);

      if (!rawState) {
        setActivity(defaultState);
        setLoadedStorageKey(storageKey);
        return;
      }

      const parsedState = JSON.parse(rawState);
      setActivity({
        favorites: Array.isArray(parsedState.favorites) ? parsedState.favorites : [],
        recentEventIds: Array.isArray(parsedState.recentEventIds)
          ? parsedState.recentEventIds
          : [],
        bookings: [],
      });
      setLoadedStorageKey(storageKey);
    } catch (_error) {
      setActivity(defaultState);
      setLoadedStorageKey(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || loadedStorageKey !== storageKey) {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: STORAGE_VERSION,
        favorites: activity.favorites,
        recentEventIds: activity.recentEventIds,
      }),
    );
  }, [activity.favorites, activity.recentEventIds, loadedStorageKey, storageKey]);

  useEffect(() => {
    let isMounted = true;

    async function loadBookings() {
      if (!user) {
        setActivity((currentActivity) => ({
          ...currentActivity,
          bookings: [],
        }));
        return;
      }

      try {
        const response = await api.get<ApiEnvelope<{ bookings: EventBooking[] }>>(
          "/bookings/me",
        );

        if (isMounted) {
          setActivity((currentActivity) => ({
            ...currentActivity,
            bookings: response.data.data.bookings,
          }));
        }
      } catch (_error) {
        if (isMounted) {
          setActivity((currentActivity) => ({
            ...currentActivity,
            bookings: [],
          }));
        }
      }
    }

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, [user]);

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

    if (typeof event !== "string") {
      pushNotification({
        title: nextIsFavorite ? "Saved to library" : "Removed from saved events",
        body: nextIsFavorite
          ? `${event.title} is waiting for you in your library.`
          : `${event.title} was removed from your saved list.`,
        href: nextIsFavorite ? "/library" : undefined,
      });
    }

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

  async function createBooking(event: EventRecord, ticketCount: number) {
    if (!user) {
      throw new Error("Sign in to book tickets.");
    }

    const response = await api.post<ApiEnvelope<{ booking: EventBooking }>>(
      "/bookings",
      {
        eventId: event.id,
        ticketCount,
      },
    );
    const booking = response.data.data.booking;

    setActivity((currentActivity) => ({
      ...currentActivity,
      bookings: [
        booking,
        ...currentActivity.bookings.filter((entry) => entry.id !== booking.id),
      ],
    }));
    pushNotification({
      title: "Booking confirmed",
      body: `${booking.ticketCount} ticket(s) booked for ${booking.eventTitle}.`,
      href: "/library",
    });

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
