-- ============================================================
-- Japan Medicine Guide — products 投入
--
-- CSV インポーターは text[] を扱えないため、products だけ SQL で入れる。
-- categories が入っていることが前提（外部キー）。
-- ============================================================

insert into products
  (slug, name_ja, name_romaji, summary_en, maker, otc_class, category, form, search_terms, source_url, verified)
values
  ('loxonin-s', 'ロキソニンS', 'Loxonin S',
   'Pain and fever relief', '第一三共ヘルスケア', 'class1', 'pain-fever', 'tablet',
   '{loxonin,roxonin,rokisonin,ロキソニン}',
   'https://www.daiichisankyo-hc.co.jp/products/details/loxonin-s/', false),

  ('tylenol-a', 'タイレノールA', 'Tylenol A',
   'Pain and fever relief', 'アリナミン製薬', 'class2', 'pain-fever', 'tablet',
   '{tylenol,tairenoru,タイレノール}',
   null, false),

  ('eve-a', 'イブA錠', 'EVE A',
   'Pain and fever relief', 'エスエス製薬', 'designated_class2', 'pain-fever', 'tablet',
   '{eve,ibu,ebu,イブ}',
   'https://www.ssp.co.jp/product/detail/evea/', false),

  ('bufferin-a', 'バファリンA', 'Bufferin A',
   'Pain and fever relief', 'ライオン', 'designated_class2', 'pain-fever', 'tablet',
   '{bufferin,bafarin,バファリン}',
   'https://www.bufferin.net/products/a', false),

  ('pabron-gold-a', 'パブロンゴールドA', 'Pabron Gold A',
   'Multi-symptom cold and flu medicine', '大正製薬', 'designated_class2', 'cold-flu', 'tablet',
   '{pabron,paburon,パブロン}',
   'https://www.catalog-taisho.com/category/02/001/04513/', false),

  ('seirogan', '正露丸', 'Seirogan',
   'For diarrhoea and upset stomach', '大幸薬品', 'class2', 'stomach', 'pill',
   '{seirogan,seirogun,正露丸,ラッパ}',
   'https://search.jsm-db.info/sp/detail.php?txtID=4987110000002', false),

  ('gaster-10', 'ガスター10', 'Gaster 10',
   'For heartburn and stomach pain', '第一三共ヘルスケア', 'class1', 'stomach', 'tablet',
   '{gaster,gasuta,ガスター}',
   'https://www.daiichisankyo-hc.co.jp/products/details/gaster/', false),

  ('allegra-fx', 'アレグラFX', 'Allegra FX',
   'For hay fever and allergic rhinitis', '久光製薬', 'class2', 'allergy', 'tablet',
   '{allegra,alegra,アレグラ}',
   'https://www.kegg.jp/medicus-bin/japic_otc?japic_code=J1201000287', false),

  ('muhi-s', 'ムヒS', 'Muhi S',
   'For itching and insect bites', '池田模範堂', 'class3', 'skin', 'cream',
   '{muhi,ムヒ}',
   'https://www.ikedamohando.co.jp/products/muhi-s.html', false),

  ('sante-fx-neo', 'サンテFXネオ', 'Sante FX Neo',
   'For tired and bloodshot eyes', '参天製薬', 'class2', 'eye-drops', 'eye_drops',
   '{sante,santefx,サンテ}',
   'https://www.santen.com/jp/healthcare/eye/products/otc/sante_fx_neo', false);

-- ------------------------------------------------------------
-- 確認
-- ------------------------------------------------------------
-- select slug, otc_class, search_terms from products order by slug;
-- select count(*) from products;   -- 10 になるはず
