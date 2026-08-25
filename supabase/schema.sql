-- ============================================================
-- Japan Medicine Guide — schema
-- Supabase の SQL Editor に貼って一度だけ実行する
-- ============================================================

-- 区分。箱の表記通りに保存し、表示側でまとめる
create type otc_class as enum ('class1', 'designated_class2', 'class2', 'class3');

-- ------------------------------------------------------------
create table categories (
  slug        text primary key,
  name_en     text not null,
  name_ja     text not null,
  sort_order  int  not null
);

-- ------------------------------------------------------------
-- name_ja はレビュー専用。UI には出さない
create table ingredients (
  slug      text primary key,
  name_en   text not null,
  name_ja   text not null,
  note_en   text,
  verified  boolean not null default false
);

-- ------------------------------------------------------------
create table products (
  slug          text primary key,
  name_ja       text not null,
  name_romaji   text not null,
  summary_en    text not null,
  maker         text not null,
  otc_class     otc_class not null,
  category      text not null references categories(slug),
  form          text not null,
  search_terms  text[] not null default '{}',
  source_url    text,
  verified      boolean not null default false,
  reviewed_at   timestamptz,
  updated_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- sort_order は箱に印刷されている順。判断ではなく転記
create table product_ingredients (
  product_slug     text not null references products(slug) on delete cascade,
  ingredient_slug  text not null references ingredients(slug),
  sort_order       int  not null,
  primary key (product_slug, ingredient_slug)
);

-- ------------------------------------------------------------
-- 豪州ブランドは1ブランド1成分のみ扱う（配合薬は持たない方針）
create table foreign_brands (
  name             text primary key,
  ingredient_slug  text not null references ingredients(slug),
  caveat_en        text,
  source_url       text,
  verified         boolean not null default false
);

-- ------------------------------------------------------------
-- updated_at の自動更新。/review の「未確認」判定がこれに依存する
create function touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_touch
  before update on products
  for each row execute function touch_updated_at();

-- ------------------------------------------------------------
-- 公開データなので全テーブル読み取り自由。書き込みは Supabase の画面から
alter table categories          enable row level security;
alter table ingredients         enable row level security;
alter table products            enable row level security;
alter table product_ingredients enable row level security;
alter table foreign_brands      enable row level security;

create policy "public read" on categories          for select using (true);
create policy "public read" on ingredients         for select using (true);
create policy "public read" on products            for select using (true);
create policy "public read" on product_ingredients for select using (true);
create policy "public read" on foreign_brands      for select using (true);

-- ============================================================
-- CSV は必ずこの順で入れる（外部キーの依存があるため）
--   1. categories.csv
--   2. ingredients.csv
--   3. products.csv
--   4. product-ingredients.csv
--   5. foreign-brands.csv
-- ============================================================
