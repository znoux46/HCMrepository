// mapCanvas.js - Interactive Vietnam Map Canvas with Real GeoJSON Data
// Phong cách Pixel Art với dữ liệu thật 100% từ VietNamMap.json

const createMapCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.id = 'vietnam-map-canvas';
  canvas.width = 1100;
  canvas.height = 1200;
  canvas.style.cursor = 'pointer';
  canvas.style.maxWidth = '100%';
  canvas.style.height = 'auto';
  canvas.style.border = '3px solid #fbbf24';
  canvas.style.borderRadius = '16px';
  canvas.style.boxShadow = '0 10px 40px rgba(251, 191, 36, 0.3)';
  canvas.style.imageRendering = 'pixelated'; // Pixel art style
  
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false; // Crisp pixel rendering

  let geoData = null;
  let hoveredProvince = null;
  let selectedProvince = null;
  let currentFilter = []; // Array of knowledge areas to filter by
  
  // Bảng màu pixel art đẹp mắt cho từng vùng
  const regionColors = {
    // Miền Bắc - Xanh dương và tím
    'north': {
      base: '#60a5fa',      // Blue 400
      hover: '#3b82f6',     // Blue 500
      selected: '#2563eb',  // Blue 600
      border: '#1e40af'     // Blue 800
    },
    // Đồng bằng Bắc Bộ - Xanh lá
    'delta': {
      base: '#34d399',      // Emerald 400
      hover: '#10b981',     // Emerald 500
      selected: '#059669',  // Emerald 600
      border: '#047857'     // Emerald 700
    },
    // Miền Trung - Vàng cam
    'central': {
      base: '#fbbf24',      // Amber 400
      hover: '#f59e0b',     // Amber 500
      selected: '#d97706',  // Amber 600
      border: '#b45309'     // Amber 700
    },
    // Tây Nguyên - Nâu đỏ
    'highland': {
      base: '#f87171',      // Red 400
      hover: '#ef4444',     // Red 500
      selected: '#dc2626',  // Red 600
      border: '#991b1b'     // Red 800
    },
    // Miền Nam - Hồng tím
    'south': {
      base: '#c084fc',      // Purple 400
      hover: '#a855f7',     // Purple 500
      selected: '#9333ea',  // Purple 600
      border: '#6b21a8'     // Purple 800
    },
    // Đồng bằng sông Cửu Long - Xanh ngọc
    'mekong': {
      base: '#2dd4bf',      // Teal 400
      hover: '#14b8a6',     // Teal 500
      selected: '#0d9488',  // Teal 600
      border: '#0f766e'     // Teal 700
    }
  };

  // Mapping từ GeoJSON province name sang game data province ID
  const provinceNameToId = {
    'AnGiang': 'an_giang', 'BaRia-VungTau': 'ba_ria_vung_tau', 'BacGiang': 'bac_giang',
    'BacKan': 'bac_kan', 'BacLieu': 'bac_lieu', 'BacNinh': 'bac_ninh',
    'BenTre': 'ben_tre', 'BinhDinh': 'binh_dinh', 'BinhDuong': 'binh_duong',
    'BinhPhuoc': 'binh_phuoc', 'BinhThuan': 'binh_thuan', 'CaMau': 'ca_mau',
    'CanTho': 'can_tho', 'CaoBang': 'cao_bang', 'DaNang': 'da_nang',
    'DakLak': 'dak_lak', 'DakNong': 'dak_nong', 'DienBien': 'dien_bien',
    'DongNai': 'dong_nai', 'DongThap': 'dong_thap', 'GiaLai': 'gia_lai',
    'HaGiang': 'ha_giang', 'HaNam': 'ha_nam', 'HaNoi': 'hanoi',
    'HaTinh': 'ha_tinh', 'HaiDuong': 'hai_duong', 'HaiPhong': 'hai_phong',
    'HauGiang': 'hau_giang', 'HoChiMinh': 'ho_chi_minh_city', 'HoaBinh': 'hoa_binh',
    'HungYen': 'hung_yen', 'KhanhHoa': 'khanh_hoa', 'KienGiang': 'kien_giang',
    'KonTum': 'kon_tum', 'LaiChau': 'lai_chau', 'LamDong': 'lam_dong',
    'LangSon': 'lang_son', 'LaoCai': 'lao_cai', 'LongAn': 'long_an',
    'NamDinh': 'nam_dinh', 'NgheAn': 'nghe_an', 'NinhBinh': 'ninh_binh',
    'NinhThuan': 'ninh_thuan', 'PhuTho': 'phu_tho', 'PhuYen': 'phu_yen',
    'QuangBinh': 'quang_binh', 'QuangNam': 'quang_nam', 'QuangNgai': 'quang_ngai',
    'QuangNinh': 'quang_ninh', 'QuangTri': 'quang_tri', 'SocTrang': 'soc_trang',
    'SonLa': 'son_la', 'TayNinh': 'tay_ninh', 'ThaiBinh': 'thai_binh',
    'ThaiNguyen': 'thai_nguyen', 'ThanhHoa': 'thanh_hoa', 'ThuaThienHue': 'hue',
    'TienGiang': 'tien_giang', 'TraVinh': 'tra_vinh', 'TuyenQuang': 'tuyen_quang',
    'VinhLong': 'vinh_long', 'VinhPhuc': 'vinh_phuc', 'YenBai': 'yen_bai'
  };

  // Phân loại tỉnh thành theo vùng
  const provinceRegions = {
    // Miền Bắc
    'HaGiang': 'north', 'CaoBang': 'north', 'BacKan': 'north', 
    'TuyenQuang': 'north', 'LaoCai': 'north', 'YenBai': 'north',
    'LaiChau': 'north', 'SonLa': 'north', 'DienBien': 'north',
    'ThaiNguyen': 'north', 'LangSon': 'north', 'BacGiang': 'north',
    'PhuTho': 'north', 'QuangNinh': 'north', 'HoaBinh': 'north',
    
    // Đồng bằng Bắc Bộ
    'HaNoi': 'delta', 'VinhPhuc': 'delta', 'BacNinh': 'delta',
    'HaiDuong': 'delta', 'HaiPhong': 'delta', 'HungYen': 'delta',
    'ThaiBinh': 'delta', 'HaNam': 'delta', 'NamDinh': 'delta',
    'NinhBinh': 'delta', 'ThanhHoa': 'delta',
    
    // Miền Trung
    'NgheAn': 'central', 'HaTinh': 'central', 'QuangBinh': 'central',
    'QuangTri': 'central', 'ThuaThienHue': 'central', 'DaNang': 'central',
    'QuangNam': 'central', 'QuangNgai': 'central', 'BinhDinh': 'central',
    'PhuYen': 'central', 'KhanhHoa': 'central', 'NinhThuan': 'central',
    'BinhThuan': 'central',
    
    // Tây Nguyên
    'KonTum': 'highland', 'GiaLai': 'highland', 'DakLak': 'highland',
    'DakNong': 'highland', 'LamDong': 'highland',
    
    // Đông Nam Bộ
    'BinhPhuoc': 'south', 'TayNinh': 'south', 'BinhDuong': 'south',
    'DongNai': 'south', 'BaRia-VungTau': 'south', 'HoChiMinh': 'south',
    
    // Đồng bằng sông Cửu Long
    'LongAn': 'mekong', 'TienGiang': 'mekong', 'BenTre': 'mekong',
    'TraVinh': 'mekong', 'VinhLong': 'mekong', 'DongThap': 'mekong',
    'AnGiang': 'mekong', 'KienGiang': 'mekong', 'CanTho': 'mekong',
    'HauGiang': 'mekong', 'SocTrang': 'mekong', 'BacLieu': 'mekong',
    'CaMau': 'mekong'
  };

  // Quần đảo Hoàng Sa, Trường Sa và đảo Phú Quốc
  const vietnamIslands = [
    {
      name: 'Quần đảo Hoàng Sa',
      nameEn: 'Paracel Islands',
      icon: '🏝️',
      lon: 112.0,
      lat: 16.5,
      description: 'Quần đảo Hoàng Sa thuộc chủ quyền Việt Nam',
      color: '#ef4444' // Red for sovereignty
    },
    {
      name: 'Quần đảo Trường Sa',
      nameEn: 'Spratly Islands',
      icon: '🏝️',
      lon: 114.0,   
      lat: 10.0,
      description: 'Quần đảo Trường Sa thuộc chủ quyền Việt Nam',
      color: '#ef4444' // Red for sovereignty
    },
    {
      name: 'Đảo Phú Quốc',
      nameEn: 'Phu Quoc Island',
      icon: '🏖️',
      lon: 103.97,
      lat: 10.22,
      description: 'Đảo ngọc Phú Quốc - Kiên Giang',
      color: '#14b8a6' // Teal cho đảo du lịch
    }
  ];

  // Update currentFilter based on store state
  const updateFilter = () => {
    if (window.store) {
      const state = window.store.getState();
      currentFilter = state.knowledgeFilter || [];
      drawMap(); // Redraw map when filter changes
    }
  };

  // Load GeoJSON data from file
  const loadGeoData = async () => {
    try {
      const response = await fetch('VietNamMap.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      geoData = await response.json();
      console.log('✅ Đã tải dữ liệu bản đồ thành công:', geoData.features.length, 'tỉnh');

      // Initial filter update
      updateFilter();

      // Subscribe to store changes to update filter
      if (window.store) {
        window.store.subscribe(updateFilter);
      }

      drawMap();
    } catch (error) {
      console.error('❌ Lỗi khi tải dữ liệu bản đồ:', error);
      drawErrorMessage();
    }
  };

  // Chuyển đổi tọa độ địa lý (longitude, latitude) sang tọa độ canvas
  const projectToCanvas = (lon, lat) => {
    // Vietnam bounds: longitude 102-115 (bao gồm Hoàng Sa, Trường Sa), latitude 8-24
    const lonMin = 102, lonMax = 115;
    const latMin = 8, latMax = 24;
    
    const padding = 50;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    
    const x = padding + ((lon - lonMin) / (lonMax - lonMin)) * width;
    const y = padding + ((latMax - lat) / (latMax - latMin)) * height;
    
    return [x, y];
  };

  // Lấy màu sắc cho tỉnh
  const getProvinceColor = (provinceName, state = 'base') => {
    const region = provinceRegions[provinceName] || 'central';
    return regionColors[region][state] || regionColors.central[state];
  };

  // Vẽ một polygon với phong cách pixel
  const drawPixelPolygon = (coordinates, fillColor, borderColor, lineWidth = 2) => {
    if (!coordinates || coordinates.length === 0) return;
    
    // Handle MultiPolygon - vẽ polygon lớn nhất
    let mainPolygon = coordinates;
    if (coordinates[0] && Array.isArray(coordinates[0][0]) && Array.isArray(coordinates[0][0][0])) {
      // Find largest polygon
      mainPolygon = coordinates.reduce((largest, current) => {
        return (current[0] && current[0].length > (largest[0] ? largest[0].length : 0)) ? current : largest;
      }, coordinates[0]);
    }
    
    const ring = mainPolygon[0] || mainPolygon;
    if (!ring || ring.length < 3) return;
    
    // Filter các điểm có tọa độ bất thường (lỗi dữ liệu trong GeoJSON)
    const validRing = ring.filter(point => {
      const [lon, lat] = point;
      return lon >= 102 && lon <= 115 && lat >= 8 && lat <= 24;
    });
    
    if (validRing.length < 3) return;
    
    ctx.beginPath();
    const [startX, startY] = projectToCanvas(validRing[0][0], validRing[0][1]);
    ctx.moveTo(Math.floor(startX), Math.floor(startY));
    
    for (let i = 1; i < validRing.length; i++) {
      const [x, y] = projectToCanvas(validRing[i][0], validRing[i][1]);
      ctx.lineTo(Math.floor(x), Math.floor(y));
    }
    ctx.closePath();
    
    ctx.fillStyle = fillColor;
    ctx.fill();
    
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  // Tính centroid của polygon để đặt label
  const getPolygonCentroid = (coordinates) => {
    if (!coordinates || coordinates.length === 0) return null;
    
    let ring = coordinates;
    if (Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0]) && Array.isArray(coordinates[0][0][0])) {
      ring = coordinates[0][0];
    } else if (Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0])) {
      ring = coordinates[0];
    }
    
    if (!ring || ring.length === 0) return null;
    
    let sumLon = 0, sumLat = 0;
    for (const point of ring) {
      sumLon += point[0];
      sumLat += point[1];
    }
    
    return [sumLon / ring.length, sumLat / ring.length];
  };

  // Vẽ bản đồ
  const drawMap = () => {
    if (!geoData) return;

    // Clear canvas với gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0f172a');  // Slate 900
    gradient.addColorStop(1, '#1e293b');  // Slate 800
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ title
    ctx.save();
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🇻🇳 BẢN ĐỒ VIỆT NAM', canvas.width / 2, 35);
    ctx.restore();

    // Vẽ tất cả các tỉnh
    geoData.features.forEach(feature => {
      const provinceName = feature.properties.VARNAME_1 || feature.properties.NAME_1;
      const isHovered = hoveredProvince === provinceName;
      const isSelected = selectedProvince === provinceName;

      // Check if province matches the current filter
      const provinceId = provinceNameToId[provinceName];
      const province = provinceId ? window.gameData?.provinces?.find(p => p.id === provinceId) : null;
      const shouldHighlight = currentFilter.length === 0 || (province && province.knowledgeAreas && province.knowledgeAreas.some(area => currentFilter.includes(area)));

      const state = isSelected ? 'selected' : isHovered ? 'hover' : 'base';
      let fillColor = getProvinceColor(provinceName, state);

      // Apply filter: if filter is active and province doesn't match, use gray color
      if (currentFilter.length > 0 && !shouldHighlight) {
        fillColor = '#e5e7eb'; // Gray for filtered out provinces
      }

      const borderColor = getProvinceColor(provinceName, 'border');
      const lineWidth = isSelected ? 4 : isHovered ? 3 : 2;

      drawPixelPolygon(feature.geometry.coordinates, fillColor, borderColor, lineWidth);

      // Vẽ label cho tỉnh đang hover hoặc selected
      if (isHovered || isSelected) {
        const centroid = getPolygonCentroid(feature.geometry.coordinates);
        if (centroid) {
          const [cx, cy] = projectToCanvas(centroid[0], centroid[1]);

          // Background cho text (pixel style)
          const displayName = feature.properties.NAME_1;
          ctx.font = 'bold 13px monospace';
          const textWidth = ctx.measureText(displayName).width;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          const boxPadding = 6;
          ctx.fillRect(
            Math.floor(cx - textWidth / 2 - boxPadding),
            Math.floor(cy - 20),
            Math.ceil(textWidth + boxPadding * 2),
            22
          );

          // Border cho text box
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            Math.floor(cx - textWidth / 2 - boxPadding),
            Math.floor(cy - 20),
            Math.ceil(textWidth + boxPadding * 2),
            22
          );

          // Text
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(displayName, Math.floor(cx), Math.floor(cy - 9));
        }
      }
    });

    // Vẽ các quần đảo Hoàng Sa và Trường Sa
    drawIslands();

    // Vẽ legend
    drawLegend();
  };

  // Vẽ các quần đảo Hoàng Sa và Trường Sa
  const drawIslands = () => {
    vietnamIslands.forEach(island => {
      const [x, y] = projectToCanvas(island.lon, island.lat);
      
      // Vẽ vòng tròn đại diện cho quần đảo
      ctx.save();
      
      // Vẽ main circle (không dùng shadow để tránh artifact)
      ctx.fillStyle = island.color;
      ctx.beginPath();
      ctx.arc(Math.floor(x), Math.floor(y), 8, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      
      // Inner circle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(Math.floor(x), Math.floor(y), 5, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      
      // Border
      ctx.strokeStyle = island.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(Math.floor(x), Math.floor(y), 8, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
      
      ctx.restore();
      
      // Label
      ctx.save();
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Background cho text
      const textWidth = ctx.measureText(island.name).width;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(
        Math.floor(x - textWidth / 2 - 6),
        Math.floor(y + 12),
        Math.ceil(textWidth + 12),
        20
      );
      
      // Border cho text box
      ctx.strokeStyle = island.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(
        Math.floor(x - textWidth / 2 - 6),
        Math.floor(y + 12),
        Math.ceil(textWidth + 12),
        20
      );
      
      // Text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(island.name, Math.floor(x), Math.floor(y + 22));
      
      // Icon
      ctx.font = 'bold 14px monospace';
      ctx.fillText(island.icon, Math.floor(x), Math.floor(y - 1));
      
      ctx.restore();
    });
  };

  // Vẽ legend (chú thích màu sắc)
  const drawLegend = () => {
    const legendData = [
      { name: 'Miền Bắc', color: regionColors.north.base },
      { name: 'Đồng bằng BB', color: regionColors.delta.base },
      { name: 'Miền Trung', color: regionColors.central.base },
      { name: 'Tây Nguyên', color: regionColors.highland.base },
      { name: 'Đông Nam Bộ', color: regionColors.south.base },
      { name: 'Đồng bằng SCL', color: regionColors.mekong.base }
    ];
    
    const startX = 20;
    const startY = canvas.height - 140;
    const boxSize = 16;
    const spacing = 22;
    
    ctx.save();
    
    // Background cho legend
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(startX - 5, startY - 5, 160, spacing * legendData.length + 10);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX - 5, startY - 5, 160, spacing * legendData.length + 10);
    
    legendData.forEach((item, index) => {
      const y = startY + index * spacing;
      
      // Color box
      ctx.fillStyle = item.color;
      ctx.fillRect(startX, y, boxSize, boxSize);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, y, boxSize, boxSize);
      
      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.name, startX + boxSize + 8, y + boxSize / 2);
    });
    
    ctx.restore();
  };

  // Vẽ thông báo lỗi
  const drawErrorMessage = () => {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚠️ Không thể tải dữ liệu bản đồ', canvas.width / 2, canvas.height / 2);
    ctx.font = '14px monospace';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Vui lòng kiểm tra file VietNamMap.json', canvas.width / 2, canvas.height / 2 + 30);
  };

  // Kiểm tra điểm có trong polygon không
  const pointInPolygon = (point, polygon) => {
    if (!polygon || polygon.length === 0) return false;
    
    // Xử lý MultiPolygon - kiểm tra tất cả các polygon
    if (Array.isArray(polygon[0]) && Array.isArray(polygon[0][0]) && Array.isArray(polygon[0][0][0])) {
      // MultiPolygon: [[[polygon1]], [[polygon2]], ...]
      for (const multiPoly of polygon) {
        if (checkSinglePolygon(point, multiPoly[0])) {
          return true;
        }
      }
      return false;
    }
    
    // Single Polygon hoặc Polygon with holes
    let ring = polygon;
    if (Array.isArray(polygon[0]) && Array.isArray(polygon[0][0])) {
      ring = polygon[0];
    }
    
    return checkSinglePolygon(point, ring);
  };
  
  // Helper function để check một polygon đơn
  const checkSinglePolygon = (point, ring) => {
    if (!ring || ring.length < 3) return false;
    
    const [testX, testY] = point;
    let inside = false;
    
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [lonI, latI] = ring[i];
      const [lonJ, latJ] = ring[j];
      const [xi, yi] = projectToCanvas(lonI, latI);
      const [xj, yj] = projectToCanvas(lonJ, latJ);
      
      const intersect = ((yi > testY) !== (yj > testY))
        && (testX < (xj - xi) * (testY - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    
    return inside;
  };

  // Lấy tỉnh tại tọa độ canvas
  const getProvinceAt = (x, y) => {
    if (!geoData) return null;
    
    // Kiểm tra xem có hover vào quần đảo không
    for (const island of vietnamIslands) {
      const [ix, iy] = projectToCanvas(island.lon, island.lat);
      const distance = Math.sqrt((x - ix) ** 2 + (y - iy) ** 2);
      if (distance <= 8) {
        return { type: 'island', data: island };
      }
    }
    
    for (const feature of geoData.features) {
      if (pointInPolygon([x, y], feature.geometry.coordinates)) {
        return feature.properties.VARNAME_1 || feature.properties.NAME_1;
      }
    }
    return null;
  };

  // Tooltip element
  let tooltip = null;
  
  const showProvinceTooltip = (x, y, provinceName) => {
    // Xử lý tooltip cho quần đảo
    if (typeof provinceName === 'object' && provinceName.type === 'island') {
      const island = provinceName.data;
      
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'fixed bg-gradient-to-br from-slate-800 to-slate-900 text-white px-4 py-3 rounded-lg shadow-2xl z-[100] pointer-events-none border-2 border-red-500/50 max-w-sm';
        tooltip.style.display = 'none';
        document.body.appendChild(tooltip);
      }
      
      tooltip.innerHTML = `
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">${island.icon}</span>
          <div class="font-bold text-red-400 text-lg">${island.name}</div>
        </div>
        <div class="text-sm text-slate-300 mb-2">${island.description}</div>
        <div class="text-xs text-red-400 mt-2 border-t border-slate-600/50 pt-2 font-semibold">
          🇻🇳 Chủ quyền thiêng liêng của Việt Nam
        </div>
      `;
      
      tooltip.style.left = `${x + 15}px`;
      tooltip.style.top = `${y + 15}px`;
      tooltip.style.display = 'block';
      return;
    }
    
    // Map từ GeoJSON name sang game data ID
    const provinceId = provinceNameToId[provinceName];
    
    // Debug logging
    if (!provinceId) {
      console.warn(`⚠️ Không tìm thấy mapping cho tỉnh: ${provinceName}`);
      console.log('Available mappings:', Object.keys(provinceNameToId));
      return;
    }
    
    const province = provinceId ? window.gameData?.provinces?.find(p => p.id === provinceId) : null;
    
    if (!province) {
      console.warn(`⚠️ Không tìm thấy province data cho ID: ${provinceId} (từ ${provinceName})`);
      return;
    }
    
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

    // Lấy thông tin công cụ được sử dụng làm nguyên liệu (tools used as materials in recipes)
    const toolMaterials = Object.values(window.gameData?.items || {}).filter(item => {
      // Check if this item is used as a material in any recipe
      return Object.values(window.gameData?.items || {}).some(otherItem =>
        otherItem.recipe && Object.keys(otherItem.recipe).includes(item.id)
      ) &&
      !item.name.toLowerCase().includes('book') &&
      !item.name.toLowerCase().includes('paper') &&
      !item.name.toLowerCase().includes('tờ');
    });
    
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

      ${toolMaterials.length > 0 ? `
        <div class="mb-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p class="text-xs font-semibold text-blue-400 mb-1">🔧 Công cụ nguyên liệu:</p>
          <div class="flex flex-wrap gap-1 mb-1">
            ${toolMaterials.map(tool => `<span class="text-xs px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/40 rounded" title="${tool.name}">${tool.icon}</span>`).join('')}
          </div>
          <p class="text-xs text-slate-400">${toolMaterials.map(t => t.name).join(', ')}</p>
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
    
    const provinceName = getProvinceAt(x, y);
    const prevHover = JSON.stringify(hoveredProvince);
    const currHover = JSON.stringify(provinceName);
    
    if (prevHover !== currHover) {
      hoveredProvince = provinceName;
      drawMap();
      
      if (provinceName) {
        if (typeof provinceName === 'object' && provinceName.type === 'island') {
          console.log('🏝️ Hover vào quần đảo:', provinceName.data.name);
        } else {
          console.log('🗺️ Hover vào tỉnh:', provinceName);
        }
        showProvinceTooltip(e.clientX, e.clientY, provinceName);
      } else {
        hideProvinceTooltip();
      }
    } else if (provinceName && tooltip) {
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
    
    const provinceName = getProvinceAt(x, y);
    if (provinceName) {
      // Nếu click vào quần đảo, chỉ hiển thị thông tin (không redirect)
      if (typeof provinceName === 'object' && provinceName.type === 'island') {
        console.log('🏝️ Click vào quần đảo:', provinceName.data.name);
        return;
      }
      
      selectedProvince = provinceName;
      drawMap();
      hideProvinceTooltip();
      
      // Map từ GeoJSON name sang game data ID
      const provinceId = provinceNameToId[provinceName];
      
      // Gọi hàm chọn tỉnh từ game để redirect
      if (provinceId && window.selectProvinceFromMap) {
        window.selectProvinceFromMap(provinceId);
      }
    }
  });
  
  canvas.addEventListener('mouseleave', () => {
    hoveredProvince = null;
    drawMap();
    hideProvinceTooltip();
  });
  
  // Load data và vẽ bản đồ
  loadGeoData();
  
  return canvas;
};

// Export để sử dụng
if (typeof window !== 'undefined') {
  window.createMapCanvas = createMapCanvas;
}

