"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ForeignBrandItem, ProductSearchItem } from "@/lib/data";
import { getOtcClassInfo } from "@/lib/otcClass";

export function FindResults({
  foreignBrands,
  products,
}: {
  foreignBrands: ForeignBrandItem[];
  products: ProductSearchItem[];
}) {
  const searchParams = useSearchParams();
  const brandParam = (searchParams.get("brand") ?? "").trim();
  const normalized = brandParam.toLowerCase();
  const brand = foreignBrands.find((item) => item.name.toLowerCase() === normalized);

  if (!brandParam || !brand) {
    return (
      <main className="page">
        <div className="brandbar">
          <Link className="backlink" href="/">
            &larr; Search
          </Link>
          <span className="brandmark">{brandParam || "Find"}</span>
        </div>

        <div className="notsold">
          <div className="notsold-t">&quot;{brandParam}&quot; not found.</div>
          <div className="notsold-d">
            We don&#39;t have this brand yet. Try browsing by symptom instead.
          </div>
        </div>

        <Link className="backlink" href="/">
          &larr; Browse by symptom
        </Link>
      </main>
    );
  }

  const matched = products
    .filter((product) => product.ingredients.some((ing) => ing.slug === brand.ingredient_slug))
    .sort((a, b) => a.ingredients.length - b.ingredients.length);

  return (
    <main className="page">
      <div className="brandbar">
        <Link className="backlink" href="/">
          &larr; Search
        </Link>
        <span className="brandmark">{brand.name}</span>
      </div>

      <div className="notsold">
        <div className="notsold-t">{brand.name} isn&#39;t sold in Japan.</div>
        <div className="notsold-d">
          {brand.caveat_en || "You won't find the box here, but the ingredient is on the shelf."}
        </div>
      </div>

      <div className="finding">
        <div className="finding-main">
          {brand.name} contains <span className="chem">{brand.ingredient_name_en}</span>.
        </div>
      </div>

      <span className="label">Contains {brand.ingredient_name_en}</span>

      {matched.length === 0 && (
        <p className="notsold-d" style={{ marginTop: 12 }}>
          No matching products yet.
        </p>
      )}

      {matched.map((product) => {
        const classInfo = getOtcClassInfo(product.otc_class);
        return (
          <div className="result" key={product.slug}>
            <div className="result-ja">{product.name_ja}</div>
            <div className="result-ro">{product.name_romaji}</div>
            <div className="result-ing">
              {product.ingredients.length === 1 ? (
                <>
                  <span className="hit">{product.ingredients[0].name_en}</span> only
                </>
              ) : (
                product.ingredients.map((ing, index) => (
                  <span key={ing.slug}>
                    {index > 0 && ", "}
                    {ing.slug === brand.ingredient_slug ? (
                      <span className="hit">{ing.name_en}</span>
                    ) : (
                      ing.name_en
                    )}
                  </span>
                ))
              )}
            </div>
            <span className={`tag ${classInfo.isClass1 ? "tag-caution" : "tag-ok"}`}>
              {classInfo.en} &middot; {classInfo.isClass1 ? "pharmacist required" : "take from shelf"}
            </span>
          </div>
        );
      })}

      <p className="disclaimer">
        We list what each box contains, not which one to take. Ask the pharmacist at the counter.
      </p>
    </main>
  );
}
