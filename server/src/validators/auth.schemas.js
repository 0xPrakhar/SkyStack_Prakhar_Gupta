import { z } from "zod";

<<<<<<< HEAD
<<<<<<< HEAD
export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long.").max(80),
  email: z.string().trim().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(64, "Password must be 64 characters or fewer.")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S+$/, "Password must include uppercase, lowercase, and a number."),
=======
=======
>>>>>>> e91372e (initial commit)
const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{8,64}$/;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long.")
    .max(80, "Name must be 80 characters or fewer."),
  email: z.string().trim().email("Please enter a valid email address."),
  password: z
    .string()
    .regex(
      passwordRule,
      "Password must be 8-64 characters, include uppercase, lowercase, and a number, and cannot contain spaces.",
    ),
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
});

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});
