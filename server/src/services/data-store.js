<<<<<<< HEAD
<<<<<<< HEAD
import bcrypt from "bcryptjs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { env } from "../config/env.js";
import { buildSeedStore } from "../constants/seed-data.js";

let cachedStore = null;

async function ensureStoreFile() {
=======
=======
>>>>>>> e91372e (initial commit)
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import { env } from "../config/env.js";
import { buildSeedStore, seedEvents } from "../constants/seed-data.js";

let storeUpdateQueue = Promise.resolve();

function normalizeRating(rating) {
  return {
    id: rating.id,
    userId: rating.userId,
    userName: rating.userName,
    rating: Number(rating.rating),
    comment: rating.comment ?? "",
    createdAt: rating.createdAt,
    updatedAt: rating.updatedAt ?? rating.createdAt,
  };
}

function normalizeEvent(event) {
  return {
    ...event,
    ratings: Array.isArray(event.ratings) ? event.ratings.map(normalizeRating) : [],
  };
}

function normalizeStore(store) {
  return {
    users: Array.isArray(store.users) ? store.users : [],
    events: Array.isArray(store.events) ? store.events.map(normalizeEvent) : [],
    meta: store.meta ?? {},
  };
}

function mergeSeedRatings(seedRatings, existingRatings) {
  const normalizedSeedRatings = Array.isArray(seedRatings)
    ? seedRatings.map(normalizeRating)
    : [];
  const normalizedExistingRatings = Array.isArray(existingRatings)
    ? existingRatings.map(normalizeRating)
    : [];
  const seedRatingIds = new Set(normalizedSeedRatings.map((rating) => rating.id));
  const userRatings = normalizedExistingRatings.filter(
    (rating) => !seedRatingIds.has(rating.id),
  );

  return [...userRatings, ...normalizedSeedRatings];
}

function mergeSeedEvents(store) {
  const normalizedStore = normalizeStore(store);
  const existingEventsById = new Map(
    normalizedStore.events.map((event, index) => [event.id, { event, index }]),
  );
  const nextEvents = [...normalizedStore.events];
  const timestamp = new Date().toISOString();
  let didChange = false;

  for (const seedEvent of seedEvents) {
    const existingEntry = existingEventsById.get(seedEvent.id);

    if (!existingEntry) {
      nextEvents.unshift(
        normalizeEvent({
          ...seedEvent,
          ratings: seedEvent.ratings ?? [],
          createdAt: timestamp,
          updatedAt: timestamp,
        }),
      );
      didChange = true;
      continue;
    }

    const mergedEvent = normalizeEvent({
      ...existingEntry.event,
      ...seedEvent,
      createdAt: existingEntry.event.createdAt ?? timestamp,
      updatedAt: existingEntry.event.updatedAt ?? timestamp,
      ratings: mergeSeedRatings(seedEvent.ratings ?? [], existingEntry.event.ratings ?? []),
    });

    if (JSON.stringify(existingEntry.event) !== JSON.stringify(mergedEvent)) {
      nextEvents[existingEntry.index] = mergedEvent;
      didChange = true;
    }
  }

  return {
    didChange,
    store: {
      ...normalizedStore,
      events: nextEvents,
      meta: {
        ...normalizedStore.meta,
        version: 4,
        lastSeedSyncAt: timestamp,
      },
    },
  };
}

export async function initializeDataStore() {
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  const directory = path.dirname(env.storageFilePath);
  await mkdir(directory, { recursive: true });

  try {
<<<<<<< HEAD
<<<<<<< HEAD
    await readFile(env.storageFilePath, "utf8");
=======
    await readFile(env.storageFilePath, "utf-8");
>>>>>>> e91372e (initial commit)
=======
    await readFile(env.storageFilePath, "utf-8");
>>>>>>> e91372e (initial commit)
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

<<<<<<< HEAD
<<<<<<< HEAD
    const defaultAdminPasswordHash = await bcrypt.hash(env.defaultAdminPassword, 12);
    const store = buildSeedStore(env.defaultAdminEmail, defaultAdminPasswordHash);
    await writeFile(env.storageFilePath, JSON.stringify(store, null, 2), "utf8");
=======
=======
>>>>>>> e91372e (initial commit)
    await writeFile(
      env.storageFilePath,
      JSON.stringify(buildSeedStore(), null, 2),
      "utf-8",
    );
    return;
  }

  const rawStore = await readFile(env.storageFilePath, "utf-8");
  const mergedStoreResult = mergeSeedEvents(JSON.parse(rawStore));

  if (mergedStoreResult.didChange) {
    await writeFile(
      env.storageFilePath,
      JSON.stringify(mergedStoreResult.store, null, 2),
      "utf-8",
    );
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  }
}

export async function readStore() {
<<<<<<< HEAD
<<<<<<< HEAD
  await ensureStoreFile();

  if (cachedStore) {
    return structuredClone(cachedStore);
  }

  const raw = await readFile(env.storageFilePath, "utf8");
  cachedStore = JSON.parse(raw);
  return structuredClone(cachedStore);
}

export async function writeStore(store) {
  cachedStore = structuredClone(store);
  await writeFile(env.storageFilePath, JSON.stringify(store, null, 2), "utf8");
=======
=======
>>>>>>> e91372e (initial commit)
  await initializeDataStore();
  const rawStore = await readFile(env.storageFilePath, "utf-8");

  return normalizeStore(JSON.parse(rawStore));
}

export async function writeStore(store) {
  await initializeDataStore();
  const tempFilePath = `${env.storageFilePath}.tmp`;
  const normalizedStore = normalizeStore(store);

  await writeFile(tempFilePath, JSON.stringify(normalizedStore, null, 2), "utf-8");
  await rename(tempFilePath, env.storageFilePath);
}

export function updateStore(updater) {
  const runUpdate = async () => {
    const store = await readStore();
    const nextStore = (await updater(store)) ?? store;

    await writeStore(nextStore);

    return normalizeStore(nextStore);
  };

  const queuedUpdate = storeUpdateQueue.then(runUpdate, runUpdate);

  storeUpdateQueue = queuedUpdate.then(
    () => undefined,
    () => undefined,
  );

  return queuedUpdate;
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
}
