"use client";
import React from "react";
import { Card as cart } from "@/types";
import { CardItem } from "@/types";
import { useRouter } from "next/navigation";
import { AppToast } from "@/components/AppToast";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { set } from "zod";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/CartAction";
import { ArrowLeftRight, Loader, Minus, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function CartTable({ cards }: { cards?: cart }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [toastData, setToastData] = React.useState<{
    title: string;
    description?: string;
    variant: "success" | "error" | "info";
    actionLabel?: string;
    actionHref?: string;
  }>({
    title: "",
    description: "",
    variant: "info",
  });
  const [isPending, startTransition] = React.useTransition();

  const handleRemoveItem = async ({ productId }: { productId: string }) => {
    setOpen(false);
    const res = await removeItemFromCart(productId);
    if (res.success) {
      setToastData({
        title: "Item removed from cart",
        variant: "success",
      });
      router.refresh();
    } else {
      setToastData({
        title: "Failed to remove item",
        description: res.message,
        variant: "error",
      });
    }
    setOpen(true);
  };
  const handleAddItem = async ({ item }: { item: CardItem }) => {
    setOpen(false);
    const res = await addItemToCart(item);
    if (res.success) {
      setToastData({
        title: "Item added to cart",
        variant: "success",
      });
      router.refresh();
    } else {
      setToastData({
        title: "Failed to add item",
        description: res.message,
        variant: "error",
      });
    }
    setOpen(true);
  };
  return (
    <>
      <h2 className="py-4 h2-bold">Shopping Cart</h2>
      {!cards || cards.items.length === 0 ? (
        <div className="py-10 text-center">
          Your cart is empty.{" "}
          <Link href="/" className="text-blue-600 underline">
            Go shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cards.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center space-x-2"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        type="button"
                        variant="outline"
                        onClick={() =>
                          startTransition(() =>
                            handleRemoveItem({ productId: item.productId }),
                          )
                        }
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        disabled={isPending}
                        type="button"
                        variant="outline"
                        onClick={() =>
                          startTransition(() => handleAddItem({ item: item }))
                        }
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="p-5 gap-4">
              <div className="pb-3 text-xl">
                Subtotal({cards.items.reduce((a, c) => a + c.quantity, 0)}):
                <span className="font-bold">
                  {" "}
                  {formatCurrency(Number(cards.totalPrice))}
                </span>
              </div>
              <Button
                className="w-full"
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push("/shipping-address"))
                }
              >
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ArrowLeftRight className="w-4 h-4 ml-2" />
                    Proceed to Checkout
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      <AppToast
        open={open}
        onOpenChange={setOpen}
        title={toastData.title}
        description={toastData.description}
        variant={toastData.variant}
        actionLabel={toastData.actionLabel}
        actionHref={toastData.actionHref}
      />
    </>
  );
}
