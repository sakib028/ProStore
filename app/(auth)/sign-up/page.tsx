import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignUpForm from "./SingUpForm";
export const metadata: import("next").Metadata = {
  title: "Sign Up - ProStore",
  description: "Sign up for a ProStore account",
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
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your ProStore account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
