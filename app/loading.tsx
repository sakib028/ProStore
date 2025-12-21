import Image from "next/image";
import React from "react";
import loader from "@/assets/loader.gif";

export default function loading() {
  return;
  <div className="flex items-center justify-center h-screen w-screen">
    <Image src={loader} height={150} width={150} alt="loading" />;
  </div>;
}
