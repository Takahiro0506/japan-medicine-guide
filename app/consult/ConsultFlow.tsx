"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ConsultOption } from "@/lib/data";
import { TabBar } from "@/app/TabBar";

type Step = 1 | 2 | 3 | "card";

const BACK_LABEL: Record<Step, string> = {
  1: "Back to Home",
  2: "Back to symptoms",
  3: "Back to how long",
  card: "Back to anything to mention",
};

const STORAGE_KEY = "consult-state";

// Step 1 の症状は部位でグルーピングして表示する。consult_options のスキーマは
// 変更しないため、グループ名と束ねる slug はここで管理する。
// DB に新しい step=1 の選択肢を追加したときは、ここにも slug を足すこと
// （足し忘れるとフラットな一覧には出ず、静かに表示から消える）
const STEP1_GROUPS: { label: string; slugs: string[]; pair?: boolean }[] = [
  { label: "NOSE & THROAT", slugs: ["sore-throat", "dry-cough", "wet-cough", "runny-nose"] },
  { label: "TEMPERATURE", slugs: ["fever", "no-fever"], pair: true },
  { label: "HEAD & BODY", slugs: ["headache"] },
  { label: "STOMACH", slugs: ["stomach-ache", "diarrhoea", "heartburn", "nausea"] },
  { label: "SKIN & EYES", slugs: ["itchy-eyes", "itchy-skin", "insect-bite"] },
];

