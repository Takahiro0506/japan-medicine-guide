import Link from "next/link";

type TabBarCurrent = "medicines" | "consult";

export function TabBar({ current }: { current: TabBarCurrent }) {
  return (
    <div className="tabs">
      {current === "medicines" ? (
        <span className="on" aria-current="page">
          Medicines
        </span>
      ) : (
        <Link href="/">Medicines</Link>
      )}
      {current === "consult" ? (
        <span className="on" aria-current="page">
          Ask pharmacist
        </span>
      ) : (
        <Link href="/consult">Ask pharmacist</Link>
      )}
    </div>
  );
}
