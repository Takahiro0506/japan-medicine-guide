-- ============================================================
-- Japan Medicine Guide — 32商品への拡張
-- SQL Editor に貼り、選択を解除してから一度だけ実行する
-- ============================================================

-- ------------------------------------------------------------
-- 1. カテゴリ追加
-- ------------------------------------------------------------
insert into categories (slug, name_en, name_ja, sort_order) values
('motion-sickness','Motion sickness','乗り物酔い',7),
('muscle-joint','Muscle & joint','筋肉痛・関節痛',8);

-- ------------------------------------------------------------
-- 2. 成分追加
-- ------------------------------------------------------------
insert into ingredients (slug, name_en, name_ja, note_en, verified) values
-- 解熱鎮痛・かぜ
('tranexamic-acid','Tranexamic acid','トラネキサム酸','Reduces inflammation in the throat.',false),
('clemastine','Clemastine','クレマスチンフマル酸塩','An antihistamine. Can cause drowsiness.',false),
('bromhexine','Bromhexine','ブロムヘキシン塩酸塩','Loosens mucus.',false),
('pseudoephedrine','Pseudoephedrine','プソイドエフェドリン塩酸塩','A decongestant. Pharmacist Only (S3) in Australia, where photo ID is required.',false),
('pyridoxine','Pyridoxine','ピリドキシン塩酸塩','Vitamin B6.',false),
('sodium-ascorbate','Sodium ascorbate','L-アスコルビン酸ナトリウム','Vitamin C.',false),
('licorice-extract','Licorice extract','カンゾウ乾燥エキス','A plant extract that reduces inflammation.',false),
-- 生薬（のど）
('platycodon','Platycodon root','キキョウ末','A plant extract.',false),
('senega','Senega root','セネガ末','A plant extract.',false),
('apricot-kernel','Apricot kernel','キョウニン','A plant extract.',false),
('ginseng','Ginseng','ニンジン末','A plant extract.',false),
-- 胃腸
('bifidobacterium','Bifidobacterium','ビフィズス菌','A live bacterium that supports gut balance.',false),
('enterococcus-faecalis','Enterococcus faecalis','フェーカリス菌','A live bacterium that supports gut balance.',false),
('lactobacillus-acidophilus','Lactobacillus acidophilus','アシドフィルス菌','A live bacterium that supports gut balance.',false),
('berberine-tannate','Berberine tannate','タンニン酸ベルベリン','Slows the bowel.',false),
('scopolia-extract','Scopolia extract','ロートエキス','Reduces cramping in the bowel.',false),
('cinnamon-bark','Cinnamon bark','ケイヒ','A plant extract.',false),
('fennel','Fennel','ウイキョウ','A plant extract.',false),
('nutmeg','Nutmeg','ニクズク','A plant extract.',false),
('clove','Clove','チョウジ','A plant extract.',false),
('gentian','Gentian','ゲンチアナ','A plant extract.',false),
('picrasma','Picrasma wood','ニガキ末','A plant extract.',false),
('sodium-bicarbonate','Sodium bicarbonate','炭酸水素ナトリウム','An antacid.',false),
('calcium-carbonate','Calcium carbonate','沈降炭酸カルシウム','An antacid.',false),
('magnesium-carbonate','Magnesium carbonate','炭酸マグネシウム','An antacid.',false),
('aluminium-silicate','Synthetic aluminium silicate','合成ケイ酸アルミニウム','An antacid.',false),
('biodiastase','Biodiastase','ビオヂアスターゼ','A digestive enzyme.',false),
('anchusan','Anchusan','安中散','A traditional Japanese (Kampo) herbal formula.',false),
('shakuyakukanzoto','Shakuyakukanzoto','芍薬甘草湯エキス末','A traditional Japanese (Kampo) herbal formula.',false),
-- 皮膚
('chlorhexidine','Chlorhexidine gluconate','クロルヘキシジングルコン酸塩','An antiseptic.',false),
('crotamiton','Crotamiton','クロタミトン','Relieves itching.',false),
('lidocaine','Lidocaine','リドカイン','A local anaesthetic.',false),
('tocopherol-acetate','Tocopherol acetate','トコフェロール酢酸エステル','Vitamin E.',false),
('dexamethasone-acetate','Dexamethasone acetate','デキサメタゾン酢酸エステル','A topical steroid. Stronger than the hydrocortisone sold over the counter in Australia.',false),
('ammonia-water','Ammonia solution','アンモニア水','Relieves itching from insect bites.',false),
('d-camphor','d-Camphor','d-カンフル','Produces a cooling sensation.',false),
('salicylic-acid','Salicylic acid','サリチル酸','Softens skin.',false),
('capsicum-tincture','Capsicum tincture','トウガラシチンキ','Produces a warming sensation.',false),
-- 目薬
('potassium-chloride','Potassium chloride','塩化カリウム','A mineral that matches the eye fluid.',false),
('sodium-chloride','Sodium chloride','塩化ナトリウム','A mineral that matches the eye fluid.',false),
('calcium-chloride','Calcium chloride','塩化カルシウム水和物','A mineral that matches the eye fluid.',false),
('retinol-palmitate','Retinol palmitate','レチノールパルミチン酸エステル','Vitamin A.',false),
('chondroitin-sulfate','Chondroitin sulfate sodium','コンドロイチン硫酸エステルナトリウム','Helps retain moisture on the eye surface.',false),
-- 乗り物酔い
('pheniramine','Pheniramine maleate','マレイン酸フェニラミン','An antihistamine. Can cause drowsiness.',false),
('ethyl-aminobenzoate','Ethyl aminobenzoate','アミノ安息香酸エチル','Settles the stomach.',false),
('scopolamine','Scopolamine hydrobromide','スコポラミン臭化水素酸塩水和物','Reduces motion sickness. Sold as hyoscine in Australia.',false),
('diprophylline','Diprophylline','ジプロフィリン','Acts on the balance centre of the inner ear.',false),
-- 筋肉・関節
('methyl-salicylate','Methyl salicylate','サリチル酸メチル','A topical pain reliever.',false),
('diclofenac','Diclofenac sodium','ジクロフェナクナトリウム','The same ingredient as in Voltaren.',false),
('epinastine','Epinastine','エピナスチン塩酸塩','A second-generation antihistamine.',false);

