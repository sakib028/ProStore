import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types";
type productType = {
  data: Product[];
  title?: string;
  limit?: number;
};

export default function ProductList({ data, title, limit }: productType) {
  const limiteData = limit ? data.slice(0, limit) : data;
  return (
    <div className="my-10">
      <h2 className=" font-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {limiteData.map((product: Product) => (
            <div key={product.slug}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div>No Products Found</div>
      )}
    </div>
  );
}
