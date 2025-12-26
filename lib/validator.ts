import { z } from "zod";
import { formatNumberDecimal } from "./utils";
import { use } from "react";
const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberDecimal(Number(value))),
    "Price must have exactly two decimal places (e.g., 49.99)"
  );

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be least 3 characters"),
  slug: z.string().min(3, "Slug must be least 3 characters"),
  category: z.string().min(3, "Catagory must be least 3 characters"),
  brand: z.string().min(3, "Brand must be least 3 characters"),
  description: z.string().min(3, "Description must be at least 3"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// Schema for sign in form
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

export const cartItemSchema = z.object({
  productId: z.string().min(1, " product ID is required"),
  name: z.string().min(1, "Invalid product name"),
  slug: z.string().min(1, "Invalid product slug"),
  quantity: z.number().int().nonnegative("Quantity must be positive Number"),
  image: z.string().min(1, "Invalid product image"),
  price: currency,
});
export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  texPrice: currency,
  shippingPrice: currency,
  totalPrice: currency,
  sessionCartId: z.string().min(1, "Session Cart ID is required"),
  userId: z.string().optional().nullable(),
});
