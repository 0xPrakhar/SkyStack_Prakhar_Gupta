import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

let pool;

export async function connectDatabase() {
  if (pool) {
    return pool;
  }

  if (!env.databaseUrl) {
    console.warn(
      "DATABASE_URL is not set. Skipping PostgreSQL connection and using the file-backed store.",
    );
    return null;
  }

  pool = new Pool({
    connectionString: env.databaseUrl,
    ssl: env.isProduction ? { rejectUnauthorized: false } : false,
    max: env.isProduction ? 10 : 4,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  await pool.query("SELECT NOW()");
  console.info("PostgreSQL connection established.");

  return pool;
}

export function getDatabase() {
  if (!pool) {
    throw new Error("Database connection has not been initialized.");
  }

  return pool;
}
