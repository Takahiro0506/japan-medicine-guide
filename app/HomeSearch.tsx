"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ForeignBrandItem, ProductSearchItem } from "@/lib/data";

export function HomeSearch({
  foreignBrands,
  products,
}: {
  foreignBrands: ForeignBrandItem[];
  products: ProductSearchItem[];
}) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function go(term: string) {
    const normalized = term.trim().toLowerCase();
    if (!normalized) return;

    const productMatch = products.find((product) =>
      product.search_terms.some((term) => term.toLowerCase() === normalized)
    );
    if (productMatch) {
      router.push(`/products/${productMatch.slug}`);
      return;
    }

    const brandMatch = foreignBrands.find((brand) => brand.name.toLowerCase() === normalized);
    router.push(`/find?brand=${encodeURIComponent(brandMatch ? brandMatch.name : term.trim())}`);
  }

  return (
    <>
      <form
        className="field"
        onSubmit={(event) => {
          event.preventDefault();
          go(value);
        }}
      >
        <span className="field-icon">&#9656;</span>
        <input
          className="field-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="e.g. Panadol"
          aria-label="Search a brand or symptom"
        />
      </form>
      <div className="suggests">
        {foreignBrands.map((brand) => (
          <button
            type="button"
            className="suggest"
            key={brand.name}
            onClick={() => go(brand.name)}
          >
            {brand.name}
          </button>
        ))}
      </div>
    </>
  );
}
