import { supabase } from "@/lib/supabase";
import type { OtcClass } from "@/lib/otcClass";

export interface ProductSearchItem {
  slug: string;
  name_ja: string;
  name_romaji: string;
  otc_class: OtcClass;
  search_terms: string[];
  ingredients: { slug: string; name_en: string }[];
}

export interface ForeignBrandItem {
  name: string;
  ingredient_slug: string;
  ingredient_name_en: string;
  caveat_en: string | null;
}

export interface CategoryItem {
  slug: string;
  name_en: string;
  name_ja: string;
}

interface RawProductRow {
  slug: string;
  name_ja: string;
  name_romaji: string;
  otc_class: OtcClass;
  search_terms: string[];
  product_ingredients: {
    sort_order: number;
    ingredients: { slug: string; name_en: string } | null;
  }[];
}

interface RawForeignBrandRow {
  name: string;
  ingredient_slug: string;
  caveat_en: string | null;
  ingredients: { name_en: string } | null;
}

export async function getProductsSearchIndex(): Promise<ProductSearchItem[]> {
  const { data } = await supabase
    .from("products")
    .select(
      "slug, name_ja, name_romaji, otc_class, search_terms, product_ingredients(sort_order, ingredients(slug, name_en))"
    )
    .order("sort_order", { foreignTable: "product_ingredients", ascending: true })
    .returns<RawProductRow[]>();

  return (data ?? []).map((row) => ({
    slug: row.slug,
    name_ja: row.name_ja,
    name_romaji: row.name_romaji,
    otc_class: row.otc_class,
    search_terms: row.search_terms,
    ingredients: row.product_ingredients
      .filter((pi) => pi.ingredients !== null)
      .map((pi) => ({ slug: pi.ingredients!.slug, name_en: pi.ingredients!.name_en })),
  }));
}

export async function getForeignBrands(): Promise<ForeignBrandItem[]> {
  const { data } = await supabase
    .from("foreign_brands")
    .select("name, ingredient_slug, caveat_en, ingredients(name_en)")
    .order("name", { ascending: true })
    .returns<RawForeignBrandRow[]>();

  return (data ?? []).map((row) => ({
    name: row.name,
    ingredient_slug: row.ingredient_slug,
    ingredient_name_en: row.ingredients?.name_en ?? "",
    caveat_en: row.caveat_en,
  }));
}

export async function getCategories(): Promise<CategoryItem[]> {
  const { data } = await supabase
    .from("categories")
    .select("slug, name_en, name_ja")
    .order("sort_order", { ascending: true })
    .returns<CategoryItem[]>();
  return data ?? [];
}
