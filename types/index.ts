import {
  cartItemSchema,
  insertCartSchema,
  insertProductSchema,
} from "@/lib/validator";
import { z } from "zod";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  createdAt: Date;
  rating: string;
  numReviews: number;
};
export type Card = z.infer<typeof insertCartSchema>;
export type CardItem = z.infer<typeof cartItemSchema>;
