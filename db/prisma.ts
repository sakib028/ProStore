import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";
import { it } from "zod/v4/locales";

// 1. Setup Neon WebSocket support
if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ DATABASE_URL is missing from your .env file.");
}

// 2. Singleton pattern to prevent "Too many connections" and "Host not set" errors
const prismaClientSingleton = () => {
  // Simple initialization: Pass the string directly to the adapter
  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({ adapter }).$extends({
    result: {
      product: {
        price: { compute: (p) => p.price.toString() },
        rating: { compute: (p) => p.rating.toString() },
      },
      cart: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute: (c) => c.itemsPrice.toString(),
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute: (c) => c.shippingPrice.toString(),
        },
        texPrice: {
          needs: { texPrice: true },
          compute: (c) => c.texPrice.toString(),
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute: (c) => c.totalPrice.toString(),
        },
      },
      order: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute: (c) => c.itemsPrice.toString(),
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute: (c) => c.shippingPrice.toString(),
        },
        taxPrice: {
          needs: { taxPrice: true },
          compute: (c) => c.taxPrice.toString(),
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute: (c) => c.totalPrice.toString(),
        },
      },
      orderItem: {
        price: {
          compute: (c) => c.price.toString(),
        },
      },
    },
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
