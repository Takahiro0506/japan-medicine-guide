"use client";

import { useState } from "react";

// 試作（try/product-tab-staff-view）。商品詳細ページ専用。
// TabBar.tsx（他3画面が使う共有コンポーネント）は変更せず、
// このページだけ Ask pharmacist タブの挙動を「/consult へ遷移」から
// 「ページ内で店員向けの表示に切り替える」に差し替える。
// 採用しない場合はこのファイルを削除し、page.tsx 側を
// <TabBar current="medicines" /> + 元の placard 呼び出しに戻すだけでよい。
type Tab = "medicines" | "consult";

export function ProductTabs({
  nameJa,
  children,
}: {
  nameJa: string;
  children: React.ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("medicines");

  return (
    <>
      <style>{`
        .tabs button {
          all: unset;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          color: var(--ink-2);
          font-family: inherit;
          cursor: pointer;
        }
        .tabs button:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        .staffview-body {
          padding: 24px 18px;
        }
        .staffview-body p {
          font-size: 28px;
          font-weight: 600;
          line-height: 1.6;
          color: var(--ink);
        }
      `}</style>

      <div className="tabs">
        {tab === "medicines" ? (
          <span className="on" aria-current="page">
            Medicines
          </span>
        ) : (
          <button type="button" onClick={() => setTab("medicines")}>
            Medicines
          </button>
        )}
        {tab === "consult" ? (
          <span className="on" aria-current="page">
            Ask pharmacist
          </span>
        ) : (
          <button type="button" onClick={() => setTab("consult")}>
            Ask pharmacist
          </button>
        )}
      </div>

      {tab === "medicines" ? (
        children
      ) : (
        <main className="shell">
          <div className="placard">
            <div className="band ja">店員の方へ</div>
            <div className="staffview-body">
              <p lang="ja">
                {nameJa} を探しています。
                <br />
                どこにありますか？
              </p>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
