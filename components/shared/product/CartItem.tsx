import { Card as cart } from "@/types";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Assuming shadcn
import { Card, CardContent } from "@/components/ui/card";

export default function CartItem({ cart }: { cart: cart }) {
  return (
    <div className="md:col-span-2 space-y-4">
      {cart.items.map((item) => (
        <Card key={item?.slug}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="relative h-20 w-20 flex-shrink-0">
              <Image
                src={item?.image}
                alt={item?.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-grow">
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p className="text-muted-foreground text-sm">
                Qty: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">${item.price}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
