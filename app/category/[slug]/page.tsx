import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getForeignBrands, getProductsByCategory } from "@/lib/data";

export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
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
        <Link className="back" href="/">
          &lsaquo;
        </Link>
        <div>
          <h2>{category.name_en}</h2>
          <div className="sub">{category.name_ja}</div>
        </div>
      </div>

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
            <div className="nm">{product.name_ja}</div>
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
