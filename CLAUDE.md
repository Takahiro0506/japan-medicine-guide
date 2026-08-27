# Japan Medicine Guide

豪州からの訪日旅行者向け、日本の市販薬を英語で読むためのガイド。
Next.js (App Router) / Supabase / Vercel / TypeScript。

読者は Perth や Sydney から来た旅行者。Panadol と Nurofen を常備し、
Pharmacist Only (S3) という概念を知っている。日本語は全く読めない。
迷ったら「Perthから来た人が棚の前で3秒で使えるか」で判断する。

## v2 について（2026-08-27 に方針転換）

v1 は検索窓を主役にしたため使いにくかった。
姉妹プロダクトの豪州版（australia-okusuri-guide）の構造に寄せて作り直す。
データと設計判断は全て残る。作り直すのは画面のコードのみ。

### 廃止したもの。復活させないこと

- 検索窓、オートコンプリート、`/find?brand=`
- `/phrases`（25件の縦一覧）→ `/consult` の組み立て式に作り替える
- 「同系統・別成分」（same_class）の表示
- IBM Plex 系の書体と #FBFAF7 系の配色

## 絶対に守ること

- 事実の提示のみ。「どれを飲むべきか」は書かない
- 成分が完全一致するものだけ対応付ける。「同系統・別成分」は出さない
- 用語は豪州英語。paracetamol と書く（acetaminophen とは書かない）。綴りは -ise 系
- 「drugstore」ではなく「chemist」
- 赤（--stop #B4462F）は「そのまま進めない」合図にのみ使う（第1類・受診勧奨）
- 成分の日本語名は DB に持つが UI には出さない（監修者のレビュー専用）
- `/consult` は商品データと絶対に繋がない（症状→商品はレコメンドになる）
- 商品詳細に必ず戻る導線を置く。行き止まりを作らない

## 表示しないもの（意図的な省略。追加しないこと）

- 成分の含有量（用量の比較は医療判断になる）
- 成分の薬効分類
- パッケージ外観の記述（添付文書に載っておらず検証不能）
- 商品パッケージ画像（著作権・商標）
- 商品ごとの年齢・妊娠の警告
  → 全商品共通の固定文に統合:
  "Ask the pharmacist if you are pregnant, taking other medicine, or under 15."

検証が必要な事実は1商品あたり3つ（商品名／成分名／区分）に抑える。

## 画面構成（5画面）

1. `/` 症状カテゴリ一覧 +「Ask the pharmacist」ブロック
2. `/category/[slug]` 商品一覧。並び順を設計する
3. `/products/[slug]` 商品詳細。棚と照合する画面
4. `/consult` 3ステップで日本語カードを組み立てる
5. `/about` Disclaimer・監修体制

`/review` は監修用に残す。公開導線には出さない。

## トップページの原則

入口は2つだけ。指示文は1つ。
第2の入口は必ず問いかけとセットで置く。
"Not sure what to look for?" → [Ask the pharmacist]
ボタンだけ置くと気づかれない。v1 でフッターに置いて失敗した。

## 並び順は設計項目

products.sort_order の昇順で表示する。DBの返す順に任せない。
原則：豪州人にとって役立つ順。

1. 豪州ブランドと同成分のもの（Panadol → タイレノールA）
2. その他
3. 第1類（夜は買えないため最後）

## 外国ブランドの扱い

foreign_brands は入口ではなくラベルとして使う。

- カテゴリ一覧のカードに "Same as Panadol"
- 商品詳細に確認材料として1行
  成分が完全一致するものだけ。別成分を「相当する」と書かない。

「Same as X」は有効成分が1つだけの商品にのみ表示する。
配合薬に表示すると置き換え可能だと読まれるため。
結果として現在ラベルが出るのは タイレノールA / アレグラFX / ガスター10 の3件のみ。

## /consult（3ステップ）

1/3 症状（複数選択・日常語のみ）
2/3 期間（単一選択）
3/3 状況・希望（複数選択・全スキップ可）
→ 完成カード

- 完成カードは日本語が主役（16px前後）。英語は下に小さく「何と書いてあるか」を添える
- 最後の1文は必ず入れる:
  「日本語が分かりません。お答えを書くか、商品を見せてください。」
- 受診勧奨の赤枠は選択内容に関わらず常時表示の固定文。条件分岐にしない
- 選択内容は端末内のみで保持。保存も送信もしない

## データベース（Supabase・すべて slug が主キー）

products(slug, name_ja, name_romaji, summary_en, maker, otc_class,
category, form, search_terms text[], sort_order, source_url,
verified, reviewed_at, updated_at)
ingredients(slug, name_en, name_ja, note_en, verified)
product_ingredients(product_slug, ingredient_slug, sort_order)
foreign_brands(name, ingredient_slug, caveat_en, source_url, verified)
categories(slug, name_en, name_ja, sort_order)
consult_options(slug, step, text_en, text_ja, sort_order)

otc_class は enum: 'class1' | 'designated_class2' | 'class2' | 'class3'
→ UI では designated_class2 と class2 を同じ表示に統合する
→ 表示文言は DB に持たず lib/otcClass.ts の定数で一元管理する

consult_options.step: 1=症状 / 2=期間 / 3=状況
成分は product_ingredients.sort_order の順で表示する（箱の印刷順）。

search_terms は v2 では使わない。列は残すが参照しない。

## 構成

- 全ページ静的生成。ビルド時に Supabase から全件取得し、実行時には叩かない
- 認証なし、フォームなし
- `/consult` の選択状態のみクライアント側で保持する

## デザイン

- docs/mockup.html を参照。:root のカスタムプロパティがデザイントークン
- 豪州版の配色をそのまま継承する。姉妹プロダクトとして揃える
  --bg #F1EFE8 / --card #FFFFFF / --border #D3D1C7 / --accent #185FA5
  --ink #2B2A26 / --stop #B4462F
- 書体はシステムフォント（-apple-system / Hiragino Sans / Noto Sans JP）
- 日本語は「読む文字」ではなく「照合・提示するための図像」として扱い、大きく出す
  商品名 32px前後 / 完成カードの日本語 16px前後

## 実装順

A. `/` と `/category/[slug]` ← 構造の作り直し。並び順を実装
B. `/products/[slug]` ← 戻る導線を必ず入れる
C. `/consult` ← 3ステップ + 完成カード
D. `/about` とデプロイ

指示された画面以外は作らないこと。