-- ------------------------------------------------------------
-- 3. ジヒドロコデインの注記を更新（豪州で処方箋が必要なため）
-- ------------------------------------------------------------
update ingredients
set note_en = 'A codeine-type medicine. Codeine products are prescription-only in Australia.'
where slug = 'dihydrocodeine';

-- ------------------------------------------------------------
-- 4. 外国ブランド追加
-- ------------------------------------------------------------
insert into foreign_brands (name, ingredient_slug, caveat_en, source_url, verified) values
('Voltaren','diclofenac',null,null,false);

-- ------------------------------------------------------------
-- 5. 商品追加（22点）
-- ------------------------------------------------------------
insert into products (slug, name_ja, name_romaji, summary_en, maker, otc_class, category, form, search_terms, sort_order, source_url, verified) values
('bufferin-luna-i','バファリン ルナi','Bufferin Luna i','Pain and fever relief','ライオン','designated_class2','pain-fever','tablet','{bufferin,luna,バファリン}',3,null,false),
('pelack-t','ペラックT錠a','Pelack T','For a sore or swollen throat','第一三共ヘルスケア','class3','cold-flu','tablet','{pelack,perakku,ペラック}',1,null,false),
('ryukakusan-direct','龍角散ダイレクト','Ryukakusan Direct','For a sore throat and cough. Taken without water','龍角散','class3','cold-flu','granule','{ryukakusan,龍角散}',2,null,false),
('lulu-attack-ex','ルルアタックEX','Lulu Attack EX','Multi-symptom cold medicine for sore throat and fever','第一三共ヘルスケア','designated_class2','cold-flu','tablet','{lulu,ruru,ルル}',4,null,false),
('benza-block-l','ベンザブロックL','Benza Block L','Multi-symptom cold medicine for sore throat','アリナミン製薬','designated_class2','cold-flu','tablet','{benza,benzablock,ベンザ}',5,null,false),
('stoppa-ex','ストッパ下痢止めEX','Stoppa EX','For sudden diarrhoea. Taken without water','ライオン','class2','stomach','tablet','{stoppa,ストッパ}',1,null,false),
('shin-biofermin-s','新ビオフェルミンS錠','Shin Biofermin S','Probiotic for general gut balance','大正製薬','class3','stomach','tablet','{biofermin,ビオフェルミン}',3,null,false),
('ota-isan','太田胃散','Ohta Isan','For indigestion, heartburn and an upset stomach','太田胃散','class2','stomach','powder','{ota,ohta,太田胃散}',4,null,false),
('taisho-kampo-ichoyaku','大正漢方胃腸薬','Taisho Kampo Ichoyaku','Herbal medicine for a weak or painful stomach','大正製薬','class2','stomach','granule','{kampo,漢方,大正}',5,null,false),
('claritin-ex','クラリチンEX','Claritin EX','For hay fever and allergic rhinitis','大正製薬','class2','allergy','tablet','{claritin,claratyne,クラリチン}',2,null,false),
('stonarini-z','ストナリニZ','Stonarini Z','For hay fever and allergic rhinitis','エスエス製薬','class2','allergy','tablet','{stonarini,ストナリニ}',3,null,false),
('alesion-20','アレジオン20','Alesion 20','For hay fever and allergic rhinitis','エスエス製薬','class2','allergy','tablet','{alesion,alegion,アレジオン}',4,null,false),
('oronine-h','オロナインH軟膏','Oronine H','Antiseptic ointment for cuts, grazes and minor burns','大塚製薬','class2','skin','ointment','{oronine,オロナイン}',1,null,false),
('mentholatum-ad','メンソレータムADクリームm','Mentholatum AD Cream','For itchy, dry skin. Steroid-free','ロート製薬','class2','skin','cream','{mentholatum,ad,メンソレータム}',3,null,false),
('kinkan','キンカン','Kinkan','Liquid for insect bites and itching','金冠堂','class2','skin','liquid','{kinkan,キンカン}',4,null,false),
('liquid-muhi-s2a','液体ムヒS2a','Liquid Muhi S2a','For insect bites with swelling and redness','池田模範堂','class2','skin','liquid','{muhi,ムヒ}',5,null,false),
('rohto-c-cube-a','ロートCキューブa','Rohto C Cube','Eye drops that can be used with contact lenses','ロート製薬','class3','eye-drops','eye_drops','{ccube,cube,キューブ}',1,null,false),
('smile-40ex','スマイル40EX','Smile 40 EX','For tired eyes','ライオン','class2','eye-drops','eye_drops','{smile,スマイル}',2,null,false),
('travelmin','トラベルミン','Travelmin','For motion sickness','エーザイ','class2','motion-sickness','tablet','{travelmin,トラベルミン}',1,null,false),
('anneron','アネロン「ニスキャップ」','Anneron Niscap','For motion sickness. One capsule lasts the day','エスエス製薬','designated_class2','motion-sickness','capsule','{anneron,アネロン}',2,null,false),
('voltaren-ex-tape','ボルタレンEXテープ','Voltaren EX Tape','Medicated patch for muscle and joint pain','グラクソ・スミスクライン','class2','muscle-joint','patch','{voltaren,ボルタレン}',1,null,false),
('salonpas-ae','サロンパスAe','Salonpas Ae','Medicated patch for stiff shoulders and muscle pain','久光製薬','class3','muscle-joint','patch','{salonpas,サロンパス}',2,null,false);

