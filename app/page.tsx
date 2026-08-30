import Link from "next/link";
import type { Metadata } from "next";
import { Thermometer, Wind, Droplet, Flower, Bandage, Eye, Waves } from "lucide-react";
import { getCategories } from "@/lib/data";
import { TabBar } from "./TabBar";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// 湿布のマーク。lucide に該当アイコンがないためインラインSVGで自作する
function PatchIcon({ size = 20, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <line x1="7" y1="10" x2="17" y2="10" />
      <line x1="7" y1="13" x2="17" y2="13" />
      <line x1="7" y1="16" x2="14" y2="16" />
    </svg>
  );
}

// categories テーブルには持たせず、ここで固定する
const CATEGORY_ICON: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  "pain-fever": Thermometer,
  "cold-flu": Wind,
  stomach: Droplet,
  allergy: Flower,
  skin: Bandage,
  "eye-drops": Eye,
  "motion-sickness": Waves,
  "muscle-joint": PatchIcon,
};

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <>
      <div className="brandhead">
        <div className="mark">JAPAN MEDICINE GUIDE</div>
        <div className="route">AUSTRALIA → JAPAN</div>
        <div className="ask">At a chemist in Japan?</div>
      </div>
      <TabBar current="medicines" />
      <main className="shell">
        <div className="intro">
          <h2>MATCH THE NAME ON THE BOX</h2>
        </div>

        <div className="signlist">
          {categories.map((category) => {
            const Icon = CATEGORY_ICON[category.slug];
            return (
              <Link className="sign" href={`/category/${category.slug}`} key={category.slug}>
                <div className="ic" aria-hidden="true">
                  {Icon && <Icon size={20} strokeWidth={1.5} />}
                </div>
                <div className="tx">
                  <div className="en">{category.name_en}</div>
                  <div className="ja">{category.name_ja}</div>
                </div>
                <div className="ar" aria-hidden="true">
                  &rsaquo;
                </div>
              </Link>
            );
          })}
        </div>

        <div className="divider">
          <span>Not sure what to look for?</span>
        </div>
        <Link className="cta" href="/consult">
          Ask the pharmacist
        </Link>
        <p className="cta-sub">
          Make a Japanese card describing your symptoms to show at the counter.
        </p>

        <div className="foot">
          Information only &mdash; not medical advice. Facts come from manufacturers&#39; package
          inserts and are checked by a registered pharmacist in Japan.
        </div>
      </main>
    </>
  );
}
