import { describe, expect, test } from "vitest";
import { products } from "@/data/products";

// docs/schema/2026-09-14_inventory.md と docs/archive/products_2026-09-14.csv から
// 手で書き写した32件。slug は主キーであり URL であり foreign_brands の参照先でもあるため
// 凍結する（CLAUDE.md「絶対に守ること」: slug は変更しない）
const FROZEN_SLUGS = [
  "alesion-20",
  "allegra-fx",
  "anneron",
  "benza-block-l",
  "bufferin-a",
  "bufferin-luna-i",
  "claritin-ex",
  "eve-a",
  "gaster-10",
  "kinkan",
  "liquid-muhi-s2a",
  "loxonin-s",
  "lulu-attack-ex",
  "mentholatum-ad",
  "muhi-s",
  "oronine-h",
  "ota-isan",
  "pabron-gold-a",
  "pelack-t",
  "rohto-c-cube-a",
  "ryukakusan-direct",
  "salonpas-ae",
  "sante-fx-neo",
  "seirogan",
  "shin-biofermin-s",
  "smile-40ex",
  "stonarini-z",
  "stoppa-ex",
  "taisho-kampo-ichoyaku",
  "travelmin",
  "tylenol-a",
  "voltaren-ex-tape",
].sort();

describe("product slugs are frozen", () => {
  test("exactly 32 slugs, matching the frozen list", () => {
    const actual = products.map((p) => p.slug).sort();
    expect(actual.length).toBe(32);
    expect(actual).toEqual(FROZEN_SLUGS);
  });
});
