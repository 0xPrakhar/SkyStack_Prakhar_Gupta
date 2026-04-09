import { Router } from "express";
import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";
import authRoutes from "./auth.routes.js";
import eventRoutes from "./events.routes.js";

const router = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
<<<<<<< HEAD
<<<<<<< HEAD
  max: 25,
=======
  max: 20,
>>>>>>> e91372e (initial commit)
=======
  max: 20,
>>>>>>> e91372e (initial commit)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please wait and try again.",
  },
});

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running.",
    environment: env.nodeEnv,
    databaseConfigured: Boolean(env.databaseUrl),
    storageFilePath: env.storageFilePath,
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authLimiter, authRoutes);
router.use("/events", eventRoutes);

export default router;