export function ConsultFlow({ options }: { options: ConsultOption[] }) {
  const [step, setStep] = useState<Step>(1);
  const [step1, setStep1] = useState<Set<string>>(new Set());
  const [step2, setStep2] = useState<string | null>(null);
  const [step3, setStep3] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // sessionStorage の読み出しは初回レンダリング後（マウント後）に行う。
  // SSR 時点では sessionStorage を参照できず、初回レンダリングで読むと
  // サーバーとクライアントの HTML が食い違いハイドレーションエラーになる
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.step1)) setStep1(new Set(parsed.step1));
        if (typeof parsed.step2 === "string" || parsed.step2 === null) {
          setStep2(parsed.step2);
        }
        if (Array.isArray(parsed.step3)) setStep3(new Set(parsed.step3));
        if (parsed.step === 1 || parsed.step === 2 || parsed.step === 3 || parsed.step === "card") {
          setStep(parsed.step);
        }
      }
    } catch {
      // 壊れたデータは無視して初期状態のまま進める
    }
    setHydrated(true);
  }, []);

  // 復元が終わってから保存を始める。復元前に保存してしまうと
  // 初期状態（未選択）で上書きしてしまう
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          step1: Array.from(step1),
          step2,
          step3: Array.from(step3),
          step,
        })
      );
    } catch {
      // sessionStorage が使えない環境では諦める（端末内保持は努力目標）
    }
  }, [hydrated, step1, step2, step3, step]);

  // 完成カード（薬剤師に見せる画面）ではAbout/Make a cardへの導線・タブバーが
  // 不要なため一時的に隠し、背景を白にする。ページ離脱時は必ず戻す
  useEffect(() => {
    document.body.classList.toggle("consult-card", step === "card");
    return () => {
      document.body.classList.remove("consult-card");
    };
  }, [step]);

  // カード以外に移動したら Wake Lock は不要
  useEffect(() => {
    if (step !== "card") {
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
    }
  }, [step]);

  useEffect(() => {
    return () => {
      wakeLockRef.current?.release().catch(() => {});
    };
  }, []);

  // 完成カードは薬剤師に見せる画面なのでスリープを避けたい。Wake Lock は
  // ユーザージェスチャの外で呼ぶと NotAllowedError になりうるため、
  // 「Make the card」を押した瞬間（ジェスチャ内）で取得する
  async function goToCard() {
    setStep("card");
    try {
      wakeLockRef.current = await navigator.wakeLock?.request("screen");
    } catch {
      // 非対応環境やユーザージェスチャ外での失敗は無視してよい
    }
  }

  const step1Items = options.filter((o) => o.step === 1);
  const step2Items = options.filter((o) => o.step === 2);
  const step3Items = options.filter((o) => o.step === 3);

  const selected = options.filter(
    (o) =>
      (o.step === 1 && step1.has(o.slug)) ||
      (o.step === 2 && o.slug === step2) ||
      (o.step === 3 && step3.has(o.slug))
  );

  function toggleStep1(slug: string) {
    setStep1((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }

  // Fever / No fever のような排他ペア用。片方を選ぶともう片方は外れる
  function toggleExclusivePair(slug: string, pairSlugs: string[]) {
    setStep1((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        pairSlugs.forEach((s) => next.delete(s));
        next.add(slug);
      }
      return next;
    });
  }

  function selectStep2(slug: string) {
    setStep2((prev) => (prev === slug ? null : slug));
  }

  function toggleStep3(slug: string) {
    setStep3((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }

  function goBack() {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === "card") setStep(3);
  }

  function startOver() {
    setStep1(new Set());
    setStep2(null);
    setStep3(new Set());
    setStep(1);
    // このページで使う sessionStorage はすべて破棄する
    // （選択状態の保存は sessionStorage のみで行い、送信はしない方針）
    window.sessionStorage.clear();
  }

  return (
    <>
      <TabBar current="consult" />
      <main className="shell">
        <div className="bar">
          {step === 1 ? (
            <Link className="back" href="/" aria-label="Back to Home">
              &lsaquo;
            </Link>
          ) : (
            <button type="button" className="back" onClick={goBack} aria-label={BACK_LABEL[step]}>
              &lsaquo;
            </button>
          )}
          <h2>{step === "card" ? "Show this to the pharmacist" : "Make a card in Japanese"}</h2>
        </div>

        {step === 1 && (
          <>
            <p className="lede">
              Answer three quick questions to make a Japanese card for the pharmacist.
            </p>
            <div className="step">1 / 3&nbsp;&nbsp;Symptoms</div>
            <div className="hint">Select everything that applies</div>
            {STEP1_GROUPS.map((group, groupIndex) => {
              const items = group.slugs
                .map((slug) => step1Items.find((o) => o.slug === slug))
                .filter((o): o is ConsultOption => Boolean(o));
              if (items.length === 0) return null;

              return (
                <div key={group.label}>
                  <div className={`grp${groupIndex === 0 ? " first" : ""}`}>{group.label}</div>
                  <div className={group.pair ? "pair" : undefined}>
                    {items.map((o) => (
                      <button
                        type="button"
                        key={o.slug}
                        className={`chip${step1.has(o.slug) ? " on" : ""}`}
                        aria-pressed={step1.has(o.slug)}
                        onClick={() =>
                          group.pair
                            ? toggleExclusivePair(o.slug, group.slugs)
                            : toggleStep1(o.slug)
                        }
                      >
                        <span className={`box${group.pair ? " rd" : ""}`} aria-hidden="true" />
                        {o.text_en}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="alert">
              If you have trouble breathing, severe chest pain, or feel confused, go to a
              hospital rather than a chemist.
            </div>
            <div className="fs">
              <button
                type="button"
                className="a"
                disabled={step1.size === 0}
                onClick={() => setStep(2)}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="step">2 / 3&nbsp;&nbsp;How long</div>
            <div className="hint">Choose one</div>
            {step2Items.map((o) => (
              <button
                type="button"
                key={o.slug}
                className={`chip${step2 === o.slug ? " on" : ""}`}
                aria-pressed={step2 === o.slug}
                onClick={() => selectStep2(o.slug)}
              >
                <span className="box rd" aria-hidden="true" />
                {o.text_en}
              </button>
            ))}
            <div className="fs">
              <button
                type="button"
                className="a"
                disabled={step2 === null}
                onClick={() => setStep(3)}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="step">3 / 3&nbsp;&nbsp;Anything to mention</div>
            <div className="hint">Skip if none apply</div>
            {step3Items.map((o) => (
              <button
                type="button"
                key={o.slug}
                className={`chip${step3.has(o.slug) ? " on" : ""}`}
                aria-pressed={step3.has(o.slug)}
                onClick={() => toggleStep3(o.slug)}
              >
                <span className="box" aria-hidden="true" />
                {o.text_en}
              </button>
            ))}
            <div className="fs">
              <button type="button" className="a" onClick={goToCard}>
                Make the card
              </button>
            </div>
          </>
        )}

        {step === "card" && (
          <>
            <div className="placard">
              <div className="band ja">薬剤師の方へ</div>
              <div className="jabody" lang="ja">
                {selected.map((o) => (
                  <p key={o.slug}>{o.text_ja}</p>
                ))}
                <p className="q">おすすめを教えていただけますか？</p>
                <p className="note">
                  日本語が分かりません。お答えを書くか、商品を見せてください。
                </p>
              </div>
            </div>

            <div className="encheck">
              <b>WHAT IT SAYS</b>
              {selected.map((o) => (
                <div key={o.slug}>{o.text_en_full}</div>
              ))}
              <div>
                I don&#39;t understand Japanese &mdash; please write your answer or show me the
                product.
              </div>
            </div>

            <div className="fs center">
              <button type="button" className="b" onClick={startOver}>
                Start over
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
