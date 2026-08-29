import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getForeignBrands, getProductsSearchIndex } from "@/lib/data";
import { getOtcClassInfo } from "@/lib/otcClass";

export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getProductsSearchIndex();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProductsSearchIndex();
  const product = products.find((item) => item.slug === slug);
  if (!product) return {};

  const classInfo = getOtcClassInfo(product.otc_class);
  const ingredientNames = product.ingredients.map((ing) => ing.name_en).join(", ");

  return {
    title: `${product.name_romaji} (${product.name_ja})`,
    description: `${product.name_romaji} — ${product.summary_en}. Active ingredient${product.ingredients.length !== 1 ? "s" : ""}: ${ingredientNames}. ${classInfo.en} in Japan.`,
    alternates: { canonical: `/products/${slug}` },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [products, categories, foreignBrands] = await Promise.all([
    getProductsSearchIndex(),
    getCategories(),
    getForeignBrands(),
  ]);

  const product = products.find((item) => item.slug === slug);
  if (!product) {
    notFound();
  }

  const category = categories.find((item) => item.slug === product.category);
  const isClass1 = product.otc_class === "class1";
  const sameAs =
    product.ingredients.length === 1
      ? foreignBrands.find((brand) => brand.ingredient_slug === product.ingredients[0].slug)
      : undefined;

  return (
    <main className="shell">
      <div className="bar">
        <Link
          className="back"
          href={`/category/${product.category}`}
          aria-label={`Back to ${category?.name_en ?? "category"}`}
        >
          &lsaquo;
        </Link>
        <div>
          <h2>{category?.name_en}</h2>
          <div className="sub">back to the list</div>
        </div>
      </div>

      <div className="placard">
        <div className="ph">MATCH THIS ON THE SHELF</div>
        <div className="pb">
          <div className="big" lang="ja">
            {product.name_ja}
          </div>
          <div className="ro2">{product.name_romaji}</div>
          <div className="en2">{product.summary_en}</div>
        </div>
      </div>

      {isClass1 && (
        <div className="k1row">
          <span className="kbox k1">第1類</span>
          <div className="d">
            Pharmacist required. Like <b>Pharmacist Only (S3)</b> at home. Many shops have no
            pharmacist in the evening.
          </div>
        </div>
      )}

      <div className="field">
        <div className="lb">
          ACTIVE INGREDIENT{product.ingredients.length !== 1 ? "S" : ""}
        </div>
        {product.ingredients.map((ing) => (
          <div className="vl" key={ing.slug}>
            {ing.name_en}
          </div>
        ))}
      </div>

      {sameAs && (
        <div className="samebar">
          <div>
            Same active ingredient as <b>{sameAs.name}</b>.
          </div>
          {sameAs.caveat_en && <div className="caveat">{sameAs.caveat_en}</div>}
        </div>
      )}

      <div className="note">
        <b>Ask the pharmacist</b> if you are pregnant, taking other medicine, or under 15.
      </div>

      {product.source_url && (
        <div className="foot">
          <a href={product.source_url} target="_blank" rel="noopener noreferrer">
            View manufacturer source
          </a>
        </div>
      )}
      {product.reviewed_at && (
        <div className="foot">Checked {product.reviewed_at.slice(0, 10)}.</div>
      )}

      <div className="fs">
        <Link className="b" href={`/category/${product.category}`}>
          &lsaquo; Back to {category?.name_en}
        </Link>
      </div>
    </main>
  );
}
