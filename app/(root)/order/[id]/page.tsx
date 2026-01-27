import { getOrderById } from "@/lib/actions/orderAction";
import { notFound } from "next/navigation";
import { title } from "process";
import React from "react";
import OrderDetailsTable from "./OrderDetailsTable";
import { ShippingAddress } from "@/types";
export const metadata = {
  title: "Order Detail",
};

export default async function OrderDetail(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const order = await getOrderById(id);
  if (!order) {
    return notFound();
  }
  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
    />
  );
}
