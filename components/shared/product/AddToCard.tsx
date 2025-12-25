"use client";

import { AppToast } from "@/components/AppToast";
import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/CartAction";
import { CardItem } from "@/types";
import { Plus } from "lucide-react";
import React from "react";

export default function AddToCard({ item }: { item: CardItem }) {
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

  const handleAddToCart = async () => {
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
        description: "Item successfully added to your cart",
        variant: "success",
        actionLabel: "View Cart",
        actionHref: "/cart",
      });
    }

    setOpen(true);
  };

  return (
    <>
      <Button
        className="w-full flex items-center gap-2"
        type="button"
        onClick={handleAddToCart}
      >
        <Plus size={16} />
        Add To Cart
      </Button>

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
