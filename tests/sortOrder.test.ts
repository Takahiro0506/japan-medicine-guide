import { describe, expect, test } from "vitest";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { productIngredients } from "@/data/productIngredients";
import { consultOptions } from "@/data/consultOptions";

function duplicates<T extends string | number>(values: T[]): T[] {
  const seen = new Set<T>();
  const dupes = new Set<T>();
  for (const v of values) {
    if (seen.has(v)) dupes.add(v);
    seen.add(v);
  }
  return [...dupes];
}

describe("sort order (\"並び順は設計項目\" の機械化)", () => {
  test("products.sort_order has no duplicates within a category", () => {
    const byCategory = new Map<string, number[]>();
    for (const p of products) {
      const list = byCategory.get(p.category) ?? [];
      list.push(p.sort_order);
      byCategory.set(p.category, list);
    }
    const violations: string[] = [];
    for (const [category, orders] of byCategory) {
      const dupes = duplicates(orders);
      if (dupes.length > 0) violations.push(`${category}: [${dupes.join(",")}]`);
    }
    expect(violations).toEqual([]);
  });

  test("otc_class = 'class1' products always use sort_order 9", () => {
    const bad = products
      .filter((p) => p.otc_class === "class1" && p.sort_order !== 9)
      .map((p) => `${p.slug}(sort_order=${p.sort_order})`);
    expect(bad).toEqual([]);
  });

  test("categories.sort_order has no duplicates", () => {
    expect(duplicates(categories.map((c) => c.sort_order))).toEqual([]);
  });

  test("product_ingredients.sort_order is a 1..N run per product (box print order)", () => {
    const byProduct = new Map<string, number[]>();
    for (const pi of productIngredients) {
      const list = byProduct.get(pi.product_slug) ?? [];
      list.push(pi.sort_order);
      byProduct.set(pi.product_slug, list);
    }
    const violations: string[] = [];
    for (const [slug, orders] of byProduct) {
      const sorted = [...orders].sort((a, b) => a - b);
      const expected = sorted.map((_, i) => i + 1);
      if (sorted.join(",") !== expected.join(",")) {
        violations.push(`${slug}: [${sorted.join(",")}]`);
      }
    }
    expect(violations).toEqual([]);
  });

  test("consult_options.sort_order has no duplicates within a step", () => {
    const byStep = new Map<number, number[]>();
    for (const o of consultOptions) {
      const list = byStep.get(o.step) ?? [];
      list.push(o.sort_order);
      byStep.set(o.step, list);
    }
    const violations: string[] = [];
    for (const [step, orders] of byStep) {
      const dupes = duplicates(orders);
      if (dupes.length > 0) violations.push(`step ${step}: [${dupes.join(",")}]`);
    }
    expect(violations).toEqual([]);
  });
});
