import crypto from "node:crypto";
import { readStore, updateStore } from "./data-store.js";
import { HttpError } from "../utils/http-error.js";

function buildBookingCode() {
  return `EV-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

function sortBookings(bookings) {
  return [...bookings].sort(
    (left, right) =>
      new Date(right.bookedAt ?? 0).getTime() - new Date(left.bookedAt ?? 0).getTime(),
  );
}

function buildPublicBooking(booking) {
  return {
    id: booking.id,
    userId: booking.userId,
    userName: booking.userName,
    userEmail: booking.userEmail,
    eventId: booking.eventId,
    eventTitle: booking.eventTitle,
    eventImage: booking.eventImage,
    city: booking.city,
    venue: booking.venue,
    date: booking.date,
    time: booking.time,
    ticketCount: booking.ticketCount,
    totalAmount: booking.totalAmount,
    bookedAt: booking.bookedAt,
    bookingCode: booking.bookingCode,
  };
}

export async function createBooking(input, user) {
  let createdBooking = null;

  await updateStore(async (store) => {
    const event = store.events.find((entry) => entry.id === input.eventId);

    if (!event) {
      throw new HttpError(404, "Event not found.");
    }

    const ticketCount = Number(input.ticketCount);
    const timestamp = new Date().toISOString();

    createdBooking = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      eventId: event.id,
      eventTitle: event.title,
      eventImage: event.image,
      city: event.city,
      venue: event.venue,
      date: event.date,
      time: event.time,
      ticketCount,
      totalAmount: Number(event.price) * ticketCount,
      bookedAt: timestamp,
      bookingCode: buildBookingCode(),
    };

    store.bookings.unshift(createdBooking);

    return store;
  });

  return buildPublicBooking(createdBooking);
}

export async function listBookingsForUser(user) {
  const store = await readStore();
  const bookings = store.bookings.filter((booking) => booking.userId === user.id);

  return sortBookings(bookings).map(buildPublicBooking);
}

export async function listAllBookings() {
  const store = await readStore();

  return sortBookings(store.bookings).map(buildPublicBooking);
}
