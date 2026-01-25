import React from "react";
import CartTable from "./CartTable";
import { getMyCart } from "@/lib/actions/CartAction";
export const metadata = {
  title: "Cart - ProStore",
  description: "Your shopping cart items",
};

export default async function Page() {
  const cart = await getMyCart();
  return (
    <>
      <CartTable cards={cart} />
    </>
  );
}
