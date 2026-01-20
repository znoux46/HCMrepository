// mapCanvas.js - Interactive Vietnam Map Canvas
// Tọa độ các tỉnh thành Việt Nam (tỉ lệ canvas 800x1000)

const createMapCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.id = 'vietnam-map-canvas';
  // Tăng kích thước canvas để có nhiều padding hơn xung quanh bản đồ
  canvas.width = 900;
  canvas.height = 1100;
  canvas.style.cursor = 'pointer';
  canvas.style.maxWidth = '100%';
  canvas.style.height = 'auto';
  canvas.style.border = '2px solid rgba(251, 191, 36, 0.3)';
  canvas.style.borderRadius = '12px';
  
  const ctx = canvas.getContext('2d');

  // Transform để bản đồ tận dụng gần hết chiều cao canvas và giãn đều theo trục dọc.
  // Dùng hệ toạ độ gốc để nội suy lại vào khung canvas với padding.
  const ORIGINAL_X_MIN = 200;
  const ORIGINAL_X_MAX = 600;
  const ORIGINAL_Y_MIN = 80;
  const ORIGINAL_Y_MAX = 1000;

  const PADDING_X = 90;
  const PADDING_TOP = 40;
  const PADDING_BOTTOM = 80;

  const transformPoint = ([x, y]) => {
    // Chuẩn hoá X vào [0,1] rồi map vào khung có padding ngang
    let nx = (x - ORIGINAL_X_MIN) / (ORIGINAL_X_MAX - ORIGINAL_X_MIN);
    nx = Math.min(Math.max(nx, 0), 1);
    const tx = PADDING_X + nx * (canvas.width - 2 * PADDING_X);

    // Chuẩn hoá Y vào [0,1]
    let ny = (y - ORIGINAL_Y_MIN) / (ORIGINAL_Y_MAX - ORIGINAL_Y_MIN);
    ny = Math.min(Math.max(ny, 0), 1);

    // Ưu tiên dãn phần phía Nam: ny^1.15 làm miền Bắc hơi nén, miền Nam giãn
    ny = Math.pow(ny, 1.15);

    const ty = PADDING_TOP + ny * (canvas.height - PADDING_TOP - PADDING_BOTTOM);

    return [tx, ty];
  };

  // Dữ liệu tọa độ các tỉnh thành (dựa trên vị trí địa lý thực tế)
  const provincePaths = {
    // Miền Bắc
    'hanoi': { path: [[320, 180], [360, 180], [360, 210], [320, 210]], center: [340, 195], name: 'Hà Nội' },
    'ha_giang': { path: [[280, 80], [320, 80], [320, 120], [280, 120]], center: [300, 100], name: 'Hà Giang' },
    'cao_bang': { path: [[340, 100], [380, 100], [380, 140], [340, 140]], center: [360, 120], name: 'Cao Bằng' },
    'bac_kan': { path: [[320, 140], [360, 140], [360, 170], [320, 170]], center: [340, 155], name: 'Bắc Kạn' },
    'tuyen_quang': { path: [[300, 160], [340, 160], [340, 190], [300, 190]], center: [320, 175], name: 'Tuyên Quang' },
    'lao_cai': { path: [[260, 120], [300, 120], [300, 160], [260, 160]], center: [280, 140], name: 'Lào Cai' },
    'dien_bien': { path: [[200, 140], [240, 140], [240, 180], [200, 180]], center: [220, 160], name: 'Điện Biên' },
    'lai_chau': { path: [[220, 120], [260, 120], [260, 150], [220, 150]], center: [240, 135], name: 'Lai Châu' },
    'son_la': { path: [[240, 180], [280, 180], [280, 220], [240, 220]], center: [260, 200], name: 'Sơn La' },
    'yen_bai': { path: [[280, 160], [320, 160], [320, 190], [280, 190]], center: [300, 175], name: 'Yên Bái' },
    'hoa_binh': { path: [[300, 220], [340, 220], [340, 250], [300, 250]], center: [320, 235], name: 'Hòa Bình' },
    'thai_nguyen': { path: [[360, 170], [400, 170], [400, 200], [360, 200]], center: [380, 185], name: 'Thái Nguyên' },
    'lang_son': { path: [[400, 120], [440, 120], [440, 160], [400, 160]], center: [420, 140], name: 'Lạng Sơn' },
    'quang_ninh': { path: [[440, 160], [480, 160], [480, 200], [440, 200]], center: [460, 180], name: 'Quảng Ninh' },
    'bac_giang': { path: [[380, 200], [420, 200], [420, 230], [380, 230]], center: [400, 215], name: 'Bắc Giang' },
    'phu_tho': { path: [[320, 210], [360, 210], [360, 240], [320, 240]], center: [340, 225], name: 'Phú Thọ' },
    'vinh_phuc': { path: [[340, 240], [380, 240], [380, 270], [340, 270]], center: [360, 255], name: 'Vĩnh Phúc' },
    'bac_ninh': { path: [[360, 230], [400, 230], [400, 260], [360, 260]], center: [380, 245], name: 'Bắc Ninh' },
    'hai_duong': { path: [[400, 260], [440, 260], [440, 290], [400, 290]], center: [420, 275], name: 'Hải Dương' },
    'hai_phong': { path: [[440, 280], [480, 280], [480, 310], [440, 310]], center: [460, 295], name: 'Hải Phòng' },
    'hung_yen': { path: [[360, 270], [400, 270], [400, 300], [360, 300]], center: [380, 285], name: 'Hưng Yên' },
    'ha_nam': { path: [[320, 300], [360, 300], [360, 330], [320, 330]], center: [340, 315], name: 'Hà Nam' },
    'nam_dinh': { path: [[360, 320], [400, 320], [400, 350], [360, 350]], center: [380, 335], name: 'Nam Định' },
    'thai_binh': { path: [[400, 330], [440, 330], [440, 360], [400, 360]], center: [420, 345], name: 'Thái Bình' },
    'ninh_binh': { path: [[360, 350], [400, 350], [400, 380], [360, 380]], center: [380, 365], name: 'Ninh Bình' },
    'thanh_hoa': { path: [[360, 380], [400, 380], [400, 420], [360, 420]], center: [380, 400], name: 'Thanh Hóa' },
    'nghe_an': { path: [[340, 420], [380, 420], [380, 460], [340, 460]], center: [360, 440], name: 'Nghệ An' },
    'ha_tinh': { path: [[380, 460], [420, 460], [420, 500], [380, 500]], center: [400, 480], name: 'Hà Tĩnh' },
    
    // Miền Trung
    'quang_binh': { path: [[400, 500], [440, 500], [440, 540], [400, 540]], center: [420, 520], name: 'Quảng Bình' },
    'quang_tri': { path: [[400, 540], [440, 540], [440, 580], [400, 580]], center: [420, 560], name: 'Quảng Trị' },
    'hue': { path: [[420, 580], [460, 580], [460, 620], [420, 620]], center: [440, 600], name: 'Thừa Thiên Huế' },
    'quang_nam': { path: [[440, 620], [480, 620], [480, 660], [440, 660]], center: [460, 640], name: 'Quảng Nam' },
    'da_nang': { path: [[460, 640], [500, 640], [500, 670], [460, 670]], center: [480, 655], name: 'Đà Nẵng' },
    'quang_ngai': { path: [[480, 660], [520, 660], [520, 700], [480, 700]], center: [500, 680], name: 'Quảng Ngãi' },
    'binh_dinh': { path: [[500, 700], [540, 700], [540, 740], [500, 740]], center: [520, 720], name: 'Bình Định' },
    'phu_yen': { path: [[520, 740], [560, 740], [560, 780], [520, 780]], center: [540, 760], name: 'Phú Yên' },
    'khanh_hoa': { path: [[540, 780], [580, 780], [580, 820], [540, 820]], center: [560, 800], name: 'Khánh Hòa' },
    'ninh_thuan': { path: [[560, 820], [600, 820], [600, 860], [560, 860]], center: [580, 840], name: 'Ninh Thuận' },
    'binh_thuan': { path: [[540, 860], [580, 860], [580, 900], [540, 900]], center: [560, 880], name: 'Bình Thuận' },
    'kon_tum': { path: [[480, 700], [520, 700], [520, 740], [480, 740]], center: [500, 720], name: 'Kon Tum' },
    'gia_lai': { path: [[500, 740], [540, 740], [540, 780], [500, 780]], center: [520, 760], name: 'Gia Lai' },
    'dak_lak': { path: [[520, 780], [560, 780], [560, 820], [520, 820]], center: [540, 800], name: 'Đắk Lắk' },
    'dak_nong': { path: [[500, 820], [540, 820], [540, 860], [500, 860]], center: [520, 840], name: 'Đắk Nông' },
    'lam_dong': { path: [[520, 860], [560, 860], [560, 900], [520, 900]], center: [540, 880], name: 'Lâm Đồng' },
    
    // Miền Nam
    'ho_chi_minh_city': { path: [[480, 900], [540, 900], [540, 960], [480, 960]], center: [510, 930], name: 'TP. Hồ Chí Minh' },
    'can_tho': { path: [[420, 960], [480, 960], [480, 1000], [420, 1000]], center: [450, 980], name: 'Cần Thơ' },
    'binh_phuoc': { path: [[540, 880], [580, 880], [580, 920], [540, 920]], center: [560, 900], name: 'Bình Phước' },
    'tay_ninh': { path: [[500, 920], [540, 920], [540, 960], [500, 960]], center: [520, 940], name: 'Tây Ninh' },
    'binh_duong': { path: [[520, 900], [560, 900], [560, 940], [520, 940]], center: [540, 920], name: 'Bình Dương' },
    'dong_nai': { path: [[540, 900], [580, 900], [580, 940], [540, 940]], center: [560, 920], name: 'Đồng Nai' },
    'ba_ria_vung_tau': { path: [[560, 920], [600, 920], [600, 960], [560, 960]], center: [580, 940], name: 'Bà Rịa - Vũng Tàu' },
    'long_an': { path: [[440, 940], [480, 940], [480, 980], [440, 980]], center: [460, 960], name: 'Long An' },
    'tien_giang': { path: [[460, 960], [500, 960], [500, 1000], [460, 1000]], center: [480, 980], name: 'Tiền Giang' },
    'ben_tre': { path: [[480, 960], [520, 960], [520, 990], [480, 990]], center: [500, 975], name: 'Bến Tre' },
    'tra_vinh': { path: [[500, 960], [540, 960], [540, 990], [500, 990]], center: [520, 975], name: 'Trà Vinh' },
    'vinh_long': { path: [[440, 960], [480, 960], [480, 990], [440, 990]], center: [460, 975], name: 'Vĩnh Long' },
    'dong_thap': { path: [[400, 940], [440, 940], [440, 980], [400, 980]], center: [420, 960], name: 'Đồng Tháp' },
    'an_giang': { path: [[380, 960], [420, 960], [420, 990], [380, 990]], center: [400, 975], name: 'An Giang' },
    'kien_giang': { path: [[360, 940], [400, 940], [400, 980], [360, 980]], center: [380, 960], name: 'Kiên Giang' },
    'ca_mau': { path: [[340, 970], [380, 970], [380, 1000], [340, 1000]], center: [360, 985], name: 'Cà Mau' },
    'bac_lieu': { path: [[380, 970], [420, 970], [420, 1000], [380, 1000]], center: [400, 985], name: 'Bạc Liêu' },
    'soc_trang': { path: [[420, 960], [460, 960], [460, 990], [420, 990]], center: [440, 975], name: 'Sóc Trăng' },
    'hau_giang': { path: [[400, 970], [440, 970], [440, 1000], [400, 1000]], center: [420, 985], name: 'Hậu Giang' }
  };
  
  // Các điểm đảo trên biển gắn với tỉnh tương ứng
  const seaIslands = [
    {
      id: 'hoang_sa',
      provinceId: 'da_nang',
      name: 'Hoàng Sa',
      coord: [620, 640] // ngoài khơi miền Trung
    },
    {
      id: 'truong_sa',
      provinceId: 'khanh_hoa',
      name: 'Trường Sa',
      coord: [640, 780] // xa hơn xuống phía Nam
    },
    {
      id: 'phu_quoc',
      provinceId: 'kien_giang',
      name: 'Phú Quốc',
      coord: [280, 960] // ngoài khơi phía Tây Nam, thuộc Kiên Giang
    }
  ];

  // Nhóm các tỉnh miền Nam (để thu nhỏ vùng chọn một chút)
  const southernProvinces = new Set([
    'lam_dong',
    'binh_phuoc', 'tay_ninh', 'binh_duong', 'dong_nai', 'ba_ria_vung_tau',
    'long_an', 'tien_giang', 'ben_tre', 'tra_vinh', 'vinh_long',
    'dong_thap', 'an_giang', 'kien_giang', 'ca_mau', 'bac_lieu',
    'soc_trang', 'hau_giang', 'can_tho', 'ho_chi_minh_city'
  ]);

  let hoveredProvince = null;
  let selectedProvince = null;
  
  // Vẽ bản đồ
  const drawMap = () => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background đơn sắc
    ctx.fillStyle = 'rgba(15, 23, 42, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ từng tỉnh dưới dạng ô vuông quanh tâm (dễ nhìn & dễ giãn khoảng cách)
    Object.entries(provincePaths).forEach(([id, data]) => {
      const isHovered = hoveredProvince === id;
      const isSelected = selectedProvince === id;
      const [cx, cy] = transformPoint(data.center);

      const size = southernProvinces.has(id) ? 28 : 30;

      ctx.beginPath();
      ctx.rect(cx - size / 2, cy - size / 2, size, size);

      // Tô màu tỉnh cho dễ nhìn / dễ chọn
      if (isSelected) {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.7)'; // Amber selected
      } else if (isHovered) {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.5)'; // Amber hover
      } else {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)'; // Slate default
      }
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.8)';
      ctx.lineWidth = isHovered || isSelected ? 2 : 1;
      ctx.fill();
      ctx.stroke();

      // Marker & tên tỉnh (chỉ hiển thị khi hover hoặc selected)
      if (isHovered || isSelected) {
        // Marker hình vuông nhỏ
        ctx.save();
        ctx.fillStyle = isSelected ? 'rgba(251, 191, 36, 0.9)' : 'rgba(251, 191, 36, 0.7)';
        const size = 10;
        ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
        ctx.restore();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Lexend, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Background cho text để dễ đọc
        const textWidth = ctx.measureText(data.name).width;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(cx - textWidth/2 - 4, cy - 18, textWidth + 8, 16);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillText(data.name, cx, cy - 10);
      }
    });

    // Vẽ các đảo Hoàng Sa / Trường Sa
    seaIslands.forEach(island => {
      const [ix, iy] = transformPoint(island.coord);

      // Vòng tròn đảo
      ctx.beginPath();
      ctx.arc(ix, iy, 6, 0, Math.PI * 2);
      const isHovered = hoveredProvince === island.provinceId;
      const isSelected = selectedProvince === island.provinceId;
      ctx.fillStyle = isSelected
        ? 'rgba(251, 191, 36, 0.9)'
        : isHovered
          ? 'rgba(251, 191, 36, 0.7)'
          : 'rgba(248, 250, 252, 0.8)';
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      // Nhãn đảo
      ctx.fillStyle = '#e5e7eb';
      ctx.font = 'bold 10px Lexend, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
    //   const label = island.name + (island.provinceId === 'da_nang' ? ' (Đà Nẵng)' : ' (Khánh Hòa)');

    let provinceSuffix = '';

    switch (island.provinceId) {
      case 'da_nang':
        provinceSuffix = ' (Đà Nẵng)';
        break;
      case 'khanh_hoa':
        provinceSuffix = ' (Khánh Hòa)';
        break;
      case 'kien_giang':
        provinceSuffix = ' (Kiên Giang)';
        break;
      default:
        provinceSuffix = '';
    }
    
    const label = island.name + provinceSuffix;    ctx.fillText(label, ix + 10, iy);
    });
  };
  
  // Kiểm tra điểm có trong polygon không (Point-in-Polygon algorithm)
  const pointInPolygon = (point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      const intersect = ((yi > point[1]) !== (yj > point[1]))
        && (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };
  
  // Lấy tỉnh tại tọa độ (dựa trên vùng tròn quanh tâm tỉnh, thay vì cả polygon)
  const getProvinceAt = (x, y) => {
    for (const [id, data] of Object.entries(provincePaths)) {
      const [cx, cy] = transformPoint(data.center);
      const dx = x - cx;
      const dy = y - cy;
      const distSq = dx * dx + dy * dy;

      // Miền Nam: vùng chọn nhỏ hơn một chút để giảm chồng lấn
      const baseRadius = southernProvinces.has(id) ? 20 : 24;
      if (distSq <= baseRadius * baseRadius) {
        return id;
      }
    }

    // Nếu click gần các đảo thì trả về tỉnh tương ứng
    for (const island of seaIslands) {
      const [ix, iy] = transformPoint(island.coord);
      const dx = x - ix;
      const dy = y - iy;
      const distSq = dx * dx + dy * dy;
      const radius = 10;
      if (distSq <= radius * radius) {
        return island.provinceId;
      }
    }

    return null;
  };
  
  // Tooltip element
  let tooltip = null;
  
  const showProvinceTooltip = (x, y, provinceId) => {
    const province = window.gameData?.provinces?.find(p => p.id === provinceId);
    if (!province) return;
    
    const state = window.store?.getState?.() || {};
    const progress = state.provinceProgress?.[provinceId];
    
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'fixed bg-gradient-to-br from-slate-800 to-slate-900 text-white px-4 py-3 rounded-lg shadow-2xl z-[100] pointer-events-none border-2 border-amber-500/50 max-w-sm';
      tooltip.style.display = 'none';
      document.body.appendChild(tooltip);
    }
    
    // Lấy thông tin sách và item đặc biệt
    const knowledgeBooks = province.knowledgeAreas?.map(area => {
      const bookKey = area + '_book';
      const book = window.gameData?.items?.[bookKey];
      return book ? { icon: book.icon, name: book.name } : null;
    }).filter(Boolean) || [];
    
    const uniqueItemsList = province.uniqueItems?.map(itemId => {
      const item = window.gameData?.items?.[itemId];
      return item ? { icon: item.icon, name: item.name, rarity: item.rarity } : null;
    }).filter(Boolean) || [];
    
    tooltip.innerHTML = `
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">${province.icon || '📍'}</span>
        <div class="font-bold text-amber-400 text-lg">${province.name}</div>
      </div>
      <div class="text-sm text-slate-300 mb-1">${province.description || ''}</div>
      ${province.culturalFact ? `<p class="text-xs text-amber-400 mb-2 italic">"${province.culturalFact}"</p>` : ''}
      <div class="text-xs text-slate-400 mb-2">
        <span>⭐ Cấp ${province.difficulty || 1}</span>
      </div>
      
      ${knowledgeBooks.length > 0 ? `
        <div class="mb-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p class="text-xs font-semibold text-blue-400 mb-1">📚 Sách có thể nhận:</p>
          <div class="flex flex-wrap gap-1 mb-1">
            ${knowledgeBooks.map(book => `<span class="text-xs px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/40 rounded" title="${book.name}">${book.icon}</span>`).join('')}
          </div>
          <p class="text-xs text-slate-400">${knowledgeBooks.map(b => b.name).join(', ')}</p>
        </div>
      ` : ''}
      
      ${uniqueItemsList.length > 0 ? `
        <div class="mb-2 p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p class="text-xs font-semibold text-purple-400 mb-1">⭐ Item đặc biệt:</p>
          <div class="flex flex-wrap gap-1 mb-1">
            ${uniqueItemsList.map(item => {
              const rarityColor = item.rarity === 'legendary' ? 'text-yellow-400 border-yellow-500/40 bg-yellow-500/20' :
                                item.rarity === 'epic' ? 'text-purple-400 border-purple-500/40 bg-purple-500/20' :
                                item.rarity === 'rare' ? 'text-blue-400 border-blue-500/40 bg-blue-500/20' :
                                'text-green-400 border-green-500/40 bg-green-500/20';
              return `<span class="text-xs px-1.5 py-0.5 ${rarityColor} border rounded" title="${item.name}">${item.icon}</span>`;
            }).join('')}
          </div>
          <p class="text-xs text-slate-400">${uniqueItemsList.map(i => i.name).join(', ')}</p>
        </div>
      ` : ''}
      
      ${progress ? `
        <div class="mb-2 text-xs text-slate-300 space-y-1 border-t border-slate-600/50 pt-2">
          <div class="flex justify-between">
            <span>💡 Học được:</span>
            <span class="font-semibold">${progress.knowledgeGained || 0}</span>
          </div>
          <div class="flex justify-between">
            <span>🗣️ Thắng tranh luận:</span>
            <span class="font-semibold">${progress.debatesWon || 0}</span>
          </div>
        </div>
      ` : ''}
      
      <div class="text-xs text-amber-400 mt-2 border-t border-slate-600/50 pt-2">
        Click để khám phá
      </div>
    `;
    
    // Đặt vị trí tooltip
    const rect = canvas.getBoundingClientRect();
    tooltip.style.left = `${x + 15}px`;
    tooltip.style.top = `${y + 15}px`;
    
    // Đảm bảo tooltip không ra ngoài màn hình
    setTimeout(() => {
      const tooltipRect = tooltip.getBoundingClientRect();
      if (tooltipRect.right > window.innerWidth) {
        tooltip.style.left = `${x - tooltipRect.width - 15}px`;
      }
      if (tooltipRect.bottom > window.innerHeight) {
        tooltip.style.top = `${y - tooltipRect.height - 15}px`;
      }
    }, 0);
    
    tooltip.style.display = 'block';
  };
  
  const hideProvinceTooltip = () => {
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  };
  
  // Event handlers
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const provinceId = getProvinceAt(x, y);
    if (provinceId !== hoveredProvince) {
      hoveredProvince = provinceId;
      drawMap();
      
      if (provinceId) {
        showProvinceTooltip(e.clientX, e.clientY, provinceId);
      } else {
        hideProvinceTooltip();
      }
    } else if (provinceId && tooltip) {
      // Cập nhật vị trí tooltip khi di chuyển chuột
      const rect = canvas.getBoundingClientRect();
      tooltip.style.left = `${e.clientX + 15}px`;
      tooltip.style.top = `${e.clientY + 15}px`;
    }
  });
  
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const provinceId = getProvinceAt(x, y);
    if (provinceId) {
      selectedProvince = provinceId;
      drawMap();
      hideProvinceTooltip();
      
      // Gọi hàm chọn tỉnh từ game
      if (window.selectProvinceFromMap) {
        window.selectProvinceFromMap(provinceId);
      }
    }
  });
  
  canvas.addEventListener('mouseleave', () => {
    hoveredProvince = null;
    drawMap();
    hideProvinceTooltip();
  });
  
  // Vẽ lần đầu
  drawMap();
  
  return canvas;
};

// Export để sử dụng
if (typeof window !== 'undefined') {
  window.createMapCanvas = createMapCanvas;
}
