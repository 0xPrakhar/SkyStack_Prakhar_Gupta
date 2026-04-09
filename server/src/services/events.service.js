import crypto from "node:crypto";
import { readStore, updateStore } from "./data-store.js";
import { HttpError } from "../utils/http-error.js";

function normalizeSearch(text = "") {
  return text.trim().toLowerCase();
}

function decorateEvent(event) {
  const ratings = Array.isArray(event.ratings) ? event.ratings : [];
  const ratingCount = ratings.length;
  const ratingAverage =
    ratingCount === 0
      ? 0
      : Number(
          (
            ratings.reduce((total, rating) => total + Number(rating.rating ?? 0), 0) /
            ratingCount
          ).toFixed(1),
        );

  return {
    ...event,
    ratings: [...ratings].sort(
      (left, right) =>
        new Date(right.updatedAt ?? right.createdAt ?? 0).getTime() -
        new Date(left.updatedAt ?? left.createdAt ?? 0).getTime(),
    ),
    ratingAverage,
    ratingCount,
  };
}

function canManageEvent(event, user) {
  return user.role === "admin" || event.createdBy === user.id;
}

function matchesQuery(event, query) {
  if (!query) {
    return true;
  }

  const searchableText = [
    event.title,
    event.categoryName,
    event.city,
    event.venue,
    event.description,
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(query);
}

export async function listEvents(filters = {}) {
  const store = await readStore();
  const query = normalizeSearch(filters.search);
  const city = normalizeSearch(filters.city);
  const categoryId = normalizeSearch(filters.categoryId);

  return store.events
    .filter((event) => {
      const matchesCity =
        !city || city === "all" || event.city.toLowerCase() === city;
      const matchesCategory =
        !categoryId ||
        categoryId === "all" ||
        event.categoryId.toLowerCase() === categoryId;

      return matchesCity && matchesCategory && matchesQuery(event, query);
    })
    .sort((firstEvent, secondEvent) => {
      const featuredScore =
        Number(Boolean(secondEvent.featured)) - Number(Boolean(firstEvent.featured));

      if (featuredScore !== 0) {
        return featuredScore;
      }

      const firstCreatedAt = new Date(firstEvent.createdAt ?? 0).getTime();
      const secondCreatedAt = new Date(secondEvent.createdAt ?? 0).getTime();

      return secondCreatedAt - firstCreatedAt;
    })
    .map(decorateEvent);
}

export async function getEventById(eventId) {
  const store = await readStore();
  const event = store.events.find((entry) => entry.id === eventId);

  if (!event) {
    throw new HttpError(404, "Event not found.");
  }

  return decorateEvent(event);
}

export async function createEvent(input, user) {
  let event = null;

  await updateStore(async (store) => {
    const timestamp = new Date().toISOString();

    event = {
      id: crypto.randomUUID(),
      ...input,
      ratings: [],
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: user.id,
      createdByName: user.name,
      updatedBy: user.id,
    };

    store.events.unshift(event);

    return store;
  });

  return decorateEvent(event);
}

export async function updateEvent(eventId, input, user) {
  let updatedEvent = null;

  await updateStore(async (store) => {
    const eventIndex = store.events.findIndex((entry) => entry.id === eventId);

    if (eventIndex === -1) {
      throw new HttpError(404, "Event not found.");
    }

    const existingEvent = store.events[eventIndex];

    if (!canManageEvent(existingEvent, user)) {
      throw new HttpError(403, "You do not have permission to edit this event.");
    }

    updatedEvent = {
      ...existingEvent,
      ...input,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id,
    };

    store.events[eventIndex] = updatedEvent;

    return store;
  });

  return decorateEvent(updatedEvent);
}

export async function deleteEvent(eventId, user) {
  await updateStore(async (store) => {
    const existingEvent = store.events.find((event) => event.id === eventId);

    if (!existingEvent) {
      throw new HttpError(404, "Event not found.");
    }

    if (!canManageEvent(existingEvent, user)) {
      throw new HttpError(403, "You do not have permission to delete this event.");
    }

    const nextEvents = store.events.filter((event) => event.id !== eventId);
    store.events = nextEvents;

    return store;
  });
}

export async function rateEvent(eventId, input, user) {
  let ratedEvent = null;

  await updateStore(async (store) => {
    const eventIndex = store.events.findIndex((entry) => entry.id === eventId);

    if (eventIndex === -1) {
      throw new HttpError(404, "Event not found.");
    }

    const existingEvent = store.events[eventIndex];
    const ratings = Array.isArray(existingEvent.ratings) ? [...existingEvent.ratings] : [];
    const existingRatingIndex = ratings.findIndex((rating) => rating.userId === user.id);
    const timestamp = new Date().toISOString();
    const nextRating = {
      id:
        existingRatingIndex >= 0
          ? ratings[existingRatingIndex].id
          : crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      rating: input.rating,
      comment: input.comment ?? "",
      createdAt:
        existingRatingIndex >= 0
          ? ratings[existingRatingIndex].createdAt
          : timestamp,
      updatedAt: timestamp,
    };

    if (existingRatingIndex >= 0) {
      ratings[existingRatingIndex] = nextRating;
    } else {
      ratings.unshift(nextRating);
    }

    ratedEvent = {
      ...existingEvent,
      ratings,
      updatedAt: timestamp,
    };

    store.events[eventIndex] = ratedEvent;

    return store;
  });

  return decorateEvent(ratedEvent);
}
