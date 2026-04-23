import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import { getDatabase } from "../config/db.js";
import { env } from "../config/env.js";
import { buildSeedStore, seedEvents } from "../constants/seed-data.js";

let storeUpdateQueue = Promise.resolve();

function parseStoreJson(rawStore) {
  return JSON.parse(rawStore.replace(/^\uFEFF/, ""));
}

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
    featured: Boolean(event.featured),
    price: Number(event.price),
    ratings: Array.isArray(event.ratings) ? event.ratings.map(normalizeRating) : [],
  };
}

function normalizeBooking(booking) {
  return {
    ...booking,
    ticketCount: Number(booking.ticketCount),
    totalAmount: Number(booking.totalAmount),
  };
}

function normalizeUser(user) {
  return {
    ...user,
    email: user.email.trim().toLowerCase(),
  };
}

function normalizeStore(store) {
  return {
    users: Array.isArray(store.users) ? store.users.map(normalizeUser) : [],
    events: Array.isArray(store.events) ? store.events.map(normalizeEvent) : [],
    bookings: Array.isArray(store.bookings) ? store.bookings.map(normalizeBooking) : [],
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

function shouldUseDatabase() {
  return Boolean(env.databaseUrl);
}

async function ensureFileStoreExists() {
  const directory = path.dirname(env.storageFilePath);
  await mkdir(directory, { recursive: true });

  try {
    await readFile(env.storageFilePath, "utf-8");
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    await writeFile(
      env.storageFilePath,
      JSON.stringify(buildSeedStore(), null, 2),
      "utf-8",
    );
  }
}

async function readRawFileStore() {
  await ensureFileStoreExists();
  const rawStore = await readFile(env.storageFilePath, "utf-8");

  return parseStoreJson(rawStore);
}

async function initializeFileStore() {
  const mergedStoreResult = mergeSeedEvents(await readRawFileStore());

  if (mergedStoreResult.didChange) {
    await writeFile(
      env.storageFilePath,
      JSON.stringify(mergedStoreResult.store, null, 2),
      "utf-8",
    );
  }
}

async function readFileStore() {
  await initializeFileStore();
  const rawStore = await readFile(env.storageFilePath, "utf-8");

  return normalizeStore(parseStoreJson(rawStore));
}

async function writeFileStore(store) {
  await ensureFileStoreExists();
  const tempFilePath = `${env.storageFilePath}.tmp`;
  const normalizedStore = normalizeStore(store);

  await writeFile(tempFilePath, JSON.stringify(normalizedStore, null, 2), "utf-8");
  await rename(tempFilePath, env.storageFilePath);
}

async function ensureDatabaseSchema(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category_id TEXT NOT NULL,
      category_name TEXT NOT NULL,
      date_label TEXT NOT NULL,
      time_label TEXT NOT NULL,
      city TEXT NOT NULL,
      venue TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      featured BOOLEAN NOT NULL DEFAULT FALSE,
      lat DOUBLE PRECISION,
      lng DOUBLE PRECISION,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL,
      created_by TEXT,
      created_by_name TEXT,
      updated_by TEXT
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS event_ratings (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL,
      UNIQUE (event_id, user_id)
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT,
      user_email TEXT,
      event_id TEXT NOT NULL,
      event_title TEXT NOT NULL,
      event_image TEXT NOT NULL,
      city TEXT NOT NULL,
      venue TEXT NOT NULL,
      date_label TEXT NOT NULL,
      time_label TEXT NOT NULL,
      ticket_count INTEGER NOT NULL,
      total_amount NUMERIC(10, 2) NOT NULL,
      booked_at TIMESTAMPTZ NOT NULL,
      booking_code TEXT NOT NULL UNIQUE
    );
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_events_city ON events(city);
    CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
    CREATE INDEX IF NOT EXISTS idx_events_featured_created ON events(featured, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_event_ratings_event ON event_ratings(event_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_booked_at ON bookings(booked_at DESC);
  `);
}

async function loadSeedStoreForDatabase() {
  try {
    const rawFileStore = await readRawFileStore();
    return mergeSeedEvents(rawFileStore).store;
  } catch (error) {
    if (error.code === "ENOENT") {
      return buildSeedStore();
    }

    throw error;
  }
}

async function readDatabaseStore(client) {
  const [usersResult, eventsResult, ratingsResult, bookingsResult] = await Promise.all([
    client.query(`
      SELECT
        id,
        name,
        email,
        password_hash AS "passwordHash",
        role,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      ORDER BY created_at ASC;
    `),
    client.query(`
      SELECT
        id,
        title,
        category_id AS "categoryId",
        category_name AS "categoryName",
        date_label AS "date",
        time_label AS "time",
        city,
        venue,
        price,
        image,
        description,
        featured,
        lat,
        lng,
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        created_by AS "createdBy",
        created_by_name AS "createdByName",
        updated_by AS "updatedBy"
      FROM events
      ORDER BY created_at DESC;
    `),
    client.query(`
      SELECT
        id,
        event_id AS "eventId",
        user_id AS "userId",
        user_name AS "userName",
        rating,
        comment,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM event_ratings
      ORDER BY created_at DESC;
    `),
    client.query(`
      SELECT
        id,
        user_id AS "userId",
        user_name AS "userName",
        user_email AS "userEmail",
        event_id AS "eventId",
        event_title AS "eventTitle",
        event_image AS "eventImage",
        city,
        venue,
        date_label AS "date",
        time_label AS "time",
        ticket_count AS "ticketCount",
        total_amount AS "totalAmount",
        booked_at AS "bookedAt",
        booking_code AS "bookingCode"
      FROM bookings
      ORDER BY booked_at DESC;
    `),
  ]);

  const ratingsByEventId = new Map();

  for (const rating of ratingsResult.rows.map(normalizeRating)) {
    const eventRatings = ratingsByEventId.get(rating.eventId) ?? [];
    eventRatings.push({
      id: rating.id,
      userId: rating.userId,
      userName: rating.userName,
      rating: rating.rating,
      comment: rating.comment,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    });
    ratingsByEventId.set(rating.eventId, eventRatings);
  }

  return normalizeStore({
    users: usersResult.rows,
    events: eventsResult.rows.map((event) => ({
      ...event,
      ratings: ratingsByEventId.get(event.id) ?? [],
    })),
    bookings: bookingsResult.rows,
    meta: {
      version: 4,
      storage: "postgres",
    },
  });
}

async function deleteMissingRows(client, tableName, ids) {
  if (ids.length === 0) {
    await client.query(`DELETE FROM ${tableName};`);
    return;
  }

  await client.query(`DELETE FROM ${tableName} WHERE id <> ALL($1::text[]);`, [ids]);
}

async function writeDatabaseStore(client, store) {
  const normalizedStore = normalizeStore(store);

  for (const user of normalizedStore.users) {
    await client.query(
      `
        INSERT INTO users (
          id,
          name,
          email,
          password_hash,
          role,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role,
          created_at = EXCLUDED.created_at,
          updated_at = EXCLUDED.updated_at;
      `,
      [
        user.id,
        user.name,
        user.email,
        user.passwordHash,
        user.role,
        user.createdAt,
        user.updatedAt,
      ],
    );
  }

  for (const event of normalizedStore.events) {
    await client.query(
      `
        INSERT INTO events (
          id,
          title,
          category_id,
          category_name,
          date_label,
          time_label,
          city,
          venue,
          price,
          image,
          description,
          featured,
          lat,
          lng,
          created_at,
          updated_at,
          created_by,
          created_by_name,
          updated_by
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          category_id = EXCLUDED.category_id,
          category_name = EXCLUDED.category_name,
          date_label = EXCLUDED.date_label,
          time_label = EXCLUDED.time_label,
          city = EXCLUDED.city,
          venue = EXCLUDED.venue,
          price = EXCLUDED.price,
          image = EXCLUDED.image,
          description = EXCLUDED.description,
          featured = EXCLUDED.featured,
          lat = EXCLUDED.lat,
          lng = EXCLUDED.lng,
          created_at = EXCLUDED.created_at,
          updated_at = EXCLUDED.updated_at,
          created_by = EXCLUDED.created_by,
          created_by_name = EXCLUDED.created_by_name,
          updated_by = EXCLUDED.updated_by;
      `,
      [
        event.id,
        event.title,
        event.categoryId,
        event.categoryName,
        event.date,
        event.time,
        event.city,
        event.venue,
        event.price,
        event.image,
        event.description,
        Boolean(event.featured),
        event.lat ?? null,
        event.lng ?? null,
        event.createdAt ?? new Date().toISOString(),
        event.updatedAt ?? new Date().toISOString(),
        event.createdBy ?? null,
        event.createdByName ?? null,
        event.updatedBy ?? null,
      ],
    );
  }

  const ratings = normalizedStore.events.flatMap((event) =>
    (event.ratings ?? []).map((rating) => ({
      ...normalizeRating(rating),
      eventId: event.id,
    })),
  );

  for (const rating of ratings) {
    await client.query(
      `
        INSERT INTO event_ratings (
          id,
          event_id,
          user_id,
          user_name,
          rating,
          comment,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          event_id = EXCLUDED.event_id,
          user_id = EXCLUDED.user_id,
          user_name = EXCLUDED.user_name,
          rating = EXCLUDED.rating,
          comment = EXCLUDED.comment,
          created_at = EXCLUDED.created_at,
          updated_at = EXCLUDED.updated_at;
      `,
      [
        rating.id,
        rating.eventId,
        rating.userId,
        rating.userName,
        rating.rating,
        rating.comment,
        rating.createdAt,
        rating.updatedAt,
      ],
    );
  }

  for (const booking of normalizedStore.bookings) {
    await client.query(
      `
        INSERT INTO bookings (
          id,
          user_id,
          user_name,
          user_email,
          event_id,
          event_title,
          event_image,
          city,
          venue,
          date_label,
          time_label,
          ticket_count,
          total_amount,
          booked_at,
          booking_code
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15
        )
        ON CONFLICT (id) DO UPDATE SET
          user_id = EXCLUDED.user_id,
          user_name = EXCLUDED.user_name,
          user_email = EXCLUDED.user_email,
          event_id = EXCLUDED.event_id,
          event_title = EXCLUDED.event_title,
          event_image = EXCLUDED.event_image,
          city = EXCLUDED.city,
          venue = EXCLUDED.venue,
          date_label = EXCLUDED.date_label,
          time_label = EXCLUDED.time_label,
          ticket_count = EXCLUDED.ticket_count,
          total_amount = EXCLUDED.total_amount,
          booked_at = EXCLUDED.booked_at,
          booking_code = EXCLUDED.booking_code;
      `,
      [
        booking.id,
        booking.userId,
        booking.userName ?? null,
        booking.userEmail ?? null,
        booking.eventId,
        booking.eventTitle,
        booking.eventImage,
        booking.city,
        booking.venue,
        booking.date,
        booking.time,
        booking.ticketCount,
        booking.totalAmount,
        booking.bookedAt,
        booking.bookingCode,
      ],
    );
  }

  await deleteMissingRows(client, "event_ratings", ratings.map((rating) => rating.id));
  await deleteMissingRows(client, "bookings", normalizedStore.bookings.map((booking) => booking.id));
  await deleteMissingRows(client, "events", normalizedStore.events.map((event) => event.id));
  await deleteMissingRows(client, "users", normalizedStore.users.map((user) => user.id));
}

async function initializeDatabaseStore() {
  const pool = getDatabase();
  const client = await pool.connect();

  try {
    await ensureDatabaseSchema(client);

    const countsResult = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS user_count,
        (SELECT COUNT(*) FROM events) AS event_count,
        (SELECT COUNT(*) FROM bookings) AS booking_count;
    `);
    const counts = countsResult.rows[0];
    const isEmpty =
      Number(counts.user_count) === 0 &&
      Number(counts.event_count) === 0 &&
      Number(counts.booking_count) === 0;

    if (!isEmpty) {
      return;
    }

    const seedStore = await loadSeedStoreForDatabase();
    await client.query("BEGIN");
    await writeDatabaseStore(client, seedStore);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

export async function initializeDataStore() {
  if (shouldUseDatabase()) {
    await initializeDatabaseStore();
    return;
  }

  await initializeFileStore();
}

export async function readStore() {
  await initializeDataStore();

  if (!shouldUseDatabase()) {
    return readFileStore();
  }

  const client = await getDatabase().connect();

  try {
    return await readDatabaseStore(client);
  } finally {
    client.release();
  }
}

export async function writeStore(store) {
  await initializeDataStore();

  if (!shouldUseDatabase()) {
    await writeFileStore(store);
    return;
  }

  const client = await getDatabase().connect();

  try {
    await client.query("BEGIN");
    await writeDatabaseStore(client, store);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export function updateStore(updater) {
  const runUpdate = async () => {
    if (!shouldUseDatabase()) {
      const store = await readFileStore();
      const nextStore = (await updater(store)) ?? store;

      await writeFileStore(nextStore);
      return normalizeStore(nextStore);
    }

    await initializeDatabaseStore();
    const client = await getDatabase().connect();

    try {
      await client.query("BEGIN");
      const store = await readDatabaseStore(client);
      const nextStore = (await updater(store)) ?? store;

      await writeDatabaseStore(client, nextStore);
      await client.query("COMMIT");

      return normalizeStore(nextStore);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  };

  const queuedUpdate = storeUpdateQueue.then(runUpdate, runUpdate);

  storeUpdateQueue = queuedUpdate.then(
    () => undefined,
    () => undefined,
  );

  return queuedUpdate;
}
