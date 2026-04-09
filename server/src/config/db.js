import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

let pool;

export async function connectDatabase() {
  if (!env.databaseUrl) {
    console.warn(
      "DATABASE_URL is not set. Skipping PostgreSQL connection and using the file-backed store.",
    );
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
