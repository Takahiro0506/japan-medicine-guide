import Link from "next/link";
import { getCategories } from "@/lib/data";

export const dynamic = "force-static";

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
        <Link className="row" href={`/category/${category.slug}`} key={category.slug}>
          <div>
            <div className="en">{category.name_en}</div>
            <div className="ja">{category.name_ja}</div>
          </div>
          <span className="chev">&rsaquo;</span>
        </Link>
      ))}

      <div className="divider">
        <span>Not sure what to look for?</span>
      </div>
      <Link className="cta" href="/consult">
        Ask the pharmacist
      </Link>

      <div className="foot">
        Information only &mdash; not medical advice. Facts come from manufacturers&#39; package
        inserts and are checked by a registered pharmacist in Japan.
      </div>
    </main>
  );
}
