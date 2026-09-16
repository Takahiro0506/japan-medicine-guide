import { describe, expect, test } from "vitest";
import { products } from "@/data/products";
import { ingredients } from "@/data/ingredients";
import { productIngredients } from "@/data/productIngredients";
import { foreignBrands } from "@/data/foreignBrands";
import { categories } from "@/data/categories";
import { consultOptions } from "@/data/consultOptions";
import { counterPhrases } from "@/data/counterPhrases";

// docs/schema/2026-09-14_inventory.md の記録から手で書いた期待値。
// 既存データから自動生成しない（現状の追認になり、バグごと固定されるため）

describe("row counts frozen at the 2026-09-14 migration", () => {
  test("total rows per table", () => {
    expect(products.length).toBe(32);
    expect(ingredients.length).toBe(82);
    expect(productIngredients.length).toBe(118);
    expect(foreignBrands.length).toBe(8);
    expect(categories.length).toBe(8);
    expect(consultOptions.length).toBe(26);
    expect(counterPhrases.length).toBe(5);
  });

  test("product_ingredients touches all 32 products (guards against the CSV-truncation incident)", () => {
    const distinctProductSlugs = new Set(productIngredients.map((pi) => pi.product_slug));
    expect(distinctProductSlugs.size).toBe(32);
  });

  test("category breakdown matches the documented counts", () => {
    const EXPECTED: Record<string, number> = {
      "pain-fever": 5,
      "cold-flu": 5,
      stomach: 6,
      allergy: 4,
      skin: 5,
      "eye-drops": 3,
      "motion-sickness": 2,
      "muscle-joint": 2,
    };

    const actual: Record<string, number> = {};
    for (const p of products) {
      actual[p.category] = (actual[p.category] ?? 0) + 1;
    }

    expect(actual).toEqual(EXPECTED);
  });
});