-- ------------------------------------------------------------
-- 6. 既存10商品の並び順を更新
-- ------------------------------------------------------------
update products set sort_order = 1 where slug = 'tylenol-a';
update products set sort_order = 2 where slug = 'eve-a';
update products set sort_order = 4 where slug = 'bufferin-a';
update products set sort_order = 9 where slug = 'loxonin-s';
update products set sort_order = 3 where slug = 'pabron-gold-a';
update products set sort_order = 2 where slug = 'seirogan';
update products set sort_order = 9 where slug = 'gaster-10';
update products set sort_order = 1 where slug = 'allegra-fx';
update products set sort_order = 2 where slug = 'muhi-s';
update products set sort_order = 3 where slug = 'sante-fx-neo';

-- ------------------------------------------------------------
-- 7. 成分の紐付け（箱の印刷順）
-- ------------------------------------------------------------
insert into product_ingredients (product_slug, ingredient_slug, sort_order) values
('bufferin-luna-i','ibuprofen',1),
('bufferin-luna-i','paracetamol',2),

('pelack-t','tranexamic-acid',1),
('pelack-t','licorice-extract',2),
('pelack-t','pyridoxine',3),
('pelack-t','riboflavin',4),
('pelack-t','sodium-ascorbate',5),

('ryukakusan-direct','platycodon',1),
('ryukakusan-direct','senega',2),
('ryukakusan-direct','licorice',3),
('ryukakusan-direct','apricot-kernel',4),
('ryukakusan-direct','ginseng',5),
('ryukakusan-direct','gambir',6),

