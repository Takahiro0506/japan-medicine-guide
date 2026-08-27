import Link from "next/link";

export const dynamic = "force-static";

// Update this date whenever the pharmacist re-confirms the site's content.
const LAST_CONFIRMED = "2026-08-27";

export default function AboutPage() {
  return (
    <main className="page">
      <div className="brandbar">
        <Link className="backlink" href="/">
          &larr; Home
        </Link>
        <span className="brandmark">About</span>
      </div>

      <h2 className="ask">Information only, checked in Japan.</h2>

      <div className="about-body">
        <p>
          Japan Medicine Guide gives you facts, not advice. It does not tell you which medicine
          to take &mdash; that decision is between you and the pharmacist at the counter.
        </p>
        <p>
          Every product name, classification, and ingredient list on this site comes from the
          manufacturer&#39;s package insert and has been checked by a pharmacist registered in
          Japan.
        </p>
        <p>
          If you&#39;re unsure which medicine is right for you, ask the pharmacist. They can see
          your symptoms and history in a way this site can&#39;t.
        </p>
      </div>

      <p className="disclaimer">Last confirmed {LAST_CONFIRMED}.</p>
    </main>
  );
}
