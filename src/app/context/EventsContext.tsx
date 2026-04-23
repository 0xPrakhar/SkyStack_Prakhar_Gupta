import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";
import type {
  ApiEnvelope,
  EventFilters,
  EventPayload,
  EventRecord,
} from "../types";

interface RateEventPayload {
  rating: number;
  comment?: string;
}

interface EventsContextValue {
  events: EventRecord[];
  featuredEvents: EventRecord[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: (filters?: EventFilters) => Promise<EventRecord[]>;
  refreshEvents: () => Promise<void>;
  createEvent: (payload: EventPayload) => Promise<EventRecord>;
  updateEvent: (eventId: string, payload: EventPayload) => Promise<EventRecord>;
  deleteEvent: (eventId: string) => Promise<void>;
  rateEvent: (eventId: string, payload: RateEventPayload) => Promise<EventRecord>;
}

const EventsContext = createContext<EventsContextValue | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const featuredEvents = events.filter((event) => event.featured).slice(0, 5);

  function upsertEvent(event: EventRecord) {
    setEvents((currentEvents) => {
      const existingIndex = currentEvents.findIndex((entry) => entry.id === event.id);

      if (existingIndex === -1) {
        return [event, ...currentEvents];
      }

      return currentEvents.map((entry) => (entry.id === event.id ? event : entry));
    });
  }

  async function refreshEvents() {
    setIsLoading(true);

    try {
      const loadedEvents = await fetchEvents();
      setEvents(loadedEvents);
      setError(null);
    } catch (_error) {
      setError("Unable to load events right now.");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchEvents(filters?: EventFilters) {
    const response = await api.get<ApiEnvelope<{ events: EventRecord[] }>>("/events", {
      params: filters,
    });

    return response.data.data.events;
  }

  async function createEvent(payload: EventPayload) {
    const response = await api.post<ApiEnvelope<{ event: EventRecord }>>(
      "/events",
      payload,
    );
    const event = response.data.data.event;

    upsertEvent(event);

    return event;
  }

  async function updateEvent(eventId: string, payload: EventPayload) {
    const response = await api.put<ApiEnvelope<{ event: EventRecord }>>(
      `/events/${eventId}`,
      payload,
    );
    const event = response.data.data.event;

    upsertEvent(event);

    return event;
  }

  async function deleteEvent(eventId: string) {
    await api.delete(`/events/${eventId}`);
    setEvents((currentEvents) =>
      currentEvents.filter((entry) => entry.id !== eventId),
    );
  }

  async function rateEvent(eventId: string, payload: RateEventPayload) {
    const response = await api.post<ApiEnvelope<{ event: EventRecord }>>(
      `/events/${eventId}/ratings`,
      payload,
    );
    const event = response.data.data.event;

    upsertEvent(event);

    return event;
  }

  useEffect(() => {
    refreshEvents();
  }, []);

  return (
    <EventsContext.Provider
      value={{
        events,
        featuredEvents: featuredEvents.length > 0 ? featuredEvents : events.slice(0, 3),
        isLoading,
        error,
        fetchEvents,
        refreshEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        rateEvent,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);

  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider.");
  }

  return context;
}
