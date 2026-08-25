# Japan Medicine Guide

豪州からの訪日旅行者向け、日本の市販薬を英語で読むためのガイド。
Next.js (App Router) / Supabase / Vercel / TypeScript。

読者は Perth や Sydney から来た旅行者。Panadol と Nurofen を常備し、
Pharmacist Only (S3) という概念を知っている。
迷ったら「Perthから来た人が棚の前で3秒で使えるか」で判断する。

## 絶対に守ること

- 事実の提示のみ。「どれを飲むべきか」は書かない
- 成分が完全一致するものだけ対応付ける。「同系統・別成分」は出さない
- 用語は豪州英語。paracetamol と書く（acetaminophen とは書かない）。綴りは -ise 系
- 「drugstore」ではなく「chemist」
- 赤（--caution #B4471C）は第1類の警告にのみ使う。他では使わない
- 成分の日本語名は DB に持つが UI には出さない（監修者のレビュー専用）
- /phrases は products と絶対に JOIN しない（症状→商品はレコメンドになる）

## 表示しないもの（意図的な省略。追加しないこと）

- 成分の含有量（用量の比較は医療判断になる）
- 成分の薬効分類
- パッケージ外観の記述（添付文書に載っておらず検証不能）
- 商品パッケージ画像（著作権・商標）
- 商品ごとの年齢・妊娠の警告
  → 全商品共通の固定文に統合:
  "Ask the pharmacist if you are pregnant, taking other medicine, or under 15."

検証が必要な事実は1商品あたり3つ（商品名／成分名／区分）に抑える。

## データベース（Supabase・すべて slug が主キー）

products(slug, name_ja, name_romaji, summary_en, maker, otc_class,
category, form, search_terms text[], source_url,
verified, reviewed_at, updated_at)
ingredients(slug, name_en, name_ja, note_en, verified)
product_ingredients(product_slug, ingredient_slug, sort_order)
foreign_brands(name, ingredient_slug, caveat_en, source_url, verified)
categories(slug, name_en, name_ja, sort_order)
phrases(slug, group_name, text_en, text_ja, sort_order)

otc_class は enum: 'class1' | 'designated_class2' | 'class2' | 'class3'
→ UI では designated_class2 と class2 を同じ表示に統合する
→ 表示文言は DB に持たず lib/otcClass.ts の定数で一元管理する

phrases.group_name: 'symptom' | 'about_me' | 'at_counter'

成分は product_ingredients.sort_order の順で表示する（箱の印刷順）。

## 構成

- 全ページ静的生成。ビルド時に Supabase から全件取得し、実行時には叩かない
- 検索は10件のJSONをクライアント側で filter。あいまい検索は実装しない
- 認証なし、フォームなし、状態は検索文字列のみ

## デザイン

- docs/mockup.html を参照。:root のカスタムプロパティがデザイントークン
- 下敷きは日本の「添付文書」。罫線と等幅で事実を並べ、装飾しない
- IBM Plex Sans / Plex Sans JP / Plex Mono で日英を同一ファミリーに統一
- 日本語は「読む文字」ではなく「照合・提示するための図像」として扱い、大きく出す
  商品名 38px前後 / フレーズ 21px前後

## 実装順

1. /products/[slug] ← 最初。全導線の行き先で、完全に静的
2. /phrases ← JOINも検索もない。docs/mockup.html の 04
3. /review ← 監修者に渡す印刷可能な1ページ。CSSは後回しでよい
4. / と /find
5. /category/[slug]、/about

指示された画面以外は作らないこと。
