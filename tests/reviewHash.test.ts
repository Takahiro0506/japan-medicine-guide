import { createHash } from "node:crypto";
import { describe, expect, test } from "vitest";
import { products } from "@/data/products";
import { productIngredients } from "@/data/productIngredients";

// review_hash の再計算はここに独立して実装する。app のバンドルには置かない
// (CLAUDE.md「## 監修体制」参照)。監修者が検証する3項目:
// name_ja / 成分 slug の列（sort_order 順 = 箱の印刷順）/ otc_class
function computeReviewHash(product: { slug: string; name_ja: string; otc_class: string }): string {
  const ingredientSlugs = productIngredients
    .filter((pi) => pi.product_slug === product.slug)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((pi) => pi.ingredient_slug);

  const payload = JSON.stringify({
    name_ja: product.name_ja,
    ingredients: ingredientSlugs,
    otc_class: product.otc_class,
  });

  return createHash("sha256").update(payload).digest("hex").slice(0, 8);
}

describe("review_hash detects unreviewed changes to the 3 audited fields", () => {
  test("every product's stored review_hash matches a fresh recomputation", () => {
    const mismatches = products
      .filter((p) => computeReviewHash(p) !== p.review_hash)
      .map((p) => `${p.slug}: stored=${p.review_hash} computed=${computeReviewHash(p)}`);
    expect(mismatches).toEqual([]);
  });
});
