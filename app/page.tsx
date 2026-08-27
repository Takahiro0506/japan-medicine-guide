import { getCategories, getForeignBrands, getProductsSearchIndex } from "@/lib/data";
import { HomeSearch } from "./HomeSearch";

export const dynamic = "force-static";

export default async function HomePage() {
  const [categories, foreignBrands, products] = await Promise.all([
    getCategories(),
    getForeignBrands(),
    getProductsSearchIndex(),
  ]);

  return (
    <main className="page">
      <div className="brandbar">
        <span className="brandmark">Japan Medicine Guide</span>
        <span className="backlink">About</span>
      </div>

      <h2 className="ask">Reading the shelf at a Japanese chemist.</h2>
      <p className="ask-sub">Search a brand you use at home, or browse by symptom.</p>

      <HomeSearch foreignBrands={foreignBrands} products={products} />

      <div className="rule-top">
        <span className="label">Browse by symptom</span>
      </div>
      <div className="catgrid">
        {categories.map((category) => (
          <div className="cat" key={category.slug}>
            <div className="cat-en">{category.name_en}</div>
            <div className="cat-ja">{category.name_ja}</div>
          </div>
        ))}
      </div>

      <p className="disclaimer">
        Information only &mdash; not medical advice. Checked by a registered pharmacist in Japan.
      </p>
    </main>
  );
}
