"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema, signUpFormSchema } from "../validator";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";

export async function signInWithCredentials(
  prevState: unknown,
  data: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: data.get("email"),
      password: data.get("password"),
    });
    await signIn("credentials", user);
    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: "Invalid email or password",
    };
  }
}
//signOut function
export async function signOutUser(_: FormData): Promise<void> {
  await signOut();

  // optional but recommended
}
export async function signUpUser(prevState: unknown, data: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
    });
    console.log(user);
    user.password = hashSync(user.password, 10);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
    await signIn("credentials", {
      email: user.email,
      password: data.get("password") as string,
    });
    // Call your user registration logic here (e.g., save to database)
    // For demonstration, we'll just return a success message
    return {
      success: true,
      message: "User registered successfully",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
}
