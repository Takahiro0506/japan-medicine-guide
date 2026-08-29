import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer" aria-label="Site">
      <Link href="/about">About</Link>
      <Link href="/consult">Make a card</Link>
    </footer>
  );
}
