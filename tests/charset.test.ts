import { describe, expect, test } from "vitest";
import { products } from "@/data/products";
import { ingredients } from "@/data/ingredients";
import { foreignBrands } from "@/data/foreignBrands";
import { categories } from "@/data/categories";
import { consultOptions } from "@/data/consultOptions";
import { counterPhrases } from "@/data/counterPhrases";

// 印字可能 ASCII のみ
const ASCII = /^[\x20-\x7E]+$/;
// slug は URL セグメントであるため小文字英数字とハイフンのみ
const SLUG = /^[a-z0-9-]+$/;
// ひらがな・カタカナ・漢字・全角記号のいずれかを含む
const JAPANESE = /[぀-ヿ㐀-鿿＀-￯]/;

describe("ASCII-only columns contain no full-width or Japanese characters", () => {
  test("products: slug / name_romaji / summary_en", () => {
    const bad = products
      .filter((p) => !ASCII.test(p.slug) || !ASCII.test(p.name_romaji) || !ASCII.test(p.summary_en))
      .map((p) => p.slug);
    expect(bad).toEqual([]);
  });

  test("ingredients: slug / name_en / note_en", () => {
    const bad = ingredients
      .filter(
        (i) =>
          !ASCII.test(i.slug) ||
          !ASCII.test(i.name_en) ||
          (i.note_en !== null && !ASCII.test(i.note_en))
      )
      .map((i) => i.slug);
    expect(bad).toEqual([]);
  });

  test("foreignBrands: name / ingredient_slug / caveat_en", () => {
    const bad = foreignBrands
      .filter(
        (b) =>
          !ASCII.test(b.name) ||
          !ASCII.test(b.ingredient_slug) ||
          (b.caveat_en !== null && !ASCII.test(b.caveat_en))
      )
      .map((b) => b.name);
    expect(bad).toEqual([]);
  });

  test("categories: slug / name_en", () => {
    const bad = categories
      .filter((c) => !ASCII.test(c.slug) || !ASCII.test(c.name_en))
      .map((c) => c.slug);
    expect(bad).toEqual([]);
  });

  test("consultOptions: slug / text_en / text_en_full", () => {
    const bad = consultOptions
      .filter(
        (o) => !ASCII.test(o.slug) || !ASCII.test(o.text_en) || !ASCII.test(o.text_en_full)
      )
      .map((o) => o.slug);
    expect(bad).toEqual([]);
  });

  test("counterPhrases: slug / text_en", () => {
    const bad = counterPhrases
      .filter((p) => !ASCII.test(p.slug) || !ASCII.test(p.text_en))
      .map((p) => p.slug);
    expect(bad).toEqual([]);
  });
});

describe("slug columns are URL-safe (^[a-z0-9-]+$)", () => {
  test("products.slug / ingredients.slug / foreignBrands.ingredient_slug", () => {
    const bad = [
      ...products.filter((p) => !SLUG.test(p.slug)).map((p) => `products.${p.slug}`),
      ...ingredients.filter((i) => !SLUG.test(i.slug)).map((i) => `ingredients.${i.slug}`),
      ...foreignBrands
        .filter((b) => !SLUG.test(b.ingredient_slug))
        .map((b) => `foreignBrands.${b.name}`),
    ];
    expect(bad).toEqual([]);
  });

  test("categories.slug / consultOptions.slug / counterPhrases.slug", () => {
    const bad = [
      ...categories.filter((c) => !SLUG.test(c.slug)).map((c) => `categories.${c.slug}`),
      ...consultOptions.filter((o) => !SLUG.test(o.slug)).map((o) => `consultOptions.${o.slug}`),
      ...counterPhrases.filter((p) => !SLUG.test(p.slug)).map((p) => `counterPhrases.${p.slug}`),
    ];
    expect(bad).toEqual([]);
  });
});

describe("Japanese columns actually contain Japanese (romaji leakage check)", () => {
  test("products.name_ja", () => {
    const bad = products.filter((p) => !JAPANESE.test(p.name_ja)).map((p) => p.slug);
    expect(bad).toEqual([]);
  });

  test("ingredients.name_ja", () => {
    const bad = ingredients.filter((i) => !JAPANESE.test(i.name_ja)).map((i) => i.slug);
    expect(bad).toEqual([]);
  });

  test("categories.name_ja", () => {
    const bad = categories.filter((c) => !JAPANESE.test(c.name_ja)).map((c) => c.slug);
    expect(bad).toEqual([]);
  });

  test("consultOptions.text_ja", () => {
    const bad = consultOptions.filter((o) => !JAPANESE.test(o.text_ja)).map((o) => o.slug);
    expect(bad).toEqual([]);
  });

  test("counterPhrases.text_ja", () => {
    const bad = counterPhrases.filter((p) => !JAPANESE.test(p.text_ja)).map((p) => p.slug);
    expect(bad).toEqual([]);
  });
});
