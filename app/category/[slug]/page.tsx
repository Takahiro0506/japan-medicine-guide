import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getProductsSearchIndex } from "@/lib/data";
import { getOtcClassInfo } from "@/lib/otcClass";

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
  const [categories, products] = await Promise.all([getCategories(), getProductsSearchIndex()]);

  const category = categories.find((item) => item.slug === slug);
  if (!category) {
    notFound();
  }

  const items = products
    .filter((product) => product.category === slug)
    .sort((a, b) => a.name_romaji.localeCompare(b.name_romaji));

  return (
    <main className="page">
      <div className="brandbar">
        <Link className="backlink" href="/">
          &larr; Home
        </Link>
        <span className="brandmark">{category.name_en}</span>
      </div>

      <h2 className="ask">{category.name_en}</h2>
      <p className="ask-sub">{category.name_ja}</p>

      {items.length === 0 && <p className="notsold-d">No products yet.</p>}

      {items.map((product) => {
        const classInfo = getOtcClassInfo(product.otc_class);
        return (
          <Link
            className="result result-link"
            href={`/products/${product.slug}`}
            key={product.slug}
          >
            <div className="result-ja">{product.name_ja}</div>
            <div className="result-ro">{product.name_romaji}</div>
            <div className="result-ing">
              {product.ingredients.map((ing) => ing.name_en).join(", ")}
            </div>
            <span className={`tag ${classInfo.isClass1 ? "tag-caution" : "tag-ok"}`}>
              {classInfo.en} &middot; {classInfo.isClass1 ? "pharmacist required" : "take from shelf"}
            </span>
          </Link>
        );
      })}

      <p className="disclaimer">
        We list what each box contains, not which one to take. Ask the pharmacist at the counter.
      </p>
    </main>
  );
}
