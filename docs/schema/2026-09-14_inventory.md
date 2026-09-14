# Supabase 棚卸し結果（2026-09-14）

Supabase ダッシュボードで実際に確認した結果の記録。推測は含まない。
対応する CSV は `docs/archive/` にある。

## 移行対象

6テーブル: `categories` / `consult_options` / `foreign_brands` /
`ingredients` / `product_ingredients` / `products`

アーカイブのみ（移行しない）: `phrases` — v1 の廃止済み機能のテーブル

## 件数（2026-09-14 時点）

products 32 / ingredients 82 / product_ingredients 118 /
foreign_brands 8 / categories 8 / consult_options 26 / phrases 25

## DB が守っていた制約（静的化で失われる）

- 主キー6本。`product_ingredients` のみ複合キー `(product_slug, ingredient_slug)`
- 外部キー4本
  - `products.category` → `categories(slug)`
  - `product_ingredients.product_slug` → `products(slug)` **ON DELETE CASCADE**
  - `product_ingredients.ingredient_slug` → `ingredients(slug)`
  - `foreign_brands.ingredient_slug` → `ingredients(slug)`
- CHECK 1本: `consult_options.step IN (1,2,3)`
- トリガ1本: `products_touch` — UPDATE のたびに `products.updated_at` を自動更新

## enum

`otc_class`: `class1` / `designated_class2` / `class2` / `class3`（規制の強い順）

## 発見

**1. `phrases` テーブルが残っていた。`at_counter` の5件は v2 に未移行。**

`phrases` 25件の内訳は symptom 14 / about_me 6 / at_counter 5。
前者20件は `consult_options` に引き継がれたが、`at_counter` の5件は
行き先を失っていた。この5件は完成カードの下に固定ブロックとして
復活させる予定があり、原文はこのアーカイブに残っている。

**2. SQL Editor の CSV ダウンロードは100行で打ち切られる。**

product_ingredients 118件のうち100件しか落ちず、最終行は改行もなく
途中で断ち切られていた。気づかなければ7商品分の成分が消えた状態で
静的化されていた。エラーは出ず、成分が表示されなくなるだけの静かな失敗。
**100件を超えるテーブルは `offset` で分割し、件数を突き合わせること。**

**3. `foreign_brands` は出典も検証フラグも持っていなかった。**

`source_url` が8件すべて null、`verified` が8件すべて false。
products は全32件に `source_url` があり `/about` にも
「Every product page links to the manufacturer's own page」と書いてあるため、
ブランド側だけ出典を持たない非対称がある。**静的化すると恒久化する。**
→ 未決事項。

**4. ASCII 制約が1つも無い。**

`name_romaji` / `summary_en` / `text_en` / `name_en` などの英語列に
文字種の制約が無く、全角文字が混入しても DB は通す。
姉妹プロジェクトでは同じ構造で実在するバグ（全角括弧）が
テスト導入の初回実行で見つかった。
`sort_order` の一意性、`class1` は `sort_order = 9` という規約、
`slug` の形式（URL セグメント）も DB は一切支えていない。
→ 制約の移植ではなく「あるべきだった制約を今回入れる」として
次段階の Vitest で対応する。

## 未決事項

- **`/review` の扱い**: `products_touch` トリガが消えるため
  `updated_at > reviewed_at` による差分検出が成立しなくなる。
  `verified` / `reviewed_at` / `updated_at` を静的ファイルに持つかは
  この判断に依存する
- **`foreign_brands.source_url`**: TGA の URL を8件埋めるか、
  出典を持たない方針に切り替えるか
- **`search_terms`**: v2 で未使用の `text[]` 列。移行しない方針
- **`at_counter` 5件**: `consult_options` には混ぜず、
  固定ブロック用の別データとして持つ方針
