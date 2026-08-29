import type { MetadataRoute } from "next";
import { getCategories, getProductsSearchIndex } from "@/lib/data";

const SITE_URL = "https://japan-medicine-guide-omega.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProductsSearchIndex(),
  ]);

  return [
    { url: `${SITE_URL}/`, priority: 1 },
    { url: `${SITE_URL}/about`, priority: 0.5 },
    { url: `${SITE_URL}/consult`, priority: 0.8 },
    ...categories.map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      priority: 0.6,
    })),
  ];
}
