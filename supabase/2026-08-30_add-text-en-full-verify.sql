-- ============================================================
-- Japan Medicine Guide — consult_options.text_en_full の確認
-- 実行手順: このファイルの内容を全部貼る → 選択解除 → Run
-- apply 実行後に流す。SELECT のみ、書き込みなし
-- ============================================================

select count(*) as null_text_en_full_count
from consult_options
where text_en_full is null;

select step, sort_order, slug, text_ja, text_en_full
from consult_options
order by step, sort_order;

select slug, text_en
from consult_options
where slug = 'nausea';
