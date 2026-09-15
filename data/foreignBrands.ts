import type { ForeignBrandRow } from "./types";

// docs/archive/foreign_brands_2026-09-14.csv から生成。
// source_url と verified は持たない（CLAUDE.md「foreign_brands は出典を持たない」参照）。
export const foreignBrands = [
  { name: "Aspro", ingredient_slug: "aspirin", caveat_en: null },
  { name: "Claratyne", ingredient_slug: "loratadine", caveat_en: null },
  { name: "Nurofen", ingredient_slug: "ibuprofen", caveat_en: null },
  { name: "Panadol", ingredient_slug: "paracetamol", caveat_en: null },
  { name: "Pepcid", ingredient_slug: "famotidine", caveat_en: null },
  {
    name: "Telfast",
    ingredient_slug: "fexofenadine",
    caveat_en: "Sold in Japan under the name Allegra",
  },
  { name: "Voltaren", ingredient_slug: "diclofenac", caveat_en: null },
  { name: "Zyrtec", ingredient_slug: "cetirizine", caveat_en: null },
] as const satisfies readonly ForeignBrandRow[];
