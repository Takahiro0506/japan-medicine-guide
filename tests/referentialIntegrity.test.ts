import { describe, expect, test } from "vitest";
import { products } from "@/data/products";
import { ingredients } from "@/data/ingredients";
import { productIngredients } from "@/data/productIngredients";
import { foreignBrands } from "@/data/foreignBrands";
import { categories } from "@/data/categories";

// DB の外部キー4本（ON DELETE CASCADE を含む）と、カスケード削除が消えたことで
// 生まれうる孤児（成分・空カテゴリ）を機械的に検査する

const categorySlugs = new Set(categories.map((c) => c.slug));
const productSlugs = new Set(products.map((p) => p.slug));
const ingredientSlugs = new Set(ingredients.map((i) => i.slug));

describe("referential integrity (foreign keys the database used to enforce)", () => {
  test("products.category -> categories.slug", () => {
    const bad = products.filter((p) => !categorySlugs.has(p.category)).map((p) => p.slug);
    expect(bad).toEqual([]);
  });

  test("product_ingredients.product_slug -> products.slug", () => {
    const bad = productIngredients
      .filter((pi) => !productSlugs.has(pi.product_slug))
      .map((pi) => `${pi.product_slug}/${pi.ingredient_slug}`);
    expect(bad).toEqual([]);
  });

  test("product_ingredients.ingredient_slug -> ingredients.slug", () => {
    const bad = productIngredients
      .filter((pi) => !ingredientSlugs.has(pi.ingredient_slug))
      .map((pi) => `${pi.product_slug}/${pi.ingredient_slug}`);
    expect(bad).toEqual([]);
  });

  test("foreign_brands.ingredient_slug -> ingredients.slug", () => {
    const bad = foreignBrands
      .filter((b) => !ingredientSlugs.has(b.ingredient_slug))
      .map((b) => b.name);
    expect(bad).toEqual([]);
  });

  test("no ingredient is orphaned (unused by every product)", () => {
    const used = new Set(productIngredients.map((pi) => pi.ingredient_slug));
    const orphans = ingredients.filter((i) => !used.has(i.slug)).map((i) => i.slug);
    expect(orphans).toEqual([]);
  });

  test("no product has zero active ingredients", () => {
    const withIngredients = new Set(productIngredients.map((pi) => pi.product_slug));
    const empty = products.filter((p) => !withIngredients.has(p.slug)).map((p) => p.slug);
    expect(empty).toEqual([]);
  });

  test("no category has zero products (dead end on the shelf page)", () => {
    const usedCategories = new Set(products.map((p) => p.category));
    const empty = categories.filter((c) => !usedCategories.has(c.slug)).map((c) => c.slug);
    expect(empty).toEqual([]);
  });
});
