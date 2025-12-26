"use client";

import { AppToast } from "@/components/AppToast";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/CartAction";
import { CardItem, Card } from "@/types";
import { Loader, Minus, Plus } from "lucide-react";
import React, { useTransition } from "react";
import { useFormStatus } from "react-dom";

export default function AddToCard({
  cart,
  item,
}: {
  cart?: Card;
  item: CardItem;
}) {
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
  const [ispending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      setOpen(false); // reset toast before showing again

      const res = await addItemToCart(item);

      if (!res.success) {
        setToastData({
          title: "Error",
          description: res.message,
          variant: "error",
        });
      } else {
        setToastData({
          title: "Added to Cart",
          description: res.message,
          variant: "success",
          actionLabel: "View Cart",
          actionHref: "/cart",
        });
      }

      setOpen(true);
    });
  };
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      setOpen(false);
      console.log(item.productId);
      const res = await removeItemFromCart(item.productId);
      if (!res.success) {
        setToastData({
          title: "Error in remove Cart",
          description: res.message,
          variant: "error",
        });
      } else {
        setToastData({
          title: "remove from Cart",
          description: res.message,
          variant: "success",
          actionLabel: "View Cart",
          actionHref: "/cart",
        });
      }

      setOpen(true);
    });
  };
  const existCart =
    cart && cart.items.find((x) => x.productId === item.productId);

  return (
    <>
      {existCart ? (
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={handleRemoveFromCart}
          >
            {ispending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Minus className="h-4 w-4" />
            )}
          </Button>
          <span className="px-2">{existCart.quantity}</span>
          <Button type="button" variant="outline" onClick={handleAddToCart}>
            {ispending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      ) : (
        <Button
          className="w-full flex items-center gap-2"
          type="button"
          onClick={handleAddToCart}
        >
          {ispending ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          Add To Cart
        </Button>
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
