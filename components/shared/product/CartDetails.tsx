import { Card as cart } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Button } from "@/components/ui/button";

export default function CartDetails({ cart }: { cart: cart }) {
  return (
    <div className="md:col-span-1">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="flex justify-between border-b pb-2">
            <span>Subtotal</span>
            <span>${cart.itemsPrice}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Tax</span>
            <span>${cart.texPrice}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Shipping</span>
            <span>${cart.shippingPrice}</span>
          </div>
          <div className="flex justify-between pt-2 font-bold text-lg">
            <span>Total</span>
            <span>${cart.totalPrice}</span>
          </div>
          <Button className="w-full mt-4" size="lg">
            Proceed to Checkout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
