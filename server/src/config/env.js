import dotenv from "dotenv";
import path from "path";

dotenv.config();

const environment = process.env.NODE_ENV ?? "development";
const fallbackClientUrls = "http://localhost:5173,http://127.0.0.1:5173";
const defaultStorageFile = path.resolve(process.cwd(), "data", "store.json");
const configuredClientUrls = [
  process.env.CLIENT_URLS,
  process.env.CLIENT_URL,
  fallbackClientUrls,
]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((url) => url.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: environment,
  port: Number(process.env.PORT ?? 5000),
  clientUrls: [...new Set(configuredClientUrls)],
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "eventify-dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  storageFilePath: process.env.STORAGE_FILE_PATH || defaultStorageFile,
  defaultAdminEmail: (process.env.DEFAULT_ADMIN_EMAIL ?? "admin@eventify.local")
    .trim()
    .toLowerCase(),
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD ?? "Admin@12345",
  isProduction: environment === "production",
};
