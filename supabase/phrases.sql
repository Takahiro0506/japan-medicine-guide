-- ============================================================
-- Japan Medicine Guide — phrases
-- カウンターで薬剤師に画面を見せるためのフレーズ集
--
-- 重要：このテーブルは products と一切 JOIN しない。
-- 症状から商品を導くと「レコメンド」になり、MVPの方針に反する。
-- /phrases という独立した1ページだけで完結させる。
-- ============================================================

create table phrases (
  slug        text primary key,
  group_name  text not null check (group_name in ('symptom', 'about_me', 'at_counter')),
  text_en     text not null,
  text_ja     text not null,
  sort_order  int  not null
);

alter table phrases enable row level security;
create policy "public read" on phrases for select using (true);

-- ------------------------------------------------------------
-- A. 症状を伝える
-- ------------------------------------------------------------
insert into phrases (slug, group_name, text_en, text_ja, sort_order) values
  ('fever',         'symptom', 'I have a fever',              '熱があります',           1),
  ('headache',      'symptom', 'I have a headache',           '頭痛がします',           2),
  ('sore-throat',   'symptom', 'I have a sore throat',        'のどが痛いです',         3),
  ('dry-cough',     'symptom', 'I have a dry cough',          '乾いた咳が出ます',       4),
  ('wet-cough',     'symptom', 'I have a cough with phlegm',  '痰のからむ咳が出ます',   5),
  ('runny-nose',    'symptom', 'I have a runny nose',         '鼻水が出ます',           6),
  ('blocked-nose',  'symptom', 'My nose is blocked',          '鼻づまりがあります',     7),
  ('diarrhoea',     'symptom', 'I have diarrhoea',            '下痢をしています',       8),
  ('stomach-ache',  'symptom', 'I have a stomach ache',       '胃が痛いです',           9),
  ('heartburn',     'symptom', 'I have heartburn',            '胸やけがします',        10),
  ('nausea',        'symptom', 'I feel nauseous',             '吐き気がします',        11),
  ('itchy-eyes',    'symptom', 'My eyes are itchy',           '目がかゆいです',        12),
  ('itchy-skin',    'symptom', 'My skin is itchy',            '皮膚がかゆいです',      13),
  ('insect-bite',   'symptom', 'I was bitten by an insect',   '虫に刺されました',      14);

-- ------------------------------------------------------------
-- B. 自分のことを伝える ← 薬剤師が判断するために最も必要な情報
-- ------------------------------------------------------------
insert into phrases (slug, group_name, text_en, text_ja, sort_order) values
  ('pregnant',      'about_me', 'I am pregnant',              '妊娠しています',          20),
  ('breastfeeding', 'about_me', 'I am breastfeeding',         '授乳中です',              21),
  ('other-medicine','about_me', 'I am taking other medicine', 'ほかに薬を飲んでいます',  22),
  ('drug-allergy',  'about_me', 'I have a drug allergy',      '薬のアレルギーがあります',23),
  ('asthma',        'about_me', 'I have asthma',              'ぜんそくがあります',      24),
  ('for-a-child',   'about_me', 'This is for a child',        '子ども用です',            25);

-- ------------------------------------------------------------
-- C. 薬剤師に聞く
-- ------------------------------------------------------------
insert into phrases (slug, group_name, text_en, text_ja, sort_order) values
  ('is-pharmacist', 'at_counter', 'Is there a pharmacist here?',            '薬剤師さんはいますか？',        30),
  ('see-a-doctor',  'at_counter', 'Should I see a doctor?',                 '病院に行ったほうがいいですか？',31),
  ('how-many',      'at_counter', 'How many should I take at a time?',      '1回に何錠飲みますか？',         32),
  ('not-drowsy',    'at_counter', 'Do you have one that will not make me drowsy?', '眠くならないものはありますか？', 33),
  ('with-painkiller','at_counter','Can I take this with painkillers?',      '痛み止めと一緒に飲めますか？',  34);

-- ------------------------------------------------------------
-- 確認
-- ------------------------------------------------------------
-- select group_name, count(*) from phrases group by group_name;
--   about_me    6
--   at_counter  5
--   symptom    14
