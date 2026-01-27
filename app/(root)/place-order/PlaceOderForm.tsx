"use client";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/orderAction";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useFormStatus } from "react-dom";

export default function PlaceOderForm() {
  const router = useRouter();
  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button
        type="submit"
        variant="outline"
        disabled={pending}
        className=" w-full p-2 rounded-md"
      >
        {pending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4 " />
        )}
        Place Order
      </Button>
    );
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await createOrder();
    if (result.redirectTo) {
      router.push(result.redirectTo);
    }
  };
  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <PlaceOrderButton />
    </form>
  );
}
