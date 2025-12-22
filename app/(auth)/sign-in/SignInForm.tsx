"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredentials } from "@/lib/actions/userAction";
import { signIndefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export default function SignInForm() {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });
  const searchParam = useSearchParams();
  const callbackUrl = searchParam.get("callbackUrl") || "/";
  const SignInButton = () => {
    // Change [pending] to { pending }
    const { pending } = useFormStatus();

    return (
      <Button className="w-full" variant="default" disabled={pending}>
        {pending ? "Signing In..." : "SignIn"}
      </Button>
    );
  };
  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={signIndefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            autoComplete="password"
            defaultValue={signIndefaultValues.password}
          />
        </div>
        <div>
          <SignInButton />
        </div>
        {data && !data.success && (
          <div className="text-sm text-center text-red-600">{data.message}</div>
        )}
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="link" target="_self">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
}
