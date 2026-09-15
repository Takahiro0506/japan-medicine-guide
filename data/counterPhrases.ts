import type { CounterPhraseRow } from "./types";

// docs/archive/phrases_2026-09-14.csv の group_name = 'at_counter' の5件のみ。
// v1 の phrases テーブルの生き残り。consultOptions とは混ぜない
// （ステップの選択肢ではなく、完成カードの下に出す固定ブロックのため）。
// sort_order 30〜34 は原本の値をそのまま保つ。
export const counterPhrases = [
  {
    slug: "is-pharmacist",
    text_en: "Is there a pharmacist here?",
    text_ja: "薬剤師さんはいますか？",
    sort_order: 30,
  },
  {
    slug: "see-a-doctor",
    text_en: "Should I see a doctor?",
    text_ja: "病院に行ったほうがいいですか？",
    sort_order: 31,
  },
  {
    slug: "how-many",
    text_en: "How many should I take at a time?",
    text_ja: "1回に何錠飲みますか？",
    sort_order: 32,
  },
  {
    slug: "not-drowsy",
    text_en: "Do you have one that will not make me drowsy?",
    text_ja: "眠くならないものはありますか？",
    sort_order: 33,
  },
  {
    slug: "with-painkiller",
    text_en: "Can I take this with painkillers?",
    text_ja: "痛み止めと一緒に飲めますか？",
    sort_order: 34,
  },
] as const satisfies readonly CounterPhraseRow[];
