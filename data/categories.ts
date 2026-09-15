import type { CategoryRow } from "./types";

// docs/archive/categories_2026-09-14.csv から生成。行順は sort_order 昇順のまま。
export const categories = [
  { slug: "pain-fever", name_en: "Pain & Fever", name_ja: "痛み・熱", sort_order: 1 },
  { slug: "cold-flu", name_en: "Cold & Flu", name_ja: "かぜ", sort_order: 2 },
  { slug: "stomach", name_en: "Stomach", name_ja: "胃腸", sort_order: 3 },
  { slug: "allergy", name_en: "Allergy", name_ja: "アレルギー", sort_order: 4 },
  { slug: "skin", name_en: "Skin", name_ja: "皮膚", sort_order: 5 },
  { slug: "eye-drops", name_en: "Eye drops", name_ja: "目薬", sort_order: 6 },
  {
    slug: "motion-sickness",
    name_en: "Motion sickness",
    name_ja: "乗り物酔い",
    sort_order: 7,
  },
  {
    slug: "muscle-joint",
    name_en: "Muscle & joint",
    name_ja: "筋肉痛・関節痛",
    sort_order: 8,
  },
] as const satisfies readonly CategoryRow[];
