"use client";
import { AppToast } from "@/components/AppToast";
import { useRouter } from "next/navigation";
import React from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { paymentMethodSchema } from "@/lib/validator";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { on } from "events";
import { updateUserPaymentMethod } from "@/lib/actions/userAction";

export default function PaymentMethodForm({
  paymentMethod,
}: {
  paymentMethod: string | null;
}) {
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
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: paymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const onSubmit = async (data: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      setOpen(false);

      const reponse = await updateUserPaymentMethod(data);
      if (reponse.success) {
        setToastData({
          title: "Payment method updated successfully",
          variant: "success",
        });
        setOpen(true);
        router.push("/place-order");
      } else {
        setToastData({
          title: "Failed to update payment method",
          description: reponse.message,
          variant: "error",
        });
        setOpen(true);
      }
    });
  };
  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4"> Payment Method</h1>
        <p className="text-sm text-muted-foreground">
          Please Selected payment method below.
        </p>
        <Form {...form}>
          <form
            method="post"
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {PAYMENT_METHODS.map((method) => (
                          <FormItem
                            key={method}
                            className="flex items-center space-x-3"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={method}
                                checked={field.value === method}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {method}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin " />
                ) : (
                  <ArrowRight className="w-4 h-4 " />
                )}
                <span className="ml-2">Continue to Payment</span>
              </Button>
            </div>
          </form>
        </Form>
      </div>
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
