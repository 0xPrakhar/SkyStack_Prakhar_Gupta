import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

let pool;

export async function connectDatabase() {
  if (!env.databaseUrl) {
    if (env.isProduction) {
      throw new Error("DATABASE_URL is required in production.");
    }

    console.warn("DATABASE_URL is not set. Skipping PostgreSQL connection in development.");
    return null;
  }

  pool = new Pool({
    connectionString: env.databaseUrl,
    ssl: env.isProduction ? { rejectUnauthorized: false } : false,
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
