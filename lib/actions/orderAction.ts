"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { CardItem } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { converToPlainObject, formatError } from "../utils";
import { insertOrderSchema } from "../validator";
import { getMyCart } from "./CartAction";
import { getUserById } from "./userAction";

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User not authenticated");
    }
    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Cart is empty",
        redirectTo: "/cart",
      };
    }
    const userId = session?.user?.id;
    if (!userId) {
      throw new Error("User ID not found");
    }
    const user = await getUserById(userId);
    if (!user.address) {
      return {
        success: false,
        message: "Address not found",
        redirectTo: "/shipping-address",
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "Payment method not found",
        redirectTo: "/payment-method",
      };
    }
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.texPrice,
      totalPrice: cart.totalPrice,
    });
    //transaction
    const insertOrderId = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: order,
      });
      for (const item of cart.items as CardItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: newOrder.id,
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            image: item.image,
          },
        });
      }
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: 0,
          shippingPrice: 0,
          texPrice: 0,
          totalPrice: 0,
        },
      });
      return newOrder.id;
    });
    if (!insertOrderId) {
      throw new Error("Order not created");
    }
    return {
      success: true,
      message: "Order created successfully",
      redirectTo: `/order/${insertOrderId}`,
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

export async function getOrderById(orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });
  return converToPlainObject(order);
}
