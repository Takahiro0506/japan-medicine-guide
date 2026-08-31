"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const KOFI_URL = "https://ko-fi.com/japanmedicineguide";

export function Footer() {
  const pathname = usePathname();
  const showSupport = !pathname?.startsWith("/products/");

  return (
    <footer className="site-footer" aria-label="Site">
      <div className="links">
        <Link href="/about">About</Link>
        {showSupport && (
          <a href={KOFI_URL} target="_blank" rel="noopener noreferrer" className="support">
            Support this free guide<span className="arrow" aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        )}
      </div>
      <p className="disclaimer">
        Information only &mdash; not medical advice. Facts come from manufacturers&#39; package
        inserts and are checked by a registered pharmacist in Japan.
      </p>
    </footer>
  );
}
