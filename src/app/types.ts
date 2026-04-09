export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface EventRating {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EventBooking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  ticketCount: number;
  totalAmount: number;
  bookedAt: string;
  bookingCode: string;
}

export interface EventRecord {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  date: string;
  time: string;
  city: string;
  venue: string;
  price: number;
  image: string;
  description: string;
  featured?: boolean;
  ratings?: EventRating[];
  ratingAverage?: number;
  ratingCount?: number;
  lat?: number;
  lng?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  createdByName?: string;
  updatedBy?: string;
}

export type EventPayload = Omit<
  EventRecord,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "createdBy"
  | "createdByName"
  | "updatedBy"
  | "ratings"
  | "ratingAverage"
  | "ratingCount"
>;

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: ApiFieldError[];
}
