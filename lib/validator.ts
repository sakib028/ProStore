import { z } from "zod";
import { formatNumberDecimal } from "./utils";
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
