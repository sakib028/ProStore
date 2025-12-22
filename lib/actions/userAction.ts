"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema } from "../validator";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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
