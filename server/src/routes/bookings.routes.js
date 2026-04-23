import { Router } from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import {
  createBooking,
  listAllBookings,
  listBookingsForUser,
} from "../services/bookings.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { bookingSchema } from "../validators/booking.schemas.js";

const router = Router();

router.use(authenticate);

router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const bookings = await listBookingsForUser(req.user);

    res.status(200).json({
      success: true,
      data: {
        bookings,
      },
    });
  }),
);

router.get(
  "/",
  authorizeRoles("admin"),
  asyncHandler(async (_req, res) => {
    const bookings = await listAllBookings();

    res.status(200).json({
      success: true,
      data: {
        bookings,
      },
    });
  }),
);

router.post(
  "/",
  validateBody(bookingSchema),
  asyncHandler(async (req, res) => {
    const booking = await createBooking(req.validatedBody, req.user);

    res.status(201).json({
      success: true,
      message: "Booking confirmed.",
      data: {
        booking,
      },
    });
  }),
);

export default router;
