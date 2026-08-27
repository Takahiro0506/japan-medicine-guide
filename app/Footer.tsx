import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <Link href="/about">About</Link>
      <Link href="/phrases">Phrases</Link>
    </footer>
  );
}
