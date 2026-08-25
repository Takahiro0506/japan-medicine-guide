import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getOtcClassInfo, type OtcClass } from "@/lib/otcClass";

export const dynamicParams = false;

interface ProductRow {
  slug: string;
  name_ja: string;
  name_romaji: string;
  summary_en: string;
  otc_class: OtcClass;
  source_url: string | null;
  reviewed_at: string | null;
}

interface IngredientRow {
  sort_order: number;
  ingredients: { name_en: string } | null;
}

export async function generateStaticParams() {
  const { data } = await supabase.from("products").select("slug");
  return (data ?? []).map((product) => ({ slug: product.slug }));
}

async function getProduct(slug: string) {
  const { data } = await supabase
    .from("products")
    .select("slug, name_ja, name_romaji, summary_en, otc_class, source_url, reviewed_at")
    .eq("slug", slug)
    .single<ProductRow>();
  return data;
}

async function getIngredients(slug: string) {
  const { data } = await supabase
    .from("product_ingredients")
    .select("sort_order, ingredients(name_en)")
    .eq("product_slug", slug)
    .order("sort_order", { ascending: true })
    .returns<IngredientRow[]>();
  return data ?? [];
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, ingredients] = await Promise.all([
    getProduct(slug),
    getIngredients(slug),
  ]);

  if (!product) {
    notFound();
  }

  const classInfo = getOtcClassInfo(product.otc_class);

  const disclaimerParts: string[] = [];
  if (product.source_url) {
    disclaimerParts.push("Source: manufacturer's package insert.");
  }
  if (product.reviewed_at) {
    disclaimerParts.push(`Checked ${product.reviewed_at.slice(0, 10)}.`);
  }

  return (
    <main className="page">
      <div className="brandbar">
        <span className="brandmark">Japan Medicine Guide</span>
        <span className="backlink">Product</span>
      </div>

      <div className="shelfcard">
        <div className="shelfcard-hint">Match this on the shelf</div>
        <div className="shelfcard-body">
          <div className="name-ja">{product.name_ja}</div>
          <div className="name-ro">{product.name_romaji}</div>
          <div className="name-en">{product.summary_en}</div>
        </div>
      </div>

      {classInfo.isClass1 ? (
        <div className="cautionbar">
          <div className="cautionbar-t">
            {classInfo.en} <span className="ja">{classInfo.ja}</span>
          </div>
          <div className="cautionbar-d">
            Like Pharmacist Only (S3) at home &mdash; a pharmacist has to hand it to you. Many
            shops have no pharmacist on duty in the evening.
          </div>
        </div>
      ) : (
        <div className="classbar">
          <div className="classbar-t">
            {classInfo.en} <span className="ja">{classInfo.ja}</span>
          </div>
        </div>
      )}

      <div className="ingblock">
        <span className="label">
          Active ingredient{ingredients.length !== 1 ? "s" : ""}
        </span>
        {ingredients.map((row) => (
          <div className="val" key={row.sort_order}>
            {row.ingredients?.name_en}
          </div>
        ))}
      </div>

      <div className="askline">
        <b>Ask the pharmacist</b> if you are pregnant, taking other medicine, or under 15.
      </div>

      {disclaimerParts.length > 0 && (
        <p className="disclaimer">{disclaimerParts.join(" ")}</p>
      )}
    </main>
  );
}
