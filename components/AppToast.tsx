"use client";

import * as Toast from "@radix-ui/react-toast";
import clsx from "clsx";
import { useRouter } from "next/navigation";

type ToastVariant = "success" | "error" | "info";

export function AppToast({
  open,
  onOpenChange,
  title,
  description,
  variant = "info",
  actionLabel,
  actionHref,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: ToastVariant;
  actionLabel?: string;
  actionHref?: string;
}) {
  const router = useRouter();

  return (
    <Toast.Root
      open={open}
      onOpenChange={onOpenChange}
      className={clsx(
        "grid grid-cols-[1fr_auto] gap-x-3 rounded-md px-4 py-3 text-white shadow-lg",
        {
          "bg-green-600": variant === "success",
          "bg-red-600": variant === "error",
          "bg-blue-600": variant === "info",
        }
      )}
    >
      <div>
        <Toast.Title className="font-semibold">{title}</Toast.Title>

        {description && (
          <Toast.Description className="text-sm opacity-90">
            {description}
          </Toast.Description>
        )}
      </div>

      {actionLabel && actionHref && (
        <Toast.Action asChild altText={actionLabel}>
          <button
            onClick={() => {
              onOpenChange(false);
              router.push(actionHref);
            }}
            className="h-8 rounded-md bg-white/20 px-3 text-sm font-medium text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white"
          >
            {actionLabel}
          </button>
        </Toast.Action>
      )}
    </Toast.Root>
  );
}
