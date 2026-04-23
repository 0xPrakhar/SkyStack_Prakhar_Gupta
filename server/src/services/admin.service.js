import { readStore } from "./data-store.js";
import { listEvents } from "./events.service.js";

function sortBookings(bookings) {
  return [...bookings].sort(
    (left, right) =>
      new Date(right.bookedAt ?? 0).getTime() - new Date(left.bookedAt ?? 0).getTime(),
  );
}

export async function getAdminOverview() {
  const [store, events] = await Promise.all([readStore(), listEvents()]);
  const bookings = sortBookings(store.bookings);
  const totalRevenue = bookings.reduce(
    (total, booking) => total + Number(booking.totalAmount ?? 0),
    0,
  );
  const ticketsSold = bookings.reduce(
    (total, booking) => total + Number(booking.ticketCount ?? 0),
    0,
  );

  return {
    stats: {
      totalRevenue,
      ticketsSold,
      activeEvents: events.length,
      registeredUsers: store.users.length,
    },
    recentBookings: bookings.slice(0, 10),
    events,
  };
}
