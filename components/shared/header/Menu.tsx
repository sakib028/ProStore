import React from "react";
import { auth } from "@/auth";
import ModeToggle from "./mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserIcon, EllipsisVertical, ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./UserButton";
export default async function Menu() {
  const session = await auth();
  return (
    <div className="flex justify-end gap-3">
      <nav className=" hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-baseline">
            <EllipsisVertical />
            <SheetContent className="flex flex-col items-start">
              <SheetTitle>Menu</SheetTitle>
              <ModeToggle />
              <Button asChild variant="ghost">
                <Link href="/cart">
                  <ShoppingCart /> Cart
                </Link>
              </Button>
              <UserButton session={session} />
              <SheetDescription></SheetDescription>
            </SheetContent>
          </SheetTrigger>
        </Sheet>
      </nav>
    </div>
  );
}
