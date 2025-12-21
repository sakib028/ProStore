import ProductList from "@/components/shared/product/ProductList";
import { getLatestProduct } from "@/lib/actions/productAction";

const HomePage = async () => {
  const data = await getLatestProduct();
  return <ProductList data={data} title="New Arrival" limit={4} />;
};

export default HomePage;
