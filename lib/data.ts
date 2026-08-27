import { supabase } from "@/lib/supabase";
import type { OtcClass } from "@/lib/otcClass";

export interface ProductSearchItem {
  slug: string;
  name_ja: string;
  name_romaji: string;
  otc_class: OtcClass;
  category: string;
  search_terms: string[];
  source_url: string | null;
  reviewed_at: string | null;
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

export interface CategoryProductItem {
  slug: string;
  name_ja: string;
  name_romaji: string;
  otc_class: OtcClass;
  ingredientSlugs: string[];
}

interface RawProductRow {
  slug: string;
  name_ja: string;
  name_romaji: string;
  otc_class: OtcClass;
  category: string;
  search_terms: string[];
  source_url: string | null;
  reviewed_at: string | null;
  product_ingredients: {
    sort_order: number;
    ingredients: { slug: string; name_en: string } | null;
  }[];
}

interface RawCategoryProductRow {
  slug: string;
  name_ja: string;
  name_romaji: string;
  otc_class: OtcClass;
  product_ingredients: { ingredients: { slug: string } | null }[];
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
      "slug, name_ja, name_romaji, otc_class, category, search_terms, source_url, reviewed_at, product_ingredients(sort_order, ingredients(slug, name_en))"
    )
    .order("sort_order", { foreignTable: "product_ingredients", ascending: true })
    .returns<RawProductRow[]>();

  return (data ?? []).map((row) => ({
    slug: row.slug,
    name_ja: row.name_ja,
    name_romaji: row.name_romaji,
    otc_class: row.otc_class,
    category: row.category,
    search_terms: row.search_terms,
    source_url: row.source_url,
    reviewed_at: row.reviewed_at,
    ingredients: row.product_ingredients
      .filter((pi) => pi.ingredients !== null)
      .map((pi) => ({ slug: pi.ingredients!.slug, name_en: pi.ingredients!.name_en })),
  }));
}

export async function getProductsByCategory(categorySlug: string): Promise<CategoryProductItem[]> {
  const { data } = await supabase
    .from("products")
    .select("slug, name_ja, name_romaji, otc_class, product_ingredients(ingredients(slug))")
    .eq("category", categorySlug)
    .order("sort_order", { ascending: true })
    .returns<RawCategoryProductRow[]>();

  return (data ?? []).map((row) => ({
    slug: row.slug,
    name_ja: row.name_ja,
    name_romaji: row.name_romaji,
    otc_class: row.otc_class,
    ingredientSlugs: row.product_ingredients
      .map((pi) => pi.ingredients?.slug)
      .filter((slug): slug is string => Boolean(slug)),
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

export interface ConsultOption {
  slug: string;
  step: 1 | 2 | 3;
  text_en: string;
  text_ja: string;
}

export async function getConsultOptions(): Promise<ConsultOption[]> {
  const { data } = await supabase
    .from("consult_options")
    .select("slug, step, text_en, text_ja")
    .order("step", { ascending: true })
    .order("sort_order", { ascending: true })
    .returns<ConsultOption[]>();
  return data ?? [];
}
