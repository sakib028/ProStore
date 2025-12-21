import { cn } from "@/lib/utils";
import React from "react";
type ProductPrice = {
  value: number;
  className?: string;
};
export default function ProductPrice({ value, className }: ProductPrice) {
  const stringValue = value.toFixed(2);
  const [intValue, floatValue] = stringValue.split(".");
  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-sm align-super">$</span>
      {intValue}
      <span className="text-sm align-super">{floatValue}</span>
    </p>
  );
}
