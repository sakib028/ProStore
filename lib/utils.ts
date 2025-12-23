import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function converToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function formatNumberDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}:00`;
}
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any) {
  if (error.name == "ZodError") {
    const fieldError = Object.keys(error.errors).map(
      (key) => error.errors[key].message
    );
    return fieldError.join(", ");
    // Zod validation error
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field} already exists. Please use a different ${field}.`;
    // Prisma unique constraint violation
  } else {
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
    // Generic or unknown error
  }
}
