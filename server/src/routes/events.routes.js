import { Router } from "express";
<<<<<<< HEAD
<<<<<<< HEAD
import { asyncHandler } from "../utils/async-handler.js";
import { readStore } from "../services/data-store.js";
=======
=======
>>>>>>> e91372e (initial commit)
import { authenticate } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import {
  createEvent,
  deleteEvent,
  getEventById,
  listEvents,
  rateEvent,
  updateEvent,
} from "../services/events.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { eventRatingSchema, eventSchema } from "../validators/event.schemas.js";
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)

const router = Router();

router.get(
  "/",
<<<<<<< HEAD
<<<<<<< HEAD
  asyncHandler(async (_req, res) => {
    const store = await readStore();
    res.status(200).json({ success: true, data: { events: store.events } });
=======
=======
>>>>>>> e91372e (initial commit)
  asyncHandler(async (req, res) => {
    const events = await listEvents(req.query);

    res.status(200).json({
      success: true,
      data: {
        events,
      },
    });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const event = await getEventById(req.params.id);

    res.status(200).json({
      success: true,
      data: {
        event,
      },
    });
  }),
);

router.post(
  "/",
  authenticate,
  validateBody(eventSchema),
  asyncHandler(async (req, res) => {
    const event = await createEvent(req.validatedBody, req.user);

    res.status(201).json({
      success: true,
      message: "Event created successfully.",
      data: {
        event,
      },
    });
  }),
);

router.put(
  "/:id",
  authenticate,
  validateBody(eventSchema),
  asyncHandler(async (req, res) => {
    const event = await updateEvent(req.params.id, req.validatedBody, req.user);

    res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      data: {
        event,
      },
    });
  }),
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    await deleteEvent(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    });
  }),
);

router.post(
  "/:id/ratings",
  authenticate,
  validateBody(eventRatingSchema),
  asyncHandler(async (req, res) => {
    const event = await rateEvent(req.params.id, req.validatedBody, req.user);

    res.status(200).json({
      success: true,
      message: "Your rating has been saved.",
      data: {
        event,
      },
    });
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  }),
);

export default router;
