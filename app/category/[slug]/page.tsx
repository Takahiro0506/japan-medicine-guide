import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getForeignBrands, getProductsByCategory } from "@/lib/data";

export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) return {};

  return {
    title: `${category.name_en} medicines in Japan`,
    description: `Japanese over-the-counter ${category.name_en.toLowerCase()} (${category.name_ja}) products, with active ingredients and legal class for each.`,
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [categories, foreignBrands, products] = await Promise.all([
    getCategories(),
    getForeignBrands(),
    getProductsByCategory(slug),
  ]);

  const category = categories.find((item) => item.slug === slug);
  if (!category) {
    notFound();
  }

  return (
    <main className="shell">
      <div className="bar">
        <Link className="back" href="/" aria-label="Back to Home">
          &lsaquo;
        </Link>
        <div>
          <h2>{category.name_en}</h2>
          <div className="sub">{category.name_ja}</div>
        </div>
      </div>

      <p className="lede">
        Choose the exact product name on the box to check its active ingredients.
      </p>

      {products.map((product) => {
        const sameAs =
          product.ingredientSlugs.length === 1
            ? foreignBrands.find((brand) => brand.ingredient_slug === product.ingredientSlugs[0])
            : undefined;
        const isClass1 = product.otc_class === "class1";

        return (
          <Link className="pcard" href={`/products/${product.slug}`} key={product.slug}>
            {sameAs && <div className="samechip">Same as {sameAs.name}</div>}
            <div className="ro">{product.name_romaji}</div>
            <div className="nm" lang="ja">
              {product.name_ja}
            </div>
            {isClass1 && (
              <div className="meta">
                <span className="kbox k1">第1類</span>
                <span className="req">Pharmacist required</span>
              </div>
            )}
          </Link>
        );
      })}
    </main>
  );
}
