import { describe, expect, test } from "vitest";
import { products } from "@/data/products";
import { productIngredients } from "@/data/productIngredients";
import { foreignBrands } from "@/data/foreignBrands";

// docs/schema/2026-09-14_inventory.md および CLAUDE.md「外国ブランドの扱い」に
// 記載の6件。slug は data/products.ts で実際の値を確認して手で書いている
// (claritin-ex であって clarityne-ex ではない)。既存データからの自動生成はしない。
const EXPECTED_SAME_AS_SLUGS = [
  "allegra-fx",
  "claritin-ex",
  "gaster-10",
  "stonarini-z",
  "tylenol-a",
  "voltaren-ex-tape",
].sort();

function ingredientSlugsOf(productSlug: string): string[] {
  return productIngredients
    .filter((pi) => pi.product_slug === productSlug)
    .map((pi) => pi.ingredient_slug);
}

// 旧 02_verify_review_2026-08-29_1.sql のクエリD相当。
// 「有効成分がちょうど1つ、かつその成分が登録ブランドに対応する」場合のみラベルを出す
function matchingForeignBrand(productSlug: string) {
  const ingredientSlugs = ingredientSlugsOf(productSlug);
  if (ingredientSlugs.length !== 1) return undefined;
  return foreignBrands.find((b) => b.ingredient_slug === ingredientSlugs[0]);
}

describe('"Same as X" label eligibility', () => {
  const withLabel = products.filter((p) => matchingForeignBrand(p.slug) !== undefined);

  test("exactly 6 products are eligible for the label", () => {
    expect(withLabel.length).toBe(6);
  });

  test("the eligible slug set matches the documented 6 products exactly", () => {
    const actual = withLabel.map((p) => p.slug).sort();
    expect(actual).toEqual(EXPECTED_SAME_AS_SLUGS);
  });

  test("no product with 2+ active ingredients is ever eligible for the label", () => {
    // ibuprofen (Nurofen) と aspirin (Aspro) は実データ上すでに配合薬の成分として
    // 登場している。ガードが無ければここでラベルが出てしまう組み合わせが実在することを
    // 確認したうえで、実際には1件も出ないことを検証する（空振りテストにしないため）
    const comboCandidates = products.filter((p) => {
      const slugs = ingredientSlugsOf(p.slug);
      return (
        slugs.length >= 2 && slugs.some((s) => foreignBrands.some((b) => b.ingredient_slug === s))
      );
    });

    expect(comboCandidates.length).toBeGreaterThan(0);

    const wronglyEligible = comboCandidates.filter((p) => matchingForeignBrand(p.slug) !== undefined);
    expect(wronglyEligible.map((p) => p.slug)).toEqual([]);
  });
});
