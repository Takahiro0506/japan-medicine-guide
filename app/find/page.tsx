import { Suspense } from "react";
import { getForeignBrands, getProductsSearchIndex } from "@/lib/data";
import { FindResults } from "./FindResults";

export const dynamic = "force-static";

export default async function FindPage() {
  const [foreignBrands, products] = await Promise.all([
    getForeignBrands(),
    getProductsSearchIndex(),
  ]);

  return (
    <Suspense fallback={null}>
      <FindResults foreignBrands={foreignBrands} products={products} />
    </Suspense>
  );
}
