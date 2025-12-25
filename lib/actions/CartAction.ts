import { CardItem } from "@/types";

export async function addItemToCart(item: CardItem) {
  try {
    return {
      success: true,
      message: "Item added to cart successfully",
    };
  } catch (error) {
    return {};
  }
}
