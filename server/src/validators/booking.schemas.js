import { z } from "zod";

export const bookingSchema = z.object({
  eventId: z.string().trim().min(1, "Event is required."),
  ticketCount: z.coerce
    .number()
    .int("Ticket count must be a whole number.")
    .min(1, "Book at least one ticket.")
    .max(5, "You can book up to 5 tickets at a time."),
});
