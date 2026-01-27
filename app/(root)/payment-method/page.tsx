import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/userAction";
import PaymentMethodForm from "./PaymentMethodForm";
import CheckOutSteps from "@/components/shared/CheckOutSteps";

export const metadata = {
  title: "Payment Method",
  description: "Payment Method",
};

export default async function PaymentMethod() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const user = await getUserById(userId);
  return (
    <>
      <CheckOutSteps current={2} />
      <PaymentMethodForm paymentMethod={user?.paymentMethod} />
    </>
  );
}
