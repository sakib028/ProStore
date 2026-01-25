import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/CartAction";
import { getUserById } from "@/lib/actions/userAction";
import { ShippingAddress } from "@/types";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./ShippingAddressForm";
import CheckOutSteps from "@/components/shared/CheckOutSteps";
export const metadata = {
  title: "Shipping Address - ProStore",
  description: "Enter your shipping address",
};
export default async function Page() {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const user = await getUserById(userId);
  return (
    <>
      <CheckOutSteps current={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />;
    </>
  );
}
