import dotenv from "dotenv";
import path from "path";

dotenv.config();

const environment = process.env.NODE_ENV ?? "development";
<<<<<<< HEAD
<<<<<<< HEAD
const defaultStorageFile = path.resolve(process.cwd(), "data", "store.json");
=======
=======
>>>>>>> e91372e (initial commit)
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
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)

export const env = {
  nodeEnv: environment,
  port: Number(process.env.PORT ?? 5000),
<<<<<<< HEAD
<<<<<<< HEAD
  clientUrls: [
    process.env.CLIENT_URL,
    process.env.CLIENT_URLS,
    "http://localhost:5173,http://127.0.0.1:5173",
  ]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean),
=======
  clientUrls: [...new Set(configuredClientUrls)],
>>>>>>> e91372e (initial commit)
=======
  clientUrls: [...new Set(configuredClientUrls)],
>>>>>>> e91372e (initial commit)
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "eventify-dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  storageFilePath: process.env.STORAGE_FILE_PATH || defaultStorageFile,
<<<<<<< HEAD
<<<<<<< HEAD
  defaultAdminEmail: (process.env.DEFAULT_ADMIN_EMAIL ?? "admin@eventify.local")
    .trim()
    .toLowerCase(),
=======
  defaultAdminEmail: (process.env.DEFAULT_ADMIN_EMAIL ?? "admin@eventify.local").trim().toLowerCase(),
>>>>>>> e91372e (initial commit)
=======
  defaultAdminEmail: (process.env.DEFAULT_ADMIN_EMAIL ?? "admin@eventify.local").trim().toLowerCase(),
>>>>>>> e91372e (initial commit)
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD ?? "Admin@12345",
  isProduction: environment === "production",
};
