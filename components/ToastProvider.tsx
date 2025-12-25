"use client";

import * as Toast from "@radix-ui/react-toast";
import { ReactNode } from "react";

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider swipeDirection="right">
      {children}
      <Toast.Viewport className="fixed bottom-4 right-4 z-50 w-[360px] max-w-full outline-none" />
    </Toast.Provider>
  );
}
