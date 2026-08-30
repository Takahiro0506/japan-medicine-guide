import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getForeignBrands, getProductsByCategory } from "@/lib/data";
import { CLASS_ONE_BADGE_EN, CLASS_ONE_MARK } from "@/lib/otcClass";
import { getProductFormInfo } from "@/lib/productForm";

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
        </div>
      </div>

      <div className="shelfsign">
        <div className="lb">LOOK FOR THIS SIGN</div>
        <div className="ja" lang="ja">
          {category.name_ja}
        </div>
      </div>
      <div className="slab">MATCH THE NAME ON THE BOX</div>

      {products.map((product) => {
        const sameAs =
          product.ingredientSlugs.length === 1
            ? foreignBrands.find(
                (brand) => brand.ingredient_slug === product.ingredientSlugs[0]
              )
            : undefined;
        const isClass1 = product.otc_class === "class1";
        const formInfo = getProductFormInfo(product.form);

        return (
          <Link className="pcard" href={`/products/${product.slug}`} key={product.slug}>
            <div className="tx">
              <div className="ro">{product.name_romaji}</div>
              <div className="ja" lang="ja">
                {product.name_ja}
              </div>
              {sameAs && <span className="same">Same as {sameAs.name}</span>}
              {isClass1 && (
                <span className="tag">
                  {CLASS_ONE_MARK} {CLASS_ONE_BADGE_EN}
                </span>
              )}
            </div>
            {formInfo && (
              <div className="fm" aria-hidden="true">
                <formInfo.Icon size={20} strokeWidth={1.5} />
              </div>
            )}
          </Link>
        );
      })}

      <div className="escape">
        <p>Can&#39;t find any of these on the shelf?</p>
        <Link className="cta ghost" href="/consult">
          Make a card for the pharmacist
        </Link>
      </div>

      <div className="fs">
        <Link className="b" href="/" aria-label="Back to Home">
          &lsaquo; Home
        </Link>
      </div>
    </main>
  );
}
