import { CardItem } from "@/types";

export async function addItemToCart(item: CardItem) {
  return {
    success: true,
    message: "Item added to cart successfully",
  };
}
