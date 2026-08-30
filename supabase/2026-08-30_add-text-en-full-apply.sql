-- ============================================================
-- Japan Medicine Guide — consult_options.text_en_full の追加
-- 実行手順: このファイルの内容を全部貼る → 選択解除 → Run
-- ============================================================

begin;

alter table consult_options add column text_en_full text;

update consult_options set text_en_full = 'I have a sore throat.' where slug = 'sore-throat';
update consult_options set text_en_full = 'I have a dry cough.' where slug = 'dry-cough';
update consult_options set text_en_full = 'I have a cough with phlegm.' where slug = 'wet-cough';
update consult_options set text_en_full = 'I have a runny or blocked nose.' where slug = 'runny-nose';
update consult_options set text_en_full = 'I have a fever.' where slug = 'fever';
update consult_options set text_en_full = 'I don''t have a fever.' where slug = 'no-fever';
update consult_options set text_en_full = 'I have a headache.' where slug = 'headache';
update consult_options set text_en_full = 'I have a stomach ache.' where slug = 'stomach-ache';
update consult_options set text_en_full = 'I have diarrhoea.' where slug = 'diarrhoea';
update consult_options set text_en_full = 'I have heartburn.' where slug = 'heartburn';
update consult_options set text_en = 'Nausea', text_en_full = 'I feel nauseous.' where slug = 'nausea';
update consult_options set text_en_full = 'My eyes are itchy.' where slug = 'itchy-eyes';
update consult_options set text_en_full = 'My skin is itchy.' where slug = 'itchy-skin';
update consult_options set text_en_full = 'I was bitten by an insect.' where slug = 'insect-bite';

update consult_options set text_en_full = 'It started today.' where slug = 'since-today';
update consult_options set text_en_full = 'It started yesterday.' where slug = 'since-yesterday';
update consult_options set text_en_full = 'It started 2-3 days ago.' where slug = 'two-three-days';
update consult_options set text_en_full = 'It started about a week ago.' where slug = 'about-a-week';
update consult_options set text_en_full = 'It started more than 2 weeks ago.' where slug = 'over-two-weeks';

update consult_options set text_en_full = 'I am taking other medicine.' where slug = 'other-medicine';
update consult_options set text_en_full = 'I am pregnant or breastfeeding.' where slug = 'pregnant';
update consult_options set text_en_full = 'I have a drug allergy.' where slug = 'drug-allergy';
update consult_options set text_en_full = 'I have asthma.' where slug = 'asthma';
update consult_options set text_en_full = 'I would prefer something non-drowsy.' where slug = 'non-drowsy';
update consult_options set text_en_full = 'Tablets are difficult for me.' where slug = 'hard-to-swallow';
update consult_options set text_en_full = 'This is for a child.' where slug = 'for-a-child';

commit;
