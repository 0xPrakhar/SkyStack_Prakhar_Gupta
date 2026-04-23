import { Router } from "express";
import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";
import adminRoutes from "./admin.routes.js";
import authRoutes from "./auth.routes.js";
import bookingRoutes from "./bookings.routes.js";
import eventRoutes from "./events.routes.js";
import openRoutes from "./open.routes.js";

const router = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
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
    storageMode: env.databaseUrl ? "postgres" : "file",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authLimiter, authRoutes);
router.use("/admin", adminRoutes);
router.use("/bookings", bookingRoutes);
router.use("/events", eventRoutes);
router.use("/open", openRoutes);

export default router;
