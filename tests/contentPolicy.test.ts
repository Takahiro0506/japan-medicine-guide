import { describe, expect, test } from "vitest";
import { products } from "@/data/products";
import { ingredients } from "@/data/ingredients";
import { foreignBrands } from "@/data/foreignBrands";
import { consultOptions } from "@/data/consultOptions";
import { categories } from "@/data/categories";

// 用量の比較は医療判断になるため、英語の表示文字列に含有量が現れてはいけない
// (CLAUDE.md「表示しないもの」)
const DOSAGE_PATTERN = /\d+\s?(mg|ml|mcg|g|%)\b/i;

// 豪州英語の禁止語。paracetamol と書く、drugstore ではなく chemist、綴りは -ise 系
// (CLAUDE.md「絶対に守ること」)
const BANNED_PATTERNS: { name: string; pattern: RegExp }[] = [
  { name: "acetaminophen", pattern: /\bacetaminophen\b/i },
  { name: "drugstore", pattern: /\bdrugstore\b/i },
  { name: "-ize style spelling", pattern: /\b\w*iz(e|ed|ing|ation)\b/i },
];

interface EnglishString {
  source: string;
  value: string;
}

function collectEnglishStrings(): EnglishString[] {
  const out: EnglishString[] = [];

  for (const p of products) {
    out.push({ source: `products.${p.slug}.summary_en`, value: p.summary_en });
  }
  for (const i of ingredients) {
    out.push({ source: `ingredients.${i.slug}.name_en`, value: i.name_en });
    if (i.note_en !== null) {
      out.push({ source: `ingredients.${i.slug}.note_en`, value: i.note_en });
    }
  }
  for (const b of foreignBrands) {
    if (b.caveat_en !== null) {
      out.push({ source: `foreignBrands.${b.name}.caveat_en`, value: b.caveat_en });
    }
  }
  for (const o of consultOptions) {
    out.push({ source: `consultOptions.${o.slug}.text_en`, value: o.text_en });
    out.push({ source: `consultOptions.${o.slug}.text_en_full`, value: o.text_en_full });
  }
  for (const c of categories) {
    out.push({ source: `categories.${c.slug}.name_en`, value: c.name_en });
  }

  return out;
}

describe("content policy is machine-checked, not left to attention alone", () => {
  const strings = collectEnglishStrings();

  test("no dosage amounts appear in English copy", () => {
    const bad = strings.filter((s) => DOSAGE_PATTERN.test(s.value)).map((s) => s.source);
    expect(bad).toEqual([]);
  });

  test.each(BANNED_PATTERNS)("no occurrence of banned term: $name", ({ pattern }) => {
    const bad = strings.filter((s) => pattern.test(s.value)).map((s) => s.source);
    expect(bad).toEqual([]);
  });
});
