import Link from "next/link";
import { getCategories } from "@/lib/data";

export const dynamic = "force-static";

// 駅ナンバリング風の2文字符号。categories テーブルには持たせず、ここで固定する
const CATEGORY_CODE: Record<string, string> = {
  "pain-fever": "PF",
  "cold-flu": "CF",
  stomach: "ST",
  allergy: "AL",
  skin: "SK",
  "eye-drops": "EY",
};

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <main className="v2">
      <div className="bar">
        <div>
          <h2>Japan Medicine Guide</h2>
          <div className="sub">What are you looking for?</div>
        </div>
      </div>

      {categories.map((category) => (
        <Link className="sign" href={`/category/${category.slug}`} key={category.slug}>
          <div className="code">{CATEGORY_CODE[category.slug] ?? "??"}</div>
          <div className="tx">
            <div className="en">{category.name_en}</div>
            <div className="ja">{category.name_ja}</div>
          </div>
          <div className="ar">&rarr;</div>
        </Link>
      ))}

      <div className="divider">
        <span>Can&#39;t explain it in Japanese?</span>
      </div>
      <Link className="cta" href="/consult">
        Make a card in Japanese
      </Link>

      <div className="foot">
        Information only &mdash; not medical advice. Facts come from manufacturers&#39; package
        inserts and are checked by a registered pharmacist in Japan.
      </div>
    </main>
  );
}
