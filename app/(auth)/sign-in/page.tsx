import React from "react";
import { auth, signIn } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import SignInForm from "./SignInForm";
import { redirect } from "next/navigation";
export const metadata: import("next").Metadata = {
  title: "Sign In - ProStore",
  description: "Sign in to your ProStore account",
};
export default async function page(props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) {
  const { callbackUrl } = await props.searchParams;
  const season = await auth();
  if (season) {
    redirect(callbackUrl || "/");
  }
  return (
    <div className="max-w-md mx-auto w-full">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} Logo`}
              width={100}
              height={100}
              priority={true}
            />
          </Link>
          <CardTitle className="text-center text-2xl font-bold">
            Sign In
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
