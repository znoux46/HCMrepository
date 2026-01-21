window.gameData = {
  provinces: [
    // Municipalities (5)
    { id: "hanoi", name: "Hà Nội", description: "Thủ đô ngàn năm văn hiến", icon: "🏛️", difficulty: 4, debateTopics: ["market_economy", "socialism_orientation"], knowledgeAreas: ["history", "philosophy", "politics"], uniqueItems: ["ho_chi_minh_mausoleum", "one_pillar_pagoda", "temple_of_literature"], requiredLevel: 1, unlocked: true, culturalFact: "Nơi Bác Hồ đọc Tuyên ngôn Độc lập" },
    { id: "ho_chi_minh_city", name: "TP. Hồ Chí Minh", description: "Trung tâm kinh tế lớn nhất", icon: "🏙️", difficulty: 4, debateTopics: ["market_economy", "socialism_orientation"], knowledgeAreas: ["economics", "politics", "society"], uniqueItems: ["independence_palace", "ben_thanh_market", "cu_chi_tunnels"], requiredLevel: 1, unlocked: true, culturalFact: "Được đặt tên theo Chủ tịch Hồ Chí Minh" },
    { id: "hai_phong", name: "Hải Phòng", description: "Thành phố Cảng - Hoa Phượng Đỏ", icon: "⚓", difficulty: 2, debateTopics: ["working_class", "industrialization"], knowledgeAreas: ["economics", "labor", "development"], uniqueItems: ["do_son_beach", "cat_ba_island", "hai_phong_opera"], requiredLevel: 1, unlocked: true, culturalFact: "Trung tâm công nghiệp phía Bắc" },
    { id: "da_nang", name: "Đà Nẵng", description: "Thành phố đáng sống", icon: "🌊", difficulty: 2, debateTopics: ["modernization", "sustainable_development"], knowledgeAreas: ["economics", "technology", "environment"], uniqueItems: ["dragon_bridge", "ba_na_hills", "my_khe_beach"], requiredLevel: 1, unlocked: true, culturalFact: "Thành phố trẻ và năng động" },
    { id: "can_tho", name: "Cần Thơ", description: "Thủ phủ Đồng bằng sông Cửu Long", icon: "🌾", difficulty: 2, debateTopics: ["agricultural_development", "rural_transformation"], knowledgeAreas: ["economics", "agriculture", "culture"], uniqueItems: ["can_tho_bridge", "cai_rang_floating_market", "bang_lang_stork_garden"], requiredLevel: 1, unlocked: true, culturalFact: "Trung tâm văn hóa miền Tây" },
    
    // Northern Provinces (25)
    { id: "ha_giang", name: "Hà Giang", description: "Cực Bắc Tổ quốc", icon: "⛰️", difficulty: 4, debateTopics: ["border_security", "ethnic_development"], knowledgeAreas: ["history", "culture", "geography"], uniqueItems: ["dong_van_plateau", "ma_pi_leng_pass", "lung_cu_flag_tower"], requiredLevel: 1, unlocked: true, culturalFact: "Nơi địa đầu Tổ quốc" },
    { id: "cao_bang", name: "Cao Bằng", description: "Căn cứ địa cách mạng", icon: "🏔️", difficulty: 4, debateTopics: ["revolution_history", "border_development"], knowledgeAreas: ["history", "politics", "culture"], uniqueItems: ["pac_bo_cave", "ban_gioc_waterfall", "thang_hen_lake"], requiredLevel: 1, unlocked: true, culturalFact: "Nơi Bác Hồ về nước năm 1941" },
    { id: "bac_kan", name: "Bắc Kạn", description: "Vùng đất giàu tiềm năng", icon: "🌲", difficulty: 3, debateTopics: ["forest_conservation", "sustainable_development"], knowledgeAreas: ["environment", "economics", "culture"], uniqueItems: ["ba_be_lake", "pac_ngoi_village", "na_ri_mountain"], requiredLevel: 1, unlocked: true, culturalFact: "Hồ Ba Bể - Di sản thiên nhiên" },
    { id: "tuyen_quang", name: "Tuyên Quang", description: "Thủ đô Kháng chiến", icon: "🏛️", difficulty: 4, debateTopics: ["revolution_tradition", "national_unity"], knowledgeAreas: ["history", "politics", "culture"], uniqueItems: ["tan_trao_banyan", "na_hang_lake", "my_lam_hot_spring"], requiredLevel: 1, unlocked: true, culturalFact: "Nơi tổ chức Quốc dân Đại hội 1945" },
    { id: "lao_cai", name: "Lào Cai", description: "Cửa ngõ phía Bắc", icon: "🚂", difficulty: 4, debateTopics: ["border_trade", "tourism_development"], knowledgeAreas: ["economics", "culture", "geography"], uniqueItems: ["sapa_town", "fansipan_peak", "bac_ha_market"], requiredLevel: 1, unlocked: true, culturalFact: "Sa Pa - Thị trấn trong mây" },
    { id: "dien_bien", name: "Điện Biên", description: "Chiến thắng lịch sử", icon: "🎖️", difficulty: 4, debateTopics: ["military_strategy", "national_pride"], knowledgeAreas: ["history", "politics", "military"], uniqueItems: ["dien_bien_phu_battlefield", "a1_hill", "pa_khoang_lake"], requiredLevel: 1, unlocked: true, culturalFact: "Chiến thắng Điện Biên Phủ 1954" },
    { id: "lai_chau", name: "Lai Châu", description: "Vùng cao Tây Bắc", icon: "🏞️", difficulty: 1, debateTopics: ["ethnic_culture", "mountain_development"], knowledgeAreas: ["culture", "geography", "economics"], uniqueItems: ["sin_ho_plateau", "pu_sam_cap_cave", "nam_nhun_lake"], requiredLevel: 1, unlocked: true, culturalFact: "Vùng đất đa dân tộc" },
    { id: "son_la", name: "Sơn La", description: "Vùng đất cách mạng", icon: "🌄", difficulty: 2, debateTopics: ["revolution_history", "ethnic_unity"], knowledgeAreas: ["history", "culture", "politics"], uniqueItems: ["son_la_prison", "moc_chau_plateau", "yen_chau_mango"], requiredLevel: 1, unlocked: true, culturalFact: "Nhà tù Sơn La - Di tích lịch sử" },
    { id: "yen_bai", name: "Yên Bái", description: "Vùng đất trung du", icon: "🍃", difficulty: 2, debateTopics: ["agricultural_innovation", "rural_development"], knowledgeAreas: ["agriculture", "economics", "culture"], uniqueItems: ["mu_cang_chai", "thac_ba_lake", "suoi_giang_tea"], requiredLevel: 1, unlocked: true, culturalFact: "Ruộng bậc thang Mù Cang Chải" },
    { id: "hoa_binh", name: "Hòa Bình", description: "Vùng đất hòa bình", icon: "⚡", difficulty: 3, debateTopics: ["energy_development", "ethnic_culture"], knowledgeAreas: ["economics", "culture", "technology"], uniqueItems: ["hoa_binh_hydropower", "kim_boi_hot_spring", "muong_culture"], requiredLevel: 1, unlocked: true, culturalFact: "Nhà máy thủy điện Hòa Bình" },
    { id: "thai_nguyen", name: "Thái Nguyên", description: "Thủ phủ trà", icon: "🍵", difficulty: 4, debateTopics: ["agricultural_development", "industrial_growth"], knowledgeAreas: ["agriculture", "economics", "culture"], uniqueItems: ["tan_cuong_tea", "nui_coc_lake", "dinh_hoa_safe_zone"], requiredLevel: 1, unlocked: true, culturalFact: "Trà Tân Cương nổi tiếng" },
    { id: "lang_son", name: "Lạng Sơn", description: "Cửa ngõ biên giới", icon: "🚪", difficulty: 2, debateTopics: ["border_trade", "cultural_exchange"], knowledgeAreas: ["economics", "culture", "geography"], uniqueItems: ["dong_dang_border", "tam_thanh_cave", "ky_cung_temple"], requiredLevel: 1, unlocked: true, culturalFact: "Cửa khẩu Đồng Đăng" },
    { id: "quang_ninh", name: "Quảng Ninh", description: "Vùng than đá", icon: "⛏️", difficulty: 4, debateTopics: ["resource_management", "tourism_development"], knowledgeAreas: ["economics", "environment", "tourism"], uniqueItems: ["ha_long_bay", "yen_tu_mountain", "bai_chay_beach"], requiredLevel: 1, unlocked: true, culturalFact: "Vịnh Hạ Long - Di sản thế giới" },
    { id: "bac_giang", name: "Bắc Giang", description: "Vùng đất trái cây", icon: "🍊", difficulty: 2, debateTopics: ["agricultural_export", "rural_development"], knowledgeAreas: ["agriculture", "economics", "culture"], uniqueItems: ["yen_the_district", "khe_ro_festival", "tho_ha_village"], requiredLevel: 1, unlocked: true, culturalFact: "Vải thiều Lục Ngạn nổi tiếng" },
    { id: "phu_tho", name: "Phú Thọ", description: "Đất Tổ Hùng Vương", icon: "👑", difficulty: 4, debateTopics: ["national_origin", "cultural_heritage"], knowledgeAreas: ["history", "culture", "politics"], uniqueItems: ["hung_temple", "xuan_son_national_park", "ao_chau_lake"], requiredLevel: 1, unlocked: true, culturalFact: "Đền Hùng - Nơi thờ các Vua Hùng" },
    { id: "vinh_phuc", name: "Vĩnh Phúc", description: "Vùng đất phát triển", icon: "🏭", difficulty: 3, debateTopics: ["industrial_development", "urban_planning"], knowledgeAreas: ["economics", "technology", "politics"], uniqueItems: ["tam_dao_mountain", "dai_lai_lake", "tay_thien_temple"], requiredLevel: 1, unlocked: true, culturalFact: "Tam Đảo - Khu nghỉ dưỡng" },
    { id: "bac_ninh", name: "Bắc Ninh", description: "Quê hương quan họ", icon: "🎵", difficulty: 2, debateTopics: ["cultural_preservation", "folk_arts"], knowledgeAreas: ["culture", "arts", "history"], uniqueItems: ["dinh_bang_village", "but_thap_temple", "lim_festival"], requiredLevel: 1, unlocked: true, culturalFact: "Dân ca quan họ Bắc Ninh" },
    { id: "hai_duong", name: "Hải Dương", description: "Vùng đất văn hiến", icon: "📚", difficulty: 3, debateTopics: ["education_development", "cultural_tradition"], knowledgeAreas: ["culture", "education", "history"], uniqueItems: ["con_son_temple", "kiep_bac_temple", "chi_linh_mountain"], requiredLevel: 1, unlocked: true, culturalFact: "Côn Sơn - Kiếp Bạc" },
    { id: "hung_yen", name: "Hưng Yên", description: "Vùng đất nhãn lồng", icon: "🌳", difficulty: 3, debateTopics: ["agricultural_branding", "rural_economy"], knowledgeAreas: ["agriculture", "economics", "culture"], uniqueItems: ["pho_hien_ancient_town", "chu_dong_tu_temple", "hong_van_temple"], requiredLevel: 1, unlocked: true, culturalFact: "Nhãn lồng Hưng Yên" },
    { id: "ha_nam", name: "Hà Nam", description: "Vùng đất trung du", icon: "🌾", difficulty: 3, debateTopics: ["agricultural_development", "rural_transformation"], knowledgeAreas: ["agriculture", "economics", "culture"], uniqueItems: ["tam_chuc_temple", "ba_danh_temple", "kenh_gia_canal"], requiredLevel: 1, unlocked: true, culturalFact: "Chùa Tam Chúc lớn nhất thế giới" },
    { id: "nam_dinh", name: "Nam Định", description: "Vùng đất văn hóa", icon: "🏛️", difficulty: 3, debateTopics: ["cultural_heritage", "religious_tradition"], knowledgeAreas: ["culture", "history", "religion"], uniqueItems: ["phu_day_temple", "tran_temple", "co_le_temple"], requiredLevel: 1, unlocked: true, culturalFact: "Phủ Dầy - Di tích tín ngưỡng" },
    { id: "thai_binh", name: "Thái Bình", description: "Vùng đất lúa", icon: "🌾", difficulty: 2, debateTopics: ["agricultural_productivity", "rural_development"], knowledgeAreas: ["agriculture", "economics", "culture"], uniqueItems: ["dong_xam_silver_village", "keo_pagoda", "bach_thuan_beach"], requiredLevel: 1, unlocked: true, culturalFact: "Vựa lúa lớn của miền Bắc" },
    { id: "ninh_binh", name: "Ninh Bình", description: "Vùng đất di sản", icon: "🏔️", difficulty: 4, debateTopics: ["tourism_development", "heritage_preservation"], knowledgeAreas: ["tourism", "culture", "history"], uniqueItems: ["trang_an_complex", "bai_dinh_temple", "cuc_phuong_national_park"], requiredLevel: 1, unlocked: true, culturalFact: "Tràng An - Di sản thế giới" },
    { id: "thanh_hoa", name: "Thanh Hóa", description: "Xứ Thanh", icon: "🏯", difficulty: 4, debateTopics: ["historical_heritage", "economic_development"], knowledgeAreas: ["history", "economics", "culture"], uniqueItems: ["ho_citadel", "sam_son_beach", "ben_en_national_park"], requiredLevel: 1, unlocked: true, culturalFact: "Thành Nhà Hồ - Di sản thế giới" },
    { id: "nghe_an", name: "Nghệ An", description: "Quê hương Chủ tịch Hồ Chí Minh", icon: "🏡", difficulty: 4, debateTopics: ["patriotism", "peoples_democracy"], knowledgeAreas: ["history", "culture", "ethics"], uniqueItems: ["kim_lien_village", "cua_lo_beach", "pu_mat_forest"], requiredLevel: 1, unlocked: true, culturalFact: "Nơi sinh của Người" },
    { id: "ha_tinh", name: "Hà Tĩnh", description: "Vùng đất cách mạng", icon: "🔥", difficulty: 2, debateTopics: ["revolution_tradition", "national_spirit"], knowledgeAreas: ["history", "politics", "culture"], uniqueItems: ["nguyen_du_temple", "thien_cam_beach", "vu_quang_national_park"], requiredLevel: 1, unlocked: true, culturalFact: "Quê hương Nguyễn Du" },
    
    // Central Provinces (14)
    { id: "quang_binh", name: "Quảng Bình", description: "Vương quốc hang động", icon: "🕳️", difficulty: 4, debateTopics: ["tourism_development", "natural_conservation"], knowledgeAreas: ["tourism", "geography", "environment"], uniqueItems: ["son_doong_cave", "phong_nha_cave", "nhat_le_beach"], requiredLevel: 1, unlocked: true, culturalFact: "Sơn Đoòng - Hang động lớn nhất thế giới" },
    { id: "quang_tri", name: "Quảng Trị", description: "Vùng đất lửa", icon: "🔥", difficulty: 3, debateTopics: ["war_history", "peace_reconstruction"], knowledgeAreas: ["history", "politics", "military"], uniqueItems: ["dmz_zone", "la_vang_basilica", "cua_tung_beach"], requiredLevel: 1, unlocked: true, culturalFact: "Vĩ tuyến 17 - Vùng phi quân sự" },
    { id: "hue", name: "Thừa Thiên Huế", description: "Cố đô - Di sản văn hóa thế giới", icon: "👑", difficulty: 4, debateTopics: ["cultural_heritage", "revolution_tradition"], knowledgeAreas: ["culture", "history", "arts"], uniqueItems: ["imperial_city", "thien_mu_pagoda", "perfume_river"], requiredLevel: 1, unlocked: true, culturalFact: "Kinh đô cuối cùng của triều đại phong kiến" },
    { id: "quang_nam", name: "Quảng Nam", description: "Vùng đất di sản", icon: "🏛️", difficulty: 3, debateTopics: ["heritage_preservation", "tourism_development"], knowledgeAreas: ["culture", "history", "tourism"], uniqueItems: ["hoi_an_ancient_town", "my_son_sanctuary", "cham_islands"], requiredLevel: 1, unlocked: true, culturalFact: "Hội An - Phố cổ di sản thế giới" },
    { id: "quang_ngai", name: "Quảng Ngãi", description: "Vùng đất cách mạng", icon: "🎖️", difficulty: 3, debateTopics: ["revolution_history", "coastal_development"], knowledgeAreas: ["history", "politics", "economics"], uniqueItems: ["ba_to_memorial", "ly_son_island", "sa_huynh_beach"], requiredLevel: 1, unlocked: true, culturalFact: "Ba Tơ - Căn cứ cách mạng" },
    { id: "binh_dinh", name: "Bình Định", description: "Vùng đất võ", icon: "🥋", difficulty: 2, debateTopics: ["martial_arts_culture", "coastal_development"], knowledgeAreas: ["culture", "sports", "economics"], uniqueItems: ["banh_it_tower", "quy_nhon_beach", "tay_son_museum"], requiredLevel: 1, unlocked: true, culturalFact: "Quê hương võ Tây Sơn" },
    { id: "phu_yen", name: "Phú Yên", description: "Vùng đất hoa vàng", icon: "🌻", difficulty: 4, debateTopics: ["tourism_development", "coastal_economy"], knowledgeAreas: ["tourism", "economics", "culture"], uniqueItems: ["ganh_da_dia", "vung_ro_bay", "xuan_dai_bay"], requiredLevel: 1, unlocked: true, culturalFact: "Gành Đá Đĩa - Kỳ quan thiên nhiên" },
    { id: "khanh_hoa", name: "Khánh Hòa", description: "Vùng đất biển", icon: "🏖️", difficulty: 4, debateTopics: ["tourism_development", "marine_economy"], knowledgeAreas: ["tourism", "economics", "environment"], uniqueItems: ["nha_trang_beach", "vinpearl_land", "hon_chong_promontory"], requiredLevel: 1, unlocked: true, culturalFact: "Nha Trang - Thành phố biển" },
    { id: "ninh_thuan", name: "Ninh Thuận", description: "Vùng đất nắng gió", icon: "☀️", difficulty: 2, debateTopics: ["renewable_energy", "agricultural_adaptation"], knowledgeAreas: ["energy", "agriculture", "environment"], uniqueItems: ["ca_na_beach", "po_klong_garai_tower", "vinh_hy_bay"], requiredLevel: 1, unlocked: true, culturalFact: "Năng lượng gió và mặt trời" },
    { id: "binh_thuan", name: "Bình Thuận", description: "Vùng đất du lịch", icon: "🏄", difficulty: 4, debateTopics: ["tourism_development", "renewable_energy"], knowledgeAreas: ["tourism", "energy", "economics"], uniqueItems: ["mui_ne_beach", "fairy_stream", "ta_cu_mountain"], requiredLevel: 1, unlocked: true, culturalFact: "Mũi Né - Thiên đường lướt sóng" },
    { id: "kon_tum", name: "Kon Tum", description: "Vùng cao nguyên", icon: "🌄", difficulty: 3, debateTopics: ["ethnic_development", "border_security"], knowledgeAreas: ["culture", "geography", "politics"], uniqueItems: ["kon_klor_suspension_bridge", "mang_den_ecotourism", "pleiku_plateau"], requiredLevel: 1, unlocked: true, culturalFact: "Cầu treo Kon Klor" },
    { id: "gia_lai", name: "Gia Lai", description: "Vùng đất cà phê", icon: "☕", difficulty: 3, debateTopics: ["agricultural_export", "ethnic_culture"], knowledgeAreas: ["agriculture", "economics", "culture"], uniqueItems: ["bien_ho_lake", "pleiku_city", "ya_ly_hydropower"], requiredLevel: 1, unlocked: true, culturalFact: "Vùng trồng cà phê lớn" },
    { id: "dak_lak", name: "Đắk Lắk", description: "Thủ phủ cà phê", icon: "☕", difficulty: 4, debateTopics: ["agricultural_export", "ethnic_heritage"], knowledgeAreas: ["agriculture", "culture", "economics"], uniqueItems: ["lak_lake", "buon_ma_thuot_coffee", "yok_don_national_park"], requiredLevel: 1, unlocked: true, culturalFact: "Buôn Ma Thuột - Thủ phủ cà phê" },
    { id: "dak_nong", name: "Đắk Nông", description: "Vùng đất mới", icon: "🌿", difficulty: 3, debateTopics: ["new_development", "ethnic_integration"], knowledgeAreas: ["economics", "culture", "geography"], uniqueItems: ["dray_sap_waterfall", "ta_dung_lake", "nam_nung_volcano"], requiredLevel: 1, unlocked: true, culturalFact: "Thác Dray Sáp hùng vĩ" },
    
    // Southern Provinces (19)
    { id: "lam_dong", name: "Lâm Đồng", description: "Thành phố ngàn hoa", icon: "🌸", difficulty: 4, debateTopics: ["tourism_development", "agricultural_innovation"], knowledgeAreas: ["tourism", "agriculture", "economics"], uniqueItems: ["da_lat_city", "lang_biang_mountain", "xuan_huong_lake"], requiredLevel: 1, unlocked: true, culturalFact: "Đà Lạt - Thành phố ngàn hoa" },
    { id: "binh_phuoc", name: "Bình Phước", description: "Vùng đất cao su", icon: "🌳", difficulty: 3, debateTopics: ["agricultural_export", "border_development"], knowledgeAreas: ["agriculture", "economics", "geography"], uniqueItems: ["bu_gia_map_national_park", "soc_bom_bo_memorial", "cao_su_plantation"], requiredLevel: 1, unlocked: true, culturalFact: "Vùng trồng cao su lớn" },
    { id: "tay_ninh", name: "Tây Ninh", description: "Vùng đất tôn giáo", icon: "🕌", difficulty: 4, debateTopics: ["religious_freedom", "cultural_diversity"], knowledgeAreas: ["religion", "culture", "politics"], uniqueItems: ["cao_dai_temple", "ba_den_mountain", "dau_tieng_lake"], requiredLevel: 1, unlocked: true, culturalFact: "Tòa Thánh Cao Đài" },
    { id: "binh_duong", name: "Bình Dương", description: "Vùng đất công nghiệp", icon: "🏭", difficulty: 3, debateTopics: ["industrial_development", "urban_growth"], knowledgeAreas: ["economics", "technology", "politics"], uniqueItems: ["lai_thieu_fruit_garden", "dau_tieng_lake", "industrial_zone"], requiredLevel: 1, unlocked: true, culturalFact: "Khu công nghiệp lớn" },
    { id: "dong_nai", name: "Đồng Nai", description: "Vùng đất phát triển", icon: "🏗️", difficulty: 4, debateTopics: ["industrial_development", "urban_planning"], knowledgeAreas: ["economics", "technology", "politics"], uniqueItems: ["cat_tien_national_park", "tri_an_hydropower", "long_khanh_fruit"], requiredLevel: 1, unlocked: true, culturalFact: "Vườn quốc gia Cát Tiên" },
    { id: "ba_ria_vung_tau", name: "Bà Rịa - Vũng Tàu", description: "Vùng đất dầu khí", icon: "🛢️", difficulty: 4, debateTopics: ["energy_development", "tourism_growth"], knowledgeAreas: ["energy", "tourism", "economics"], uniqueItems: ["vung_tau_beach", "con_dao_island", "long_son_pagoda"], requiredLevel: 1, unlocked: true, culturalFact: "Côn Đảo - Di tích lịch sử" },
    { id: "long_an", name: "Long An", description: "Cửa ngõ miền Tây", icon: "🚪", difficulty: 3, debateTopics: ["agricultural_development", "trade_gateway"], knowledgeAreas: ["agriculture", "economics", "geography"], uniqueItems: ["dong_thap_muoi", "tan_lap_floating_village", "lang_sen_wetland"], requiredLevel: 1, unlocked: true, culturalFact: "Đồng Tháp Mười" },
    { id: "tien_giang", name: "Tiền Giang", description: "Vùng đất trái cây", icon: "🍈", difficulty: 3, debateTopics: ["agricultural_export", "rural_development"], knowledgeAreas: ["agriculture", "economics", "culture"], uniqueItems: ["cai_be_floating_market", "dong_tam_snake_farm", "go_cong_beach"], requiredLevel: 1, unlocked: true, culturalFact: "Chợ nổi Cái Bè" },
    { id: "ben_tre", name: "Bến Tre", description: "Xứ dừa", icon: "🥥", difficulty: 4, debateTopics: ["agricultural_branding", "rural_economy"], knowledgeAreas: ["agriculture", "economics", "culture"], uniqueItems: ["coconut_kingdom", "con_phung_island", "dong_khoi_movement"], requiredLevel: 1, unlocked: true, culturalFact: "Xứ dừa Bến Tre" },
    { id: "tra_vinh", name: "Trà Vinh", description: "Vùng đất Khmer", icon: "🕌", difficulty: 3, debateTopics: ["ethnic_culture", "religious_diversity"], knowledgeAreas: ["culture", "religion", "history"], uniqueItems: ["ang_pagoda", "ba_om_pond", "co_chien_river"], requiredLevel: 1, unlocked: true, culturalFact: "Văn hóa Khmer Nam Bộ" },
    { id: "vinh_long", name: "Vĩnh Long", description: "Vùng đất sông nước", icon: "🚣", difficulty: 2, debateTopics: ["waterway_development", "agricultural_innovation"], knowledgeAreas: ["geography", "agriculture", "economics"], uniqueItems: ["an_binh_island", "mang_thit_river", "long_ho_garden"], requiredLevel: 1, unlocked: true, culturalFact: "Cù lao An Bình" },
    { id: "dong_thap", name: "Đồng Tháp", description: "Vùng đất sen", icon: "🪷", difficulty: 4, debateTopics: ["agricultural_diversity", "ecotourism"], knowledgeAreas: ["agriculture", "tourism", "environment"], uniqueItems: ["tram_chim_national_park", "sen_pond", "gao_giong_ecotourism"], requiredLevel: 1, unlocked: true, culturalFact: "Vườn quốc gia Tràm Chim" },
    { id: "an_giang", name: "An Giang", description: "Vùng đất tôn giáo", icon: "⛰️", difficulty: 4, debateTopics: ["religious_harmony", "border_development"], knowledgeAreas: ["religion", "culture", "geography"], uniqueItems: ["sam_mountain", "ba_chua_xu_temple", "tra_su_forest"], requiredLevel: 1, unlocked: true, culturalFact: "Núi Sam - Di tích tôn giáo" },
    { id: "kien_giang", name: "Kiên Giang", description: "Vùng đất biển đảo", icon: "🏝️", difficulty: 4, debateTopics: ["maritime_sovereignty", "tourism_development"], knowledgeAreas: ["geography", "tourism", "politics"], uniqueItems: ["phu_quoc_island", "ha_tien_beach", "u_minh_thuong_national_park"], requiredLevel: 1, unlocked: true, culturalFact: "Phú Quốc - Đảo ngọc" },
    { id: "ca_mau", name: "Cà Mau", description: "Đất mũi Cà Mau", icon: "🗺️", difficulty: 4, debateTopics: ["coastal_development", "mangrove_conservation"], knowledgeAreas: ["geography", "environment", "economics"], uniqueItems: ["ca_mau_cape", "u_minh_ha_forest", "ngoc_hien_mangrove"], requiredLevel: 1, unlocked: true, culturalFact: "Mũi Cà Mau - Cực Nam Tổ quốc" },
    { id: "bac_lieu", name: "Bạc Liêu", description: "Vùng đất văn hóa", icon: "🎭", difficulty: 3, debateTopics: ["cultural_heritage", "coastal_development"], knowledgeAreas: ["culture", "economics", "geography"], uniqueItems: ["bac_lieu_wind_power", "cong_tu_bac_lieu", "nha_mat_beach"], requiredLevel: 1, unlocked: true, culturalFact: "Công tử Bạc Liêu" },
    { id: "soc_trang", name: "Sóc Trăng", description: "Vùng đất Khmer", icon: "🕌", difficulty: 3, debateTopics: ["ethnic_culture", "religious_diversity"], knowledgeAreas: ["culture", "religion", "history"], uniqueItems: ["clay_pagoda", "khleang_pagoda", "my_phuoc_island"], requiredLevel: 1, unlocked: true, culturalFact: "Chùa Đất Sóc Trăng" },
    { id: "hau_giang", name: "Hậu Giang", description: "Vùng đất mới", icon: "🌾", difficulty: 3, debateTopics: ["agricultural_development", "rural_transformation"], knowledgeAreas: ["agriculture", "economics", "culture"], uniqueItems: ["phung_hiep_floating_market", "lung_ngoc_hoang", "vi_thanh_city"], requiredLevel: 1, unlocked: true, culturalFact: "Chợ nổi Phụng Hiệp" }
  ],

  items: {
    // Knowledge Resources (like books, papers)
    history_book: { name: "Sách Lịch sử", icon: "📕", type: "knowledge", rarity: "common", area: "history", points: 5 },
    philosophy_book: { name: "Sách Triết học", icon: "📗", type: "knowledge", rarity: "common", area: "philosophy", points: 5 },
    politics_book: { name: "Sách Chính trị", icon: "📘", type: "knowledge", rarity: "common", area: "politics", points: 5 },
    economics_book: { name: "Sách Kinh tế", icon: "📙", type: "knowledge", rarity: "uncommon", area: "economics", points: 8 },
    culture_book: { name: "Sách Văn hóa", icon: "📔", type: "knowledge", rarity: "common", area: "culture", points: 5 },
    society_book: { name: "Sách Xã hội", icon: "📚", type: "knowledge", rarity: "common", area: "society", points: 5 },
    tourism_book: { name: "Sách Du lịch", icon: "✈️", type: "knowledge", rarity: "common", area: "tourism", points: 5 },
    geography_book: { name: "Sách Địa lý", icon: "🗺️", type: "knowledge", rarity: "common", area: "geography", points: 5 },
    environment_book: { name: "Sách Môi trường", icon: "🌍", type: "knowledge", rarity: "common", area: "environment", points: 5 },
    agriculture_book: { name: "Sách Nông nghiệp", icon: "🌾", type: "knowledge", rarity: "common", area: "agriculture", points: 5 },
    energy_book: { name: "Sách Năng lượng", icon: "⚡", type: "knowledge", rarity: "uncommon", area: "energy", points: 8 },
    technology_book: { name: "Sách Công nghệ", icon: "💻", type: "knowledge", rarity: "uncommon", area: "technology", points: 8 },
    labor_book: { name: "Sách Lao động", icon: "👷", type: "knowledge", rarity: "common", area: "labor", points: 5 },
    development_book: { name: "Sách Phát triển", icon: "📈", type: "knowledge", rarity: "common", area: "development", points: 5 },
    military_book: { name: "Sách Quân sự", icon: "🎖️", type: "knowledge", rarity: "uncommon", area: "military", points: 8 },
    arts_book: { name: "Sách Nghệ thuật", icon: "🎨", type: "knowledge", rarity: "common", area: "arts", points: 5 },
    education_book: { name: "Sách Giáo dục", icon: "📖", type: "knowledge", rarity: "common", area: "education", points: 5 },
    religion_book: { name: "Sách Tôn giáo", icon: "🕌", type: "knowledge", rarity: "common", area: "religion", points: 5 },
    ethics_book: { name: "Sách Đạo đức", icon: "✨", type: "knowledge", rarity: "common", area: "ethics", points: 5 },
    sports_book: { name: "Sách Thể thao", icon: "⚽", type: "knowledge", rarity: "common", area: "sports", points: 5 },

    research_paper: { name: "Bài nghiên cứu", icon: "📄", type: "knowledge", rarity: "common", area: "general", points: 5 },
    documentary: { name: "Phim tài liệu", icon: "🎞️", type: "knowledge", rarity: "uncommon", area: "general", points: 10 },
    interview_record: { name: "Bản phỏng vấn", icon: "🎤", type: "knowledge", rarity: "rare", area: "general", points: 15 },

    // Hanoi unique items
    ho_chi_minh_mausoleum: { name: "Lăng Chủ tịch Hồ Chí Minh", icon: "🏛️", type: "landmark", rarity: "legendary", description: "Biểu tượng thiêng liêng của dân tộc", wisdom: 5, credibility: 4, location: "Hà Nội", locationInfo: "Nơi Bác Hồ đọc Tuyên ngôn Độc lập" },
    one_pillar_pagoda: { name: "Chùa Một Cột", icon: "⛩️", type: "landmark", rarity: "rare", description: "Di tích kiến trúc độc đáo", wisdom: 4, credibility: 3, location: "Hà Nội", locationInfo: "Chùa một cột độc đáo nhất Việt Nam" },
    temple_of_literature: { name: "Văn Miếu Quốc Tử Giám", icon: "🎓", type: "landmark", rarity: "epic", description: "Trường đại học đầu tiên VN", wisdom: 3, credibility: 2, location: "Hà Nội", locationInfo: "Trường đại học đầu tiên của Việt Nam" },
    hoan_kiem_lake: { name: "Hồ Hoàn Kiếm", icon: "🌊", type: "landmark", rarity: "epic", description: "Trái tim của Hà Nội", wisdom: 3, credibility: 3, location: "Hà Nội", locationInfo: "Hồ gắn liền với truyền thuyết vua Lê" },
    old_quarter: { name: "Phố cổ Hà Nội", icon: "🏘️", type: "landmark", rarity: "rare", description: "Khu phố cổ nghìn năm", wisdom: 2, credibility: 2, location: "Hà Nội", locationInfo: "36 phố phường cổ kính" },

    // Nghe An unique items
    kim_lien_village: { name: "Làng Sen", icon: "🏡", type: "landmark", rarity: "legendary", description: "Quê hương Bác Hồ", wisdom: 2, patriotism: 5, location: "Nghệ An", locationInfo: "Nơi sinh của Chủ tịch Hồ Chí Minh" },
    cua_lo_beach: { name: "Biển Cửa Lò", icon: "🏖️", type: "landmark", rarity: "rare", description: "Bãi biển đẹp", credibility: 4, location: "Nghệ An", locationInfo: "Bãi biển nổi tiếng miền Trung" },
    pu_mat_forest: { name: "Rừng Pù Mát", icon: "🌲", type: "landmark", rarity: "epic", description: "Rừng nguyên sinh quý hiếm", wisdom: 3, location: "Nghệ An", locationInfo: "Vườn quốc gia Pù Mát" },
    nguyen_du_memorial: { name: "Khu lưu niệm Nguyễn Du", icon: "📖", type: "landmark", rarity: "epic", description: "Di tích văn học", wisdom: 3, credibility: 2, location: "Nghệ An", locationInfo: "Nơi tưởng niệm đại thi hào" },
    hoang_tru_village: { name: "Làng Hoàng Trù", icon: "🏘️", type: "landmark", rarity: "rare", description: "Quê ngoại Bác Hồ", wisdom: 2, patriotism: 3, location: "Nghệ An", locationInfo: "Quê ngoại của Bác Hồ" },

    // Hai Phong unique items
    do_son_beach: { name: "Bãi biển Đồ Sơn", icon: "🌊", type: "landmark", rarity: "uncommon", description: "Khu nghỉ dưỡng nổi tiếng", credibility: 3, location: "Hải Phòng", locationInfo: "Khu nghỉ dưỡng biển đầu tiên" },
    cat_ba_island: { name: "Đảo Cát Bà", icon: "🏝️", type: "landmark", rarity: "rare", description: "Vườn quốc gia sinh học", wisdom: 2, location: "Hải Phòng", locationInfo: "Vườn quốc gia Cát Bà" },
    hai_phong_opera: { name: "Nhà hát Lớn Hải Phòng", icon: "🎭", type: "landmark", rarity: "epic", description: "Kiến trúc Pháp cổ điển", credibility: 3, location: "Hải Phòng", locationInfo: "Nhà hát kiến trúc Pháp" },
    du_hang_pagoda: { name: "Chùa Dư Hàng", icon: "🛕", type: "landmark", rarity: "rare", description: "Chùa cổ Hải Phòng", wisdom: 2, credibility: 2, location: "Hải Phòng", locationInfo: "Chùa cổ nghìn năm" },
    hai_phong_port: { name: "Cảng Hải Phòng", icon: "⚓", type: "landmark", rarity: "epic", description: "Cảng lớn nhất miền Bắc", credibility: 3, location: "Hải Phòng", locationInfo: "Cảng biển lớn nhất phía Bắc" },

    // Hue unique items
    imperial_city: { name: "Đại Nội Huế", icon: "🏰", type: "landmark", rarity: "legendary", description: "Di sản văn hóa thế giới", wisdom: 4, credibility: 4, location: "Thừa Thiên Huế", locationInfo: "Kinh đô cuối cùng của triều đại phong kiến" },
    thien_mu_pagoda: { name: "Chùa Thiên Mụ", icon: "🛕", type: "landmark", rarity: "epic", description: "Ngôi chùa cổ nhất", wisdom: 3, location: "Thừa Thiên Huế", locationInfo: "Chùa cổ nhất Huế" },
    perfume_river: { name: "Sông Hương", icon: "🛶", type: "landmark", rarity: "rare", description: "Dòng sông thơ mộng", credibility: 2, location: "Thừa Thiên Huế", locationInfo: "Dòng sông thơ mộng nhất Việt Nam" },

    // Da Nang unique items
    dragon_bridge: { name: "Cầu Rồng", icon: "🐉", type: "landmark", rarity: "epic", description: "Biểu tượng hiện đại", credibility: 3, location: "Đà Nẵng", locationInfo: "Cầu phun lửa và nước độc đáo" },
    ba_na_hills: { name: "Bà Nà Hills", icon: "🎡", type: "landmark", rarity: "rare", description: "Khu du lịch độc đáo", credibility: 2, location: "Đà Nẵng", locationInfo: "Khu du lịch trên núi" },
    my_khe_beach: { name: "Biển Mỹ Khê", icon: "🏄", type: "landmark", rarity: "uncommon", description: "Một trong những bãi biển đẹp nhất", credibility: 4, location: "Đà Nẵng", locationInfo: "Một trong những bãi biển đẹp nhất thế giới" },

    // Ho Chi Minh City unique items
    independence_palace: { name: "Dinh Độc Lập", icon: "🏢", type: "landmark", rarity: "legendary", description: "Biểu tượng thống nhất đất nước", wisdom: 4, credibility: 4, location: "TP. Hồ Chí Minh", locationInfo: "Nơi giải phóng miền Nam" },
    ben_thanh_market: { name: "Chợ Bến Thành", icon: "🏪", type: "landmark", rarity: "rare", description: "Chợ lịch sử nổi tiếng", credibility: 2, location: "TP. Hồ Chí Minh", locationInfo: "Chợ lịch sử trăm năm" },
    cu_chi_tunnels: { name: "Địa đạo Củ Chi", icon: "🕳️", type: "landmark", rarity: "epic", description: "Công trình quân sự huyền thoại", wisdom: 4, patriotism: 3, location: "TP. Hồ Chí Minh", locationInfo: "Hệ thống địa đạo huyền thoại" },

    // Can Tho unique items
    can_tho_bridge: { name: "Cầu Cần Thơ", icon: "🌉", type: "landmark", rarity: "epic", description: "Cây cầu dây văng lớn nhất", credibility: 3, location: "Cần Thơ", locationInfo: "Cầu dây văng lớn nhất ĐBSCL" },
    cai_rang_floating_market: { name: "Chợ nổi Cái Răng", icon: "🛶", type: "landmark", rarity: "rare", description: "Chợ nổi nổi tiếng", credibility: 2, location: "Cần Thơ", locationInfo: "Chợ nổi lớn nhất miền Tây" },
    bang_lang_stork_garden: { name: "Vườn cò Bằng Lăng", icon: "🦅", type: "landmark", rarity: "uncommon", description: "Vườn cò đẹp nhất", wisdom: 3, location: "Cần Thơ", locationInfo: "Vườn cò đẹp nhất miền Tây" },

    // Additional provinces unique items (sample for all 63 provinces)
    dong_van_plateau: { name: "Cao nguyên Đồng Văn", icon: "⛰️", type: "landmark", rarity: "epic", description: "Công viên địa chất toàn cầu", wisdom: 8, credibility: 7 },
    ma_pi_leng_pass: { name: "Đèo Mã Pí Lèng", icon: "🛣️", type: "landmark", rarity: "rare", description: "Tứ đại đỉnh đèo", wisdom: 2 },
    lung_cu_flag_tower: { name: "Cột cờ Lũng Cú", icon: "🚩", type: "landmark", rarity: "legendary", description: "Cực Bắc Tổ quốc", wisdom: 4, patriotism: 22 },
    pac_bo_cave: { name: "Hang Pác Bó", icon: "🕳️", type: "landmark", rarity: "legendary", description: "Nơi Bác Hồ về nước", wisdom: 4, patriotism: 22 },
    ban_gioc_waterfall: { name: "Thác Bản Giốc", icon: "💧", type: "landmark", rarity: "epic", description: "Thác lớn nhất Đông Nam Á", wisdom: 3 },
    thang_hen_lake: { name: "Hồ Thang Hen", icon: "🏞️", type: "landmark", rarity: "rare", description: "Hồ trên núi đẹp", wisdom: 2 },
    ba_be_lake: { name: "Hồ Ba Bể", icon: "🏞️", type: "landmark", rarity: "legendary", description: "Di sản thiên nhiên", wisdom: 4, credibility: 3 },
    pac_ngoi_village: { name: "Bản Pác Ngòi", icon: "🏘️", type: "landmark", rarity: "uncommon", description: "Làng văn hóa", credibility: 2 },
    na_ri_mountain: { name: "Núi Na Rì", icon: "⛰️", type: "landmark", rarity: "rare", description: "Núi thiêng", wisdom: 2 },
    tan_trao_banyan: { name: "Cây đa Tân Trào", icon: "🌳", type: "landmark", rarity: "legendary", description: "Di tích lịch sử", wisdom: 4, patriotism: 22 },
    na_hang_lake: { name: "Hồ Na Hang", icon: "🏞️", type: "landmark", rarity: "epic", description: "Hồ đẹp", wisdom: 3 },
    my_lam_hot_spring: { name: "Suối khoáng Mỹ Lâm", icon: "♨️", type: "landmark", rarity: "uncommon", description: "Suối khoáng", credibility: 4 },
    sapa_town: { name: "Thị trấn Sa Pa", icon: "🏔️", type: "landmark", rarity: "epic", description: "Thị trấn trong mây", wisdom: 8, credibility: 3 },
    fansipan_peak: { name: "Đỉnh Fansipan", icon: "⛰️", type: "landmark", rarity: "legendary", description: "Nóc nhà Đông Dương", wisdom: 4, credibility: 22 },
    bac_ha_market: { name: "Chợ Bắc Hà", icon: "🏪", type: "landmark", rarity: "rare", description: "Chợ vùng cao", credibility: 2 },
    dien_bien_phu_battlefield: { name: "Điện Biên Phủ", icon: "🎖️", type: "landmark", rarity: "legendary", description: "Chiến thắng lịch sử", wisdom: 4, patriotism: 10 },
    a1_hill: { name: "Đồi A1", icon: "⛰️", type: "landmark", rarity: "epic", description: "Di tích chiến thắng", wisdom: 4, patriotism: 3 },
    pa_khoang_lake: { name: "Hồ Pá Khoang", icon: "🏞️", type: "landmark", rarity: "rare", description: "Hồ đẹp", wisdom: 2 },
    sin_ho_plateau: { name: "Cao nguyên Sìn Hồ", icon: "🌄", type: "landmark", rarity: "uncommon", description: "Cao nguyên", credibility: 2 },
    pu_sam_cap_cave: { name: "Hang Pú Sam Cáp", icon: "🕳️", type: "landmark", rarity: "rare", description: "Hang động", wisdom: 2 },
    nam_nhun_lake: { name: "Hồ Nậm Nhùn", icon: "🏞️", type: "landmark", rarity: "uncommon", description: "Hồ", credibility: 4 },
    son_la_prison: { name: "Nhà tù Sơn La", icon: "🏛️", type: "landmark", rarity: "epic", description: "Di tích lịch sử", wisdom: 4, patriotism: 3 },
    moc_chau_plateau: { name: "Cao nguyên Mộc Châu", icon: "🌄", type: "landmark", rarity: "epic", description: "Cao nguyên đẹp", wisdom: 3, credibility: 2 },
    yen_chau_mango: { name: "Xoài Yên Châu", icon: "🥭", type: "landmark", rarity: "uncommon", description: "Đặc sản", credibility: 4 },
    mu_cang_chai: { name: "Mù Cang Chải", icon: "🌾", type: "landmark", rarity: "epic", description: "Ruộng bậc thang", wisdom: 8, credibility: 3 },
    thac_ba_lake: { name: "Hồ Thác Bà", icon: "🏞️", type: "landmark", rarity: "rare", description: "Hồ thủy điện", wisdom: 2 },
    suoi_giang_tea: { name: "Chè Suối Giàng", icon: "🍵", type: "landmark", rarity: "rare", description: "Chè cổ thụ", wisdom: 3 },
    hoa_binh_hydropower: { name: "Thủy điện Hòa Bình", icon: "⚡", type: "landmark", rarity: "legendary", description: "Nhà máy thủy điện lớn", wisdom: 4, credibility: 22 },
    kim_boi_hot_spring: { name: "Suối khoáng Kim Bôi", icon: "♨️", type: "landmark", rarity: "uncommon", description: "Suối khoáng", credibility: 2 },
    muong_culture: { name: "Văn hóa Mường", icon: "🎭", type: "landmark", rarity: "rare", description: "Di sản văn hóa", wisdom: 2 },
    tan_cuong_tea: { name: "Chè Tân Cương", icon: "🍵", type: "landmark", rarity: "epic", description: "Chè ngon nhất", wisdom: 8, credibility: 3 },
    nui_coc_lake: { name: "Hồ Núi Cốc", icon: "🏞️", type: "landmark", rarity: "rare", description: "Hồ đẹp", wisdom: 2 },
    dinh_hoa_safe_zone: { name: "An toàn khu Định Hóa", icon: "🛡️", type: "landmark", rarity: "legendary", description: "Căn cứ cách mạng", wisdom: 4, patriotism: 22 },
    dong_dang_border: { name: "Cửa khẩu Đồng Đăng", icon: "🚪", type: "landmark", rarity: "epic", description: "Cửa ngõ biên giới", credibility: 3 },
    tam_thanh_cave: { name: "Động Tam Thanh", icon: "🕳️", type: "landmark", rarity: "rare", description: "Động đẹp", wisdom: 2 },
    ky_cung_temple: { name: "Đền Kỳ Cùng", icon: "🛕", type: "landmark", rarity: "uncommon", description: "Đền cổ", credibility: 2 },
    ha_long_bay: { name: "Vịnh Hạ Long", icon: "🏝️", type: "landmark", rarity: "legendary", description: "Di sản thế giới", wisdom: 4, credibility: 4 },
    yen_tu_mountain: { name: "Núi Yên Tử", icon: "⛰️", type: "landmark", rarity: "epic", description: "Núi thiêng", wisdom: 4, credibility: 3 },
    bai_chay_beach: { name: "Bãi Cháy", icon: "🏖️", type: "landmark", rarity: "rare", description: "Bãi biển", credibility: 2 },
    yen_the_district: { name: "Yên Thế", icon: "🏛️", type: "landmark", rarity: "epic", description: "Di tích lịch sử", wisdom: 8, patriotism: 3 },
    khe_ro_festival: { name: "Lễ hội Khe Rỗ", icon: "🎉", type: "landmark", rarity: "rare", description: "Lễ hội dân gian", credibility: 2 },
    tho_ha_village: { name: "Làng Thổ Hà", icon: "🏘️", type: "landmark", rarity: "uncommon", description: "Làng cổ", credibility: 2 },
    hung_temple: { name: "Đền Hùng", icon: "👑", type: "landmark", rarity: "legendary", description: "Đất Tổ", wisdom: 4, patriotism: 10 },
    xuan_son_national_park: { name: "Vườn quốc gia Xuân Sơn", icon: "🌲", type: "landmark", rarity: "epic", description: "Vườn quốc gia", wisdom: 20 },
    ao_chau_lake: { name: "Hồ Ao Châu", icon: "🏞️", type: "landmark", rarity: "rare", description: "Hồ", wisdom: 2 },
    tam_dao_mountain: { name: "Tam Đảo", icon: "⛰️", type: "landmark", rarity: "epic", description: "Khu nghỉ dưỡng", wisdom: 8, credibility: 3 },
    dai_lai_lake: { name: "Hồ Đại Lải", icon: "🏞️", type: "landmark", rarity: "rare", description: "Hồ", wisdom: 2 },
    tay_thien_temple: { name: "Chùa Tây Thiên", icon: "🛕", type: "landmark", rarity: "epic", description: "Chùa cổ", wisdom: 20 },
    dinh_bang_village: { name: "Làng Đình Bảng", icon: "🏘️", type: "landmark", rarity: "epic", description: "Làng quan họ", wisdom: 8, credibility: 3 },
    but_thap_temple: { name: "Chùa Bút Tháp", icon: "🛕", type: "landmark", rarity: "rare", description: "Chùa cổ", wisdom: 3 },
    lim_festival: { name: "Lễ hội Lim", icon: "🎵", type: "landmark", rarity: "epic", description: "Lễ hội quan họ", wisdom: 8, credibility: 3 },
    con_son_temple: { name: "Côn Sơn", icon: "🛕", type: "landmark", rarity: "epic", description: "Di tích lịch sử", wisdom: 4, credibility: 3 },
    kiep_bac_temple: { name: "Kiếp Bạc", icon: "🛕", type: "landmark", rarity: "epic", description: "Đền thờ", wisdom: 20 },
    chi_linh_mountain: { name: "Núi Chí Linh", icon: "⛰️", type: "landmark", rarity: "rare", description: "Núi", wisdom: 2 },
    pho_hien_ancient_town: { name: "Phố Hiến", icon: "🏛️", type: "landmark", rarity: "epic", description: "Phố cổ", wisdom: 8, credibility: 3 },
    chu_dong_tu_temple: { name: "Đền Chử Đồng Tử", icon: "🛕", type: "landmark", rarity: "epic", description: "Đền cổ", wisdom: 20 },
    hong_van_temple: { name: "Đền Hồng Vân", icon: "🛕", type: "landmark", rarity: "rare", description: "Đền", wisdom: 2 },
    tam_chuc_temple: { name: "Chùa Tam Chúc", icon: "🛕", type: "landmark", rarity: "legendary", description: "Chùa lớn nhất", wisdom: 4, credibility: 22 },
    ba_danh_temple: { name: "Chùa Bà Đanh", icon: "🛕", type: "landmark", rarity: "rare", description: "Chùa", wisdom: 2 },
    kenh_gia_canal: { name: "Kênh Gia", icon: "🚣", type: "landmark", rarity: "uncommon", description: "Kênh", credibility: 4 },
    phu_day_temple: { name: "Phủ Dầy", icon: "🛕", type: "landmark", rarity: "epic", description: "Di tích tín ngưỡng", wisdom: 4, credibility: 3 },
    tran_temple: { name: "Đền Trần", icon: "🛕", type: "landmark", rarity: "epic", description: "Đền thờ", wisdom: 8, credibility: 3 },
    co_le_temple: { name: "Chùa Cổ Lễ", icon: "🛕", type: "landmark", rarity: "rare", description: "Chùa", wisdom: 2 },
    dong_xam_silver_village: { name: "Làng Đồng Xâm", icon: "🏘️", type: "landmark", rarity: "epic", description: "Làng nghề", wisdom: 3, credibility: 2 },
    keo_pagoda: { name: "Chùa Keo", icon: "🛕", type: "landmark", rarity: "epic", description: "Chùa cổ", wisdom: 20 },
    bach_thuan_beach: { name: "Bãi biển Bạch Thuận", icon: "🏖️", type: "landmark", rarity: "uncommon", description: "Bãi biển", credibility: 4 },
    trang_an_complex: { name: "Quần thể Tràng An", icon: "🏔️", type: "landmark", rarity: "legendary", description: "Di sản thế giới", wisdom: 4, credibility: 4 },
    bai_dinh_temple: { name: "Chùa Bái Đính", icon: "🛕", type: "landmark", rarity: "legendary", description: "Chùa lớn nhất", wisdom: 4, credibility: 22 },
    cuc_phuong_national_park: { name: "Vườn quốc gia Cúc Phương", icon: "🌲", type: "landmark", rarity: "epic", description: "Vườn quốc gia", wisdom: 4 },
    ho_citadel: { name: "Thành Nhà Hồ", icon: "🏰", type: "landmark", rarity: "legendary", description: "Di sản thế giới", wisdom: 4, credibility: 22 },
    sam_son_beach: { name: "Bãi biển Sầm Sơn", icon: "🏖️", type: "landmark", rarity: "epic", description: "Bãi biển đẹp", credibility: 3 },
    ben_en_national_park: { name: "Vườn quốc gia Bến En", icon: "🌲", type: "landmark", rarity: "rare", description: "Vườn quốc gia", wisdom: 3 },
    nguyen_du_temple: { name: "Đền Nguyễn Du", icon: "🛕", type: "landmark", rarity: "epic", description: "Di tích văn học", wisdom: 4, credibility: 3 },
    thien_cam_beach: { name: "Bãi biển Thiên Cầm", icon: "🏖️", type: "landmark", rarity: "rare", description: "Bãi biển", credibility: 2 },
    vu_quang_national_park: { name: "Vườn quốc gia Vũ Quang", icon: "🌲", type: "landmark", rarity: "epic", description: "Vườn quốc gia", wisdom: 20 },
    son_doong_cave: { name: "Hang Sơn Đoòng", icon: "🕳️", type: "landmark", rarity: "legendary", description: "Hang lớn nhất thế giới", wisdom: 4, credibility: 4 },
    phong_nha_cave: { name: "Động Phong Nha", icon: "🕳️", type: "landmark", rarity: "legendary", description: "Di sản thế giới", wisdom: 4, credibility: 22 },
    nhat_le_beach: { name: "Bãi biển Nhật Lệ", icon: "🏖️", type: "landmark", rarity: "epic", description: "Bãi biển đẹp", credibility: 3 },
    dmz_zone: { name: "Vĩ tuyến 17", icon: "🚧", type: "landmark", rarity: "legendary", description: "Vùng phi quân sự", wisdom: 4, patriotism: 22 },
    la_vang_basilica: { name: "Đức Mẹ La Vang", icon: "⛪", type: "landmark", rarity: "epic", description: "Thánh địa", wisdom: 4, credibility: 3 },
    cua_tung_beach: { name: "Bãi biển Cửa Tùng", icon: "🏖️", type: "landmark", rarity: "rare", description: "Bãi biển", credibility: 2 },
    hoi_an_ancient_town: { name: "Hội An", icon: "🏛️", type: "landmark", rarity: "legendary", description: "Di sản thế giới", wisdom: 4, credibility: 4 },
    my_son_sanctuary: { name: "Mỹ Sơn", icon: "🏛️", type: "landmark", rarity: "legendary", description: "Di sản thế giới", wisdom: 4, credibility: 22 },
    cham_islands: { name: "Cù Lao Chàm", icon: "🏝️", type: "landmark", rarity: "epic", description: "Đảo đẹp", wisdom: 8, credibility: 3 },
    ba_to_memorial: { name: "Tượng đài Ba Tơ", icon: "🎖️", type: "landmark", rarity: "epic", description: "Di tích lịch sử", wisdom: 4, patriotism: 3 },
    ly_son_island: { name: "Đảo Lý Sơn", icon: "🏝️", type: "landmark", rarity: "epic", description: "Đảo đẹp", wisdom: 8, credibility: 3 },
    sa_huynh_beach: { name: "Bãi biển Sa Huỳnh", icon: "🏖️", type: "landmark", rarity: "rare", description: "Bãi biển", credibility: 2 },
    banh_it_tower: { name: "Tháp Bánh Ít", icon: "🏛️", type: "landmark", rarity: "epic", description: "Tháp Chăm", wisdom: 8, credibility: 3 },
    quy_nhon_beach: { name: "Bãi biển Quy Nhơn", icon: "🏖️", type: "landmark", rarity: "epic", description: "Bãi biển đẹp", credibility: 3 },
    tay_son_museum: { name: "Bảo tàng Tây Sơn", icon: "🏛️", type: "landmark", rarity: "epic", description: "Di tích lịch sử", wisdom: 4, credibility: 3 },
    ganh_da_dia: { name: "Gành Đá Đĩa", icon: "🌊", type: "landmark", rarity: "legendary", description: "Kỳ quan thiên nhiên", wisdom: 4, credibility: 22 },
    vung_ro_bay: { name: "Vịnh Vũng Rô", icon: "🌊", type: "landmark", rarity: "epic", description: "Vịnh đẹp", wisdom: 8, credibility: 3 },
    xuan_dai_bay: { name: "Vịnh Xuân Đài", icon: "🌊", type: "landmark", rarity: "epic", description: "Vịnh", wisdom: 3 },
    nha_trang_beach: { name: "Bãi biển Nha Trang", icon: "🏖️", type: "landmark", rarity: "legendary", description: "Thành phố biển", wisdom: 4, credibility: 22 },
    vinpearl_land: { name: "Vinpearl Land", icon: "🎡", type: "landmark", rarity: "epic", description: "Khu vui chơi", credibility: 3 },
    hon_chong_promontory: { name: "Hòn Chồng", icon: "⛰️", type: "landmark", rarity: "epic", description: "Địa danh", wisdom: 3 },
    ca_na_beach: { name: "Bãi biển Cà Ná", icon: "🏖️", type: "landmark", rarity: "rare", description: "Bãi biển", credibility: 2 },
    po_klong_garai_tower: { name: "Tháp Pô Klông Garai", icon: "🏛️", type: "landmark", rarity: "epic", description: "Tháp Chăm", wisdom: 8, credibility: 3 },
    vinh_hy_bay: { name: "Vịnh Vĩnh Hy", icon: "🌊", type: "landmark", rarity: "epic", description: "Vịnh", wisdom: 3 },
    mui_ne_beach: { name: "Bãi biển Mũi Né", icon: "🏄", type: "landmark", rarity: "legendary", description: "Thiên đường lướt sóng", wisdom: 4, credibility: 22 },
    fairy_stream: { name: "Suối Tiên", icon: "💧", type: "landmark", rarity: "epic", description: "Suối đẹp", wisdom: 20 },
    ta_cu_mountain: { name: "Núi Tà Cú", icon: "⛰️", type: "landmark", rarity: "epic", description: "Núi", wisdom: 3 },
    kon_klor_suspension_bridge: { name: "Cầu treo Kon Klor", icon: "🌉", type: "landmark", rarity: "epic", description: "Cầu treo đẹp", credibility: 3 },
    mang_den_ecotourism: { name: "Măng Đen", icon: "🌲", type: "landmark", rarity: "epic", description: "Du lịch sinh thái", wisdom: 20 },
    pleiku_plateau: { name: "Cao nguyên Pleiku", icon: "🌄", type: "landmark", rarity: "rare", description: "Cao nguyên", wisdom: 2 },
    bien_ho_lake: { name: "Hồ Biển Hồ", icon: "🏞️", type: "landmark", rarity: "epic", description: "Hồ đẹp", wisdom: 8, credibility: 3 },
    pleiku_city: { name: "Thành phố Pleiku", icon: "🏙️", type: "landmark", rarity: "rare", description: "Thành phố", credibility: 2 },
    ya_ly_hydropower: { name: "Thủy điện Yaly", icon: "⚡", type: "landmark", rarity: "epic", description: "Thủy điện", wisdom: 20 },
    lak_lake: { name: "Hồ Lắk", icon: "🏞️", type: "landmark", rarity: "epic", description: "Hồ đẹp", wisdom: 8, credibility: 3 },
    buon_ma_thuot_coffee: { name: "Cà phê Buôn Ma Thuột", icon: "☕", type: "landmark", rarity: "legendary", description: "Thủ phủ cà phê", wisdom: 4, credibility: 22 },
    yok_don_national_park: { name: "Vườn quốc gia Yok Đôn", icon: "🌲", type: "landmark", rarity: "epic", description: "Vườn quốc gia", wisdom: 4 },
    dray_sap_waterfall: { name: "Thác Dray Sáp", icon: "💧", type: "landmark", rarity: "epic", description: "Thác hùng vĩ", wisdom: 8, credibility: 3 },
    ta_dung_lake: { name: "Hồ Tà Đùng", icon: "🏞️", type: "landmark", rarity: "epic", description: "Hồ", wisdom: 3 },
    nam_nung_volcano: { name: "Núi lửa Nam Nung", icon: "🌋", type: "landmark", rarity: "rare", description: "Núi lửa", wisdom: 2 },
    da_lat_city: { name: "Thành phố Đà Lạt", icon: "🌸", type: "landmark", rarity: "legendary", description: "Thành phố ngàn hoa", wisdom: 4, credibility: 4 },
    lang_biang_mountain: { name: "Núi Lang Biang", icon: "⛰️", type: "landmark", rarity: "epic", description: "Núi", wisdom: 4 },
    xuan_huong_lake: { name: "Hồ Xuân Hương", icon: "🏞️", type: "landmark", rarity: "epic", description: "Hồ", wisdom: 8, credibility: 3 },
    bu_gia_map_national_park: { name: "Vườn quốc gia Bù Gia Mập", icon: "🌲", type: "landmark", rarity: "epic", description: "Vườn quốc gia", wisdom: 20 },
    soc_bom_bo_memorial: { name: "Tượng đài Sóc Bom Bo", icon: "🎖️", type: "landmark", rarity: "epic", description: "Di tích", wisdom: 8, patriotism: 3 },
    cao_su_plantation: { name: "Đồn điền cao su", icon: "🌳", type: "landmark", rarity: "rare", description: "Đồn điền", wisdom: 2 },
    cao_dai_temple: { name: "Tòa Thánh Cao Đài", icon: "🕌", type: "landmark", rarity: "legendary", description: "Thánh địa", wisdom: 4, credibility: 22 },
    ba_den_mountain: { name: "Núi Bà Đen", icon: "⛰️", type: "landmark", rarity: "epic", description: "Núi thiêng", wisdom: 4 },
    dau_tieng_lake: { name: "Hồ Dầu Tiếng", icon: "🏞️", type: "landmark", rarity: "epic", description: "Hồ lớn", wisdom: 20 },
    lai_thieu_fruit_garden: { name: "Vườn trái cây Lái Thiêu", icon: "🍇", type: "landmark", rarity: "epic", description: "Vườn trái cây", wisdom: 3, credibility: 2 },
    industrial_zone: { name: "Khu công nghiệp", icon: "🏭", type: "landmark", rarity: "epic", description: "Khu công nghiệp", credibility: 3 },
    cat_tien_national_park: { name: "Vườn quốc gia Cát Tiên", icon: "🌲", type: "landmark", rarity: "legendary", description: "Di sản thế giới", wisdom: 4, credibility: 22 },
    tri_an_hydropower: { name: "Thủy điện Trị An", icon: "⚡", type: "landmark", rarity: "epic", description: "Thủy điện", wisdom: 20 },
    long_khanh_fruit: { name: "Trái cây Long Khánh", icon: "🍊", type: "landmark", rarity: "rare", description: "Đặc sản", credibility: 2 },
    vung_tau_beach: { name: "Bãi biển Vũng Tàu", icon: "🏖️", type: "landmark", rarity: "epic", description: "Bãi biển", credibility: 3 },
    con_dao_island: { name: "Côn Đảo", icon: "🏝️", type: "landmark", rarity: "legendary", description: "Di tích lịch sử", wisdom: 4, patriotism: 22 },
    long_son_pagoda: { name: "Chùa Long Sơn", icon: "🛕", type: "landmark", rarity: "epic", description: "Chùa", wisdom: 20 },
    tan_lap_floating_village: { name: "Làng nổi Tân Lập", icon: "🛶", type: "landmark", rarity: "epic", description: "Làng nổi", wisdom: 8, credibility: 3 },
    lang_sen_wetland: { name: "Láng Sen", icon: "🦢", type: "landmark", rarity: "epic", description: "Khu bảo tồn", wisdom: 20 },
    cai_be_floating_market: { name: "Chợ nổi Cái Bè", icon: "🛶", type: "landmark", rarity: "epic", description: "Chợ nổi", wisdom: 8, credibility: 3 },
    dong_tam_snake_farm: { name: "Trại rắn Đồng Tâm", icon: "🐍", type: "landmark", rarity: "rare", description: "Trại rắn", wisdom: 2 },
    go_cong_beach: { name: "Bãi biển Gò Công", icon: "🏖️", type: "landmark", rarity: "uncommon", description: "Bãi biển", credibility: 4 },
    coconut_kingdom: { name: "Xứ dừa", icon: "🥥", type: "landmark", rarity: "epic", description: "Vương quốc dừa", wisdom: 8, credibility: 3 },
    con_phung_island: { name: "Cồn Phụng", icon: "🏝️", type: "landmark", rarity: "epic", description: "Đảo", wisdom: 3 },
    dong_khoi_movement: { name: "Đồng Khởi", icon: "🎖️", type: "landmark", rarity: "legendary", description: "Phong trào cách mạng", wisdom: 4, patriotism: 22 },
    ang_pagoda: { name: "Chùa Ang", icon: "🛕", type: "landmark", rarity: "epic", description: "Chùa Khmer", wisdom: 8, credibility: 3 },
    ba_om_pond: { name: "Ao Bà Om", icon: "🏞️", type: "landmark", rarity: "epic", description: "Ao", wisdom: 3 },
    co_chien_river: { name: "Sông Cổ Chiên", icon: "🛶", type: "landmark", rarity: "rare", description: "Sông", credibility: 2 },
    an_binh_island: { name: "Cù lao An Bình", icon: "🏝️", type: "landmark", rarity: "epic", description: "Cù lao", wisdom: 8, credibility: 3 },
    mang_thit_river: { name: "Sông Măng Thít", icon: "🛶", type: "landmark", rarity: "rare", description: "Sông", credibility: 2 },
    long_ho_garden: { name: "Vườn Long Hồ", icon: "🌳", type: "landmark", rarity: "uncommon", description: "Vườn", credibility: 2 },
    tram_chim_national_park: { name: "Vườn quốc gia Tràm Chim", icon: "🦢", type: "landmark", rarity: "legendary", description: "Vườn quốc gia", wisdom: 4, credibility: 22 },
    sen_pond: { name: "Đầm sen", icon: "🪷", type: "landmark", rarity: "epic", description: "Đầm sen", wisdom: 8, credibility: 3 },
    gao_giong_ecotourism: { name: "Gáo Giồng", icon: "🦢", type: "landmark", rarity: "epic", description: "Du lịch sinh thái", wisdom: 20 },
    sam_mountain: { name: "Núi Sam", icon: "⛰️", type: "landmark", rarity: "legendary", description: "Núi thiêng", wisdom: 4, credibility: 22 },
    ba_chua_xu_temple: { name: "Miếu Bà Chúa Xứ", icon: "🛕", type: "landmark", rarity: "legendary", description: "Di tích tôn giáo", wisdom: 4, credibility: 22 },
    tra_su_forest: { name: "Rừng Trà Sư", icon: "🌲", type: "landmark", rarity: "epic", description: "Rừng tràm", wisdom: 4 },
    phu_quoc_island: { name: "Đảo Phú Quốc", icon: "🏝️", type: "landmark", rarity: "legendary", description: "Đảo ngọc", wisdom: 4, credibility: 4 },
    ha_tien_beach: { name: "Bãi biển Hà Tiên", icon: "🏖️", type: "landmark", rarity: "epic", description: "Bãi biển", credibility: 3 },
    u_minh_thuong_national_park: { name: "Vườn quốc gia U Minh Thượng", icon: "🌲", type: "landmark", rarity: "epic", description: "Vườn quốc gia", wisdom: 4 },
    ca_mau_cape: { name: "Mũi Cà Mau", icon: "🗺️", type: "landmark", rarity: "legendary", description: "Cực Nam Tổ quốc", wisdom: 4, patriotism: 10 },
    u_minh_ha_forest: { name: "Rừng U Minh Hạ", icon: "🌲", type: "landmark", rarity: "epic", description: "Rừng tràm", wisdom: 4 },
    ngoc_hien_mangrove: { name: "Rừng ngập mặn Ngọc Hiển", icon: "🌊", type: "landmark", rarity: "epic", description: "Rừng ngập mặn", wisdom: 20 },
    bac_lieu_wind_power: { name: "Điện gió Bạc Liêu", icon: "💨", type: "landmark", rarity: "epic", description: "Điện gió", wisdom: 20 },
    cong_tu_bac_lieu: { name: "Công tử Bạc Liêu", icon: "🎭", type: "landmark", rarity: "epic", description: "Di tích văn hóa", wisdom: 8, credibility: 3 },
    nha_mat_beach: { name: "Bãi biển Nhà Mát", icon: "🏖️", type: "landmark", rarity: "rare", description: "Bãi biển", credibility: 2 },
    clay_pagoda: { name: "Chùa Đất", icon: "🛕", type: "landmark", rarity: "epic", description: "Chùa Khmer", wisdom: 4, credibility: 3 },
    khleang_pagoda: { name: "Chùa Khleang", icon: "🛕", type: "landmark", rarity: "epic", description: "Chùa Khmer", wisdom: 20 },
    my_phuoc_island: { name: "Cù lao Mỹ Phước", icon: "🏝️", type: "landmark", rarity: "rare", description: "Cù lao", wisdom: 2 },
    phung_hiep_floating_market: { name: "Chợ nổi Phụng Hiệp", icon: "🛶", type: "landmark", rarity: "epic", description: "Chợ nổi", wisdom: 8, credibility: 3 },
    lung_ngoc_hoang: { name: "Láng Ngọc Hoàng", icon: "🦢", type: "landmark", rarity: "epic", description: "Khu bảo tồn", wisdom: 20 },
    vi_thanh_city: { name: "Thành phố Vị Thanh", icon: "🏙️", type: "landmark", rarity: "rare", description: "Thành phố", credibility: 2 },

    // Crafted argument tools
    // Argument Tools - Specific book recipes
    thesis_paper: { name: "Luận án", icon: "📋", type: "argument", rarity: "uncommon", description: "Lập luận có cơ sở", persuasion: 6, recipe: { history_book: 1, philosophy_book: 1, research_paper: 1 } },
    evidence_folder: { name: "Hồ sơ chứng cứ", icon: "📁", type: "argument", rarity: "rare", description: "Bằng chứng thuyết phục", persuasion: 10, recipe: { politics_book: 2, research_paper: 1, documentary: 1 } },
    dialectical_framework: { name: "Khung phân tích biện chứng", icon: "🔍", type: "argument", rarity: "epic", description: "Phương pháp luận mạnh mẽ", persuasion: 16, recipe: { philosophy_book: 2, politics_book: 2, research_paper: 2 } },
    revolutionary_thesis: { name: "Luận điểm cách mạng", icon: "🔥", type: "argument", rarity: "rare", description: "Lập luận về cách mạng", persuasion: 11, recipe: { history_book: 2, politics_book: 1, research_paper: 1 } },
    historical_evidence: { name: "Chứng cứ lịch sử", icon: "📜", type: "argument", rarity: "uncommon", description: "Bằng chứng từ lịch sử", persuasion: 7, recipe: { history_book: 2, documentary: 1 } },
    philosophical_analysis: { name: "Phân tích triết học", icon: "🧠", type: "argument", rarity: "epic", description: "Phân tích sâu sắc", persuasion: 18, recipe: { philosophy_book: 3, research_paper: 2, interview_record: 1 } },
    economic_argument: { name: "Lập luận kinh tế", icon: "💰", type: "argument", rarity: "rare", description: "Phân tích kinh tế", persuasion: 12, recipe: { economics_book: 2, politics_book: 1, research_paper: 1 } },
    cultural_perspective: { name: "Góc nhìn văn hóa", icon: "🎭", type: "argument", rarity: "uncommon", description: "Lập luận từ văn hóa", persuasion: 8, recipe: { culture_book: 2, history_book: 1 } },
    social_analysis: { name: "Phân tích xã hội", icon: "👥", type: "argument", rarity: "uncommon", description: "Lập luận từ xã hội", persuasion: 7, recipe: { society_book: 2, culture_book: 1 } },
    geographic_context: { name: "Bối cảnh địa lý", icon: "🌏", type: "argument", rarity: "uncommon", description: "Lập luận từ địa lý", persuasion: 7, recipe: { geography_book: 2, history_book: 1 } },
    environmental_argument: { name: "Lập luận môi trường", icon: "🌱", type: "argument", rarity: "uncommon", description: "Lập luận về môi trường", persuasion: 7, recipe: { environment_book: 2, geography_book: 1 } },
    agricultural_insight: { name: "Góc nhìn nông nghiệp", icon: "🚜", type: "argument", rarity: "uncommon", description: "Lập luận từ nông nghiệp", persuasion: 6, recipe: { agriculture_book: 2, economics_book: 1 } },
    technological_advancement: { name: "Tiến bộ công nghệ", icon: "🔬", type: "argument", rarity: "rare", description: "Lập luận về công nghệ", persuasion: 10, recipe: { technology_book: 2, economics_book: 1, research_paper: 1 } },
    labor_perspective: { name: "Góc nhìn lao động", icon: "⚒️", type: "argument", rarity: "uncommon", description: "Lập luận từ lao động", persuasion: 7, recipe: { labor_book: 2, society_book: 1 } },
    development_framework: { name: "Khung phát triển", icon: "📊", type: "argument", rarity: "rare", description: "Lập luận về phát triển", persuasion: 11, recipe: { development_book: 2, economics_book: 1, research_paper: 1 } },
    military_strategy: { name: "Chiến lược quân sự", icon: "🎯", type: "argument", rarity: "rare", description: "Lập luận quân sự", persuasion: 12, recipe: { military_book: 2, history_book: 1, research_paper: 1 } },
    artistic_expression: { name: "Biểu đạt nghệ thuật", icon: "🎨", type: "argument", rarity: "uncommon", description: "Lập luận từ nghệ thuật", persuasion: 7, recipe: { arts_book: 2, culture_book: 1 } },
    educational_foundation: { name: "Nền tảng giáo dục", icon: "🎓", type: "argument", rarity: "rare", description: "Lập luận về giáo dục", persuasion: 10, recipe: { education_book: 2, philosophy_book: 1, research_paper: 1 } },
    ethical_framework: { name: "Khung đạo đức", icon: "⚖️", type: "argument", rarity: "rare", description: "Lập luận đạo đức", persuasion: 10, recipe: { ethics_book: 2, philosophy_book: 1, research_paper: 1 } },
    comprehensive_theory: { name: "Lý thuyết tổng hợp", icon: "📚", type: "argument", rarity: "legendary", description: "Lý thuyết hoàn chỉnh", persuasion: 24, recipe: { philosophy_book: 2, politics_book: 2, economics_book: 1, history_book: 1, research_paper: 2, evidence_folder: 1 } },
    strategic_analysis: { name: "Phân tích chiến lược", icon: "⚔️", type: "argument", rarity: "epic", description: "Phân tích chiến lược", persuasion: 20, recipe: { politics_book: 2, history_book: 2, research_paper: 2, thesis_paper: 1 } },

    // Defense Tools - Specific book recipes
    rhetorical_strategy: { name: "Chiến lược hùng biện", icon: "🎯", type: "defense", rarity: "uncommon", description: "Phòng thủ lập luận", resilience: 5, recipe: { culture_book: 1, politics_book: 1 } },
    critical_thinking: { name: "Tư duy phản biện", icon: "💭", type: "defense", rarity: "rare", description: "Phân tích sắc bén", resilience: 8, recipe: { philosophy_book: 2, economics_book: 1, research_paper: 1 } },
    ideological_foundation: { name: "Nền tảng tư tưởng", icon: "🏛️", type: "defense", rarity: "epic", description: "Căn cứ vững chắc", resilience: 14, recipe: { politics_book: 2, history_book: 2, evidence_folder: 1 } },
    logical_shield: { name: "Khiên logic", icon: "🛡️", type: "defense", rarity: "uncommon", description: "Bảo vệ bằng logic", resilience: 6, recipe: { philosophy_book: 2, research_paper: 1 } },
    historical_grounding: { name: "Căn cứ lịch sử", icon: "🏺", type: "defense", rarity: "rare", description: "Bảo vệ bằng lịch sử", resilience: 9, recipe: { history_book: 2, documentary: 1 } },
    cultural_resilience: { name: "Kiên định văn hóa", icon: "🎨", type: "defense", rarity: "uncommon", description: "Bảo vệ từ văn hóa", resilience: 6, recipe: { culture_book: 2, history_book: 1 } },
    social_shield: { name: "Khiên xã hội", icon: "🛡️", type: "defense", rarity: "uncommon", description: "Bảo vệ từ xã hội", resilience: 6, recipe: { society_book: 2, culture_book: 1 } },
    geographic_grounding: { name: "Căn cứ địa lý", icon: "🗺️", type: "defense", rarity: "uncommon", description: "Bảo vệ bằng địa lý", resilience: 5, recipe: { geography_book: 2, history_book: 1 } },
    environmental_protection: { name: "Bảo vệ môi trường", icon: "🌿", type: "defense", rarity: "uncommon", description: "Bảo vệ từ môi trường", resilience: 6, recipe: { environment_book: 2, geography_book: 1 } },
    agricultural_stability: { name: "Ổn định nông nghiệp", icon: "🌾", type: "defense", rarity: "uncommon", description: "Bảo vệ từ nông nghiệp", resilience: 6, recipe: { agriculture_book: 2, economics_book: 1 } },
    technological_barrier: { name: "Rào cản công nghệ", icon: "🔒", type: "defense", rarity: "rare", description: "Bảo vệ bằng công nghệ", resilience: 8, recipe: { technology_book: 2, research_paper: 1 } },
    labor_solidarity: { name: "Đoàn kết lao động", icon: "🤝", type: "defense", rarity: "uncommon", description: "Bảo vệ từ lao động", resilience: 6, recipe: { labor_book: 2, society_book: 1 } },
    development_fortress: { name: "Pháo đài phát triển", icon: "🏗️", type: "defense", rarity: "rare", description: "Bảo vệ bằng phát triển", resilience: 9, recipe: { development_book: 2, economics_book: 1, research_paper: 1 } },
    military_discipline: { name: "Kỷ luật quân sự", icon: "⚔️", type: "defense", rarity: "rare", description: "Bảo vệ bằng quân sự", resilience: 10, recipe: { military_book: 2, history_book: 1, research_paper: 1 } },
    artistic_inspiration: { name: "Cảm hứng nghệ thuật", icon: "🎭", type: "defense", rarity: "uncommon", description: "Bảo vệ từ nghệ thuật", resilience: 6, recipe: { arts_book: 2, culture_book: 1 } },
    educational_wisdom: { name: "Trí tuệ giáo dục", icon: "📚", type: "defense", rarity: "rare", description: "Bảo vệ bằng giáo dục", resilience: 9, recipe: { education_book: 2, philosophy_book: 1, research_paper: 1 } },
    ethical_guard: { name: "Bảo vệ đạo đức", icon: "✨", type: "defense", rarity: "rare", description: "Bảo vệ bằng đạo đức", resilience: 10, recipe: { ethics_book: 2, philosophy_book: 1, research_paper: 1 } },
    economic_justification: { name: "Biện minh kinh tế", icon: "💼", type: "defense", rarity: "rare", description: "Bảo vệ bằng kinh tế", resilience: 10, recipe: { economics_book: 2, politics_book: 1, research_paper: 1 } },
    unshakeable_belief: { name: "Niềm tin vững chắc", icon: "💎", type: "defense", rarity: "epic", description: "Niềm tin không lay chuyển", resilience: 17, recipe: { philosophy_book: 2, politics_book: 2, history_book: 1, ideological_foundation: 1 } },
    comprehensive_defense: { name: "Phòng thủ toàn diện", icon: "🏰", type: "defense", rarity: "legendary", description: "Phòng thủ hoàn hảo", resilience: 22, recipe: { politics_book: 2, history_book: 2, philosophy_book: 1, economics_book: 1, critical_thinking: 1, ideological_foundation: 1 } },

    // Consumables - Specific book recipes
    coffee: { name: "Cà phê", icon: "☕", type: "consumable", rarity: "common", description: "Tăng sự tập trung", focusBoost: 10, duration: 2, recipe: { culture_book: 1 } },
    green_tea: { name: "Trà xanh", icon: "🍵", type: "consumable", rarity: "common", description: "Thanh tĩnh tâm trí", clarityBoost: 10, duration: 2, recipe: { culture_book: 1 } },
    inspiration: { name: "Cảm hứng", icon: "✨", type: "consumable", rarity: "rare", description: "Tăng khả năng thuyết phục", persuasionBoost: 20, duration: 1, recipe: { philosophy_book: 1, documentary: 1 } },
    confidence: { name: "Tự tin", icon: "💪", type: "consumable", rarity: "rare", description: "Tăng sức đề kháng lập luận", resilienceBoost: 15, duration: 1, recipe: { politics_book: 1, thesis_paper: 1 } },
    wisdom_elixir: { name: "Thuốc trí tuệ", icon: "🧪", type: "consumable", rarity: "uncommon", description: "Tăng trí tuệ tạm thời", focusBoost: 15, clarityBoost: 15, duration: 2, recipe: { philosophy_book: 1, research_paper: 1 } },
    revolutionary_spirit: { name: "Tinh thần cách mạng", icon: "🔥", type: "consumable", rarity: "epic", description: "Tăng thuyết phục mạnh", persuasionBoost: 35, duration: 1, recipe: { history_book: 2, politics_book: 1, research_paper: 1 } },
    mental_fortitude: { name: "Sức mạnh tinh thần", icon: "💎", type: "consumable", rarity: "epic", description: "Tăng kiên định mạnh", resilienceBoost: 30, duration: 1, recipe: { philosophy_book: 2, evidence_folder: 1 } },
    clarity_potion: { name: "Thuốc minh mẫn", icon: "💧", type: "consumable", rarity: "uncommon", description: "Tăng tập trung và minh mẫn", focusBoost: 20, clarityBoost: 20, duration: 2, recipe: { culture_book: 1, research_paper: 1 } },
    debate_energy: { name: "Năng lượng tranh luận", icon: "⚡", type: "consumable", rarity: "rare", description: "Tăng cả thuyết phục và kiên định", persuasionBoost: 18, resilienceBoost: 18, duration: 1, recipe: { politics_book: 1, philosophy_book: 1, research_paper: 1 } },
    perfect_preparation: { name: "Chuẩn bị hoàn hảo", icon: "🌟", type: "consumable", rarity: "legendary", description: "Tăng tất cả chỉ số", persuasionBoost: 40, resilienceBoost: 35, focusBoost: 25, clarityBoost: 25, duration: 2, recipe: { philosophy_book: 2, politics_book: 1, history_book: 1, economics_book: 1, research_paper: 2, evidence_folder: 1 } },
    quick_wit: { name: "Trí tuệ nhanh nhạy", icon: "🧠", type: "consumable", rarity: "uncommon", description: "Tăng thuyết phục nhanh", persuasionBoost: 12, duration: 1, recipe: { philosophy_book: 1, research_paper: 1 } },
    steady_mind: { name: "Tâm trí vững vàng", icon: "🧘", type: "consumable", rarity: "uncommon", description: "Tăng kiên định", resilienceBoost: 12, duration: 1, recipe: { culture_book: 1, philosophy_book: 1 } },
    tourism_boost: { name: "Tăng cường du lịch", icon: "✈️", type: "consumable", rarity: "common", description: "Tăng tập trung", focusBoost: 8, duration: 2, recipe: { tourism_book: 1 } },
    energy_drink: { name: "Nước tăng lực", icon: "⚡", type: "consumable", rarity: "uncommon", description: "Tăng năng lượng", focusBoost: 12, clarityBoost: 12, duration: 2, recipe: { energy_book: 1, research_paper: 1 } },
    labor_energy: { name: "Năng lượng lao động", icon: "👷", type: "consumable", rarity: "common", description: "Tăng kiên định", resilienceBoost: 8, duration: 1, recipe: { labor_book: 1 } },
    sports_vigor: { name: "Sức mạnh thể thao", icon: "⚽", type: "consumable", rarity: "common", description: "Tăng kiên định", resilienceBoost: 10, duration: 1, recipe: { sports_book: 1 } },
    religious_peace: { name: "Bình an tôn giáo", icon: "🕊️", type: "consumable", rarity: "uncommon", description: "Tăng kiên định", resilienceBoost: 14, duration: 1, recipe: { religion_book: 1, culture_book: 1 } },
    agricultural_strength: { name: "Sức mạnh nông nghiệp", icon: "🌾", type: "consumable", rarity: "common", description: "Tăng tập trung", focusBoost: 9, duration: 2, recipe: { agriculture_book: 1 } },
    geographic_knowledge: { name: "Kiến thức địa lý", icon: "🗺️", type: "consumable", rarity: "common", description: "Tăng minh mẫn", clarityBoost: 9, duration: 2, recipe: { geography_book: 1 } },
    environmental_awareness: { name: "Nhận thức môi trường", icon: "🌍", type: "consumable", rarity: "uncommon", description: "Tăng tập trung và minh mẫn", focusBoost: 11, clarityBoost: 11, duration: 2, recipe: { environment_book: 1, research_paper: 1 } },
    social_connection: { name: "Kết nối xã hội", icon: "🤝", type: "consumable", rarity: "common", description: "Tăng thuyết phục", persuasionBoost: 8, duration: 1, recipe: { society_book: 1 } },
    artistic_inspiration_drink: { name: "Cảm hứng nghệ thuật", icon: "🎨", type: "consumable", rarity: "uncommon", description: "Tăng thuyết phục", persuasionBoost: 11, duration: 1, recipe: { arts_book: 1, culture_book: 1 } },
    educational_boost: { name: "Tăng cường giáo dục", icon: "📖", type: "consumable", rarity: "uncommon", description: "Tăng thuyết phục và kiên định", persuasionBoost: 10, resilienceBoost: 10, duration: 1, recipe: { education_book: 1, research_paper: 1 } },
    ethical_guidance: { name: "Hướng dẫn đạo đức", icon: "✨", type: "consumable", rarity: "uncommon", description: "Tăng kiên định", resilienceBoost: 13, duration: 1, recipe: { ethics_book: 1, philosophy_book: 1 } },
    development_momentum: { name: "Đà phát triển", icon: "📈", type: "consumable", rarity: "rare", description: "Tăng thuyết phục và kiên định", persuasionBoost: 16, resilienceBoost: 16, duration: 1, recipe: { development_book: 1, economics_book: 1, research_paper: 1 } },
    military_discipline_potion: { name: "Thuốc kỷ luật quân sự", icon: "🎖️", type: "consumable", rarity: "rare", description: "Tăng kiên định mạnh", resilienceBoost: 20, duration: 1, recipe: { military_book: 1, research_paper: 1 } },
    technology_boost: { name: "Tăng cường công nghệ", icon: "💻", type: "consumable", rarity: "uncommon", description: "Tăng thuyết phục", persuasionBoost: 12, duration: 1, recipe: { technology_book: 1, research_paper: 1 } }
  },

  opponents: {
    basic_ideology: {
      name: "Người thiếu hiểu biết",
      icon: "🤔",
      baseConfidence: 40,
      basePersuasion: 10,
      baseResilience: 12,
      exp: 20,
      topic: "Đảng Cộng sản là gì?",
      correctAnswer: "Đảng của giai cấp công nhân và nhân dân lao động",
      wrongAnswers: ["Đảng của tư sản", "Đảng của trí thức", "Đảng của nông dân"],
      knowledge: ["philosophy_book", "history_book"]
    },
    party_nature: {
      name: "Người hoài nghi",
      icon: "🧐",
      baseConfidence: 50,
      basePersuasion: 12,
      baseResilience: 14,
      exp: 25,
      topic: "Bản chất của Đảng Cộng sản Việt Nam",
      correctAnswer: "Đảng lãnh đạo, đại diện lợi ích của giai cấp công nhân, nhân dân lao động và dân tộc",
      wrongAnswers: ["Đảng chỉ đại diện tầng lớp trí thức", "Đảng độc quyền quyền lực", "Đảng chỉ của một giai cấp"],
      knowledge: ["politics_book", "history_book"]
    },
    patriotism: {
      name: "Người nghi ngờ chủ nghĩa yêu nước",
      icon: "🎭",
      baseConfidence: 58,
      basePersuasion: 15,
      baseResilience: 15,
      exp: 30,
      topic: "Chủ nghĩa yêu nước của Hồ Chí Minh",
      correctAnswer: "Yêu nước gắn liền với chủ nghĩa xã hội, độc lập dân tộc gắn với chủ nghĩa quốc tế",
      wrongAnswers: ["Chỉ là dân tộc chủ nghĩa hẹp hòi", "Yêu nước không cần lý tưởng", "Chủ nghĩa cực đoan"],
      knowledge: ["history_book", "culture_book", "politics_book"]
    },
    peoples_democracy: {
      name: "Nhà phê bình dân chủ",
      icon: "👨‍⚖️",
      baseConfidence: 60,
      basePersuasion: 15,
      baseResilience: 15,
      exp: 35,
      topic: "Nhà nước của dân, do dân, vì dân",
      correctAnswer: "Quyền lực thuộc về nhân dân, do nhân dân thực hiện thông qua Đảng lãnh đạo",
      wrongAnswers: ["Chỉ là khẩu hiệu tuyên truyền", "Dân chủ hình thức", "Độc đoán đảng trị"],
      knowledge: ["politics_book", "philosophy_book", "research_paper"]
    },
    working_class: {
      name: "Người hoài nghi giai cấp",
      icon: "👷",
      baseConfidence: 65,
      basePersuasion: 16,
      baseResilience: 14,
      exp: 38,
      topic: "Vai trò giai cấp công nhân",
      correctAnswer: "Giai cấp lãnh đạo cách mạng, là lực lượng tiên tiến nhất",
      wrongAnswers: ["Chỉ là lao động giản đơn", "Đã lỗi thời trong thời đại công nghệ", "Không còn quan trọng"],
      knowledge: ["politics_book", "economics_book", "documentary"]
    },
    industrialization: {
      name: "Nhà kinh tế thực dụng",
      icon: "🏭",
      baseConfidence: 70,
      basePersuasion: 18,
      baseResilience: 16,
      exp: 42,
      topic: "Công nghiệp hóa định hướng XHCN",
      correctAnswer: "Phát triển kinh tế phải gắn với tiến bộ và công bằng xã hội",
      wrongAnswers: ["Chỉ cần tăng trưởng kinh tế", "Bỏ qua yếu tố xã hội", "Ưu tiên lợi nhuận tối đa"],
      knowledge: ["economics_book", "politics_book", "research_paper"]
    },
    cultural_heritage: {
      name: "Nhà bảo thủ văn hóa",
      icon: "🎨",
      baseConfidence: 75,
      basePersuasion: 20,
      baseResilience: 18,
      exp: 45,
      topic: "Cách mạng và truyền thống văn hóa",
      correctAnswer: "Kế thừa và phát huy truyền thống tốt đẹp, loại bỏ lạc hậu",
      wrongAnswers: ["Phá bỏ hoàn toàn truyền thống", "Giữ nguyên mọi truyền thống", "Văn hóa không quan trọng"],
      knowledge: ["culture_book", "history_book", "philosophy_book"]
    },
    revolution_tradition: {
      name: "Người phê phán truyền thống",
      icon: "📜",
      baseConfidence: 78,
      basePersuasion: 21,
      baseResilience: 19,
      exp: 48,
      topic: "Truyền thống cách mạng Việt Nam",
      correctAnswer: "Đấu tranh giải phóng dân tộc, xây dựng CNXH là mạch nguồn",
      wrongAnswers: ["Chỉ là lịch sử xa xưa", "Không còn giá trị", "Truyền thống bảo thủ"],
      knowledge: ["history_book", "politics_book", "documentary"]
    },
    modernization: {
      name: "Nhà cải cách cực đoan",
      icon: "🚀",
      baseConfidence: 82,
      basePersuasion: 23,
      baseResilience: 20,
      exp: 52,
      topic: "Hiện đại hóa đất nước",
      correctAnswer: "Hiện đại hóa gắn với bản sắc dân tộc và CNXH",
      wrongAnswers: ["Bắt chước hoàn toàn phương Tây", "Hiện đại hóa bằng mọi giá", "Quên đi bản sắc dân tộc"],
      knowledge: ["economics_book", "culture_book", "research_paper"]
    },
    sustainable_development: {
      name: "Nhà môi trường hoài nghi",
      icon: "🌱",
      baseConfidence: 85,
      basePersuasion: 24,
      baseResilience: 22,
      exp: 55,
      topic: "Phát triển bền vững",
      correctAnswer: "Phát triển kinh tế phải hài hòa với bảo vệ môi trường và xã hội",
      wrongAnswers: ["Chỉ tập trung kinh tế", "Môi trường không quan trọng", "Phát triển sau lo sau"],
      knowledge: ["economics_book", "philosophy_book", "documentary"]
    },
    market_economy: {
      name: "Nhà tư bản chủ nghĩa",
      icon: "💼",
      baseConfidence: 90,
      basePersuasion: 26,
      baseResilience: 24,
      exp: 60,
      topic: "Kinh tế thị trường định hướng XHCN",
      correctAnswer: "Thị trường phục vụ mục tiêu xã hội chủ nghĩa, do Nhà nước điều tiết",
      wrongAnswers: ["Thị trường tự do hoàn toàn", "Nhà nước không can thiệp", "Tư nhân hóa mọi thứ"],
      knowledge: ["economics_book", "politics_book", "interview_record"]
    },
    socialism_orientation: {
      name: "Học giả phương Tây",
      icon: "🎓",
      baseConfidence: 95,
      basePersuasion: 28,
      baseResilience: 26,
      exp: 65,
      topic: "Con đường đi lên CNXH ở Việt Nam",
      correctAnswer: "Bỏ qua chế độ TBCN, xây dựng CNXH phù hợp điều kiện VN",
      wrongAnswers: ["Phải trải qua TBCN", "Theo mô hình phương Tây", "Không thể xây dựng CNXH"],
      knowledge: ["politics_book", "economics_book", "philosophy_book", "interview_record"]
    },
    // Boss opponents
    tri_nhan: {
      name: "Trí Nhân",
      icon: "👑",
      baseConfidence: 68,
      basePersuasion: 15,
      baseResilience: 14,
      exp: 40,
      topic: "Tư tưởng Hồ Chí Minh về Đảng và Nhà nước",
      correctAnswer: "Đảng lãnh đạo, Nhà nước quản lý, Nhân dân làm chủ",
      wrongAnswers: ["Đảng độc quyền", "Nhà nước độc tài", "Nhân dân không có quyền"],
      knowledge: ["politics_book", "philosophy_book", "history_book", "economics_book"],
      // isBoss: true,
      // dropRate: 0.5,
      // dropItems: ["ho_chi_minh_mausoleum", "one_pillar_pagoda", "temple_of_literature"]
    },
    nguyen_vu: {
      name: "Nguyên Vũ",
      icon: "👑",
      baseConfidence: 100,
      basePersuasion: 20,
      baseResilience: 18,
      exp: 45,
      topic: "Vận dụng tư tưởng Hồ Chí Minh trong thời đại mới",
      correctAnswer: "Kế thừa và phát triển sáng tạo tư tưởng Hồ Chí Minh",
      wrongAnswers: ["Áp dụng máy móc", "Bỏ qua tư tưởng cũ", "Chỉ học lý thuyết"],
      knowledge: ["politics_book", "philosophy_book", "history_book", "economics_book", "culture_book"],
      // isBoss: true,
      // dropRate: 0.6,
      // dropItems: ["imperial_city", "thien_mu_pagoda", "hoi_an_ancient_town"]
    },
    hoang_nguyen: {
      name: "Hoàng Nguyên",
      icon: "👑",
      baseConfidence: 102,
      basePersuasion: 19,
      baseResilience: 17,
      exp: 45,
      topic: "Xây dựng và phát triển đất nước theo tư tưởng Hồ Chí Minh",
      correctAnswer: "Độc lập dân tộc gắn liền với CNXH, dân giàu nước mạnh",
      wrongAnswers: ["Chỉ phát triển kinh tế", "Bỏ qua độc lập dân tộc", "Theo mô hình nước ngoài"],
      knowledge: ["politics_book", "philosophy_book", "history_book", "economics_book", "culture_book", "society_book"],
      // isBoss: true,
      // dropRate: 0.7,
      // dropItems: ["independence_palace", "ben_thanh_market", "cu_chi_tunnels"]
    }
  },

  quizQuestions: [
    {
      question: "Theo Hồ Chí Minh, Đảng Cộng sản Việt Nam là nhân tố gì đối với thắng lợi của cách mạng?",
      answers: ["Nhân tố chủ quan duy nhất", "Nhân tố quyết định hàng đầu", "Nhân tố hỗ trợ quan trọng", "Nhân tố khách quan tất yếu"],
      correct: 1
    },
    {
      question: 'Hồ Chí Minh khẳng định: "Đảng có vững cách mệnh mới thành công, cũng như người cầm lái có vững thuyền mới chạy" trong tác phẩm nào?',
      answers: ["Bản án chế độ thực dân Pháp", "Sửa đổi lối làm việc", "Đường Kách mệnh", "Chánh cương vắn tắt của Đảng"],
      correct: 2
    },
    {
      question: "Quy luật ra đời của Đảng Cộng sản Việt Nam là sự kết hợp của các yếu tố nào?",
      answers: ["Chủ nghĩa Mác-Lênin và phong trào công nhân", "Chủ nghĩa Mác-Lênin, phong trào công nhân và phong trào yêu nước", "Phong trào yêu nước và phong trào công nhân", "Chủ nghĩa Mác-Lênin và tư tưởng phương Tây"],
      correct: 1
    },
    {
      question: '"Đảng ta là đạo đức, là văn minh". "Đạo đức" theo ý của Hồ Chí Minh là:',
      answers: ["Đảng viên phải đi chùa, làm từ thiện", "Đảng không có lợi ích riêng, mục đích duy nhất là giải phóng dân tộc, giải phóng con người", "Đảng chỉ bao gồm những người hiền lành", "Đảng viên phải sống khổ hạnh"],
      correct: 1
    },
    {
      question: 'Nguyên tắc "Tập trung dân chủ" trong tổ chức Đảng được hiểu là:',
      answers: ["Chỉ tập trung quyền lực vào người đứng đầu", "Dân chủ tự do tuyệt đối, không cần kỷ luật", "Tập trung trên cơ sở dân chủ, dân chủ dưới sự chỉ đạo tập trung", "Mọi đảng viên thích làm gì thì làm"],
      correct: 2
    },
    {
      question: 'Theo Hồ Chí Minh, "vũ khí" để làm cho Đảng luôn trong sạch, vững mạnh là gì?',
      answers: ["Kỷ luật sắt", "Tự phê bình và phê bình", "Tăng cường kết nạp đảng viên mới", "Loại bỏ hết những người có ý kiến khác biệt"],
      correct: 1
    },
    {
      question: 'Hồ Chí Minh ví việc "Tự phê bình và phê bình" như việc gì hàng ngày?',
      answers: ["Đi chợ", "Ăn cơm", "Rửa mặt", "Quét nhà"],
      correct: 2
    },
    {
      question: 'Đảng cầm quyền nhưng "Dân là chủ". Điều này có nghĩa là:',
      answers: ["Đảng đứng trên nhân dân để ra lệnh", "Mọi quyền lực của Đảng đều do nhân dân ủy thác", "Nhân dân không cần nghe theo Đảng", "Đảng viên có quyền ưu tiên hơn nhân dân"],
      correct: 1
    },
    {
      question: "Tiêu chuẩn hàng đầu của một đảng viên theo tư tưởng Hồ Chí Minh là:",
      answers: ["Có trình độ học vấn cao nhất", "Có tài năng kinh doanh giỏi", "Tuyệt đối trung thành với lý tưởng của Đảng và lợi ích dân tộc", "Có nhiều mối quan hệ quốc tế"],
      correct: 2
    },
    {
      question: "Đảng lãnh đạo Nhà nước bằng phương thức nào là chủ yếu?",
      answers: ["Bằng mệnh lệnh hành chính", "Bằng đường lối, chủ trương và qua sự gương mẫu của đảng viên", "Bằng cách làm thay công việc của các cơ quan chính quyền", "Bằng cách can thiệp trực tiếp vào việc xét xử của tòa án"],
      correct: 1
    },
    {
      question: 'Nội dung của "Đảng là văn minh" bao gồm:',
      answers: ["Đảng viên phải ăn mặc đẹp", "Đảng tiêu biểu cho lương tri, trí tuệ của dân tộc và thời đại", "Đảng chỉ dùng công nghệ hiện đại", "Đảng xây dựng nhiều công trình kiến trúc lớn"],
      correct: 1
    },
    {
      question: "Tại sao Hồ Chí Minh thêm yếu tố \"Phong trào yêu nước\" vào quy luật ra đời của Đảng?",
      answers: ["Vì phong trào công nhân Việt Nam quá yếu", "Vì phong trào yêu nước có vị trí, vai trò cực kỳ quan trọng trong lịch sử dân tộc", "Vì Người muốn làm khác đi so với Lênin", "Vì phong trào yêu nước dễ tập hợp hơn"],
      correct: 1
    },
    {
      question: "Trong công tác xây dựng Đảng, việc \"Chỉnh đốn Đảng\" cần được thực hiện khi nào?",
      answers: ["Khi Đảng gặp khủng hoảng", "Chỉ thực hiện khi có cán bộ bị kỷ luật", "Phải thực hiện thường xuyên để Đảng luôn vững mạnh", "Chỉ thực hiện trước các kỳ đại hội"],
      correct: 2
    },
    {
      question: 'Theo Hồ Chí Minh, "Đoàn kết" trong Đảng có vai trò gì?',
      answers: ["Để che giấu khuyết điểm cho nhau", "Là sinh mệnh của Đảng, là nhân tố tạo nên sức mạnh", "Là hình thức để đối phó với cấp trên", "Chỉ cần đoàn kết ở cấp lãnh đạo"],
      correct: 1
    },
    {
      question: "Mối quan hệ giữa Đảng và Nhân dân được ví là:",
      answers: ["Quan hệ giữa người chủ và người làm thuê", "Quan hệ như cá với nước", "Quan hệ giữa người quản lý và người bị quản lý", "Quan hệ tạm thời để đạt mục đích cách mạng"],
      correct: 1
    },
    {
      question: '"Đảng không phải là một tổ chức để làm quan phát tài". Câu nói này nhấn mạnh điều gì?',
      answers: ["Đảng viên không được nhận lương", "Mục đích của Đảng là phục vụ nhân dân chứ không phải vì lợi ích cá nhân", "Đảng viên không được làm kinh tế", "Đảng viên phải sống nghèo khổ"],
      correct: 1
    },
    {
      question: "Đảng phải liên hệ mật thiết với nhân dân nhằm mục đích:",
      answers: ["Để nhân dân đóng thuế đầy đủ", "Để lắng nghe ý kiến, tâm tư của dân và được dân ủng hộ", "Để giám sát hành động của nhân dân", "Để phô trương thanh thế"],
      correct: 1
    },
    {
      question: "Kỷ luật của Đảng theo Hồ Chí Minh là:",
      answers: ["Kỷ luật áp đặt từ bên ngoài", "Kỷ luật sắt nhưng là kỷ luật tự giác", "Kỷ luật lỏng lẻo để tạo sự thoải mái", "Kỷ luật chỉ áp dụng cho đảng viên cấp dưới"],
      correct: 1
    },
    {
      question: "Hồ Chí Minh coi cán bộ là:",
      answers: ["Công cụ của Đảng", "Cái gốc của mọi công việc", "Người đứng đầu thiên hạ", "Những người lao động trí óc đơn thuần"],
      correct: 1
    },
    {
      question: "Đảng lãnh đạo nhưng phải dựa trên cơ sở nào?",
      answers: ["Dựa trên vũ khí", "Dựa trên lòng dân (lòng tin của quần chúng)", "Dựa trên sự giúp đỡ của nước ngoài", "Dựa trên các văn bản hành chính khô khan"],
      correct: 1
    },
    {
      question: 'Nhà nước "của nhân dân" có nghĩa là:',
      answers: ["Nhà nước sở hữu mọi tài sản của dân", "Mọi quyền lực trong nước đều thuộc về nhân dân", "Nhân dân phải phục vụ Nhà nước", "Nhà nước do một nhóm người giàu quản lý"],
      correct: 1
    },
    {
      question: 'Quyền "Bãi miễn đại biểu" của nhân dân thể hiện tính chất gì của Nhà nước?',
      answers: ["Nhà nước của dân", "Nhà nước do dân", "Nhà nước vì dân", "Nhà nước độc tài"],
      correct: 1
    },
    {
      question: 'Nhà nước "Vì dân" là nhà nước:',
      answers: ["Mọi hoạt động đều nhằm mang lại lợi ích cho nhân dân", "Chỉ quan tâm đến những người có công với cách mạng", "Nhà nước làm mọi việc thay cho dân", "Nhà nước phát tiền cho dân hàng tháng"],
      correct: 0
    },
    {
      question: "Bản chất giai cấp công nhân của Nhà nước Việt Nam thể hiện ở:",
      answers: ["Số lượng công nhân trong bộ máy rất đông", "Do Đảng Cộng sản lãnh đạo", "Nhà nước chỉ bảo vệ công nhân", "Nhà nước đóng cửa các doanh nghiệp tư nhân"],
      correct: 1
    },
    {
      question: "Tính thống nhất giữa bản chất giai cấp công nhân với tính dân tộc thể hiện ở chỗ:",
      answers: ["Giai cấp công nhân chỉ quan tâm đến lợi ích của mình", "Lợi ích của giai cấp công nhân thống nhất với lợi ích của dân tộc", "Giai cấp công nhân đứng trên dân tộc", "Nhà nước chỉ dùng tiếng Việt"],
      correct: 1
    },
    {
      question: 'Một nhà nước "Hợp hiến, hợp pháp" là nhà nước:',
      answers: ["Được quân đội thành lập", "Do nhân dân bầu ra qua tổng tuyển cử, có Hiến pháp rõ ràng", "Được các cường quốc thừa nhận ngay lập tức", "Có hệ thống pháp luật phức tạp"],
      correct: 1
    },
    {
      question: "Hồ Chí Minh đã chủ trì soạn thảo những bản Hiến pháp nào?",
      answers: ["Hiến pháp 1946 và 1959", "Hiến pháp 1946 và 1980", "Hiến pháp 1959 và 1992", "Chỉ có Hiến pháp 1946"],
      correct: 0
    },
    {
      question: '"Pháp quyền nhân nghĩa" là sự kết hợp giữa:',
      answers: ["Luật pháp và tôn giáo", "Luật pháp nghiêm minh và đạo đức, lòng nhân ái", "Hình phạt nặng và sự khoan hồng vô điều kiện", "Pháp luật Việt Nam và pháp luật quốc tế"],
      correct: 1
    },
    {
      question: "Hồ Chí Minh gọi Tham ô, Lãng phí, Quan liêu là:",
      answers: ["Những lỗi lầm cá nhân", "Giặc nội xâm", "Thói quen của người có quyền", "Giặc ngoại xâm"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, căn bệnh nào là \"nguồn gốc\" sinh ra tham ô, lãng phí?",
      answers: ["Bệnh lười biếng", "Bệnh quan liêu", "Bệnh thiếu hiểu biết", "Bệnh kiêu ngạo"],
      correct: 1
    },
    {
      question: "Để kiểm soát quyền lực nhà nước, Hồ Chí Minh nhấn mạnh vai trò của:",
      answers: ["Chỉ các cơ quan cấp cao", "Công tác thanh tra của Đảng và sự giám sát của nhân dân", "Quân đội và cảnh sát", "Các tổ chức quốc tế"],
      correct: 1
    },
    {
      question: "Tiêu chuẩn của cán bộ nhà nước theo Hồ Chí Minh là:",
      answers: ["Chỉ cần có tài, không cần đạo đức", "Vừa có đức vừa có tài, trong đó đức là gốc", "Chỉ cần hiền lành, trung thực là đủ", "Phải là người có họ hàng với lãnh đạo"],
      correct: 1
    },
    {
      question: '"Việc gì có lợi cho dân, ta phải hết sức làm. Việc gì có hại cho dân, ta phải hết sức tránh". Câu nói này thể hiện tư tưởng gì?',
      answers: ["Nhà nước của dân", "Nhà nước do dân", "Nhà nước vì dân", "Nhà nước pháp quyền"],
      correct: 2
    },
    {
      question: "Muốn xây dựng Nhà nước trong sạch, vững mạnh thì trước hết phải làm gì?",
      answers: ["Mua sắm thêm trang thiết bị", "Xây dựng đội ngũ cán bộ \"vừa hồng vừa chuyên\"", "Tăng lương cho cán bộ thật cao", "Giảm số lượng nhân dân"],
      correct: 1
    },
    {
      question: 'Cơ chế "Dân biết, dân bàn, dân làm, dân kiểm tra" thể hiện quyền gì của dân?',
      answers: ["Quyền bầu cử", "Quyền làm chủ trực tiếp", "Quyền tự do kinh doanh", "Quyền đi học"],
      correct: 1
    },
    {
      question: "Tại sao phải chống lãng phí?",
      answers: ["Vì lãng phí làm tốn thời gian", "Vì lãng phí là tội ác đối với nhân dân, làm chậm sự phát triển của đất nước", "Vì lãng phí không đẹp mắt", "Vì lãng phí làm cho văn phòng bừa bộn"],
      correct: 1
    },
    {
      question: "Trong Nhà nước pháp quyền Hồ Chí Minh, luật pháp có vị trí như thế nào?",
      answers: ["Dưới quyền của cán bộ", "Thượng tôn pháp luật (mọi người đều phải tuân thủ luật)", "Chỉ dành cho nhân dân", "Chỉ để tham khảo"],
      correct: 1
    },
    {
      question: "Hồ Chí Minh ví cán bộ nhà nước là:",
      answers: ["Những ông quan cách mạng", "Người đầy tớ thật trung thành của nhân dân", "Những nhà quản lý chuyên nghiệp", "Những người đứng đầu tầng lớp lao động"],
      correct: 1
    },
    {
      question: '"Giặc nội xâm" nguy hiểm hơn giặc ngoại xâm vì:',
      answers: ["Nó có vũ khí hiện đại hơn", "Nó phá hoại từ bên trong, làm suy yếu sức mạnh dân tộc và niềm tin của dân", "Nó khó nhìn thấy bằng mắt thường", "Nó là người nước ngoài sống trong nước"],
      correct: 1
    },
    {
      question: "Để vận dụng tư tưởng Hồ Chí Minh vào xây dựng Nhà nước hiện nay, cần chú trọng điều gì?",
      answers: ["Cải cách hành chính và phòng chống tham nhũng", "Chỉ tập trung phát triển kinh tế", "Không cần sửa đổi luật pháp", "Hạn chế quyền làm chủ của dân"],
      correct: 0
    },
    {
      question: "Đảng Cộng sản Việt Nam ra đời vào năm nào?",
      answers: ["1925", "1927", "1930", "1945"],
      correct: 2
    },
    {
      question: "Ai là người sáng lập Đảng Cộng sản Việt Nam?",
      answers: ["Trường Chinh", "Lê Duẩn", "Hồ Chí Minh", "Võ Nguyên Giáp"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Đảng Cộng sản Việt Nam mang bản chất giai cấp nào?",
      answers: ["Giai cấp nông dân", "Giai cấp công nhân", "Giai cấp trí thức", "Giai cấp tư sản"],
      correct: 1
    },
    {
      question: "Đảng Cộng sản Việt Nam đồng thời đại biểu cho lợi ích của ai?",
      answers: ["Giai cấp công nhân", "Nhân dân lao động", "Dân tộc Việt Nam", "Cả A, B và C"],
      correct: 3
    },
    {
      question: "Mục tiêu cao nhất của Đảng Cộng sản Việt Nam là gì?",
      answers: ["Giành chính quyền", "Phát triển kinh tế", "Phục vụ nhân dân", "Xây dựng CNXH và CNCS"],
      correct: 3
    },
    {
      question: "Theo Hồ Chí Minh, Đảng lãnh đạo cách mạng bằng cách nào?",
      answers: ["Mệnh lệnh hành chính", "Áp đặt quyền lực", "Đường lối, chủ trương đúng đắn", "Vũ lực"],
      correct: 2
    },
    {
      question: "Theo tư tưởng Hồ Chí Minh, Đảng có đứng trên nhân dân không?",
      answers: ["Có", "Không", "Chỉ trong thời chiến", "Chỉ trong thời bình"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, cán bộ là gì của cách mạng?",
      answers: ["Người chỉ huy", "Người quản lý", "Gốc của mọi công việc", "Người giám sát"],
      correct: 2
    },
    {
      question: "Đảng Cộng sản Việt Nam lấy chủ nghĩa nào làm nền tảng tư tưởng?",
      answers: ["Chủ nghĩa dân tộc", "Chủ nghĩa yêu nước", "Chủ nghĩa Mác – Lênin", "Chủ nghĩa cải lương"],
      correct: 2
    },
    {
      question: "Nguyên tắc tổ chức cơ bản của Đảng là gì?",
      answers: ["Đa nguyên đa đảng", "Phân quyền tuyệt đối", "Tập trung dân chủ", "Tự do tuyệt đối"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Đảng phải thường xuyên làm gì để trong sạch, vững mạnh?",
      answers: ["Tự phê bình và phê bình", "Mở rộng quyền lực", "Giữ bí mật nội bộ", "Tăng số lượng đảng viên"],
      correct: 0
    },
    {
      question: "Căn bệnh nào Hồ Chí Minh cảnh báo là nguy hiểm đối với Đảng?",
      answers: ["Quan liêu", "Tham ô", "Xa rời quần chúng", "Cả A, B và C"],
      correct: 3
    },
    {
      question: "Theo Hồ Chí Minh, sức mạnh của Đảng bắt nguồn từ đâu?",
      answers: ["Vũ khí", "Tiền bạc", "Nhân dân", "Quyền lực"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Đảng phải gắn bó chặt chẽ với ai?",
      answers: ["Trí thức", "Công nhân", "Nhân dân", "Quân đội"],
      correct: 2
    },
    {
      question: "Nhà nước Việt Nam theo Hồ Chí Minh là nhà nước của ai?",
      answers: ["Giai cấp công nhân", "Đảng Cộng sản", "Nhân dân", "Chính phủ"],
      correct: 2
    },
    {
      question: "\"Nhà nước của dân\" có nghĩa là gì?",
      answers: ["Dân đóng thuế", "Dân có quyền làm chủ", "Dân tự quản hoàn toàn", "Dân phục tùng nhà nước"],
      correct: 1
    },
    {
      question: "\"Nhà nước do dân\" thể hiện ở điểm nào?",
      answers: ["Dân lao động", "Dân bầu ra nhà nước", "Dân tuân thủ pháp luật", "Dân đóng góp kinh tế"],
      correct: 1
    },
    {
      question: "\"Nhà nước vì dân\" có nghĩa là gì?",
      answers: ["Phục vụ lợi ích của dân", "Phục vụ lợi ích của Đảng", "Phục vụ lợi ích của Nhà nước", "Phục vụ lợi ích của quốc tế"],
      correct: 0
    },
    {
      question: "Theo Hồ Chí Minh, nhân dân có quyền gì đối với Nhà nước?",
      answers: ["Chỉ tuân theo", "Kiểm tra, giám sát", "Không được góp ý", "Chỉ đóng thuế"],
      correct: 1
    },
    {
      question: "Hồ Chí Minh coi cán bộ nhà nước là gì của nhân dân?",
      answers: ["Người cai trị", "Người chỉ huy", "Công bộc", "Người kiểm soát"],
      correct: 2
    },
    {
      question: "Nhà nước quản lý xã hội chủ yếu bằng gì?",
      answers: ["Quyền lực cá nhân", "Mệnh lệnh", "Pháp luật", "Ý chí lãnh đạo"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước ta là nhà nước kiểu gì?",
      answers: ["Phong kiến", "Tư sản", "Xã hội chủ nghĩa", "Quân chủ"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, mọi quyền lực nhà nước thuộc về ai?",
      answers: ["Chính phủ", "Quốc hội", "Nhân dân", "Đảng"],
      correct: 2
    },
    {
      question: "Theo tư tưởng Hồ Chí Minh, Nhà nước có được phép xa dân không?",
      answers: ["Có", "Không", "Trong trường hợp đặc biệt", "Khi có chiến tranh"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, mục đích tồn tại của Nhà nước là gì?",
      answers: ["Quản lý xã hội", "Thể hiện quyền lực", "Phục vụ nhân dân", "Phát triển bộ máy"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, ai là chủ của đất nước?",
      answers: ["Đảng", "Chính phủ", "Nhân dân", "Quân đội"],
      correct: 2
    },
    {
      question: "Nhà nước vì dân phải thể hiện rõ nhất ở đâu?",
      answers: ["Khẩu hiệu", "Văn bản", "Đời sống nhân dân", "Tổ chức bộ máy"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, cán bộ phải có phẩm chất gì?",
      answers: ["Giàu có", "Quyền lực", "Đạo đức cách mạng", "Bằng cấp cao"],
      correct: 2
    },
    {
      question: "Theo Bác Hồ, cán bộ không được mắc bệnh gì?",
      answers: ["Lười biếng", "Quan liêu", "Tham ô", "Cả A, B và C"],
      correct: 3
    },
    {
      question: "Theo Hồ Chí Minh, dân chủ có nghĩa là gì?",
      answers: ["Dân làm chủ", "Dân phục tùng", "Dân không cần pháp luật", "Dân chỉ bầu cử"],
      correct: 0
    },
    {
      question: "Theo Hồ Chí Minh, Đảng mạnh là nhờ đâu?",
      answers: ["Quyền lực", "Số lượng đảng viên", "Gắn bó với nhân dân", "Bộ máy lớn"],
      correct: 2
    },
    {
      question: "Theo tư tưởng Hồ Chí Minh, Nhà nước có trách nhiệm gì?",
      answers: ["Cai trị", "Phục vụ", "Kiểm soát", "Áp đặt"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, dân chủ phải gắn với yếu tố nào?",
      answers: ["Tự do tuyệt đối", "Pháp luật", "Quyền lực", "Bạo lực"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, nhân dân tham gia quản lý nhà nước thông qua hình thức nào?",
      answers: ["Bầu cử", "Biểu tình", "Tự quản", "Tự do cá nhân"],
      correct: 0
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước phải tôn trọng điều gì của nhân dân?",
      answers: ["Ý kiến", "Quyền làm chủ", "Quyền lợi", "Cả A, B và C"],
      correct: 3
    },
    {
      question: "Theo Hồ Chí Minh, pháp luật sinh ra để làm gì?",
      answers: ["Trừng phạt", "Bảo vệ quyền lợi nhân dân", "Kiểm soát xã hội", "Thể hiện quyền lực"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước phải dựa vào đâu để hoạt động hiệu quả?",
      answers: ["Quyền lực", "Tiền bạc", "Nhân dân", "Bộ máy"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, cán bộ tốt là người như thế nào?",
      answers: ["Nhiều quyền", "Nhiều tiền", "Hết lòng vì dân", "Có chức vụ cao"],
      correct: 2
    },
    {
      question: "Theo tư tưởng Hồ Chí Minh, ai có quyền kiểm tra Nhà nước?",
      answers: ["Đảng", "Chính phủ", "Nhân dân", "Quốc hội"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước không được làm điều gì?",
      answers: ["Phục vụ dân", "Xa rời dân", "Tôn trọng dân", "Dựa vào dân"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, quyền lực nhà nước phải được sử dụng như thế nào?",
      answers: ["Vì lợi ích cá nhân", "Vì lợi ích tập thể", "Vì lợi ích nhân dân", "Vì lợi ích tổ chức"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, dân chủ là mục tiêu hay phương tiện?",
      answers: ["Chỉ là mục tiêu", "Chỉ là phương tiện", "Vừa là mục tiêu vừa là động lực", "Không quan trọng"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, ai là người quyết định vận mệnh đất nước?",
      answers: ["Đảng", "Chính phủ", "Nhân dân", "Quân đội"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước phải lắng nghe ai?",
      answers: ["Cán bộ", "Đảng viên", "Nhân dân", "Lãnh đạo"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước phải chịu trách nhiệm trước ai?",
      answers: ["Đảng", "Chính phủ", "Nhân dân", "Quốc hội"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước phải bảo vệ quyền lợi của ai?",
      answers: ["Cán bộ", "Tổ chức", "Nhân dân", "Doanh nghiệp"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, dân chủ không bao gồm điều nào sau đây?",
      answers: ["Quyền làm chủ", "Quyền tham gia", "Quyền giám sát", "Quyền cai trị"],
      correct: 3
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước phải dựa trên nguyên tắc nào?",
      answers: ["Chuyên quyền", "Pháp quyền", "Cá nhân", "Tập trung tuyệt đối"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, mục đích của pháp luật là gì?",
      answers: ["Trừng phạt dân", "Bảo vệ dân", "Kiểm soát dân", "Hạn chế dân"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, Đảng và Nhà nước tồn tại vì ai?",
      answers: ["Đảng viên", "Cán bộ", "Nhân dân", "Tổ chức"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Đảng phải đặt lợi ích nào lên trên hết?",
      answers: ["Lợi ích cá nhân", "Lợi ích giai cấp", "Lợi ích nhân dân và dân tộc", "Lợi ích tổ chức"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Đảng muốn vững mạnh thì trước hết phải làm gì?",
      answers: ["Mở rộng tổ chức", "Tăng quyền lực", "Giữ vững đạo đức cách mạng", "Tăng số lượng đảng viên"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Đảng phải chống lại biểu hiện nào sau đây?",
      answers: ["Chủ quan", "Quan liêu", "Tham nhũng", "Cả A, B và C"],
      correct: 3
    },
    {
      question: "Theo Hồ Chí Minh, Đảng có vai trò gì đối với Nhà nước?",
      answers: ["Đứng ngoài Nhà nước", "Lãnh đạo Nhà nước", "Thay thế Nhà nước", "Không liên quan"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, Đảng lãnh đạo Nhà nước chủ yếu thông qua đâu?",
      answers: ["Mệnh lệnh hành chính", "Pháp luật", "Đường lối, chủ trương", "Quyền lực cá nhân"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước ta mang bản chất gì?",
      answers: ["Phong kiến", "Tư sản", "Nhân dân", "Quân sự"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, nhân dân tham gia quản lý nhà nước bằng cách nào?",
      answers: ["Tuân thủ mệnh lệnh", "Thông qua bầu cử và giám sát", "Thông qua biểu tình", "Thông qua tổ chức riêng"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước do dân thể hiện rõ nhất ở điều nào?",
      answers: ["Dân đóng thuế", "Dân lao động", "Dân bầu ra chính quyền", "Dân chấp hành pháp luật"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước vì dân không thể hiện ở đâu?",
      answers: ["Chính sách xã hội", "Đời sống nhân dân", "Quyền lực tuyệt đối", "Phúc lợi xã hội"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, cán bộ nhà nước phải có thái độ nào với nhân dân?",
      answers: ["Cai trị", "Ban ơn", "Tôn trọng và phục vụ", "Kiểm soát"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, dân chủ trước hết là gì?",
      answers: ["Khẩu hiệu", "Hình thức", "Quyền làm chủ của nhân dân", "Cơ chế quản lý"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, dân chủ phải gắn liền với điều gì?",
      answers: ["Tự do tuyệt đối", "Pháp luật và kỷ cương", "Quyền lực", "Quân đội"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, pháp luật Nhà nước ta nhằm mục đích gì?",
      answers: ["Trấn áp nhân dân", "Bảo vệ quyền làm chủ của nhân dân", "Củng cố quyền lực", "Duy trì trật tự đơn thuần"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước phải dựa vào đâu để hoạt động hiệu quả?",
      answers: ["Bộ máy lớn", "Ngân sách mạnh", "Nhân dân", "Quyền lực chính trị"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, quan liêu gây ra tác hại gì?",
      answers: ["Tốn thời gian", "Làm xa dân", "Giảm uy tín Nhà nước", "Cả B và C"],
      correct: 3
    },
    {
      question: "Theo Hồ Chí Minh, tham nhũng làm tổn hại điều gì nghiêm trọng nhất?",
      answers: ["Kinh tế", "Uy tín của Đảng và Nhà nước", "Quan hệ quốc tế", "Trật tự xã hội"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, cán bộ tốt phải là người như thế nào?",
      answers: ["Có quyền lực", "Có địa vị", "Có đạo đức, tận tụy", "Có nhiều mối quan hệ"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, nhân dân có quyền gì đối với cán bộ?",
      answers: ["Tuân theo tuyệt đối", "Phê bình và giám sát", "Không được góp ý", "Chỉ đánh giá gián tiếp"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước phải chịu sự kiểm tra của ai?",
      answers: ["Đảng", "Quốc hội", "Nhân dân", "Chính phủ"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, quyền lực nếu không được kiểm soát sẽ dẫn đến điều gì?",
      answers: ["Hiệu quả cao", "Quan liêu, lạm quyền", "Phát triển nhanh", "Ổn định xã hội"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, Đảng cầm quyền phải làm gì để giữ được lòng dân?",
      answers: ["Tăng quyền lực", "Giữ đạo đức và trách nhiệm", "Mở rộng bộ máy", "Siết chặt quản lý"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, mối quan hệ giữa Đảng và nhân dân là gì?",
      answers: ["Lãnh đạo – phục tùng", "Cai trị – bị cai trị", "Gắn bó máu thịt", "Quản lý – tuân theo"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước mạnh khi nào?",
      answers: ["Bộ máy lớn", "Pháp luật nghiêm", "Được nhân dân tin tưởng", "Quyền lực tập trung"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, mục tiêu của dân chủ là gì?",
      answers: ["Tăng quyền lực", "Phát triển tổ chức", "Hạnh phúc của nhân dân", "Quản lý xã hội"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, cán bộ phải gần dân để làm gì?",
      answers: ["Kiểm soát dân", "Hiểu và phục vụ dân tốt hơn", "Duy trì trật tự", "Thể hiện quyền lực"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước không được phép làm điều gì?",
      answers: ["Ban hành pháp luật", "Phục vụ nhân dân", "Xa rời nhân dân", "Tổ chức bộ máy"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, dân chủ có cần đi đôi với kỷ luật không?",
      answers: ["Không cần", "Chỉ cần dân chủ", "Chỉ cần kỷ luật", "Có, phải đi đôi"],
      correct: 3
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước pháp quyền phải bảo đảm điều gì?",
      answers: ["Quyền lực", "Trật tự", "Quyền lợi của nhân dân", "Lợi ích tổ chức"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, dân chủ hình thức có nguy hiểm không?",
      answers: ["Không", "Có, dễ dẫn đến mất lòng tin", "Không ảnh hưởng", "Chỉ ảnh hưởng nhỏ"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước phải thường xuyên làm gì để hoàn thiện?",
      answers: ["Tăng quyền lực", "Tự phê bình và sửa chữa", "Mở rộng bộ máy", "Giữ nguyên hiện trạng"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, dân chủ phải được thực hiện ở đâu?",
      answers: ["Trên giấy tờ", "Trong khẩu hiệu", "Trong thực tiễn đời sống", "Trong hội nghị"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước phải lắng nghe ý kiến của ai?",
      answers: ["Cán bộ", "Lãnh đạo", "Nhân dân", "Tổ chức"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, quyền làm chủ của nhân dân thể hiện rõ nhất khi nào?",
      answers: ["Khi phát biểu", "Khi giám sát chính quyền", "Khi tham gia quyết định các vấn đề chung", "Khi tuân thủ pháp luật"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước vì dân phải được đo bằng gì?",
      answers: ["Quy mô", "Quyền lực", "Hiệu quả phục vụ nhân dân", "Uy tín quốc tế"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, cán bộ xa dân sẽ dẫn đến điều gì?",
      answers: ["Hiệu quả cao", "Quan liêu", "Phát triển nhanh", "Ổn định xã hội"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước ta không phải là nhà nước của ai?",
      answers: ["Nhân dân", "Một nhóm người", "Toàn dân", "Dân lao động"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, Đảng cầm quyền phải chịu trách nhiệm trước ai?",
      answers: ["Quốc tế", "Tổ chức", "Nhân dân", "Chính phủ"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước phải kết hợp yếu tố nào sau đây?",
      answers: ["Quyền lực và bạo lực", "Dân chủ và pháp luật", "Tự do và vô chính phủ", "Quản lý và áp đặt"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, dân chủ không có nghĩa là gì?",
      answers: ["Dân làm chủ", "Dân tham gia", "Dân vô kỷ luật", "Dân giám sát"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước phải phục vụ ai trước hết?",
      answers: ["Cán bộ", "Tổ chức", "Nhân dân", "Doanh nghiệp"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, pháp luật phải nghiêm minh nhằm mục đích gì?",
      answers: ["Tăng quyền lực", "Bảo vệ dân chủ", "Trấn áp dân", "Giữ hình thức"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước mạnh nhất khi nào?",
      answers: ["Có nhiều quyền", "Có nhiều tiền", "Được dân tin tưởng", "Có bộ máy lớn"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, quyền lực nhà nước phải gắn với điều gì?",
      answers: ["Trách nhiệm", "Danh vọng", "Địa vị", "Lợi ích cá nhân"],
      correct: 0
    },
    {
      question: "Theo Hồ Chí Minh, dân chủ phải được mở rộng cho ai?",
      answers: ["Cán bộ", "Đảng viên", "Toàn thể nhân dân", "Tổ chức chính trị"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước phải bảo đảm điều gì cho nhân dân?",
      answers: ["Quyền lực", "Quyền làm chủ", "Nghĩa vụ", "Trách nhiệm"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, cán bộ phải học điều gì từ nhân dân?",
      answers: ["Quyền lực", "Kinh nghiệm và thực tiễn", "Tổ chức", "Kỷ luật"],
      correct: 1
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước không thể tồn tại nếu thiếu điều gì?",
      answers: ["Pháp luật", "Bộ máy", "Nhân dân", "Quyền lực"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, dân chủ gắn với trách nhiệm có ý nghĩa gì?",
      answers: ["Tăng kỷ luật", "Ngăn chặn vô chính phủ", "Bảo đảm quyền làm chủ thực chất", "Cả A, B và C"],
      correct: 3
    },
    {
      question: "Theo Hồ Chí Minh, Nhà nước vì dân phải ưu tiên giải quyết vấn đề gì?",
      answers: ["Quy mô bộ máy", "Lợi ích cán bộ", "Đời sống nhân dân", "Uy tín quốc tế"],
      correct: 2
    },
    {
      question: "Theo Hồ Chí Minh, mục tiêu cuối cùng của Đảng và Nhà nước là gì?",
      answers: ["Quyền lực", "Ổn định", "Hạnh phúc của nhân dân", "Phát triển tổ chức"],
      correct: 2
    }
  ]
};

