import "dotenv/config";
import sampleData from "./sample-data";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();

  await prisma.user.createMany({
    data: sampleData.users,
  });
  await prisma.product.createMany({
    data: sampleData.products,
  });

  console.log("Database seeded successfully");
}

main();
