import cors from "cors";
import express from "express";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import rateLimit from "express-rate-limit";
>>>>>>> e91372e (initial commit)
=======
import rateLimit from "express-rate-limit";
>>>>>>> e91372e (initial commit)
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { notFoundHandler } from "./middlewares/not-found.js";
<<<<<<< HEAD
<<<<<<< HEAD
import apiRoutes from "./routes/index.js";

const app = express();
=======
=======
>>>>>>> e91372e (initial commit)
import { sanitizeRequest } from "./middlewares/sanitize-request.js";
import apiRoutes from "./routes/index.js";

const app = express();
const allowedOrigins = new Set(env.clientUrls);
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again in a few minutes.",
  },
});
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)

app.use(
  cors({
    origin(origin, callback) {
<<<<<<< HEAD
<<<<<<< HEAD
      if (!origin || env.clientUrls.includes(origin)) {
=======
      if (!origin || allowedOrigins.has(origin)) {
>>>>>>> e91372e (initial commit)
=======
      if (!origin || allowedOrigins.has(origin)) {
>>>>>>> e91372e (initial commit)
        callback(null, true);
        return;
      }

<<<<<<< HEAD
<<<<<<< HEAD
      callback(new Error("CORS origin not allowed."));
=======
      callback(new Error("Origin not allowed."));
>>>>>>> e91372e (initial commit)
=======
      callback(new Error("Origin not allowed."));
>>>>>>> e91372e (initial commit)
    },
    credentials: true,
  }),
);
<<<<<<< HEAD
<<<<<<< HEAD
app.use(helmet());
app.use(morgan(env.isProduction ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
=======
=======
>>>>>>> e91372e (initial commit)
app.disable("x-powered-by");
app.use(helmet());
app.use(morgan(env.isProduction ? "combined" : "dev"));
app.use(apiLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeRequest);
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Eventify backend is ready.",
  });
});

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
