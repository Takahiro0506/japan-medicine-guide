import Link from "next/link";
import type { Metadata } from "next";
import { getAboutStats } from "@/lib/data";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About",
  description:
    "How Japan Medicine Guide sources its facts, who checked them, and what this guide does not do.",
  alternates: { canonical: "/about" },
};

function formatLongDate(iso: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function AboutPage() {
  const stats = await getAboutStats();

  return (
    <main className="shell">
      <div className="bar">
        <Link className="back" href="/" aria-label="Back to Home">
          &lsaquo;
        </Link>
        <h2>About</h2>
      </div>

      <div className="about-section">
        <h3>What this is</h3>
        <p>
          This guide shows what Japanese over-the-counter medicines contain, in English. It does
          not tell you which one to take.
        </p>
      </div>

      <div className="about-section">
        <h3>Where the facts come from</h3>
        <ul>
          <li>
            Product names, active ingredients and the legal class come from each manufacturer&#39;s
            package insert
          </li>
          <li>Every product page links to the manufacturer&#39;s own page</li>
          <li>
            {stats.productCount} products across {stats.categoryCount} categories
          </li>
        </ul>
      </div>

      {stats.lastChecked && (
        <div className="about-section">
          <h3>Who checked it</h3>
          <p>The facts were checked by a registered pharmacist in Japan.</p>
          <p>Last checked: {formatLongDate(stats.lastChecked)}</p>
        </div>
      )}

      <div className="about-section">
        <h3>What this guide does not do</h3>
        <ul>
          <li>It does not recommend a medicine</li>
          <li>It does not give doses</li>
          <li>It cannot tell you whether a medicine is safe for you</li>
        </ul>
        <p>Ask the pharmacist if you are pregnant, taking other medicine, or under 15.</p>
        <p>This site is not affiliated with any manufacturer or pharmacy.</p>
      </div>
    </main>
  );
}
