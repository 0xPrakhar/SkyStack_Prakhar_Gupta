import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long.").max(120),
  categoryId: z.string().min(2, "Category is required.").max(40),
  categoryName: z.string().min(2, "Category name is required.").max(60),
  date: z.string().min(3, "Date is required.").max(40),
  time: z.string().min(2, "Time is required.").max(40),
  city: z.string().min(2, "City is required.").max(80),
  venue: z.string().min(2, "Venue is required.").max(120),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  image: z.string().url("Image must be a valid URL."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters long.")
    .max(1500, "Description must be 1500 characters or fewer."),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
});

export const eventRatingSchema = z.object({
  rating: z.coerce
    .number()
    .int("Rating must be a whole number.")
    .min(1, "Rating must be at least 1 star.")
    .max(5, "Rating cannot be more than 5 stars."),
  comment: z
    .string()
    .trim()
    .max(500, "Review must be 500 characters or fewer.")
    .optional()
    .default(""),
});
