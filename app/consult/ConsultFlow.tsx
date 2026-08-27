"use client";

import { useState } from "react";
import Link from "next/link";
import type { ConsultOption } from "@/lib/data";

type Step = 1 | 2 | 3 | "card";

export function ConsultFlow({ options }: { options: ConsultOption[] }) {
  const [step, setStep] = useState<Step>(1);
  const [step1, setStep1] = useState<Set<string>>(new Set());
  const [step2, setStep2] = useState<string | null>(null);
  const [step3, setStep3] = useState<Set<string>>(new Set());

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
  }

  return (
    <main className="v2">
      <div className="bar">
        {step === 1 ? (
          <Link className="back" href="/">
            &lsaquo;
          </Link>
        ) : (
          <button type="button" className="back" onClick={goBack}>
            &lsaquo;
          </button>
        )}
        <h2>{step === "card" ? "Show this to the pharmacist" : "Ask the pharmacist"}</h2>
      </div>

      {step === 1 && (
        <>
          <div className="step">1 / 3&nbsp;&nbsp;Symptoms</div>
          <div className="hint">Select everything that applies</div>
          {step1Items.map((o) => (
            <button
              type="button"
              key={o.slug}
              className={`chip${step1.has(o.slug) ? " on" : ""}`}
              onClick={() => toggleStep1(o.slug)}
            >
              <span className="box" />
              {o.text_en}
            </button>
          ))}
          <div className="alert">
            If you have trouble breathing, severe chest pain, or feel confused, go to a hospital
            rather than a chemist.
          </div>
          <div className="fs">
            <button type="button" className="a" disabled={step1.size === 0} onClick={() => setStep(2)}>
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
              onClick={() => selectStep2(o.slug)}
            >
              <span className="box rd" />
              {o.text_en}
            </button>
          ))}
          <div className="fs">
            <button type="button" className="a" onClick={() => setStep(3)}>
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
              onClick={() => toggleStep3(o.slug)}
            >
              <span className="box" />
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
          <div className="jacard">
            {selected.map((o) => (
              <p key={o.slug}>{o.text_ja}</p>
            ))}
            <p className="request">おすすめを教えていただけますか？</p>
            <p className="closing">
              日本語が分かりません。お答えを書くか、商品を見せてください。
            </p>
          </div>

          <div className="encheck">
            <b>WHAT IT SAYS</b>
            {selected.map((o) => (
              <div key={o.slug}>{o.text_en}</div>
            ))}
            <div>I don&#39;t understand Japanese &mdash; please write your answer or show me the product.</div>
          </div>

          <div className="fs">
            <button type="button" className="b" onClick={startOver}>
              Start over
            </button>
          </div>
        </>
      )}
    </main>
  );
}
