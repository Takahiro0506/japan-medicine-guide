import { describe, expect, test } from "vitest";
import { products } from "@/data/products";
import { consultOptions } from "@/data/consultOptions";
import { getOtcClassInfo, type OtcClass } from "@/lib/otcClass";

// consult_options.step IN (1,2,3) の CHECK 制約の代替
const VALID_STEPS = [1, 2, 3] as const;
// otc_class enum の代替
const VALID_OTC_CLASSES: readonly OtcClass[] = [
  "class1",
  "designated_class2",
  "class2",
  "class3",
];

describe("value sets (CHECK constraint replacement)", () => {
  test("products.otc_class is always one of the 4 known values", () => {
    const bad = products
      .filter((p) => !VALID_OTC_CLASSES.includes(p.otc_class))
      .map((p) => `${p.slug}: ${p.otc_class}`);
    expect(bad).toEqual([]);
  });

  test("lib/otcClass.ts covers all 4 otc_class values with non-empty labels", () => {
    for (const cls of VALID_OTC_CLASSES) {
      const info = getOtcClassInfo(cls);
      expect(info, `missing display info for otc_class "${cls}"`).toBeDefined();
      expect(info.en.length).toBeGreaterThan(0);
      expect(info.ja.length).toBeGreaterThan(0);
    }
  });

  test("consult_options.step is always 1, 2 or 3", () => {
    const bad = consultOptions
      .filter((o) => !(VALID_STEPS as readonly number[]).includes(o.step))
      .map((o) => o.slug);
    expect(bad).toEqual([]);
  });

  test("every step (1, 2, 3) has at least one option", () => {
    for (const step of VALID_STEPS) {
      const count = consultOptions.filter((o) => o.step === step).length;
      expect(count, `step ${step} has no options`).toBeGreaterThan(0);
    }
  });
});
