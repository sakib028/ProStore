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
  // Fixed typo: changed ":" to "." for the default decimal return
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any): string {
  console.log(error.name);
  if (error.name === "ZodError") {
    // 1. Zod actually uses 'issues'. 'errors' is often just a getter.
    // We use optional chaining and a fallback to an empty array.
    const issues = error.issues || error.errors || [];

    if (issues.length > 0) {
      return issues.map((err: { message: string }) => err.message).join(". ");
    }

    // Fallback if it's a ZodError but the issues array is empty/missing
    return error.message || "Validation failed";
  }

  if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    const field = error.meta?.target
      ? (error.meta.target as string[])[0]
      : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Handle standard Error objects or strings
  return typeof error.message === "string"
    ? error.message
    : JSON.stringify(error) || "An unknown error occurred";
}
