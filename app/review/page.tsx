import type { Metadata } from "next";
import { getReviewProducts } from "@/lib/data";

export const dynamic = "force-static";

// 監修用ページ。検索結果に出さない（robots.ts の disallow と二重で防ぐ）
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  const products = getReviewProducts();

  return (
    <main className="page review-page">
      <div className="brandbar">
        <span className="brandmark">Japan Medicine Guide</span>
        <span className="backlink">Review</span>
      </div>

      {products.map((product) => (
        <div className="review-item" key={product.slug}>
          <div className="review-name-ja">{product.name_ja}</div>
          <div className="review-name-ro">{product.name_romaji}</div>
          <div className="review-meta">{product.maker}</div>
          <div className="review-meta">{product.otc_class}</div>
          <div className="review-meta">Reviewed {product.reviewed_on}</div>

          <div className="review-ing-list">
            {product.ingredients.map((ing) => (
              <div className="review-ing-row" key={ing.slug}>
                <span className="review-ing-en">{ing.name_en}</span>
                <span className="review-ing-ja">{ing.name_ja}</span>
              </div>
            ))}
          </div>

          <div className="review-link">
            <a href={product.source_url} target="_blank" rel="noreferrer">
              {product.source_url}
            </a>
          </div>
        </div>
      ))}
    </main>
  );
}
