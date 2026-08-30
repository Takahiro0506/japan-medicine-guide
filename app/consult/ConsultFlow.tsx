"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ConsultOption } from "@/lib/data";

type Step = 1 | 2 | 3 | "card";

const BACK_LABEL: Record<Step, string> = {
  1: "Back to Home",
  2: "Back to symptoms",
  3: "Back to how long",
  card: "Back to anything to mention",
};

export function ConsultFlow({ options }: { options: ConsultOption[] }) {
  const [step, setStep] = useState<Step>(1);
  const [step1, setStep1] = useState<Set<string>>(new Set());
  const [step2, setStep2] = useState<string | null>(null);
  const [step3, setStep3] = useState<Set<string>>(new Set());
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

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

  async function requestFullScreen() {
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
          {step1Items.map((o) => (
            <button
              type="button"
              key={o.slug}
              className={`chip${step1.has(o.slug) ? " on" : ""}`}
              aria-pressed={step1.has(o.slug)}
              onClick={() => toggleStep1(o.slug)}
            >
              <span className="box" aria-hidden="true" />
              {o.text_en}
            </button>
          ))}
          <div className="alert">
            If you have trouble breathing, severe chest pain, or feel confused, go to a hospital
            rather than a chemist.
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
            <button type="button" className="a" disabled={step2 === null} onClick={() => setStep(3)}>
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
            <button type="button" className="a" onClick={() => setStep("card")}>
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
            <div>I don&#39;t understand Japanese &mdash; please write your answer or show me the product.</div>
          </div>

          <div className="fs split">
            <button type="button" className="a" onClick={requestFullScreen}>
              Full screen
            </button>
            <button type="button" className="b" onClick={startOver}>
              Start over
            </button>
          </div>
        </>
      )}
    </main>
  );
}
