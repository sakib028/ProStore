import { auth } from "@/auth";
import CartDetails from "@/components/shared/product/CartDetails";
import CartItem from "@/components/shared/product/CartItem";
import { Button } from "@/components/ui/button"; // Assuming shadcn
import { getMyCart } from "@/lib/actions/CartAction";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CartPage() {
  const session = await auth();
  const cart = await getMyCart();
  console.log(cart);

  if (!session?.user) {
    redirect("/sign-in");
  }

  // 1. Handle Empty Cart
  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Button asChild>
          <Link href="/">Go Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <CartItem cart={cart} />
        {/* RIGHT COLUMN: SUMMARY */}
        <CartDetails cart={cart} />
      </div>
    </div>
  );
}
