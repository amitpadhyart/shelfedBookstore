import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Tell us your name (at least 2 characters)."),
  email: z.string().email("That doesn't look like a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("That doesn't look like a valid email."),
  password: z.string().min(1, "Enter your password."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const addressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(2, "Enter the recipient's full name."),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
  line1: z.string().min(4, "Enter the house/flat and street."),
  line2: z.string().optional(),
  city: z.string().min(2, "Enter a city."),
  state: z.string().min(2, "Enter a state."),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code."),
  isDefault: z.boolean().optional(),
});
export type AddressInput = z.infer<typeof addressSchema>;

export const checkoutSchema = addressSchema.omit({ label: true, isDefault: true });
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const reviewSchema = z.object({
  bookId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().min(9),
  genre: z.string().min(1),
  price: z.number().int().positive(),
  coverUrl: z.string().url(),
  synopsis: z.string().min(10),
  authorBio: z.string().optional(),
  rating: z.number().min(0).max(5).default(0),
  ratingCount: z.number().int().min(0).default(0),
  stock: z.number().int().min(0),
  format: z.enum(["HARDCOVER", "PAPERBACK", "EBOOK"]),
  year: z.number().int().min(1000).max(2100),
  featured: z.boolean().optional(),
  staffPick: z.boolean().optional(),
  staffNote: z.string().optional(),
  newArrival: z.boolean().optional(),
  mood: z.string().optional(),
});
export type BookInput = z.infer<typeof bookSchema>;