('lulu-attack-ex','tranexamic-acid',1),
('lulu-attack-ex','ibuprofen',2),
('lulu-attack-ex','clemastine',3),
('lulu-attack-ex','bromhexine',4),
('lulu-attack-ex','dihydrocodeine',5),
('lulu-attack-ex','methylephedrine',6),

('benza-block-l','ibuprofen',1),
('benza-block-l','dihydrocodeine',2),
('benza-block-l','pseudoephedrine',3),
('benza-block-l','chlorpheniramine',4),
('benza-block-l','anhydrous-caffeine',5),

('stoppa-ex','berberine-tannate',1),
('stoppa-ex','scopolia-extract',2),

('shin-biofermin-s','bifidobacterium',1),
('shin-biofermin-s','enterococcus-faecalis',2),
('shin-biofermin-s','lactobacillus-acidophilus',3),

('ota-isan','cinnamon-bark',1),
('ota-isan','fennel',2),
('ota-isan','nutmeg',3),
('ota-isan','clove',4),
('ota-isan','citrus-peel',5),
('ota-isan','gentian',6),
('ota-isan','picrasma',7),
('ota-isan','sodium-bicarbonate',8),
('ota-isan','calcium-carbonate',9),
('ota-isan','magnesium-carbonate',10),
('ota-isan','aluminium-silicate',11),
('ota-isan','biodiastase',12),

('taisho-kampo-ichoyaku','anchusan',1),
('taisho-kampo-ichoyaku','shakuyakukanzoto',2),

('claritin-ex','loratadine',1),
('stonarini-z','cetirizine',1),
('alesion-20','epinastine',1),

('oronine-h','chlorhexidine',1),

('mentholatum-ad','crotamiton',1),
('mentholatum-ad','lidocaine',2),
('mentholatum-ad','diphenhydramine',3),
('mentholatum-ad','tocopherol-acetate',4),
('mentholatum-ad','glycyrrhetinic-acid',5),

('kinkan','ammonia-water',1),
('kinkan','l-menthol',2),
('kinkan','d-camphor',3),
('kinkan','salicylic-acid',4),
('kinkan','capsicum-tincture',5),

('liquid-muhi-s2a','diphenhydramine',1),
('liquid-muhi-s2a','dexamethasone-acetate',2),
('liquid-muhi-s2a','l-menthol',3),
('liquid-muhi-s2a','dl-camphor',4),

('rohto-c-cube-a','taurine',1),
('rohto-c-cube-a','potassium-chloride',2),
('rohto-c-cube-a','sodium-chloride',3),
('rohto-c-cube-a','calcium-chloride',4),

('smile-40ex','retinol-palmitate',1),
('smile-40ex','tocopherol-acetate',2),
('smile-40ex','pyridoxine',3),
('smile-40ex','potassium-aspartate',4),
('smile-40ex','chondroitin-sulfate',5),
('smile-40ex','chlorpheniramine',6),
('smile-40ex','tetrahydrozoline',7),

('travelmin','diphenhydramine',1),
('travelmin','diprophylline',2),

('anneron','pheniramine',1),
('anneron','ethyl-aminobenzoate',2),
('anneron','scopolamine',3),
('anneron','anhydrous-caffeine',4),
('anneron','pyridoxine',5),

('voltaren-ex-tape','diclofenac',1),

('salonpas-ae','methyl-salicylate',1),
('salonpas-ae','l-menthol',2),
('salonpas-ae','tocopherol-acetate',3);

-- ------------------------------------------------------------
-- 8. 確認
-- ------------------------------------------------------------
-- select category, count(*) from products group by category order by category;
-- select count(*) from ingredients;          -- 約80
-- select count(*) from product_ingredients;  -- 約130
