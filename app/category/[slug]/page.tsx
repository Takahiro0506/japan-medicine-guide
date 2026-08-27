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
    <main className="v2">
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
        const sameAs = foreignBrands.find((brand) =>
          product.ingredientSlugs.includes(brand.ingredient_slug)
        );
        const isClass1 = product.otc_class === "class1";

        return (
          <Link className="pcard" href={`/products/${product.slug}`} key={product.slug}>
            <div className="nm">{product.name_ja}</div>
            <div className="ro">{product.name_romaji}</div>
            {(sameAs || isClass1) && (
              <div className="badges">
                {sameAs && <span className="same">Same as {sameAs.name}</span>}
                {isClass1 && <span className="tag stop">Pharmacist required</span>}
              </div>
            )}
          </Link>
        );
      })}
    </main>
  );
}
