import type { OtcClass } from "@/lib/otcClass";
import { products } from "@/data/products";
import { ingredients } from "@/data/ingredients";
import { productIngredients } from "@/data/productIngredients";
import { foreignBrands } from "@/data/foreignBrands";
import { categories } from "@/data/categories";
import { consultOptions } from "@/data/consultOptions";

export interface ProductSearchItem {
  slug: string;
  name_ja: string;
  name_romaji: string;
  summary_en: string;
  otc_class: OtcClass;
  category: string;
  form: string;
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
  form: string;
  ingredientSlugs: string[];
}

const ingredientBySlug = new Map(ingredients.map((ingredient) => [ingredient.slug, ingredient]));

function ingredientsForProduct(productSlug: string) {
  return productIngredients
    .filter((pi) => pi.product_slug === productSlug)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((pi) => ingredientBySlug.get(pi.ingredient_slug))
    .filter((ingredient): ingredient is NonNullable<typeof ingredient> => Boolean(ingredient));
}

export function getProductsSearchIndex(): ProductSearchItem[] {
  return products.map((product) => ({
    slug: product.slug,
    name_ja: product.name_ja,
    name_romaji: product.name_romaji,
    summary_en: product.summary_en,
    otc_class: product.otc_class,
    category: product.category,
    form: product.form,
    source_url: product.source_url,
    reviewed_at: product.reviewed_on,
    ingredients: ingredientsForProduct(product.slug).map((ing) => ({
      slug: ing.slug,
      name_en: ing.name_en,
    })),
  }));
}

export function getProductsByCategory(categorySlug: string): CategoryProductItem[] {
  return products
    .filter((product) => product.category === categorySlug)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((product) => ({
      slug: product.slug,
      name_ja: product.name_ja,
      name_romaji: product.name_romaji,
      otc_class: product.otc_class,
      form: product.form,
      ingredientSlugs: ingredientsForProduct(product.slug).map((ing) => ing.slug),
    }));
}

export function getForeignBrands(): ForeignBrandItem[] {
  return [...foreignBrands]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((brand) => ({
      name: brand.name,
      ingredient_slug: brand.ingredient_slug,
      ingredient_name_en: ingredientBySlug.get(brand.ingredient_slug)?.name_en ?? "",
      caveat_en: brand.caveat_en,
    }));
}

export function getCategories(): CategoryItem[] {
  return [...categories]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category) => ({
      slug: category.slug,
      name_en: category.name_en,
      name_ja: category.name_ja,
    }));
}

export interface ConsultOption {
  slug: string;
  step: 1 | 2 | 3;
  text_en: string;
  text_en_full: string;
  text_ja: string;
}

export function getConsultOptions(): ConsultOption[] {
  return [...consultOptions]
    .sort((a, b) => a.step - b.step || a.sort_order - b.sort_order)
    .map((option) => ({
      slug: option.slug,
      step: option.step,
      text_en: option.text_en,
      text_en_full: option.text_en_full,
      text_ja: option.text_ja,
    }));
}

export interface AboutStats {
  productCount: number;
  categoryCount: number;
  lastChecked: string | null;
}

export function getAboutStats(): AboutStats {
  const lastChecked = products.reduce<string | null>((latest, product) => {
    if (!latest || product.reviewed_on > latest) return product.reviewed_on;
    return latest;
  }, null);

  return {
    productCount: products.length,
    categoryCount: categories.length,
    lastChecked,
  };
}

// /review（監修用）専用。成分の日本語名はこの画面にのみ出す
export interface ReviewProductItem {
  slug: string;
  name_ja: string;
  name_romaji: string;
  maker: string;
  otc_class: OtcClass;
  source_url: string;
  reviewed_on: string;
  ingredients: { slug: string; name_en: string; name_ja: string }[];
}

export function getReviewProducts(): ReviewProductItem[] {
  return [...products]
    .sort((a, b) => a.reviewed_on.localeCompare(b.reviewed_on))
    .map((product) => ({
      slug: product.slug,
      name_ja: product.name_ja,
      name_romaji: product.name_romaji,
      maker: product.maker,
      otc_class: product.otc_class,
      source_url: product.source_url,
      reviewed_on: product.reviewed_on,
      ingredients: ingredientsForProduct(product.slug).map((ing) => ({
        slug: ing.slug,
        name_en: ing.name_en,
        name_ja: ing.name_ja,
      })),
    }));
}
