import type { OtcClass } from "@/lib/otcClass";

export interface ProductRow {
  slug: string;
  name_ja: string;
  name_romaji: string;
  summary_en: string;
  maker: string;
  otc_class: OtcClass;
  category: string;
  form: string;
  sort_order: number;
  source_url: string;
  reviewed_on: string;
  // 監修者が検証する3項目（name_ja / 成分slugの列 / otc_class）から計算した
  // sha256 先頭8文字。計算式は tests/reviewHash.test.ts 側で再実装して照合する
  review_hash: string;
}

export interface IngredientRow {
  slug: string;
  name_en: string;
  name_ja: string;
  note_en: string | null;
}

export interface ProductIngredientRow {
  product_slug: string;
  ingredient_slug: string;
  sort_order: number;
}

export interface ForeignBrandRow {
  name: string;
  ingredient_slug: string;
  caveat_en: string | null;
}

export interface CategoryRow {
  slug: string;
  name_en: string;
  name_ja: string;
  sort_order: number;
}

export interface ConsultOptionRow {
  slug: string;
  step: 1 | 2 | 3;
  text_en: string;
  text_en_full: string;
  text_ja: string;
  sort_order: number;
}

export interface CounterPhraseRow {
  slug: string;
  text_en: string;
  text_ja: string;
  sort_order: number;
}
