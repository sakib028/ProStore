import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

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
    },
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
