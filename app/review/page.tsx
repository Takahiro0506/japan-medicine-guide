import { supabase } from "@/lib/supabase";

export const dynamic = "force-static";

interface ReviewProductRow {
  slug: string;
  name_ja: string;
  name_romaji: string;
  maker: string;
  otc_class: string;
  source_url: string | null;
  reviewed_at: string | null;
  updated_at: string;
}

interface ReviewIngredientRow {
  product_slug: string;
  sort_order: number;
  ingredients: { name_en: string; name_ja: string } | null;
}

async function getProducts() {
  const { data } = await supabase
    .from("products")
    .select("slug, name_ja, name_romaji, maker, otc_class, source_url, reviewed_at, updated_at")
    .order("slug", { ascending: true })
    .returns<ReviewProductRow[]>();
  return data ?? [];
}

async function getIngredientsByProduct() {
  const { data } = await supabase
    .from("product_ingredients")
    .select("product_slug, sort_order, ingredients(name_en, name_ja)")
    .order("product_slug", { ascending: true })
    .order("sort_order", { ascending: true })
    .returns<ReviewIngredientRow[]>();

  const byProduct = new Map<string, ReviewIngredientRow[]>();
  for (const row of data ?? []) {
    const rows = byProduct.get(row.product_slug) ?? [];
    rows.push(row);
    byProduct.set(row.product_slug, rows);
  }
  return byProduct;
}

function needsReview(product: ReviewProductRow) {
  if (!product.reviewed_at) return true;
  return new Date(product.updated_at).getTime() > new Date(product.reviewed_at).getTime();
}

export default async function ReviewPage() {
  const [products, ingredientsByProduct] = await Promise.all([
    getProducts(),
    getIngredientsByProduct(),
  ]);

  return (
    <main className="page review-page">
      <div className="brandbar">
        <span className="brandmark">Japan Medicine Guide</span>
        <span className="backlink">Review</span>
      </div>

      {products.map((product) => {
        const ingredients = ingredientsByProduct.get(product.slug) ?? [];
        return (
          <div className="review-item" key={product.slug}>
            <div className="review-name-ja">
              {product.name_ja}
              {needsReview(product) && <span className="tag-unreviewed">未確認</span>}
            </div>
            <div className="review-name-ro">{product.name_romaji}</div>
            <div className="review-meta">{product.maker}</div>
            <div className="review-meta">{product.otc_class}</div>

            <div className="review-ing-list">
              {ingredients.map((row) => (
                <div className="review-ing-row" key={row.sort_order}>
                  <span className="review-ing-en">{row.ingredients?.name_en}</span>
                  <span className="review-ing-ja">{row.ingredients?.name_ja}</span>
                </div>
              ))}
            </div>

            <div className="review-link">
              {product.source_url ? (
                <a href={product.source_url} target="_blank" rel="noreferrer">
                  {product.source_url}
                </a>
              ) : (
                "No source"
              )}
            </div>
          </div>
        );
      })}
    </main>
  );
}
