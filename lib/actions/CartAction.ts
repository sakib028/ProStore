"use server";
import { CardItem } from "@/types";
import { converToPlainObject, formatError } from "@/lib/utils";
import { round2ToConvert } from "@/lib/utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validator";
import { revalidatePath } from "next/cache";
import { date, success } from "zod";
import { Prisma } from "@prisma/client";
//Calculate cart price
// Helper to ensure numbers have exactly 2 decimal places
export const calcPrice = async (items: CardItem[]) => {
  const itemsPrice = round2ToConvert(
    items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
  );

  const shippingPrice = round2ToConvert(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2ToConvert(0.15 * itemsPrice);
  const totalPrice = round2ToConvert(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    texPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(item: CardItem) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await getMyCart();
    const deta = cartItemSchema.parse(item);

    const product = await prisma.product.findFirst({
      where: { id: deta.productId },
    });

    if (!product) throw new Error("Product not found");

    if (!cart) {
      // 1. Await the async price calculation
      const prices = await calcPrice([deta]);

      // 2. Pass the resolved prices into the schema
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [deta],
        sessionCartId: sessionCartId,
        ...prices, // Now spreading the actual values, not a Promise
      });

      // 3. Insert into database
      await prisma.cart.create({
        data: newCart,
      });
      revalidatePath(`/product/${product.slug}`);
      return { success: true, message: `${product.name} added to cart` };
    } else {
      const existItem = (cart.items as CardItem[]).find(
        (x) => x.productId === item.productId
      );
      console.log(existItem + "exits");
      if (existItem) {
        if (product.stock < existItem.quantity + 1) {
          throw new Error("Out of Stock");
        }
        (cart.items as CardItem[]).find(
          (x) => x.productId === item.productId
        )!.quantity = existItem.quantity + 1;
      } else {
        if (product.stock < 1) {
          throw new Error("Not enough Stock");
        }
        cart.items.push(item);
      }
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CardItem[]),
        },
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name}${
          existItem?.quantity ? " Updated in" : " Added To"
        } Cart `,
      };
    }

    // Logic for updating existing cart goes here...
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Card session not found");
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });
  if (!cart) return undefined;
  return converToPlainObject({
    ...cart,
    items: cart.items as CardItem[],
    totalPrice: cart.totalPrice.toString(),
    itemsPrice: cart.itemsPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    texPrice: cart.texPrice.toString(),
  });
}

export async function removeItemFormCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) {
      throw new Error("Product not found");
    }
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not Found");
    const exist = (cart.items as CardItem[]).find((x) => {
      x.productId = productId;
    });
    if (!exist) throw new Error("Item not found");
    if (exist.quantity == 1) {
      cart.items = (cart.items as CardItem[]).filter(
        (x) => x.productId !== exist.productId
      );
    } else {
      (cart.items as CardItem[]).find(
        (x) => x.productId === exist.productId
      )!.quantity = exist.quantity - 1;
    }
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CardItem[]),
      },
    });
    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
