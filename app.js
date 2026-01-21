const gameData = window.gameData;
if (!gameData) {
  throw new Error('Missing gameData: make sure data.js is loaded before app.js');
}
const ENEMY_WEAKEN = 0.65;

// ==================== STATE MANAGEMENT ====================
const createStore = (initialState) => {
  let state = initialState;
  const listeners = new Set();

  return {
    getState: () => state,
    setState: (newState, skipRender = false) => {
      state = typeof newState === 'function' ? newState(state) : { ...state, ...newState };
      if (!skipRender) {
        listeners.forEach(listener => listener(state));
      }
      saveToLocalStorage(state);
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
};

const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('hcm-thought-game');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load:', e);
  }
  return null;
};

const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem('hcm-thought-game', JSON.stringify({
      scholar: state.scholar,
      inventory: state.inventory,
      unlockedProvinces: state.unlockedProvinces,
      provinceProgress: state.provinceProgress,
      season: state.season,
      currentMonth: state.currentMonth
    }));
  } catch (e) {
    console.error('Failed to save:', e);
  }
};

const saved = loadFromLocalStorage();
// Ensure all provinces are unlocked (merge with saved data if exists)
const allProvinceIds = gameData.provinces.map(p => p.id);
const unlockedProvinces = saved?.unlockedProvinces 
  ? [...new Set([...saved.unlockedProvinces, ...allProvinceIds])] // Merge and deduplicate
  : allProvinceIds;

// Season system: Spring 2026 - Spring 2030 (20 seasons total)
const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
const getSeasonName = (seasonIndex) => {
  const year = 2026 + Math.floor(seasonIndex / 4);
  const season = seasons[seasonIndex % 4];
  return `${season} ${year}`;
};

const store = createStore({
  currentPage: 'intro',
  currentProvince: null,
  autoArgument: false,
  season: saved?.season || 0, // 0 = Spring 2026, 19 = Spring 2030
  currentMonth: saved?.currentMonth || 0, // 0 = first month, 1 = second month, 2 = final month
  rulesSection: 'general',
  knowledgeFilter: [], // Array of knowledge areas to filter by
  scholar: saved?.scholar || {
    name: "Học viên",
    level: 1,
    exp: 0,
    maxConfidence: 100,
    currentConfidence: 100,
    basePersuasion: 12,
    baseResilience: 8,
    argument: null,
    defense: null,
    landmark: null, // Di tích trang bị
    activeBuffs: []
  },
  inventory: saved?.inventory || {},
  unlockedProvinces: unlockedProvinces,
  provinceProgress: saved?.provinceProgress || {},
  // Remove craftedItems tracking, use inventory count instead
  currentOpponent: null,
  debate: null,
  crafting: null,
  studying: null,
  quiz: null,
  learningQuiz: null, // Quiz khi học tập
  debateQuiz: null, // Quiz khi thắng tranh luận
  argumentQuiz: null, // Quiz khi đưa ra lập luận
  toast: null
});

// ==================== UTILITY FUNCTIONS ====================
let toastTimer = null;
const showToast = (message, type = 'info') => {
  // Clear previous toast timer to avoid overlap / race conditions
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }

  // Show latest toast
  store.setState({ toast: { message, type } });

  // Auto-hide after 3s
  toastTimer = setTimeout(() => {
    store.setState({ toast: null });
    toastTimer = null;
  }, 3000);
};

let autoArgumentTimer = null;
const stopAutoArgument = () => {
  if (autoArgumentTimer) {
    clearInterval(autoArgumentTimer);
    autoArgumentTimer = null;
  }
  if (store.getState().autoArgument) {
    store.setState({ autoArgument: false }, true);
  }
};

const startAutoArgument = () => {
  stopAutoArgument();
  store.setState({ autoArgument: true }, true);
  autoArgumentTimer = setInterval(() => {
    const state = store.getState();
    if (
      state.currentPage !== 'debate' ||
      !state.debate ||
      !state.currentOpponent ||
      state.scholar.currentConfidence <= 0 ||
      state.currentOpponent.currentConfidence <= 0
    ) {
      stopAutoArgument();
      return;
    }
    if (state.debate.scholarTurn) {
      presentArgument();
    }
  }, 700); // gentle loop to avoid spamming too fast
};

window.toggleAutoArgument = () => {
  const state = store.getState();
  if (state.autoArgument) {
    stopAutoArgument();
  } else {
    startAutoArgument();
  }
};

const addToInventory = (itemId, amount = 1) => {
  const state = store.getState();
  const newInventory = { ...state.inventory };
  newInventory[itemId] = (newInventory[itemId] || 0) + amount;
  store.setState({ inventory: newInventory });
};

const removeFromInventory = (itemId, amount = 1) => {
  const state = store.getState();
  const newInventory = { ...state.inventory };
  if (newInventory[itemId]) {
    newInventory[itemId] -= amount;
    if (newInventory[itemId] <= 0) delete newInventory[itemId];
  }
  store.setState({ inventory: newInventory });
};

const hasItems = (recipe) => {
  const state = store.getState();
  const allBookTypes = ['history_book', 'philosophy_book', 'politics_book', 'economics_book', 'culture_book', 'society_book', 'tourism_book', 'geography_book', 'environment_book', 'agriculture_book', 'energy_book', 'technology_book', 'labor_book', 'development_book', 'military_book', 'arts_book', 'education_book', 'religion_book', 'ethics_book', 'sports_book'];
  
  return Object.entries(recipe).every(([id, amount]) => {
    if (id === 'any_book') {
      // Check if we have enough of any book type
      const totalBooks = allBookTypes.reduce((sum, bookType) => {
        return sum + (state.inventory[bookType] || 0);
      }, 0);
      return totalBooks >= amount;
    }
    return (state.inventory[id] || 0) >= amount;
  });
};

const getScholarStats = () => {
  const state = store.getState();
  const scholar = state.scholar;
  let persuasion = scholar.basePersuasion;
  let resilience = scholar.baseResilience;

  if (scholar.argument) {
    persuasion += gameData.items[scholar.argument]?.persuasion || 0;
  }
  if (scholar.defense) {
    resilience += gameData.items[scholar.defense]?.resilience || 0;
  }
  
  // Landmark bonuses
  if (scholar.landmark) {
    const landmark = gameData.items[scholar.landmark];
    if (landmark) {
      persuasion += landmark.wisdom || 0;
      resilience += landmark.credibility || 0;
      // Some landmarks have patriotism which could boost both
      if (landmark.patriotism) {
        persuasion += Math.floor(landmark.patriotism * 0.5);
        resilience += Math.floor(landmark.patriotism * 0.5);
      }
    }
  }

  scholar.activeBuffs.forEach(buff => {
    if (buff.persuasionBoost) persuasion += buff.persuasionBoost;
    if (buff.resilienceBoost) resilience += buff.resilienceBoost;
  });

  return { persuasion, resilience };
};

const gainExp = (amount) => {
  const state = store.getState();
  const scholar = { ...state.scholar };
  scholar.exp += amount;

  const expNeeded = scholar.level * 100;
  while (scholar.exp >= expNeeded) {
    scholar.exp -= expNeeded;
    scholar.level++;
    scholar.maxConfidence += 20;
    scholar.currentConfidence = scholar.maxConfidence;
    scholar.basePersuasion += 4;
    scholar.baseResilience += 3;
    showToast(`🎓 Lên cấp ${scholar.level}! Hiểu biết sâu sắc hơn`, 'success');

    // All provinces are already unlocked, no level requirement
  }

  store.setState({ scholar });
};

const restoreConfidence = (amount) => {
  const state = store.getState();
  const scholar = { ...state.scholar };
  scholar.currentConfidence = Math.min(scholar.maxConfidence, scholar.currentConfidence + amount);
  store.setState({ scholar });
};

const getRarityColor = (rarity) => {
  const colors = {
    common: 'text-slate-400',
    uncommon: 'text-emerald-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-amber-400'
  };
  return colors[rarity] || colors.common;
};

const getRarityBg = (rarity) => {
  const colors = {
    common: 'bg-slate-500/85 border-slate-500/30',
    uncommon: 'bg-emerald-500/85 border-emerald-500/30',
    rare: 'bg-blue-500/85 border-blue-500/30',
    epic: 'bg-purple-500/85 border-purple-500/30',
    legendary: 'bg-amber-500/95 border-amber-500/30'
  };
  return colors[rarity] || colors.common;
};

const getAreaName = (area) => {
  const areaNames = {
    history: "Lịch sử",
    philosophy: "Triết học",
    politics: "Chính trị",
    economics: "Kinh tế",
    culture: "Văn hóa",
    society: "Xã hội",
    tourism: "Du lịch",
    geography: "Địa lý",
    environment: "Môi trường",
    agriculture: "Nông nghiệp",
    energy: "Năng lượng",
    technology: "Công nghệ",
    labor: "Lao động",
    development: "Phát triển",
    military: "Quân sự",
    arts: "Nghệ thuật",
    education: "Giáo dục",
    religion: "Tôn giáo",
    ethics: "Đạo đức",
    sports: "Thể thao"
  };
  return areaNames[area] || area;
};

// ==================== GAME LOGIC ====================
window.startStudying = (provinceId) => {
  try {
    if (!gameData || !gameData.provinces) {
      console.error('gameData not loaded');
      showToast('Dữ liệu trò chơi chưa tải xong!', 'error');
      return;
    }
    
    const province = gameData.provinces.find(p => p.id === provinceId);
    const state = store.getState();

    if (!province) {
      console.error('Province not found:', provinceId, 'Available:', gameData.provinces.map(p => p.id));
      showToast('Không tìm thấy tỉnh thành này!', 'error');
      return;
    }

    if (!state.provinceProgress[provinceId]) {
      state.provinceProgress[provinceId] = {
        timeElapsed: 0,
        knowledgeGained: 0,
        debatesWon: 0,
        quizzesPassed: 0,
        nextQuizMilestone: 60
      };
    }

    store.setState({
      currentPage: 'studying',
      currentProvince: provinceId,
      studying: {
        currentMonth: state.currentMonth || 0, // 0 = first month, 1 = second month, 2 = final month
        canLearn: true,
        canDebate: true
      }
    });
  } catch (error) {
    console.error('Error in startStudying:', error);
    showToast('Có lỗi xảy ra khi bắt đầu học tập!', 'error');
  }
};

// Timer removed - using month-based progression
let studyTimer = null; // Keep for compatibility

// Advance month when activity is performed
const advanceMonth = () => {
  const state = store.getState();
  let newMonth = state.currentMonth + 1;
  let newSeason = state.season;
  
  // If we've completed all 3 months, advance to next season
  if (newMonth >= 3) {
    newMonth = 0;
    newSeason++;
    
    // Check if game is over (Spring 2030 is season 19, so 20 seasons total)
    if (newSeason >= 20) {
      showToast('🎉 Hoàn thành hành trình! Đã đến Spring 2030!', 'success');
      // Could add end game logic here
    }
    
    // Check for boss encounter (every 4 seasons = once per year, at the start of Winter seasons)
    // Winter 2026 = season 3, Winter 2027 = season 7, Winter 2028 = season 11, Winter 2029 = season 15
    if (newSeason % 4 === 0 && newSeason >= 3) {
      showBossEncounter(newSeason);
      return; // Boss encounter will handle season advancement
    }
  }
  
  store.setState({ 
    currentMonth: newMonth,
    season: newSeason
  });
  
  // Quiz system disabled - no milestone quizzes
};

// Boss encounter function
const showBossEncounter = (seasonIndex) => {
  const seasonName = getSeasonName(seasonIndex);
  
  // Select boss based on season (cycle through 3 bosses)
  const bossKeys = ['tri_nhan', 'nguyen_vu', 'hoang_nguyen'];
  const bossKey = bossKeys[Math.floor(seasonIndex / 4) % bossKeys.length];
  const bossData = gameData.opponents[bossKey];
  
  // Đặt tên boss theo năm
  const year = 2026 + Math.floor(seasonIndex / 4);
  const bossNamesByYear = {
    2027: 'Đại biểu Kỳ họp thứ 4, Quốc hội khóa XVI',
    2028: 'Đại biểu Kỳ họp thứ 6, Quốc hội khóa XVI',
    2029: 'Đại biểu Kỳ họp thứ 8, Quốc hội khóa XVI',
    2030: 'Đại biểu Kỳ họp thứ 10, Quốc hội khóa XVI'
  };
  
  if (!bossData) {
    // Fallback to default boss
    const defaultBoss = {
      name: bossNamesByYear[year] || `Boss ${seasonName}`,
      icon: "👑",
      baseConfidence: 60 + (60 * (seasonIndex /4) * 0.1),
      basePersuasion: 14 + (14 * (seasonIndex /4) * 0.1),
      baseResilience: 12 + (12 * (seasonIndex /4) * 0.1),
      exp: 100,
      topic: `Thử thách cuối năm ${year}`,
      correctAnswer: "Kiên trì học tập và rèn luyện",
      wrongAnswers: ["Bỏ cuộc", "Chỉ học lý thuyết", "Không cần thực hành"],
      knowledge: ["philosophy_book", "history_book", "politics_book", "economics_book"],
      isBoss: true
    };
    const opponent = {
      type: 'boss',
      name: defaultBoss.name,
      icon: defaultBoss.icon,
      topic: defaultBoss.topic,
      maxConfidence: defaultBoss.baseConfidence,
      currentConfidence: defaultBoss.baseConfidence,
      persuasion: defaultBoss.basePersuasion,
      resilience: defaultBoss.baseResilience,
      exp: defaultBoss.exp,
      knowledge: defaultBoss.knowledge,
      correctAnswer: defaultBoss.correctAnswer,
      wrongAnswers: defaultBoss.wrongAnswers,
      isBoss: true,
      seasonIndex: seasonIndex
    };
    
    showToast(`👑 Gặp Boss ${defaultBoss.name}!`, 'warning');
    store.setState({
      currentPage: 'debate',
      currentOpponent: opponent,
      debate: {
        scholarTurn: true,
        log: [`👑 BOSS ENCOUNTER: "${opponent.topic}"`]
      },
      autoArgument: false,
      season: seasonIndex,
      currentMonth: 0
    });
    if (studyTimer) clearInterval(studyTimer);
    return;
  }
  
  const bossTitle = bossNamesByYear[year] || bossData.name;
  
  const opponent = {
    type: 'boss',
    name: bossTitle,
    icon: bossData.icon,
    topic: bossData.topic,
    maxConfidence: 60 + (60 * (seasonIndex / 4) * 0.1),
    currentConfidence: 60 + (60 * (seasonIndex / 4) * 0.1),
    persuasion: 14 + (14 * (seasonIndex / 4) * 0.1),
    resilience: 12 + (12 * (seasonIndex / 4) * 0.1),
    exp: bossData.exp,
    knowledge: bossData.knowledge || [],
    correctAnswer: bossData.correctAnswer,
    wrongAnswers: bossData.wrongAnswers,
    isBoss: true,
    seasonIndex: seasonIndex,
    bossKey: bossKey // Lưu để dùng khi đánh bại
  };
  
  showToast(`👑 Gặp Boss ${bossTitle}!`, 'warning');
  
  store.setState({
    currentPage: 'debate',
    currentOpponent: opponent,
    debate: {
      scholarTurn: true,
      log: [`👑 BOSS ENCOUNTER: "${opponent.topic}"`]
    },
    autoArgument: false,
    season: seasonIndex,
    currentMonth: 0
  });
  
  if (studyTimer) clearInterval(studyTimer);
};

// Skip season function (rest)
window.skipSeason = () => {
  const state = store.getState();
  if (state.season >= 19) {
    showToast('Đã đến mùa cuối cùng!', 'error');
    return;
  }
  
  const newSeason = state.season + 1;
  const seasonName = getSeasonName(newSeason);
  
  // Restore confidence when resting
  const scholar = { ...state.scholar };
  scholar.currentConfidence = scholar.maxConfidence;
  
  // Check for boss encounter
  if (newSeason % 4 === 3 && newSeason > 0) {
    showBossEncounter(newSeason);
    return;
  }
  
  store.setState({
    season: newSeason,
    currentMonth: 0,
    scholar
  });
  
  showToast(`🌱 Nghỉ ngơi đến ${seasonName}. Tự tin đã hồi phục!`, 'success');
};

// Timer display function removed - no longer needed

const showMilestoneQuiz = (question, isFinal) => {
  store.setState({
    quiz: {
      question,
      isFinal,
      answered: false,
      correct: false
    }
  });
};

window.learnKnowledge = () => {
  const state = store.getState();
  const province = gameData.provinces.find(p => p.id === state.currentProvince);
  const studying = { ...state.studying };

  if (!province) {
    console.error('Province not found for learnKnowledge:', state.currentProvince);
    showToast('Không tìm thấy tỉnh thành!', 'error');
    return;
  }

  if (!studying || !studying.canLearn) {
    showToast('Bạn cần nghỉ ngơi!', 'error');
    return;
  }

  if (!province.knowledgeAreas || province.knowledgeAreas.length === 0) {
    console.error('Province has no knowledge areas:', province.name);
    showToast('Tỉnh thành này không có lĩnh vực học tập!', 'error');
    return;
  }

  const knowledgeItem = province.knowledgeAreas[Math.floor(Math.random() * province.knowledgeAreas.length)];
  const itemKey = knowledgeItem + '_book';
  const item = gameData.items[itemKey];
  
  if (!item) {
    console.error('Book item not found:', itemKey, 'for knowledge area:', knowledgeItem);
    showToast('Không tìm thấy học liệu!', 'error');
    return;
  }

  let amount = Math.floor(Math.random() * 2) + 1;
  let rareItem = null;
  
  if (Math.random() < 0.2) {
    const rareItems = ['research_paper', 'documentary', 'interview_record'];
    rareItem = rareItems[Math.floor(Math.random() * rareItems.length)];
  }

  // Show quiz before adding items
  const randomQuestion = gameData.quizQuestions[Math.floor(Math.random() * gameData.quizQuestions.length)];
  store.setState({
    learningQuiz: {
      question: randomQuestion,
      itemKey: itemKey,
      amount: amount,
      rareItem: rareItem,
      answered: false
    }
  });

  studying.canLearn = false;
  
  const progress = { ...state.provinceProgress[state.currentProvince] };
  progress.knowledgeGained++;
  const newProvinceProgress = { ...state.provinceProgress, [state.currentProvince]: progress };

  store.setState({ studying, provinceProgress: newProvinceProgress });
  
  // Advance month after learning
  advanceMonth();
  
  // Re-enable learning after month advance
  setTimeout(() => {
    const newState = store.getState();
    if (newState.studying) {
      store.setState({ studying: { ...newState.studying, canLearn: true } });
    }
  }, 500);
};

window.startDebate = () => {
  try {
    const state = store.getState();
    const province = gameData.provinces.find(p => p.id === state.currentProvince);
    
    if (!province) {
      console.error('Province not found for debate:', state.currentProvince);
      showToast('Không tìm thấy tỉnh thành!', 'error');
      return;
    }
    
    const studying = { ...state.studying };

    if (!studying || !studying.canDebate) {
      showToast('Bạn cần chuẩn bị thêm!', 'error');
      return;
    }

    if (!province.debateTopics || province.debateTopics.length === 0) {
      console.error('Province has no debate topics:', province.name);
      showToast('Tỉnh thành này không có chủ đề tranh luận!', 'error');
      return;
    }

    // Filter to only topics that exist in opponents, fallback to first available if none match
    const availableTopics = province.debateTopics.filter(topic => gameData.opponents[topic]);
    const topicType = availableTopics.length > 0 
      ? availableTopics[Math.floor(Math.random() * availableTopics.length)]
      : province.debateTopics[Math.floor(Math.random() * province.debateTopics.length)];
    
    let opponentData = gameData.opponents[topicType];
    
    // If topic doesn't exist, use a default opponent based on difficulty
    if (!opponentData) {
      console.warn('Opponent data not found for topic:', topicType, 'Using default opponent');
      const defaultTopics = Object.keys(gameData.opponents);
      const difficultyIndex = Math.min(province.difficulty - 1, defaultTopics.length - 1);
      const fallbackTopic = defaultTopics[difficultyIndex] || defaultTopics[0];
      opponentData = gameData.opponents[fallbackTopic];
    }

    const progress = state.provinceProgress[state.currentProvince] || {
      timeElapsed: 0,
      knowledgeGained: 0,
      debatesWon: 0,
      quizzesPassed: 0,
      nextQuizMilestone: 60
    };
    const timeMultiplier = 1 + (progress.timeElapsed / 180);

    const opponent = {
      type: opponentData.isBoss ? 'boss' : topicType,
      name: opponentData.name,
      icon: opponentData.icon,
      topic: opponentData.topic,
      maxConfidence: Math.floor(opponentData.baseConfidence * timeMultiplier * (opponentData.isBoss ? 1 : ENEMY_WEAKEN)),
      currentConfidence: Math.floor(opponentData.baseConfidence * timeMultiplier * (opponentData.isBoss ? 1 : ENEMY_WEAKEN)),
      persuasion: Math.floor(opponentData.basePersuasion * timeMultiplier * (opponentData.isBoss ? 1 : ENEMY_WEAKEN)),
      resilience: Math.floor(opponentData.baseResilience * timeMultiplier * (opponentData.isBoss ? 1 : ENEMY_WEAKEN)),
      exp: Math.floor(opponentData.exp * timeMultiplier),
      knowledge: opponentData.knowledge,
      correctAnswer: opponentData.correctAnswer,
      wrongAnswers: opponentData.wrongAnswers,
      isBoss: opponentData.isBoss || false
    };

    stopAutoArgument();

    store.setState({
      currentPage: 'debate',
      currentOpponent: opponent,
      debate: {
        scholarTurn: true,
        log: [`Bắt đầu tranh luận về: "${opponent.topic}"`]
      },
      autoArgument: false
    });

    if (studyTimer) clearInterval(studyTimer);
    
    // Advance month after starting debate
    advanceMonth();
  } catch (error) {
    console.error('Error in startDebate:', error);
    showToast('Có lỗi xảy ra khi bắt đầu tranh luận!', 'error');
  }
};

window.presentArgument = () => {
  const state = store.getState();
  const { currentOpponent, debate, argumentQuiz } = state;

  if (!debate.scholarTurn) return;
  
  // If there's already an argument quiz waiting, don't create another one
  if (argumentQuiz) return;

  // Show quiz before calculating damage
  const randomQuestion = gameData.quizQuestions[Math.floor(Math.random() * gameData.quizQuestions.length)];
  store.setState({
    argumentQuiz: {
      question: randomQuestion,
      answered: false
    }
  });
};

const opponentCounterArgument = () => {
  const state = store.getState();
  const { scholar, currentOpponent, debate } = state;
  const stats = getScholarStats();

  const counterPower = Math.max(1, currentOpponent.persuasion - stats.resilience);
  const newScholar = { ...scholar };
  newScholar.currentConfidence -= counterPower;

  const log = [...debate.log, `🗣️ ${currentOpponent.name} phản biện! Bạn -${counterPower} tự tin`];

  if (newScholar.currentConfidence <= 0) {
    newScholar.currentConfidence = 0;
    log.push(`😔 Bạn chưa thuyết phục được...`);

    setTimeout(() => {
      // Check if this is a boss fight
      if (currentOpponent.type === 'boss') {
        // Game over - lost to boss
        store.setState({
          scholar: newScholar,
          currentPage: 'gameover',
          currentOpponent: null,
          debate: null,
          gameOverReason: 'lost_to_boss'
        });
        if (studyTimer) clearInterval(studyTimer);
        stopAutoArgument();
      } else {
        // Normal defeat - continue playing
        newScholar.currentConfidence = Math.floor(newScholar.maxConfidence * 0.5);
        store.setState({
          scholar: newScholar,
          currentPage: 'home',
          currentOpponent: null,
          debate: null
        });
        if (studyTimer) clearInterval(studyTimer);
        stopAutoArgument();
        showToast('Cần học hỏi thêm và trở lại!', 'error');
      }
    }, 2000);

    store.setState({ scholar: newScholar, debate: { ...debate, log, scholarTurn: false } });
    return;
  }

  store.setState({
    scholar: newScholar,
    debate: { ...debate, log, scholarTurn: true }
  });
};

window.conced = () => {
  const customModal = document.createElement('div');
  customModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-none flex items-center justify-center z-50 p-6 animate-fade-in';
  customModal.innerHTML = `
        <div class="bg-slate-800 rounded-2xl p-8 border border-amber-500/50 max-w-md">
          <h3 class="text-xl font-bold mb-4 text-center">🤔 Tạm ngừng tranh luận?</h3>
          <p class="text-slate-300 text-center mb-6">Bạn có chắc muốn tạm ngừng cuộc tranh luận này không?</p>
          <div class="flex gap-3">
            <button onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600/80 rounded-xl font-semibold transition-all">
              Tiếp tục tranh luận
            </button>
            <button onclick="this.closest('.fixed').remove(); confirmConcede()" class="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 rounded-xl font-semibold transition-all">
              Xác nhận rút lui
            </button>
          </div>
        </div>
      `;
  document.body.appendChild(customModal);
};

window.confirmConcede = () => {
  const state = store.getState();
  const { currentOpponent } = state;
  
  // Check if this is a boss fight
  if (currentOpponent && currentOpponent.type === 'boss') {
    // Game over - conceded to boss
    stopAutoArgument();
    store.setState({
      currentPage: 'gameover',
      currentOpponent: null,
      debate: null,
      gameOverReason: 'conceded_to_boss'
    });
    if (studyTimer) clearInterval(studyTimer);
    return;
  }
  
  // Normal concede logic
  if (Math.random() < 0.7) {
    showToast('Tạm dừng để suy ngẫm thêm!', 'success');
    stopAutoArgument();
    store.setState({
      currentPage: 'studying',
      currentOpponent: null,
      debate: null
    });
    startStudyTimer();
  } else {
    showToast('Không thể rút lui trong tình huống này!', 'error');
    opponentCounterArgument();
  }
};

window.useItem = (itemId) => {
  const state = store.getState();
  const item = gameData.items[itemId];

  if (!item || item.type !== 'consumable') return;

  if ((state.inventory[itemId] || 0) <= 0) {
    showToast('Không có vật phẩm!', 'error');
    return;
  }

  removeFromInventory(itemId, 1);

  if (item.focusBoost || item.clarityBoost) {
    restoreConfidence(item.focusBoost || item.clarityBoost);
    showToast(`+${item.focusBoost || item.clarityBoost} Tự tin`, 'success');
  }

  if (item.persuasionBoost || item.resilienceBoost) {
    const scholar = { ...state.scholar };
    scholar.activeBuffs.push({
      name: item.name,
      persuasionBoost: item.persuasionBoost,
      resilienceBoost: item.resilienceBoost,
      duration: item.duration,
      debatesLeft: item.duration
    });
    store.setState({ scholar });
    showToast(`Buff: ${item.name}`, 'success');
  }
};

window.answerQuiz = (choiceIndex) => {
  const state = store.getState();
  const quiz = { ...state.quiz };
  const correct = choiceIndex === quiz.question.correct;

  quiz.answered = true;
  quiz.correct = correct;

  if (correct) {
    if (quiz.isFinal) {
      showToast('🎉 Chính xác! Hiểu biết sâu sắc!', 'success');
    } else {
      showToast('✅ Chính xác! Tiếp tục học tập', 'success');
      const progress = { ...state.provinceProgress[state.currentProvince] };
      progress.quizzesPassed++;
      progress.nextQuizMilestone += 60;
      const newProvinceProgress = { ...state.provinceProgress, [state.currentProvince]: progress };
      store.setState({ provinceProgress: newProvinceProgress });
    }
  } else {
    showToast('❌ Chưa chính xác! Cần nghiên cứu thêm', 'error');
  }

  store.setState({ quiz });

  setTimeout(() => {
    if (quiz.isFinal) {
      exitProvince(quiz.correct);
    } else {
      store.setState({ quiz: null });
    }
  }, 3000);
};

window.answerLearningQuiz = (choiceIndex) => {
  const state = store.getState();
  if (!state.learningQuiz) return;
  
  const learningQuiz = { ...state.learningQuiz };
  const correct = choiceIndex === learningQuiz.question.correct;

  // Mark as answered first
  store.setState({ learningQuiz: { ...learningQuiz, answered: true, correct: correct } });
  
  let finalAmount = learningQuiz.amount;
  if (correct) {
    finalAmount = learningQuiz.amount * 2; // Gấp đôi nếu đúng
    showToast('🎉 Trả lời đúng! Nhận được x2 học liệu!', 'success');
  } else {
    showToast('❌ Trả lời sai! Nhận được số lượng bình thường', 'error');
  }

  // Add items after a short delay
  setTimeout(() => {
    addToInventory(learningQuiz.itemKey, finalAmount);
    const item = gameData.items[learningQuiz.itemKey];
    showToast(`+${finalAmount} ${item.icon} ${item.name}`, 'success');

    // Add rare item if exists
    if (learningQuiz.rareItem) {
      const rareItemData = gameData.items[learningQuiz.rareItem];
      if (rareItemData) {
        addToInventory(learningQuiz.rareItem, correct ? 2 : 1); // Gấp đôi nếu đúng
        showToast(`⭐ ${rareItemData.icon} ${rareItemData.name}!`, 'success');
      }
    }

    // Close modal after 2 seconds
    setTimeout(() => {
      store.setState({ learningQuiz: null });
    }, 2000);
  }, 500);
};

window.answerArgumentQuiz = (choiceIndex) => {
  const state = store.getState();
  if (!state.argumentQuiz) return;
  
  const argumentQuiz = { ...state.argumentQuiz };
  const correct = choiceIndex === argumentQuiz.question.correct;
  
  // Mark as answered first
  store.setState({ argumentQuiz: { ...argumentQuiz, answered: true, correct: correct } });
  
  // Calculate damage multiplier: 1.5x if correct, 0.8x if wrong
  const damageMultiplier = correct ? 1.5 : 0.8;
  
  // Apply damage after a short delay
  setTimeout(() => {
    const currentState = store.getState();
    const { currentOpponent, debate } = currentState;
    
    if (!currentOpponent || !debate) return;
    
    const stats = getScholarStats();
    const basePersuasivePower = Math.max(1, stats.persuasion - currentOpponent.resilience);
    const persuasivePower = Math.floor(basePersuasivePower * damageMultiplier);
    const newOpponent = { ...currentOpponent };
    newOpponent.currentConfidence -= persuasivePower;
    
    const logMessage = correct 
      ? `💡 Bạn đưa ra lập luận xuất sắc! (x${damageMultiplier}) Opponent -${persuasivePower} tự tin`
      : `💡 Bạn đưa ra lập luận yếu! (x${damageMultiplier}) Opponent -${persuasivePower} tự tin`;
    const log = [...debate.log, logMessage];
    
    if (newOpponent.currentConfidence <= 0) {
      log.push(`🎉 Chiến thắng! +${currentOpponent.exp} EXP`);
      gainExp(currentOpponent.exp);

      // Store opponent data for quiz callback
      const opponentData = currentOpponent.bossKey 
        ? gameData.opponents[currentOpponent.bossKey]
        : Object.values(gameData.opponents).find(o => o.name === currentOpponent.name && o.isBoss);
      
      // Show quiz before handling drops
      const randomQuestion = gameData.quizQuestions[Math.floor(Math.random() * gameData.quizQuestions.length)];
      store.setState({
        debateQuiz: {
          question: randomQuestion,
          opponentData: opponentData,
          currentOpponent: currentOpponent,
          answered: false
        },
        currentOpponent: newOpponent,
        debate: { ...debate, log, scholarTurn: false },
        argumentQuiz: null
      });
      
      return;
    }

    store.setState({
      currentOpponent: newOpponent,
      debate: { ...debate, log, scholarTurn: false },
      argumentQuiz: null
    });

    setTimeout(() => {
      opponentCounterArgument();
    }, 1000);
  }, 1500);
};

window.answerDebateQuiz = (choiceIndex) => {
  const state = store.getState();
  if (!state.debateQuiz) return;
  
  const debateQuiz = { ...state.debateQuiz };
  const correct = choiceIndex === debateQuiz.question.correct;

  // Mark as answered first
  store.setState({ debateQuiz: { ...debateQuiz, answered: true, correct: correct } });
  
  const opponentData = debateQuiz.opponentData;
  const currentOpponent = debateQuiz.currentOpponent;

  if (correct) {
    showToast('🎉 Trả lời đúng! Tỉ lệ rơi di tích x2!', 'success');
    
    // Double drop rate for landmarks
    setTimeout(() => {
      // Check for landmark drops from current province
      const province = gameData.provinces.find(p => p.id === state.currentProvince);
      if (province && province.uniqueItems && province.uniqueItems.length > 0) {
        // Filter to only landmark items from this province
        const landmarkItems = province.uniqueItems.filter(id => {
          const item = gameData.items[id];
          return item && item.type === 'landmark';
        });

        const dropRate = currentOpponent.isBoss ? 0.5 : 0.1; // Higher rate for boss
        if (landmarkItems.length > 0 && Math.random() < dropRate * 2) {
          const randomLandmark = landmarkItems[Math.floor(Math.random() * landmarkItems.length)];
          addToInventory(randomLandmark, 1);
          const toastMessage = currentOpponent.isBoss ? `🏆 Đánh bại Boss! Nhận được Di tích ${gameData.items[randomLandmark].icon} ${gameData.items[randomLandmark].name}` : `🏛️ Nhận được Di tích ${gameData.items[randomLandmark].icon} ${gameData.items[randomLandmark].name}`;
          showToast(toastMessage, 'success');
        }
      }

      // Normal knowledge drops (only for non-boss)
      if (!currentOpponent.isBoss) {
        currentOpponent.knowledge?.forEach(itemId => {
          if (Math.random() < 0.6) {
            addToInventory(itemId, 1);
            showToast(`📚 Thu nhận ${gameData.items[itemId]?.icon || ''} ${gameData.items[itemId]?.name || itemId}`, 'success');
          }
        });
      }

      const progress = { ...state.provinceProgress[state.currentProvince] };
      progress.debatesWon++;
      const newProvinceProgress = { ...state.provinceProgress, [state.currentProvince]: progress };

      setTimeout(() => {
        // Kiểm tra nếu đánh bại boss cuối (Winter 2030 - season 19)
        const currentOpponent = state.currentOpponent;
        if (currentOpponent && currentOpponent.isBoss && currentOpponent.seasonIndex >= 19) {
          // Đánh bại boss cuối - kết thúc game với chiến thắng
          stopAutoArgument();
          store.setState({
            currentPage: 'gameover',
            currentOpponent: null,
            debate: null,
            debateQuiz: null,
            provinceProgress: newProvinceProgress,
            gameOverReason: 'defeated_final_boss'
          });
          if (studyTimer) clearInterval(studyTimer);
        } else {
          // Boss thường hoặc không phải boss - tiếp tục chơi
          stopAutoArgument();
          store.setState({
            currentPage: 'studying',
            currentOpponent: null,
            debate: null,
            debateQuiz: null,
            provinceProgress: newProvinceProgress,
            studying: {
              currentMonth: state.currentMonth,
              canLearn: true,
              canDebate: true
            }
          });
        }
      }, 1500);
    }, 500);
  } else {
    showToast('❌ Trả lời sai! Tỉ lệ rơi bình thường', 'error');
    
    // Normal drop logic
    setTimeout(() => {
      if (opponentData && opponentData.dropItems && opponentData.dropRate) {
        if (Math.random() < opponentData.dropRate) {
          const droppedItem = opponentData.dropItems[Math.floor(Math.random() * opponentData.dropItems.length)];
          if (droppedItem && gameData.items[droppedItem]) {
            addToInventory(droppedItem, 1);
            showToast(`🏆 Đánh bại Boss! Nhận được ${gameData.items[droppedItem].icon} ${gameData.items[droppedItem].name}`, 'success');
          }
        }
      } else {
        currentOpponent.knowledge?.forEach(itemId => {
          if (Math.random() < 0.6) {
            addToInventory(itemId, 1);
            showToast(`📚 Thu nhận ${gameData.items[itemId]?.icon || ''} ${gameData.items[itemId]?.name || itemId}`, 'success');
          }
        });
      }

      const progress = { ...state.provinceProgress[state.currentProvince] };
      progress.debatesWon++;
      const newProvinceProgress = { ...state.provinceProgress, [state.currentProvince]: progress };

      setTimeout(() => {
        // Kiểm tra nếu đánh bại boss cuối (Winter 2030 - season 19)
        const currentOpponent = state.currentOpponent;
        if (currentOpponent && currentOpponent.isBoss && currentOpponent.seasonIndex >= 19) {
          // Đánh bại boss cuối - kết thúc game với chiến thắng
          stopAutoArgument();
          store.setState({
            currentPage: 'gameover',
            currentOpponent: null,
            debate: null,
            debateQuiz: null,
            provinceProgress: newProvinceProgress,
            gameOverReason: 'defeated_final_boss'
          });
          if (studyTimer) clearInterval(studyTimer);
        } else {
          // Boss thường hoặc không phải boss - tiếp tục chơi
          stopAutoArgument();
          store.setState({
            currentPage: 'studying',
            currentOpponent: null,
            debate: null,
            debateQuiz: null,
            provinceProgress: newProvinceProgress,
            studying: {
              currentMonth: state.currentMonth,
              canLearn: true,
              canDebate: true
            }
          });
        }
      }, 1500);
    }, 500);
  }
};

const exitProvince = (bonusReward) => {
  if (studyTimer) clearInterval(studyTimer);
  stopAutoArgument();

  if (bonusReward) {
    const state = store.getState();
    const province = gameData.provinces.find(p => p.id === state.currentProvince);
    province.uniqueItems.forEach(itemId => {
      if (Math.random() < 0.5) {
        addToInventory(itemId, 1);
        showToast(`🎁 Nhận ${gameData.items[itemId].icon} ${gameData.items[itemId].name}`, 'success');
      }
    });
  }

  store.setState({
    currentPage: 'home',
    currentProvince: null,
    studying: null,
    quiz: null
  });
};

window.exitProvince = () => exitProvince(false);

window.openCrafting = () => {
  store.setState({ currentPage: 'crafting' });
};

window.openRules = () => {
  store.setState({ currentPage: 'rules', rulesSection: 'general' });
};

window.openRulesSection = (section) => {
  store.setState({ currentPage: 'rules', rulesSection: section || 'general' });
};

window.craftItem = (itemId) => {
  const state = store.getState();
  const item = gameData.items[itemId];
  if (!item.recipe) return;

  // Check if item has reached the crafting limit (5)
  const currentCount = state.inventory[itemId] || 0;
  if (currentCount >= 5) {
    showToast('Vật phẩm này đã đạt giới hạn chế tạo (5 cái)!', 'error');
    return;
  }

  if (!hasItems(item.recipe)) {
    showToast('Không đủ tài liệu!', 'error');
    return;
  }

  const allBookTypes = ['history_book', 'philosophy_book', 'politics_book', 'economics_book', 'culture_book', 'society_book', 'tourism_book', 'geography_book', 'environment_book', 'agriculture_book', 'energy_book', 'technology_book', 'labor_book', 'development_book', 'military_book', 'arts_book', 'education_book', 'religion_book', 'ethics_book', 'sports_book'];

  Object.entries(item.recipe).forEach(([id, amount]) => {
    if (id === 'any_book') {
      // Use any available books
      let remaining = amount;
      for (const bookType of allBookTypes) {
        if (remaining <= 0) break;
        const available = state.inventory[bookType] || 0;
        if (available > 0) {
          const use = Math.min(available, remaining);
          removeFromInventory(bookType, use);
          remaining -= use;
        }
      }
    } else {
      removeFromInventory(id, amount);
    }
  });

  addToInventory(itemId, 1);

  showToast(`📝 Hoàn thành ${item.icon} ${item.name}! (${currentCount + 1}/5)`, 'success');
};

window.equipItem = (itemId) => {
  const state = store.getState();
  const item = gameData.items[itemId];
  const scholar = { ...state.scholar };

  if (item.type === 'argument') {
    if (scholar.argument) addToInventory(scholar.argument, 1);
    scholar.argument = itemId;
    removeFromInventory(itemId, 1);
    showToast(`💡 Trang bị ${item.name}`, 'success');
  } else if (item.type === 'defense') {
    if (scholar.defense) addToInventory(scholar.defense, 1);
    scholar.defense = itemId;
    removeFromInventory(itemId, 1);
    showToast(`🛡️ Trang bị ${item.name}`, 'success');
  } else if (item.type === 'landmark') {
    if (scholar.landmark) addToInventory(scholar.landmark, 1);
    scholar.landmark = itemId;
    removeFromInventory(itemId, 1);
    showToast(`🏛️ Trang bị Di tích ${item.name}`, 'success');
  }

  store.setState({ scholar });
};

window.unequipItem = (slot) => {
  const state = store.getState();
  const scholar = { ...state.scholar };

  if (slot === 'argument' && scholar.argument) {
    addToInventory(scholar.argument, 1);
    scholar.argument = null;
    showToast('Đã tháo lập luận', 'info');
  } else if (slot === 'defense' && scholar.defense) {
    addToInventory(scholar.defense, 1);
    scholar.defense = null;
    showToast('Đã tháo phương án phòng thủ', 'info');
  } else if (slot === 'landmark' && scholar.landmark) {
    addToInventory(scholar.landmark, 1);
    scholar.landmark = null;
    showToast('Đã tháo Di tích', 'info');
  }

  store.setState({ scholar });
};

window.resetGame = () => {
  const customModal = document.createElement('div');
  customModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-none flex items-center justify-center z-50 p-6 animate-fade-in';
  customModal.innerHTML = `
        <div class="bg-slate-800 rounded-2xl p-8 border border-rose-500/50 max-w-md">
          <h3 class="text-xl font-bold mb-4 text-center">⚠️ Khởi động lại trò chơi?</h3>
          <p class="text-slate-300 text-center mb-6">Tất cả tiến trình, cấp độ, học liệu và thành tích sẽ bị xóa. Bạn có chắc chắn?</p>
          <div class="flex gap-3">
            <button onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600/80 rounded-xl font-semibold transition-all">
              Hủy
            </button>
            <button onclick="
              if (studyTimer) clearInterval(studyTimer);
              stopAutoArgument();
              localStorage.removeItem('hcm-thought-game');
              location.reload();
            " class="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 rounded-xl font-semibold transition-all">
              Xác nhận
            </button>
          </div>
        </div>
      `;
  document.body.appendChild(customModal);
};

window.toggleKnowledgeFilter = (area) => {
  const state = store.getState();
  const currentFilter = state.knowledgeFilter || [];
  const newFilter = currentFilter.includes(area)
    ? currentFilter.filter(a => a !== area)
    : [...currentFilter, area];
  store.setState({ knowledgeFilter: newFilter });
};

window.clearKnowledgeFilter = () => {
  store.setState({ knowledgeFilter: [] });
};

window.navigate = (page) => {
  if (studyTimer) clearInterval(studyTimer);
  stopAutoArgument();
  store.setState({ currentPage: page });
};

// ==================== RENDER FUNCTIONS ====================
const renderHomePage = () => {
  const state = store.getState();
  const { scholar } = state;
  const stats = getScholarStats();
  const expNeeded = scholar.level * 100;
  const expProgress = (scholar.exp / expNeeded) * 100;

  return `
        <div class="min-h-full p-6">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-8 relative">
              <div class="absolute top-0 right-0 flex gap-2">
                <button onclick="openRules()" class="px-4 py-2 bg-blue-600/70 hover:bg-blue-600 border border-blue-500/50 rounded-xl transition-all text-sm text-white">
                  📖 Luật chơi
                </button>
                <button onclick="resetGame()" class="px-4 py-2 bg-slate-700/70 hover:bg-slate-700 border border-slate-600/50 rounded-xl transition-all text-sm text-slate-300 hover:text-white">
                  🔄 Khởi động lại
                </button>
              </div>
              <h1 class="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-rose-400 via-amber-400 to-red-400 bg-clip-text text-transparent font-sans tracking-tight">
                Hành trình Tư tưởng
              </h1>
              <h1 class="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-rose-400 via-amber-400 to-red-400 bg-clip-text text-transparent font-sans tracking-tight">
                Hồ Chí Minh
              </h1>
              <p class="text-slate-300 text-lg">Học tập - Tranh luận - Trưởng thành</p>
              <div class="mt-4 inline-block px-6 py-2 bg-amber-500/85 border border-amber-500/50 rounded-xl">
                <p class="text-lg font-bold text-white-400">${getSeasonName(state.season)}</p>
                <p class="text-xs text-white-400">Mùa ${state.season + 1}/20</p>
              </div>
            </div>

            <div class="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-2xl p-6 border border-amber-500/30 mb-6 shadow-xl">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center text-3xl animate-float">
                  🎓
                </div>
                <div class="flex-1">
                  <h2 class="text-xl font-bold">${scholar.name}</h2>
                  <div class="flex items-center gap-4 text-sm text-slate-300">
                    <span>Cấp độ ${scholar.level}</span>
                    <span>Tự tin: ${scholar.currentConfidence}/${scholar.maxConfidence}</span>
                  </div>
                </div>
                <button onclick="navigate('inventory')" class="px-4 py-2 bg-amber-500/40 hover:bg-amber-500/30 border border-amber-500/50 rounded-xl transition-all">
                  📚 Học liệu
                </button>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="text-center p-3 bg-slate-700/60 rounded-xl border border-slate-600/50">
                  <p class="text-2xl font-bold text-rose-400">${stats.persuasion}</p>
                  <p class="text-xs text-slate-400">Thuyết phục</p>
                </div>
                <div class="text-center p-3 bg-slate-700/60 rounded-xl border border-slate-600/50">
                  <p class="text-2xl font-bold text-blue-400">${stats.resilience}</p>
                  <p class="text-xs text-slate-400">Kiên định</p>
                </div>
              </div>

              <div class="mb-4">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-slate-300">Tự tin</span>
                  <span>${scholar.currentConfidence}/${scholar.maxConfidence}</span>
                </div>
                <div class="h-3 bg-slate-700/70 rounded-full overflow-hidden">
                  <div class="progress-bar h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full" style="width: ${(scholar.currentConfidence / scholar.maxConfidence) * 100}%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-slate-300">Kinh nghiệm</span>
                  <span>${expNeeded - scholar.exp} để lên cấp</span>
                </div>
                <div class="h-3 bg-slate-700/70 rounded-full overflow-hidden">
                  <div class="progress-bar h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full" style="width: ${expProgress}%"></div>
                </div>
              </div>

              ${scholar.argument || scholar.defense ? `
                <div class="mt-4 pt-4 border-t border-slate-700/50">
                  <p class="text-sm text-slate-300 mb-2">Đang trang bị:</p>
                  <div class="flex gap-2 flex-wrap">
                    ${scholar.argument ? `<span class="px-3 py-1 bg-rose-500/40 border border-rose-500/30 rounded-lg text-sm">${gameData.items[scholar.argument].icon} ${gameData.items[scholar.argument].name}</span>` : ''}
                    ${scholar.defense ? `<span class="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm">${gameData.items[scholar.defense].icon} ${gameData.items[scholar.defense].name}</span>` : ''}
                  </div>
                </div>
              ` : ''}
            </div>

            <div class="flex gap-6 mb-6">
              <div class="tooltip flex-1">
                <button onclick="openCrafting()" class="w-full p-6 bg-gradient-to-r from-amber-600/60 to-orange-600/60 hover:from-amber-600/70 hover:to-orange-600/70 border border-amber-500/40 rounded-xl transition-all card-hover">
                  <span class="text-4xl block mb-3">📝</span>
                  <span class="font-bold text-lg">Soạn luận cứ</span>
                </button>
                <span class="tooltip-text">Chế tạo công cụ lập luận và vật phẩm hỗ trợ từ học liệu thu thập được</span>
              </div>
              <div class="tooltip flex-1">
                <button onclick="navigate('inventory')" class="w-full p-6 bg-gradient-to-r from-blue-600/60 to-cyan-600/60 hover:from-blue-600/70 hover:to-cyan-600/70 border border-blue-500/40 rounded-xl transition-all card-hover">
                  <span class="text-4xl block mb-3">📚</span>
                  <span class="font-bold text-lg">Kho học liệu</span>
                </button>
                <span class="tooltip-text">Xem và trang bị học liệu, công cụ lập luận, và di tích</span>
              </div>
            </div>

            <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🗺️</span>
              <span>Bản đồ Việt Nam</span>
            </h3>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-6 border border-amber-500/30 mb-6 shadow-xl">
              <div class="mb-4">
                <p class="text-sm text-slate-400 mb-3 text-center">Lọc theo lĩnh vực học liệu:</p>
                <div class="flex flex-wrap justify-center gap-2 mb-3">
                  ${['history', 'philosophy', 'politics', 'economics', 'culture', 'society', 'tourism', 'geography', 'environment', 'agriculture', 'energy', 'technology', 'labor', 'development', 'military', 'arts', 'education', 'religion', 'ethics', 'sports'].map(area => {
                    const isSelected = state.knowledgeFilter.includes(area);
                    return `<button onclick="toggleKnowledgeFilter('${area}')" class="px-3 py-1 rounded-lg text-xs transition-all ${isSelected ? 'bg-amber-500/30 border border-amber-500/50 text-amber-200' : 'bg-slate-700/70 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-600/80'}">${getAreaName(area)}</button>`;
                  }).join('')}
                </div>
                ${state.knowledgeFilter.length > 0 ? `<div class="text-center"><button onclick="clearKnowledgeFilter()" class="px-4 py-2 bg-slate-700/70 hover:bg-slate-600/80 border border-slate-600/50 rounded-lg text-sm transition-all">Xóa bộ lọc</button></div>` : ''}
              </div>
              <p class="text-sm text-slate-400 mb-4 text-center">Di chuột để xem thông tin tỉnh • Click để chọn tỉnh</p>
              <div id="map-container" class="flex justify-center overflow-x-auto">
                <!-- Canvas sẽ được thêm vào đây -->
              </div>
            </div>
            
            <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>📋</span>
              <span>Danh sách tỉnh thành</span>
            </h3>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              ${gameData.provinces.map((prov, i) => {
                const progress = state.provinceProgress[prov.id];
                return `
                  <div class="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-5 border border-amber-500/40 card-hover shadow-lg" style="animation-delay: ${i * 0.1}s">
                    <div class="flex items-start justify-between mb-3">
                      <span class="text-4xl">${prov.icon}</span>
                    </div>
                    <h4 class="font-bold text-lg mb-1">${prov.name}</h4>
                    <p class="text-sm text-slate-400 mb-2">${prov.description}</p>
                    <p class="text-xs text-amber-400 mb-3 italic">"${prov.culturalFact}"</p>
                    <div class="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <span>⭐ Cấp ${prov.difficulty}</span>
                    </div>
                    
                    ${prov.knowledgeAreas && prov.knowledgeAreas.length > 0 ? `
                      <div class="mb-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p class="text-xs font-semibold text-blue-400 mb-1">📚 Sách có thể nhận:</p>
                        <div class="flex flex-wrap gap-1">
                          ${prov.knowledgeAreas.map(area => {
                            const bookKey = area + '_book';
                            const book = gameData.items[bookKey];
                            if (!book) return '';
                            return `<span class="text-xs px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/40 rounded" title="${book.name}">${book.icon}</span>`;
                          }).filter(Boolean).join('')}
                        </div>
                        <p class="text-xs text-slate-400 mt-1">${prov.knowledgeAreas.map(area => {
                          const bookKey = area + '_book';
                          const book = gameData.items[bookKey];
                          return book ? book.name : '';
                        }).filter(Boolean).join(', ')}</p>
                      </div>
                    ` : ''}
                    
                    ${prov.uniqueItems && prov.uniqueItems.length > 0 ? `
                      <div class="mb-3 p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <p class="text-xs font-semibold text-purple-400 mb-1">⭐ Item đặc biệt:</p>
                        <div class="flex flex-wrap gap-1">
                          ${prov.uniqueItems.map(itemId => {
                            const item = gameData.items[itemId];
                            if (!item) return '';
                            const rarityColor = item.rarity === 'legendary' ? 'text-yellow-400 border-yellow-500/40 bg-yellow-500/20' :
                                              item.rarity === 'epic' ? 'text-purple-400 border-purple-500/40 bg-purple-500/20' :
                                              item.rarity === 'rare' ? 'text-blue-400 border-blue-500/40 bg-blue-500/20' :
                                              'text-green-400 border-green-500/40 bg-green-500/20';
                            return `<span class="text-xs px-1.5 py-0.5 ${rarityColor} border rounded" title="${item.name}">${item.icon}</span>`;
                          }).filter(Boolean).join('')}
                        </div>
                        <p class="text-xs text-slate-400 mt-1">${prov.uniqueItems.map(itemId => {
                          const item = gameData.items[itemId];
                          return item ? item.name : '';
                        }).filter(Boolean).join(', ')}</p>
                      </div>
                    ` : ''}
                    
                    ${progress ? `
                      <div class="mb-3 text-xs text-slate-300 space-y-1">
                        <div class="flex justify-between">
                          <span>💡 Học được:</span>
                          <span class="font-semibold">${progress.knowledgeGained}</span>
                        </div>
                        <div class="flex justify-between">
                          <span>🗣️ Thắng tranh luận:</span>
                          <span class="font-semibold">${progress.debatesWon}</span>
                        </div>
                      </div>
                    ` : ''}
                    <button onclick="startStudying('${prov.id.replace(/'/g, "\\'")}')" class="w-full py-2 px-4 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 rounded-lg font-semibold transition-all text-sm shadow-lg">
                      🎓 Học tập
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
};

const renderStudyingPage = () => {
  const state = store.getState();
  const province = gameData.provinces.find(p => p.id === state.currentProvince);
  const { studying } = state;
  
  if (!province) {
    console.error('Province not found for currentProvince:', state.currentProvince);
    return '<div class="p-6 text-center"><p class="text-red-400">Lỗi: Không tìm thấy tỉnh thành</p><button onclick="navigate(\'home\')" class="mt-4 px-4 py-2 bg-slate-700 rounded-xl">Quay lại</button></div>';
  }
  
  if (!studying) {
    console.error('Studying state is null for province:', state.currentProvince);
    return '<div class="p-6 text-center"><p class="text-red-400">Lỗi: Trạng thái học tập không hợp lệ</p><button onclick="navigate(\'home\')" class="mt-4 px-4 py-2 bg-slate-700 rounded-xl">Quay lại</button></div>';
  }
  
  const progress = state.provinceProgress[state.currentProvince] || {
    timeElapsed: 0,
    knowledgeGained: 0,
    debatesWon: 0,
    quizzesPassed: 0,
    nextQuizMilestone: 60
  };

  const seasonName = getSeasonName(state.season);
  const monthNames = ['Tháng đầu tiên', 'Tháng thứ hai', 'Tháng cuối cùng'];
  const currentMonthName = monthNames[state.currentMonth] || 'Tháng đầu tiên';

  return `
        <div class="min-h-full p-6">
          <div class="max-w-4xl mx-auto">
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-2xl p-6 border border-amber-500/40 mb-6 shadow-xl">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4">
                  <span class="text-5xl">${province.icon}</span>
                  <div>
                    <h2 class="text-2xl font-bold">${province.name}</h2>
                    <p class="text-slate-300 text-sm">${province.description}</p>
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-amber-400 mb-1">${seasonName}</div>
                  <div class="text-lg text-slate-300">${currentMonthName}</div>
                </div>
                <div class="flex items-center gap-2">
                  <button onclick="openRulesSection('collecting')" class="px-3 py-2 bg-amber-600/30 hover:bg-amber-600 border border-amber-500/40 rounded-xl transition-all text-sm text-white">
                    📖 Luật (Thu thập)
                  </button>
                  <button onclick="openRulesSection('debate')" class="px-3 py-2 bg-rose-600/30 hover:bg-rose-600 border border-rose-500/40 rounded-xl transition-all text-sm text-white">
                    📖 Luật (Tranh luận)
                  </button>
                  <button onclick="navigate('home')" class="px-4 py-2 bg-slate-700/70 hover:bg-slate-700 border border-slate-600/50 rounded-xl transition-all">
                    ← Quay lại
                  </button>
                </div>
              </div>
              
              <div class="text-center mb-4">
                <div class="inline-flex gap-2 bg-slate-700/70 rounded-xl p-2">
                  ${monthNames.map((name, idx) => `
                    <div class="px-4 py-2 rounded-lg ${idx === state.currentMonth ? 'bg-amber-500/30 border border-amber-500/50 text-amber-300 font-semibold' : 'text-slate-400'}">
                      ${name}
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3 text-center text-sm">
                <div class="p-2 bg-slate-700/60 rounded-lg border border-slate-600/50">
                  <p class="text-xl font-bold text-blue-400">${progress.knowledgeGained}</p>
                  <p class="text-slate-300 text-xs">Học liệu</p>
                </div>
                <div class="p-2 bg-slate-700/60 rounded-lg border border-slate-600/50">
                  <p class="text-xl font-bold text-rose-400">${progress.debatesWon}</p>
                  <p class="text-slate-300 text-xs">Tranh luận</p>
                </div>
                <div class="p-2 bg-slate-700/60 rounded-lg border border-slate-600/50">
                  <p class="text-xl font-bold text-emerald-400">${progress.quizzesPassed}</p>
                  <p class="text-slate-300 text-xs">Câu hỏi</p>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4 mb-6">
              <button
                onclick="learnKnowledge()"
                ${!studying.canLearn ? 'disabled' : ''}
                class="p-8 bg-gradient-to-br from-blue-600/60 to-cyan-600/60 hover:from-blue-600/70 hover:to-cyan-600/70 border border-blue-500/40 rounded-2xl transition-all shadow-lg ${studying.canLearn ? 'card-hover' : 'opacity-80 cursor-not-allowed'}"
              >
                <span class="text-6xl block mb-3">📖</span>
                <h3 class="font-bold text-xl mb-2">Thu thập học liệu</h3>
                <p class="text-sm text-slate-300">Tìm kiếm tài liệu, sách vở</p>
                ${!studying.canLearn ? '<p class="text-xs text-amber-400 mt-2">⏳ Đang nghiên cứu...</p>' : ''}
              </button>

              <button
                onclick="startDebate()"
                class="p-8 bg-gradient-to-br from-rose-600/60 to-red-600/60 hover:from-rose-600/70 hover:to-red-600/70 border border-rose-500/40 rounded-2xl transition-all shadow-lg card-hover"
              >
                <span class="text-6xl block mb-3">🗣️</span>
                <h3 class="font-bold text-xl mb-2">Tranh luận</h3>
                <p class="text-sm text-slate-300">Đối thoại, phản biện quan điểm</p>
              </button>
            </div>

            <div class="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-4 border border-amber-500/30 mb-6 shadow-lg">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-300">Tự tin hiện tại</p>
                  <p class="font-bold">${state.scholar.currentConfidence}/${state.scholar.maxConfidence}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-300">Thuyết phục / Kiên định</p>
                  <p class="font-bold">${getScholarStats().persuasion} / ${getScholarStats().resilience}</p>
                </div>
                <button onclick="exitProvince()" class="px-6 py-3 bg-slate-700 hover:bg-slate-600/80 rounded-xl font-semibold transition-all">
                  🚪 Kết thúc
                </button>
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-4 border border-emerald-500/30 shadow-lg mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-300">Mùa hiện tại: <span class="font-bold text-emerald-400">${seasonName}</span></p>
                  <p class="text-xs text-slate-400 mt-1">Mỗi hoạt động tiêu tốn 1 tháng</p>
                </div>
                <button onclick="skipSeason()" class="px-6 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 rounded-xl font-semibold transition-all">
                  🌱 Nghỉ mùa
                </button>
              </div>
            </div>

            <div class="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-4 border border-blue-500/30 shadow-lg">
              <h4 class="font-bold mb-3 flex items-center gap-2">
                <span>ℹ️</span>
                <span>Điểm độc đáo của ${province.name}</span>
              </h4>
              <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-slate-300 mb-2">Lĩnh vực học tập:</p>
                  <div class="flex flex-wrap gap-2">
                    ${province.knowledgeAreas.map(area => {
                      const bookKey = area + '_book';
                      const book = gameData.items[bookKey];
                      if (!book) {
                        console.warn('Book not found:', bookKey);
                        return '';
                      }
                      return `<span class="px-2 py-1 bg-slate-700/70 border border-slate-600 rounded">${book.icon} ${book.name}</span>`;
                    }).filter(Boolean).join('')}
                  </div>
                </div>
                <div>
                  <p class="text-slate-300 mb-2">Di sản đặc biệt:</p>
                  <div class="flex flex-wrap gap-2">
                    ${province.uniqueItems.map(id => {
                      const item = gameData.items[id];
                      if (!item) {
                        console.warn('Unique item not found:', id, 'for province:', province.name);
                        return '';
                      }
                      const locationInfo = item.locationInfo || item.description || '';
                      const rarityColor = item.rarity === 'legendary' ? 'text-yellow-400' : 
                                         item.rarity === 'epic' ? 'text-purple-400' : 
                                         item.rarity === 'rare' ? 'text-blue-400' : 'text-green-400';
                      return `
                        <div class="group relative">
                          <span class="px-2 py-1 bg-amber-500/40 border border-amber-500/40 rounded text-xs cursor-help hover:bg-amber-500/30 transition-colors">
                            ${item.icon} ${item.name}
                          </span>
                          <div class="absolute left-0 top-full mt-1 w-64 p-3 bg-slate-800 border border-amber-500/40 rounded-lg shadow-xl opacity-80 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <div class="flex items-start justify-between mb-2">
                              <span class="text-lg">${item.icon}</span>
                              <span class="text-xs ${rarityColor} font-bold">${item.rarity ? item.rarity.toUpperCase() : ''}</span>
                            </div>
                            <h4 class="font-bold text-sm mb-1">${item.name}</h4>
                            <p class="text-xs text-slate-300 mb-2">${item.description || ''}</p>
                            ${locationInfo ? `<p class="text-xs text-amber-400 italic">📍 ${locationInfo}</p>` : ''}
                            ${item.wisdom ? `<p class="text-xs text-blue-400 mt-2">🧠 Trí tuệ: +${item.wisdom}</p>` : ''}
                            ${item.credibility ? `<p class="text-xs text-green-400">✨ Uy tín: +${item.credibility}</p>` : ''}
                            ${item.patriotism ? `<p class="text-xs text-red-400">❤️ Yêu nước: +${item.patriotism}</p>` : ''}
                          </div>
                        </div>
                      `;
                    }).filter(Boolean).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
};

const renderDebatePage = () => {
  const state = store.getState();
  const { scholar, currentOpponent, debate } = state;
  const stats = getScholarStats();

  return `
        <div class="min-h-full p-6">
          <div class="max-w-7xl w-full mx-auto grid lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2">
              <div class="flex items-center justify-between mb-4">
                <button onclick="conced()" class="px-4 py-2 bg-slate-700/70 hover:bg-slate-700 border border-slate-600/50 rounded-xl transition-all text-sm text-slate-300 hover:text-white">
                  ← Rút lui khỏi tranh luận
                </button>
              </div>
              <div class="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-2xl p-8 border border-amber-500/40 mb-6 shadow-xl">
                <div class="text-center mb-6">
                  <h3 class="text-xl font-bold text-amber-400 mb-2">Đề tài tranh luận</h3>
                  <p class="text-lg font-serif italic text-slate-200">"${currentOpponent.topic}"</p>
                </div>

                <div class="grid md:grid-cols-2 gap-8 mb-8">
                  <div class="text-center">
                    <div class="text-6xl mb-4 ${debate.scholarTurn ? 'animate-float' : ''}">🎓</div>
                    <h3 class="font-bold text-xl mb-2">${scholar.name}</h3>
                    <div class="mb-3">
                      <div class="flex justify-between text-sm mb-1">
                        <span>Tự tin</span>
                        <span>${scholar.currentConfidence}/${scholar.maxConfidence}</span>
                      </div>
                      <div class="h-4 bg-slate-700/70 rounded-full overflow-hidden">
                        <div class="progress-bar h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full" style="width: ${(scholar.currentConfidence / scholar.maxConfidence) * 100}%"></div>
                      </div>
                    </div>
                    <div class="flex justify-center gap-4 text-sm">
                      <span class="text-rose-400">💡 ${stats.persuasion}</span>
                      <span class="text-blue-400">🛡️ ${stats.resilience}</span>
                    </div>
                  </div>

                  <div class="text-center">
                    <div class="text-6xl mb-4">${currentOpponent.icon}</div>
                    <h3 class="font-bold text-xl mb-2">${currentOpponent.name}</h3>
                    <div class="mb-3">
                      <div class="flex justify-between text-sm mb-1">
                        <span>Tự tin</span>
                        <span>${currentOpponent.currentConfidence}/${currentOpponent.maxConfidence}</span>
                      </div>
                      <div class="h-4 bg-slate-700/70 rounded-full overflow-hidden">
                        <div class="progress-bar h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full" style="width: ${(currentOpponent.currentConfidence / currentOpponent.maxConfidence) * 100}%"></div>
                      </div>
                    </div>
                    <div class="flex justify-center gap-4 text-sm">
                      <span class="text-rose-400">💡 ${currentOpponent.persuasion}</span>
                      <span class="text-blue-400">🛡️ ${currentOpponent.resilience}</span>
                    </div>
                  </div>
                </div>

                <div class="bg-slate-700/60 rounded-xl p-4 mb-6 max-h-[150px] overflow-y-auto border border-slate-600/50">
                  ${debate.log.map(msg => `<p class="text-sm mb-1 text-slate-200">${msg}</p>`).join('')}
                </div>

                ${debate.scholarTurn && currentOpponent.currentConfidence > 0 && scholar.currentConfidence > 0 ? `
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <button onclick="presentArgument()" class="py-4 px-6 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 rounded-xl font-bold text-lg transition-all animate-glow shadow-lg">
                      💡 Đưa ra lập luận
                    </button>
                    <button onclick="toggleAutoArgument()" class="py-4 px-6 ${state.autoArgument ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-700 hover:bg-slate-600/80'} rounded-xl font-bold text-lg transition-all">
                      🔁 Tự động (${state.autoArgument ? 'ON' : 'OFF'})
                    </button>
                  </div>
                ` : ''}

                <div class="flex justify-center">
                  <button onclick="conced()" class="py-3 px-6 bg-slate-700/70 hover:bg-slate-600/80/50 border border-slate-600/50 rounded-xl font-semibold transition-all text-slate-300 hover:text-white">
                    🚪 Rút lui khỏi tranh luận
                  </button>
                </div>
              </div>

              <div class="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-4 border border-blue-500/30 shadow-lg">
                <h4 class="font-bold mb-3">☕ Vật phẩm hỗ trợ</h4>
                <div class="flex gap-2 flex-wrap">
                  ${Object.entries(state.inventory).filter(([id]) => {
                    const item = gameData.items[id];
                    return item && item.type === 'consumable';
                  }).slice(0, 5).map(([id, count]) => {
                    const item = gameData.items[id];
                    if (!item) return '';
                    const rarityColor = getRarityColor(item.rarity);
                    return `
                      <div class="group relative">
                        <button onclick="useItem('${id}')" class="px-4 py-2 ${getRarityBg(item.rarity)} border rounded-lg transition-all hover:scale-105">
                          <span class="text-2xl">${item.icon}</span>
                          <span class="ml-2 text-sm">×${count}</span>
                        </button>
                        <div class="absolute left-0 top-full mt-1 w-64 p-3 bg-slate-800 border border-blue-500/40 rounded-lg shadow-xl opacity-80 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                          <div class="flex items-start justify-between mb-2">
                            <span class="text-lg">${item.icon}</span>
                            <span class="text-xs ${rarityColor} font-bold">${item.rarity ? item.rarity.toUpperCase() : ''}</span>
                          </div>
                          <h4 class="font-bold text-sm mb-1">${item.name}</h4>
                          <p class="text-xs text-slate-300 mb-2">${item.description}</p>
                          ${item.focusBoost ? `<p class="text-xs text-emerald-400 mb-1">☕ +${item.focusBoost} Tự tin</p>` : ''}
                          ${item.clarityBoost ? `<p class="text-xs text-cyan-400 mb-1">💧 +${item.clarityBoost} Minh mẫn</p>` : ''}
                          ${item.persuasionBoost ? `<p class="text-xs text-amber-400 mb-1">✨ +${item.persuasionBoost} Thuyết phục (${item.duration} trận)</p>` : ''}
                          ${item.resilienceBoost ? `<p class="text-xs text-cyan-400 mb-1">💪 +${item.resilienceBoost} Kiên định (${item.duration} trận)</p>` : ''}
                        </div>
                      </div>
                    `;
                  }).filter(Boolean).join('')}
                </div>
              </div>
            </div>

            <div class="lg:col-span-1">
              <div class="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-4 border border-red-500/30 shadow-lg sticky top-6">
                <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>🗣️</span>
                  <span>Luật Tranh luận</span>
                </h2>
                <div class="space-y-3 text-slate-300 text-sm">
                  <p><strong class="text-red-400">Cách tranh luận:</strong> Sau khi học tập, click "Tranh luận" để bắt đầu</p>
                  <p><strong class="text-red-400">Cơ chế:</strong></p>
                  <ul class="list-disc list-inside space-y-1 ml-4">
                    <li>Bạn và đối thủ có thanh "Tự tin" (Confidence)</li>
                    <li>Mỗi lượt đưa ra lập luận sẽ gây sát thương cho đối thủ</li>
                    <li>Đối thủ sẽ phản biện và gây sát thương cho bạn</li>
                    <li>Người nào hết tự tin trước sẽ thua</li>
                  </ul>
                  <p><strong class="text-red-400">Câu hỏi khi đưa ra lập luận:</strong></p>
                  <ul class="list-disc list-inside space-y-1 ml-4">
                    <li>Mỗi lần đưa ra lập luận sẽ có một câu hỏi kiểm tra</li>
                    <li>Trả lời đúng: Gây x1.5 sát thương!</li>
                    <li>Trả lời sai: Chỉ gây x0.8 sát thương</li>
                  </ul>
                  <p><strong class="text-red-400">Chiến thắng:</strong></p>
                  <ul class="list-disc list-inside space-y-1 ml-4">
                    <li>Nhận EXP để tăng cấp</li>
                    <li>Có cơ hội nhận sách và vật phẩm từ đối thủ</li>
                    <li>Sau khi thắng sẽ có câu hỏi kiểm tra</li>
                    <li>Trả lời đúng: Tỉ lệ rơi di tích x2!</li>
                  </ul>
                  <p><strong class="text-red-400">Rút lui:</strong> Bạn có thể rút lui khỏi tranh luận bất cứ lúc nào</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
};

const renderInventoryPage = () => {
  const state = store.getState();
  const { scholar, inventory } = state;

  const argumentsItems = Object.entries(inventory).filter(([id]) => gameData.items[id].type === 'argument');
  const defenses = Object.entries(inventory).filter(([id]) => gameData.items[id].type === 'defense');
  const consumables = Object.entries(inventory).filter(([id]) => gameData.items[id].type === 'consumable');
  const knowledge = Object.entries(inventory).filter(([id]) => gameData.items[id].type === 'knowledge');
  const landmarks = Object.entries(inventory).filter(([id]) => gameData.items[id].type === 'landmark');

  return `
        <div class="min-h-full p-6">
          <div class="max-w-6xl mx-auto">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold flex items-center gap-2">
                <span>📚</span>
                <span>Kho học liệu</span>
              </h2>
              <button onclick="navigate('home')" class="px-4 py-2 bg-slate-700 hover:bg-slate-600/80 rounded-xl transition-all">
                ← Quay lại
              </button>
            </div>

            <div class="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-6 border border-amber-500/40 mb-6 shadow-xl">
              <h3 class="font-bold mb-4">⚡ Đang trang bị</h3>
              <div class="grid md:grid-cols-3 gap-4">
                <div class="p-4 bg-slate-700/60 rounded-xl border border-slate-600/50">
                  <p class="text-sm text-slate-300 mb-2">💡 Lập luận</p>
                  ${scholar.argument ? `
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <span class="text-3xl">${gameData.items[scholar.argument].icon}</span>
                        <div>
                          <p class="font-bold">${gameData.items[scholar.argument].name}</p>
                          <p class="text-sm text-rose-400">+${gameData.items[scholar.argument].persuasion} Thuyết phục</p>
                        </div>
                      </div>
                      <button onclick="unequipItem('argument')" class="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-sm transition-all">
                        Tháo
                      </button>
                    </div>
                  ` : '<p class="text-slate-500 text-sm">Chưa trang bị</p>'}
                </div>

                <div class="p-4 bg-slate-700/60 rounded-xl border border-slate-600/50">
                  <p class="text-sm text-slate-300 mb-2">🛡️ Phòng thủ</p>
                  ${scholar.defense ? `
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <span class="text-3xl">${gameData.items[scholar.defense].icon}</span>
                        <div>
                          <p class="font-bold">${gameData.items[scholar.defense].name}</p>
                          <p class="text-sm text-blue-400">+${gameData.items[scholar.defense].resilience} Kiên định</p>
                        </div>
                      </div>
                      <button onclick="unequipItem('defense')" class="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-sm transition-all">
                        Tháo
                      </button>
                    </div>
                  ` : '<p class="text-slate-500 text-sm">Chưa trang bị</p>'}
                </div>

                <div class="p-4 bg-slate-700/60 rounded-xl border border-slate-600/50">
                  <p class="text-sm text-slate-300 mb-2">🏛️ Di tích</p>
                  ${scholar.landmark ? `
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <span class="text-3xl">${gameData.items[scholar.landmark].icon}</span>
                        <div>
                          <p class="font-bold">${gameData.items[scholar.landmark].name}</p>
                          ${gameData.items[scholar.landmark].wisdom ? `<p class="text-sm text-purple-400">+${gameData.items[scholar.landmark].wisdom} Trí tuệ</p>` : ''}
                          ${gameData.items[scholar.landmark].credibility ? `<p class="text-sm text-cyan-400">+${gameData.items[scholar.landmark].credibility} Uy tín</p>` : ''}
                          ${gameData.items[scholar.landmark].patriotism ? `<p class="text-sm text-red-400">+${gameData.items[scholar.landmark].patriotism} Lòng yêu nước</p>` : ''}
                        </div>
                      </div>
                      <button onclick="unequipItem('landmark')" class="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-sm transition-all">
                        Tháo
                      </button>
                    </div>
                  ` : '<p class="text-slate-500 text-sm">Chưa trang bị</p>'}
                </div>
              </div>
            </div>

            ${argumentsItems.length > 0 ? `
              <div class="mb-6">
                <h3 class="font-bold mb-3 flex items-center gap-2">
                  <span>💡</span>
                  <span>Luận cứ</span>
                </h3>
                <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                  ${argumentsItems.map(([id]) => {
                    const item = gameData.items[id];
                    return `
                      <div class="p-4 ${getRarityBg(item.rarity)} border rounded-xl card-hover shadow-lg">
                        <div class="flex items-start justify-between mb-2">
                          <span class="text-3xl">${item.icon}</span>
                          <span class="text-xs ${getRarityColor(item.rarity)}">${item.rarity}</span>
                        </div>
                        <p class="font-bold text-sm mb-1">${item.name}</p>
                        <p class="text-xs text-slate-300 mb-2">${item.description}</p>
                        <p class="text-sm text-rose-400 mb-2">+${item.persuasion} Thuyết phục</p>
                        <button onclick="equipItem('${id}')" class="w-full py-1 px-3 bg-amber-500/40 hover:bg-amber-500/30 border border-amber-500/50 rounded-lg text-xs transition-all">
                          Trang bị
                        </button>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}

            ${defenses.length > 0 ? `
              <div class="mb-6">
                <h3 class="font-bold mb-3 flex items-center gap-2">
                  <span>🛡️</span>
                  <span>Phương án phòng thủ</span>
                </h3>
                <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                  ${defenses.map(([id]) => {
                    const item = gameData.items[id];
                    return `
                      <div class="p-4 ${getRarityBg(item.rarity)} border rounded-xl card-hover shadow-lg">
                        <div class="flex items-start justify-between mb-2">
                          <span class="text-3xl">${item.icon}</span>
                          <span class="text-xs ${getRarityColor(item.rarity)}">${item.rarity}</span>
                        </div>
                        <p class="font-bold text-sm mb-1">${item.name}</p>
                        <p class="text-xs text-slate-300 mb-2">${item.description}</p>
                        <p class="text-sm text-blue-400 mb-2">+${item.resilience} Kiên định</p>
                        <button onclick="equipItem('${id}')" class="w-full py-1 px-3 bg-amber-500/40 hover:bg-amber-500/30 border border-amber-500/50 rounded-lg text-xs transition-all">
                          Trang bị
                        </button>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}

            ${consumables.length > 0 ? `
              <div class="mb-6">
                <h3 class="font-bold mb-3 flex items-center gap-2">
                  <span>☕</span>
                  <span>Vật phẩm hỗ trợ</span>
                </h3>
                <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                  ${consumables.map(([id, count]) => {
                    const item = gameData.items[id];
                    return `
                      <div class="p-4 ${getRarityBg(item.rarity)} border rounded-xl card-hover shadow-lg">
                        <div class="flex items-start justify-between mb-2">
                          <span class="text-3xl">${item.icon}</span>
                          <span class="px-2 py-1 bg-slate-700/70 rounded text-xs">×${count}</span>
                        </div>
                        <p class="font-bold text-sm mb-1">${item.name}</p>
                        <p class="text-xs text-slate-300 mb-2">${item.description}</p>
                        <button onclick="useItem('${id}')" class="w-full py-1 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 rounded-lg text-xs transition-all">
                          Sử dụng
                        </button>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}

            ${knowledge.length > 0 ? `
              <div class="mb-6">
                <h3 class="font-bold mb-3 flex items-center gap-2">
                  <span>📖</span>
                  <span>Học liệu</span>
                </h3>
                <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  ${knowledge.map(([id, count]) => {
                    const item = gameData.items[id];
                    return `
                      <div class="group relative p-3 ${getRarityBg(item.rarity)} border rounded-xl text-center card-hover shadow-lg cursor-help">
                        <span class="text-3xl block mb-1">${item.icon}</span>
                        <p class="text-xs font-bold mb-1">${item.name}</p>
                        <p class="text-xs text-slate-300">×${count}</p>
                        <div class="absolute left-1/2 top-full mt-1 -translate-x-1/2 w-48 p-3 bg-slate-800 border border-slate-600 rounded-lg shadow-xl opacity-80 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-left">
                          <div class="flex items-start justify-between mb-2">
                            <span class="text-lg">${item.icon}</span>
                            <span class="text-xs ${getRarityColor(item.rarity)} font-bold">${item.rarity ? item.rarity.toUpperCase() : ''}</span>
                          </div>
                          <h4 class="font-bold text-sm mb-1">${item.name}</h4>
                          <p class="text-xs text-slate-300 mb-2">Lĩnh vực: ${getAreaName(item.area)}</p>
                          <p class="text-xs text-slate-400">Số lượng: ${count}</p>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}

            ${landmarks.length > 0 ? `
              <div class="mb-6">
                <h3 class="font-bold mb-3 flex items-center gap-2">
                  <span>🏛️</span>
                  <span>Di tích</span>
                </h3>
                <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                  ${landmarks.map(([id]) => {
                    const item = gameData.items[id];
                    return `
                      <div class="p-4 ${getRarityBg(item.rarity)} border rounded-xl card-hover shadow-lg">
                        <div class="flex items-start justify-between mb-2">
                          <span class="text-3xl">${item.icon}</span>
                          <span class="text-xs ${getRarityColor(item.rarity)}">${item.rarity}</span>
                        </div>
                        <p class="font-bold text-sm mb-1">${item.name}</p>
                        <p class="text-xs text-slate-300 mb-2">${item.description}</p>
                        ${item.wisdom ? `<p class="text-sm text-purple-400 mb-1">+${item.wisdom} Trí tuệ</p>` : ''}
                        ${item.credibility ? `<p class="text-sm text-cyan-400 mb-1">+${item.credibility} Uy tín</p>` : ''}
                        ${item.patriotism ? `<p class="text-sm text-red-400 mb-2">+${item.patriotism} Lòng yêu nước</p>` : ''}
                        <button onclick="equipItem('${id}')" class="w-full py-1 px-3 bg-amber-500/40 hover:bg-amber-500/30 border border-amber-500/50 rounded-lg text-xs transition-all">
                          Trang bị
                        </button>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
};

const renderCraftingPage = () => {
  const state = store.getState();

  const craftableItems = Object.entries(gameData.items).filter(([, item]) => item.recipe);
  
  // Separate into argument tools and consumables
  const argumentTools = craftableItems.filter(([, item]) => item.type === 'argument' || item.type === 'defense');
  const consumables = craftableItems.filter(([, item]) => item.type === 'consumable');

  return `
        <div class="min-h-full p-6">
          <div class="max-w-6xl mx-auto">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold flex items-center gap-2">
                <span>📝</span>
                <span>Soạn luận cứ</span>
              </h2>
              <button onclick="navigate('home')" class="px-4 py-2 bg-slate-700 hover:bg-slate-600/80 rounded-xl transition-all">
                ← Quay lại
              </button>
            </div>

            ${argumentTools.length > 0 ? `
              <div class="mb-8">
                <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>💡</span>
                  <span>Luận cứ và Phòng thủ <span class="text-sm font-normal text-blue-400">[Argument Tool]</span></span>
                </h3>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  ${argumentTools.map(([id, item]) => {
                    const currentCount = state.inventory[id] || 0;
                    const canCraft = currentCount < 5 && hasItems(item.recipe);
                    return `
                      <div class="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-5 border ${currentCount >= 5 ? 'border-purple-500/40' : canCraft ? 'border-emerald-500/40' : 'border-slate-700/50'} ${canCraft ? 'card-hover' : 'opacity-85'} shadow-lg">
                        <div class="flex items-start justify-between mb-3">
                          <span class="text-4xl">${item.icon}</span>
                          <span class="text-xs ${getRarityColor(item.rarity)} px-2 py-1 bg-slate-700/70 rounded">${item.rarity}</span>
                        </div>
                        <div class="mb-2">
                          <span class="text-xs px-2 py-1 bg-blue-500/20 border border-blue-500/40 rounded text-blue-300">[Argument Tool]</span>
                        </div>
                        <h3 class="font-bold mb-1">${item.name}</h3>
                        <p class="text-sm text-slate-300 mb-3">${item.description}</p>
                        ${currentCount >= 5 ? `<p class="text-xs text-purple-400 mb-2 font-semibold">✓ Đã chế tạo tối đa (5/5)</p>` : `<p class="text-xs text-slate-400 mb-2">Đã chế tạo: ${currentCount}/5</p>`}

                        ${item.persuasion ? `<p class="text-sm text-rose-400 mb-1">💡 +${item.persuasion} Thuyết phục</p>` : ''}
                        ${item.resilience ? `<p class="text-sm text-blue-400 mb-1">🛡️ +${item.resilience} Kiên định</p>` : ''}

                        <div class="my-3 pt-3 border-t border-slate-700/50">
                          <p class="text-xs text-slate-300 mb-2">Nguyên liệu:</p>
                          <div class="flex flex-wrap gap-2">
                            ${Object.entries(item.recipe).map(([recipeId, amount]) => {
                              if (recipeId === 'any_book') {
                                const allBookTypes = ['history_book', 'philosophy_book', 'politics_book', 'economics_book', 'culture_book', 'society_book', 'tourism_book', 'geography_book', 'environment_book', 'agriculture_book', 'energy_book', 'technology_book', 'labor_book', 'development_book', 'military_book', 'arts_book', 'education_book', 'religion_book', 'ethics_book', 'sports_book'];
                                const totalBooks = allBookTypes.reduce((sum, bookType) => sum + (state.inventory[bookType] || 0), 0);
                                const enough = totalBooks >= amount;
                                return `
                                  <span class="px-2 py-1 ${enough ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-red-500/20 border-red-500/30'} border rounded text-xs" title="Bất kỳ loại sách nào">
                                    📚 ${totalBooks}/${amount}
                                  </span>
                                `;
                              }
                              const has = state.inventory[recipeId] || 0;
                              const enough = has >= amount;
                              const recipeItem = gameData.items[recipeId];
                              if (recipeItem) {
                                return `
                                  <div class="group relative inline-block">
                                    <span class="px-2 py-1 ${enough ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-red-500/20 border-red-500/30'} border rounded text-xs cursor-help">
                                      ${recipeItem.icon} ${has}/${amount}
                                    </span>
                                    <div class="absolute left-1/2 bottom-full mb-1 -translate-x-1/2 w-64 p-3 bg-slate-800 border border-slate-600 rounded-lg shadow-xl opacity-80 invisible group-hover:opacity-100 group-hover:visible transition-all z-[999999] text-left">
                                      <div class="flex items-start justify-between mb-2">
                                        <span class="text-lg">${recipeItem.icon}</span>
                                        <span class="text-xs ${getRarityColor(recipeItem.rarity)} font-bold">${recipeItem.rarity ? recipeItem.rarity.toUpperCase() : ''}</span>
                                      </div>
                                      <h4 class="font-bold text-sm mb-1">${recipeItem.name}</h4>
                                      <p class="text-xs text-slate-300 mb-2">${recipeItem.description || ''}</p>
                                      ${recipeItem.type === 'knowledge' ? `<p class="text-xs text-slate-400">Lĩnh vực: ${getAreaName(recipeItem.area)}</p>` : ''}
                                      ${recipeItem.persuasion ? `<p class="text-xs text-rose-400 mb-1">💡 Thuyết phục: +${recipeItem.persuasion}</p>` : ''}
                                      ${recipeItem.resilience ? `<p class="text-xs text-blue-400 mb-1">🛡️ Kiên định: +${recipeItem.resilience}</p>` : ''}
                                      ${recipeItem.focusBoost ? `<p class="text-xs text-emerald-400 mb-1">☕ +${recipeItem.focusBoost} Tự tin</p>` : ''}
                                      ${recipeItem.clarityBoost ? `<p class="text-xs text-cyan-400 mb-1">💧 +${recipeItem.clarityBoost} Minh mẫn</p>` : ''}
                                      ${recipeItem.persuasionBoost ? `<p class="text-xs text-amber-400 mb-1">✨ +${recipeItem.persuasionBoost} Thuyết phục (${recipeItem.duration} trận)</p>` : ''}
                                      ${recipeItem.resilienceBoost ? `<p class="text-xs text-cyan-400 mb-1">💪 +${recipeItem.resilienceBoost} Kiên định (${recipeItem.duration} trận)</p>` : ''}
                                      <p class="text-xs text-slate-400 mt-2">Loại: ${recipeItem.type === 'knowledge' ? 'Học liệu' : recipeItem.type === 'argument' ? 'Công cụ lập luận' : recipeItem.type === 'defense' ? 'Công cụ phòng thủ' : recipeItem.type === 'consumable' ? 'Vật phẩm hỗ trợ' : recipeItem.type}</p>
                                      <p class="text-xs text-slate-400">Số lượng: ${has}/${amount}</p>
                                    </div>
                                  </div>
                                `;
                              } else {
                                return `
                                  <span class="px-2 py-1 ${enough ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-red-500/20 border-red-500/30'} border rounded text-xs">
                                    📄 ${has}/${amount}
                                  </span>
                                `;
                              }
                            }).join('')}
                          </div>
                        </div>

                        <button
                          onclick="craftItem('${id}')"
                          ${!canCraft ? 'disabled' : ''}
                          class="w-full py-2 px-4 ${currentCount >= 5 ? 'bg-purple-600/50 cursor-not-allowed' : canCraft ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700' : 'bg-slate-700/70 cursor-not-allowed'} rounded-lg font-semibold transition-all text-sm shadow-lg"
                        >
                          ${currentCount >= 5 ? '✓ Đã chế tạo tối đa' : canCraft ? '📝 Soạn thảo' : '❌ Thiếu tài liệu'}
                        </button>


                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}

            ${consumables.length > 0 ? `
              <div class="mb-8">
                <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>☕</span>
                  <span>Vật phẩm hỗ trợ <span class="text-sm font-normal text-purple-400">[Consumables]</span></span>
                </h3>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  ${consumables.map(([id, item]) => {
                    const currentCount = state.inventory[id] || 0;
                    const canCraft = currentCount < 5 && hasItems(item.recipe);
                    return `
                      <div class="group relative bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-5 border ${currentCount >= 5 ? 'border-purple-500/40' : canCraft ? 'border-emerald-500/40' : 'border-slate-700/50'} ${canCraft ? 'card-hover' : 'opacity-100'} shadow-lg cursor-help">
                        <div class="flex items-start justify-between mb-3">
                          <span class="text-4xl">${item.icon}</span>
                          <span class="text-xs ${getRarityColor(item.rarity)} px-2 py-1 bg-slate-700/70 rounded">${item.rarity}</span>
                        </div>
                        <div class="mb-2">
                          <span class="text-xs px-2 py-1 bg-purple-500/20 border border-purple-500/40 rounded text-purple-300">[Consumables]</span>
                        </div>
                        <h3 class="font-bold mb-1">${item.name}</h3>
                        <p class="text-sm text-slate-300 mb-3">${item.description}</p>
                        ${currentCount >= 5 ? `<p class="text-xs text-purple-400 mb-2 font-semibold">✓ Đã chế tạo tối đa (5/5)</p>` : `<p class="text-xs text-slate-400 mb-2">Đã chế tạo: ${currentCount}/5</p>`}

                        ${item.focusBoost ? `<p class="text-sm text-emerald-400 mb-1">☕ +${item.focusBoost} Tự tin</p>` : ''}
                        ${item.clarityBoost ? `<p class="text-sm text-cyan-400 mb-1">💧 +${item.clarityBoost} Minh mẫn</p>` : ''}
                        ${item.persuasionBoost ? `<p class="text-sm text-amber-400 mb-1">✨ +${item.persuasionBoost} Thuyết phục (${item.duration} trận)</p>` : ''}
                        ${item.resilienceBoost ? `<p class="text-sm text-cyan-400 mb-1">💪 +${item.resilienceBoost} Kiên định (${item.duration} trận)</p>` : ''}

                        <div class="my-3 pt-3 border-t border-slate-700/50">
                          <p class="text-xs text-slate-300 mb-2">Nguyên liệu:</p>
                          <div class="flex flex-wrap gap-2">
                            ${Object.entries(item.recipe).map(([recipeId, amount]) => {
                              if (recipeId === 'any_book') {
                                const allBookTypes = ['history_book', 'philosophy_book', 'politics_book', 'economics_book', 'culture_book', 'society_book', 'tourism_book', 'geography_book', 'environment_book', 'agriculture_book', 'energy_book', 'technology_book', 'labor_book', 'development_book', 'military_book', 'arts_book', 'education_book', 'religion_book', 'ethics_book', 'sports_book'];
                                const totalBooks = allBookTypes.reduce((sum, bookType) => sum + (state.inventory[bookType] || 0), 0);
                                const enough = totalBooks >= amount;
                                return `
                                  <span class="px-2 py-1 ${enough ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-red-500/20 border-red-500/30'} border rounded text-xs" title="Bất kỳ loại sách nào">
                                    📚 ${totalBooks}/${amount}
                                  </span>
                                `;
                              }
                              const has = state.inventory[recipeId] || 0;
                              const enough = has >= amount;
                              const recipeItem = gameData.items[recipeId];
                              if (recipeItem) {
                                return `
                                  <div class="group relative inline-block">
                                    <span class="px-2 py-1 ${enough ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-red-500/20 border-red-500/30'} border rounded text-xs cursor-help">
                                      ${recipeItem.icon} ${has}/${amount}
                                    </span>
                                    <div class="absolute left-1/2 bottom-full mb-1 -translate-x-1/2 w-64 p-3 bg-slate-800 border border-slate-600 rounded-lg shadow-xl opacity-80 invisible group-hover:opacity-100 group-hover:visible transition-all z-[999999] text-left">
                                      <div class="flex items-start justify-between mb-2">
                                        <span class="text-lg">${recipeItem.icon}</span>
                                        <span class="text-xs ${getRarityColor(recipeItem.rarity)} font-bold">${recipeItem.rarity ? recipeItem.rarity.toUpperCase() : ''}</span>
                                      </div>
                                      <h4 class="font-bold text-sm mb-1">${recipeItem.name}</h4>
                                      <p class="text-xs text-slate-300 mb-2">${recipeItem.description || ''}</p>
                                      ${recipeItem.type === 'knowledge' ? `<p class="text-xs text-slate-400">Lĩnh vực: ${getAreaName(recipeItem.area)}</p>` : ''}
                                      ${recipeItem.persuasion ? `<p class="text-xs text-rose-400 mb-1">💡 Thuyết phục: +${recipeItem.persuasion}</p>` : ''}
                                      ${recipeItem.resilience ? `<p class="text-xs text-blue-400 mb-1">🛡️ Kiên định: +${recipeItem.resilience}</p>` : ''}
                                      ${recipeItem.focusBoost ? `<p class="text-xs text-emerald-400 mb-1">☕ +${recipeItem.focusBoost} Tự tin</p>` : ''}
                                      ${recipeItem.clarityBoost ? `<p class="text-xs text-cyan-400 mb-1">💧 +${recipeItem.clarityBoost} Minh mẫn</p>` : ''}
                                      ${recipeItem.persuasionBoost ? `<p class="text-xs text-amber-400 mb-1">✨ +${recipeItem.persuasionBoost} Thuyết phục (${recipeItem.duration} trận)</p>` : ''}
                                      ${recipeItem.resilienceBoost ? `<p class="text-xs text-cyan-400 mb-1">💪 +${recipeItem.resilienceBoost} Kiên định (${recipeItem.duration} trận)</p>` : ''}
                                      <p class="text-xs text-slate-400 mt-2">Loại: ${recipeItem.type === 'knowledge' ? 'Học liệu' : recipeItem.type === 'argument' ? 'Công cụ lập luận' : recipeItem.type === 'defense' ? 'Công cụ phòng thủ' : recipeItem.type === 'consumable' ? 'Vật phẩm hỗ trợ' : recipeItem.type}</p>
                                      <p class="text-xs text-slate-400">Số lượng: ${has}/${amount}</p>
                                    </div>
                                  </div>
                                `;
                              } else {
                                return `
                                  <span class="px-2 py-1 ${enough ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-red-500/20 border-red-500/30'} border rounded text-xs">
                                    📄 ${has}/${amount}
                                  </span>
                                `;
                              }
                            }).join('')}
                          </div>
                        </div>

                        <button
                          onclick="craftItem('${id}')"
                          ${!canCraft ? 'disabled' : ''}
                          class="w-full py-2 px-4 ${currentCount >= 5 ? 'bg-purple-600/50 cursor-not-allowed' : canCraft ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700' : 'bg-slate-700/70 cursor-not-allowed'} rounded-lg font-semibold transition-all text-sm shadow-lg"
                        >
                          ${currentCount >= 5 ? '✓ Đã chế tạo tối đa' : canCraft ? '📝 Soạn thảo' : '❌ Thiếu tài liệu'}
                        </button>

                        <div class="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-64 p-3 bg-slate-800 border border-purple-500/40 rounded-lg shadow-xl opacity-80 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-left">
                          <div class="flex items-start justify-between mb-2">
                            <span class="text-lg">${item.icon}</span>
                            <span class="text-xs ${getRarityColor(item.rarity)} font-bold">${item.rarity ? item.rarity.toUpperCase() : ''}</span>
                          </div>
                          <h4 class="font-bold text-sm mb-1">${item.name}</h4>
                          <p class="text-xs text-slate-300 mb-2">${item.description}</p>
                          ${item.focusBoost ? `<p class="text-xs text-emerald-400 mb-1">☕ Tự tin: +${item.focusBoost}</p>` : ''}
                          ${item.clarityBoost ? `<p class="text-xs text-cyan-400 mb-1">💧 Minh mẫn: +${item.clarityBoost}</p>` : ''}
                          ${item.persuasionBoost ? `<p class="text-xs text-amber-400 mb-1">✨ Thuyết phục: +${item.persuasionBoost} (${item.duration} trận)</p>` : ''}
                          ${item.resilienceBoost ? `<p class="text-xs text-cyan-400 mb-1">💪 Kiên định: +${item.resilienceBoost} (${item.duration} trận)</p>` : ''}
                          <p class="text-xs text-slate-400 mt-2">Loại: Vật phẩm hỗ trợ</p>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
};

const renderQuizModal = () => {
  const state = store.getState();
  if (!state.quiz) return '';

  const { quiz } = state;

  return `
        <div class="fixed inset-0 bg-black/90 backdrop-blur-none flex items-center justify-center z-50 p-6">
          <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-amber-500/50 max-w-2xl w-full shadow-2xl">
            <div class="text-center mb-6">
              <span class="text-6xl block mb-4">${quiz.isFinal ? '🏆' : '❓'}</span>
              <h3 class="text-2xl font-bold mb-2">${quiz.isFinal ? 'Câu hỏi tổng kết!' : 'Kiểm tra kiến thức'}</h3>
              <p class="text-slate-300">${quiz.isFinal ? 'Trả lời đúng để nhận phần thưởng!' : 'Củng cố hiểu biết của bạn'}</p>
            </div>

            <div class="bg-slate-700/70 rounded-xl p-6 mb-6 border border-slate-600/50">
              <p class="text-lg font-medium text-center text-slate-100">${quiz.question.question}</p>
            </div>

            <div class="grid grid-cols-1 gap-3 mb-6">
              ${quiz.question.choices.map((choice, i) => `
                <button
                  onclick="answerQuiz(${i})"
                  ${quiz.answered ? 'disabled' : ''}
                  class="p-4 text-left ${quiz.answered ? (i === quiz.question.correct ? 'bg-emerald-500/20 border-emerald-500' : 'bg-slate-700/30 border-slate-600') : 'bg-slate-700/30 hover:bg-slate-600/80/40 border-slate-600 hover:border-amber-500'} border-2 rounded-xl transition-all ${quiz.answered ? 'cursor-default' : ''}"
                >
                  <span class="font-bold mr-2">${String.fromCharCode(65 + i)}.</span>
                  <span class="text-sm">${choice}</span>
                </button>
              `).join('')}
            </div>

            ${quiz.answered ? `
              <div class="p-4 rounded-xl ${quiz.correct ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-red-500/20 border border-red-500/50'} text-center mb-4">
                <p class="font-bold text-lg mb-2">${quiz.correct ? '✅ Chính xác!' : '❌ Chưa chính xác'}</p>
                <p class="text-sm text-slate-200 italic">${quiz.question.explanation}</p>
              </div>
            ` : ''}
          </div>
        </div>
      `;
};

const renderLearningQuizModal = () => {
  const state = store.getState();
  if (!state.learningQuiz) return '';

  const quiz = state.learningQuiz;
  const question = quiz.question;

  return `
    <div class="fixed inset-0 bg-black/80 backdrop-blur-none flex items-center justify-center z-50 p-6">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-amber-500/50 max-w-2xl w-full shadow-2xl">
        <div class="text-center mb-6">
          <div class="text-5xl mb-4">📚</div>
          <h3 class="text-2xl font-bold text-amber-400 mb-2">Kiểm tra kiến thức</h3>
          <p class="text-slate-300 text-sm">Trả lời đúng để nhận x2 học liệu!</p>
        </div>

        <div class="mb-6">
          <p class="text-lg font-semibold text-slate-200 mb-4">${question.question}</p>
          <div class="space-y-3">
            ${question.answers.map((choice, i) => `
              <button
                onclick="answerLearningQuiz(${i})"
                ${quiz.answered ? 'disabled' : ''}
                class="w-full p-4 text-left ${quiz.answered ? (i === question.correct ? 'bg-emerald-500/20 border-emerald-500' : 'bg-slate-700/30 border-slate-600') : 'bg-slate-700/30 hover:bg-slate-600/80/40 border-slate-600 hover:border-amber-500'} border-2 rounded-xl transition-all ${quiz.answered ? 'cursor-default' : ''}"
              >
                <span class="font-bold mr-2">${String.fromCharCode(65 + i)}.</span>
                <span class="text-sm">${choice}</span>
              </button>
            `).join('')}
          </div>
        </div>

        ${quiz.answered ? `
          <div class="p-4 rounded-xl ${quiz.correct ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-red-500/20 border border-red-500/50'} text-center">
            <p class="font-bold text-lg mb-2">${quiz.correct ? '✅ Chính xác!' : '❌ Chưa chính xác'}</p>
            <p class="text-sm text-slate-300">${quiz.correct ? 'Nhận được x2 học liệu!' : 'Nhận được số lượng bình thường'}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;
};

const renderIntroPage = () => {
  const hasSave = !!saved;
  const seasonLabel = getSeasonName((saved && typeof saved.season === 'number') ? saved.season : 0);

  return `
        <div class="min-h-full p-6 bg-gradient-to-br from-slate-900 via-red-950 to-slate-900">
          <div class="max-w-4xl mx-auto">
            <div class="text-center mb-10">
              <h1 class="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-rose-400 via-amber-400 to-red-400 bg-clip-text text-transparent font-sans tracking-tight">
                Hành trình Tư tưởng
              </h1>
              <h1 class="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-rose-400 via-amber-400 to-red-400 bg-clip-text text-transparent font-sans tracking-tight">
                Hồ Chí Minh
              </h1>
              <div class="space-y-6 text-justify"> 
  
  <p class="text-slate-300 text-lg md:text-xl">
    Bạn không bắt đầu trong một cung điện. Bạn bắt đầu trong một thư viện cũ kỹ, nơi mùi giấy mục và mực in hòa quyện thành thứ hương vị của thời gian. Bạn là một Học viên của Thời đại — một linh hồn trẻ tuổi mang trong mình tham vọng xoay chuyển bánh xe tư tưởng của quốc gia.
  </p>

  <p class="text-slate-300 text-lg md:text-xl">
    Mục tiêu của bạn là thu thập những "vũ khí" đầu tiên: Dữ liệu và Sự thật. Bạn bắt đầu bước ra khỏi thư viện để đến với các diễn đàn học thuật, nơi những bộ óc sắc bén nhất tranh đấu. Khi mùa đông của sự khổ luyện kết thúc, cánh cửa của Quốc hội mở ra. Trước mặt bạn là hàng trăm đại biểu — những người nắm giữ huyết mạch của quốc gia.
  </p>

  <p class="text-slate-300 text-lg md:text-xl italic mt-10 pl-4 border-l-2 border-slate-500">
    "Thưa các vị, luật lệ được viết trên giấy, nhưng tương lai được viết bằng tư tưởng. Nếu chúng ta chỉ nhìn vào mặt đất dưới chân, chúng ta sẽ mãi mãi đi vòng quanh một cái hố."
  </p>
  
</div>
              
              <div class="mt-6 inline-block px-6 py-2 bg-amber-500/40 border border-amber-500/50 rounded-xl">
                <p class="text-lg font-bold text-amber-400">${seasonLabel}</p>
                <p class="text-xs text-slate-400">${hasSave ? 'Có dữ liệu lưu — có thể tiếp tục' : 'Bắt đầu hành trình mới'}</p>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4 mb-8">
              <button onclick="openRulesSection('general')" class="p-5 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 border border-blue-500/40 rounded-xl transition-all card-hover text-left">
                <div class="text-3xl mb-2">📘</div>
                <div class="font-bold text-lg">Luật chung</div>
                <div class="text-sm text-slate-300 mt-1">Mục tiêu, thời gian, chỉ số, mẹo chơi</div>
              </button>
              <button onclick="openRulesSection('studying')" class="p-5 bg-gradient-to-r from-emerald-600/20 to-green-600/20 hover:from-emerald-600/30 hover:to-green-600/30 border border-emerald-500/40 rounded-xl transition-all card-hover text-left">
                <div class="text-3xl mb-2">🎓</div>
                <div class="font-bold text-lg">Học tập</div>
                <div class="text-sm text-slate-300 mt-1">Chọn tỉnh, học, câu hỏi kiểm tra</div>
              </button>
              <button onclick="openRulesSection('collecting')" class="p-5 bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/40 rounded-xl transition-all card-hover text-left">
                <div class="text-3xl mb-2">📚</div>
                <div class="font-bold text-lg">Thu thập học liệu &amp; Soạn luận cứ</div>
                <div class="text-sm text-slate-300 mt-1">Sách theo vùng, công thức chế tạo</div>
              </button>
              <button onclick="openRulesSection('debate')" class="p-5 bg-gradient-to-r from-rose-600/20 to-red-600/20 hover:from-rose-600/30 hover:to-red-600/30 border border-rose-500/40 rounded-xl transition-all card-hover text-left">
                <div class="text-3xl mb-2">🗣️</div>
                <div class="font-bold text-lg">Tranh luận</div>
                <div class="text-sm text-slate-300 mt-1">Đưa ra lập luận, vật phẩm hỗ trợ</div>
              </button>
            </div>

            <div class="flex flex-col md:flex-row gap-3 justify-center">
              <button onclick="navigate('home')" class="px-7 py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 rounded-xl font-bold text-lg transition-all shadow-lg">
                ${hasSave ? '▶ Tiếp tục hành trình' : '▶ Bắt đầu'}
              </button>
              <button onclick="openRulesSection('general')" class="px-7 py-3 bg-slate-700/60 hover:bg-slate-700 border border-slate-600/50 rounded-xl font-semibold transition-all text-slate-200">
                📖 Xem luật chơi
              </button>
            </div>
          </div>
        </div>
      `;
};

const renderArgumentQuizModal = () => {
  const state = store.getState();
  if (!state.argumentQuiz) return '';

  const quiz = state.argumentQuiz;
  const question = quiz.question;

  return `
    <div class="fixed inset-0 bg-black/80 backdrop-blur-none flex items-center justify-center z-50 p-6">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-amber-500/50 max-w-2xl w-full shadow-2xl">
        <div class="text-center mb-6">
          <div class="text-5xl mb-4">💡</div>
          <h3 class="text-2xl font-bold text-amber-400 mb-2">Kiểm tra kiến thức</h3>
          <p class="text-slate-300 text-sm">Trả lời đúng để gây x1.5 sát thương, sai chỉ x0.8!</p>
        </div>

        <div class="mb-6">
          <p class="text-lg font-semibold text-slate-200 mb-4">${question.question}</p>
          <div class="space-y-3">
            ${question.answers.map((choice, i) => `
              <button
                onclick="answerArgumentQuiz(${i})"
                ${quiz.answered ? 'disabled' : ''}
                class="w-full p-4 text-left ${quiz.answered ? (i === question.correct ? 'bg-emerald-500/20 border-emerald-500' : 'bg-slate-700/30 border-slate-600') : 'bg-slate-700/30 hover:bg-slate-600/80/40 border-slate-600 hover:border-amber-500'} border-2 rounded-xl transition-all ${quiz.answered ? 'cursor-default' : ''}"
              >
                <span class="font-bold mr-2">${String.fromCharCode(65 + i)}.</span>
                <span class="text-sm">${choice}</span>
              </button>
            `).join('')}
          </div>
        </div>

        ${quiz.answered ? `
          <div class="p-4 rounded-xl ${quiz.correct ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-red-500/20 border border-red-500/50'} text-center">
            <p class="font-bold text-lg mb-2">${quiz.correct ? '✅ Chính xác!' : '❌ Chưa chính xác'}</p>
            <p class="text-sm text-slate-300">${quiz.correct ? 'Sát thương x1.5!' : 'Sát thương chỉ x0.8'}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;
};

const renderDebateQuizModal = () => {
  const state = store.getState();
  if (!state.debateQuiz) return '';

  const quiz = state.debateQuiz;
  const question = quiz.question;

  return `
    <div class="fixed inset-0 bg-black/80 backdrop-blur-none flex items-center justify-center z-50 p-6">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-purple-500/50 max-w-2xl w-full shadow-2xl">
        <div class="text-center mb-6">
          <div class="text-5xl mb-4">🏆</div>
          <h3 class="text-2xl font-bold text-purple-400 mb-2">Kiểm tra kiến thức</h3>
          <p class="text-slate-300 text-sm">Trả lời đúng để tăng x2 tỉ lệ rơi di tích!</p>
        </div>

        <div class="mb-6">
          <p class="text-lg font-semibold text-slate-200 mb-4">${question.question}</p>
          <div class="space-y-3">
            ${question.answers.map((choice, i) => `
              <button
                onclick="answerDebateQuiz(${i})"
                ${quiz.answered ? 'disabled' : ''}
                class="w-full p-4 text-left ${quiz.answered ? (i === question.correct ? 'bg-emerald-500/20 border-emerald-500' : 'bg-slate-700/30 border-slate-600') : 'bg-slate-700/30 hover:bg-slate-600/80/40 border-slate-600 hover:border-purple-500'} border-2 rounded-xl transition-all ${quiz.answered ? 'cursor-default' : ''}"
              >
                <span class="font-bold mr-2">${String.fromCharCode(65 + i)}.</span>
                <span class="text-sm">${choice}</span>
              </button>
            `).join('')}
          </div>
        </div>

        ${quiz.answered ? `
          <div class="p-4 rounded-xl ${quiz.correct ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-red-500/20 border border-red-500/50'} text-center">
            <p class="font-bold text-lg mb-2">${quiz.correct ? '✅ Chính xác!' : '❌ Chưa chính xác'}</p>
            <p class="text-sm text-slate-300">${quiz.correct ? 'Tỉ lệ rơi di tích x2!' : 'Tỉ lệ rơi bình thường'}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;
};

const renderRulesPage = () => {
  const state = store.getState();
  const section = state.rulesSection || 'general';

  const tabClass = (key) =>
    `px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
      section === key
        ? 'bg-amber-500/30 border-amber-500/50 text-amber-200'
        : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800'
    }`;

  return `
    <div class="min-h-full p-6 bg-gradient-to-br from-slate-900 via-red-950 to-slate-900">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <div class="flex items-center justify-between gap-3 mb-4">
            <button onclick="navigate('intro')" class="px-4 py-2 bg-slate-700/70 hover:bg-slate-700 border border-slate-600/50 rounded-xl transition-all text-sm text-slate-300 hover:text-white">
              ← Về màn hình mở
            </button>
            <div class="flex flex-wrap justify-center gap-2">
              <button onclick="openRulesSection('general')" class="${tabClass('general')}">Luật chung</button>
              <button onclick="openRulesSection('studying')" class="${tabClass('studying')}">Học tập</button>
              <button onclick="openRulesSection('collecting')" class="${tabClass('collecting')}">Thu thập &amp; Soạn luận cứ</button>
              <button onclick="openRulesSection('debate')" class="${tabClass('debate')}">Tranh luận</button>
            </div>
          </div>
          <h1 class="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-rose-400 via-amber-400 to-red-400 bg-clip-text text-transparent font-serif">
            📖 Luật chơi
          </h1>
          <p class="text-slate-300 text-lg">Hướng dẫn cách chơi chi tiết</p>
        </div>

        <div class="space-y-6">
          <!-- Mục tiêu -->
          <div class="${section === 'general' ? '' : 'hidden'} bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-6 border border-amber-500/30 shadow-lg">
            <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🎯</span>
              <span>Mục tiêu trò chơi</span>
            </h2>
            <p class="text-slate-300 mb-2">
              Bạn là một học viên đang học tập về Tư tưởng Hồ Chí Minh. Mục tiêu của bạn là:
            </p>
            <ul class="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Du hành qua các tỉnh thành Việt Nam để học tập và tranh luận</li>
              <li>Thu thập sách và vật phẩm để tăng cường khả năng</li>
              <li>Chế tạo công cụ lập luận và vật phẩm hỗ trợ</li>
              <li>Đánh bại các Boss trong các mùa để hoàn thành hành trình</li>
              <li>Hoàn thành game bằng cách đánh bại Boss cuối cùng (Mùa Xuân 2030)</li>
            </ul>
          </div>

          <!-- Hệ thống mùa -->
          <div class="${section === 'general' ? '' : 'hidden'} bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-6 border border-blue-500/30 shadow-lg">
            <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>📅</span>
              <span>Hệ thống mùa và thời gian</span>
            </h2>
            <div class="space-y-3 text-slate-300">
              <p><strong class="text-blue-400">Mùa:</strong> Game diễn ra từ Mùa Xuân 2026 đến Mùa Xuân 2030 (20 mùa)</p>
              <p><strong class="text-blue-400">Tháng:</strong> Mỗi mùa có 3 tháng (Tháng đầu, Tháng giữa, Tháng cuối)</p>
              <p><strong class="text-blue-400">Hoạt động:</strong> Mỗi hoạt động (học tập hoặc tranh luận) tiêu tốn 1 tháng</p>
              <p><strong class="text-blue-400">Nghỉ ngơi:</strong> Bạn có thể bỏ qua mùa để nghỉ ngơi và phục hồi tự tin</p>
            </div>
          </div>

          <!-- Học tập -->
          <div class="${section === 'studying' ? '' : 'hidden'} bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-6 border border-green-500/30 shadow-lg">
            <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🎓</span>
              <span>Học tập</span>
            </h2>
            <div class="space-y-3 text-slate-300">
              <p><strong class="text-green-400">Cách học:</strong> Chọn một tỉnh thành và click "Học tập"</p>
              <p><strong class="text-green-400">Thu thập học liệu:</strong></p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>Mỗi lần học tập bạn sẽ nhận được 1-2 cuốn sách ngẫu nhiên từ các lĩnh vực kiến thức của tỉnh đó</li>
                <li>Có 20% cơ hội nhận được vật phẩm hiếm (research_paper, documentary, interview_record)</li>
                <li>Mỗi tỉnh có các loại sách riêng biệt, hãy khám phá để thu thập đầy đủ!</li>
              </ul>
              <p><strong class="text-green-400">Câu hỏi kiểm tra:</strong></p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>Mỗi lần thu thập học liệu sẽ có một câu hỏi kiểm tra</li>
                <li>Trả lời đúng: Nhận x2 số lượng vật phẩm!</li>
                <li>Trả lời sai: Nhận số lượng bình thường</li>
              </ul>
            </div>
          </div>

          <!-- Tranh luận -->
          <div class="${section === 'debate' ? '' : 'hidden'} bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-6 border border-red-500/30 shadow-lg">
            <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🗣️</span>
              <span>Tranh luận</span>
            </h2>
            <div class="space-y-3 text-slate-300">
              <p><strong class="text-red-400">Cách tranh luận:</strong> Sau khi học tập, click "Tranh luận" để bắt đầu</p>
              <p><strong class="text-red-400">Cơ chế:</strong></p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>Bạn và đối thủ có thanh "Tự tin" (Confidence)</li>
                <li>Mỗi lượt đưa ra lập luận sẽ gây sát thương cho đối thủ</li>
                <li>Đối thủ sẽ phản biện và gây sát thương cho bạn</li>
                <li>Người nào hết tự tin trước sẽ thua</li>
              </ul>
              <p><strong class="text-red-400">Câu hỏi khi đưa ra lập luận:</strong></p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>Mỗi lần đưa ra lập luận sẽ có một câu hỏi kiểm tra</li>
                <li>Trả lời đúng: Gây x1.5 sát thương!</li>
                <li>Trả lời sai: Chỉ gây x0.8 sát thương</li>
              </ul>
              <p><strong class="text-red-400">Chiến thắng:</strong></p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>Nhận EXP để tăng cấp</li>
                <li>Có cơ hội nhận sách và vật phẩm từ đối thủ</li>
                <li>Sau khi thắng sẽ có câu hỏi kiểm tra</li>
                <li>Trả lời đúng: Tỉ lệ rơi di tích x2!</li>
              </ul>
              <p><strong class="text-red-400">Rút lui:</strong> Bạn có thể rút lui khỏi tranh luận bất cứ lúc nào</p>
            </div>
          </div>

          <!-- Chế tạo -->
          <div class="${section === 'collecting' ? '' : 'hidden'} bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-6 border border-purple-500/30 shadow-lg">
            <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>📝</span>
              <span>Chế tạo vật phẩm</span>
            </h2>
            <div class="space-y-3 text-slate-300">
              <p><strong class="text-purple-400">Công cụ lập luận:</strong> Tăng chỉ số Lập luận (Persuasion)</p>
              <p><strong class="text-purple-400">Công cụ phòng thủ:</strong> Tăng chỉ số Phòng thủ (Resilience)</p>
              <p><strong class="text-purple-400">Vật phẩm hỗ trợ:</strong> Sử dụng trong tranh luận để phục hồi tự tin hoặc buff</p>
              <p><strong class="text-purple-400">Giới hạn:</strong> Mỗi vật phẩm có thể chế tạo tối đa 5 lần!</p>
              <p><strong class="text-purple-400">Công thức:</strong> Mỗi công thức yêu cầu các loại sách cụ thể, hãy thu thập đầy đủ để chế tạo</p>
            </div>
          </div>

          <!-- Trang bị -->
          <div class="${section === 'collecting' ? '' : 'hidden'} bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-6 border border-yellow-500/30 shadow-lg">
            <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>⚔️</span>
              <span>Trang bị</span>
            </h2>
            <div class="space-y-3 text-slate-300">
              <p><strong class="text-yellow-400">Công cụ lập luận:</strong> Trang bị để tăng Lập luận</p>
              <p><strong class="text-yellow-400">Công cụ phòng thủ:</strong> Trang bị để tăng Phòng thủ</p>
              <p><strong class="text-yellow-400">Di tích:</strong> Trang bị đặc biệt tăng Trí tuệ, Uy tín, và Lòng yêu nước</p>
              <p><strong class="text-yellow-400">Giới hạn:</strong> Chỉ có thể trang bị 1 vật phẩm mỗi loại</p>
            </div>
          </div>

          <!-- Boss -->
          <div class="${section === 'general' ? '' : 'hidden'} bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-6 border border-orange-500/30 shadow-lg">
            <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>👑</span>
              <span>Boss</span>
            </h2>
            <div class="space-y-3 text-slate-300">
              <p><strong class="text-orange-400">Xuất hiện:</strong> Boss xuất hiện vào cuối một số mùa</p>
              <p><strong class="text-orange-400">Độ khó:</strong> Boss mạnh hơn đối thủ thường rất nhiều</p>
              <p><strong class="text-orange-400">Phần thưởng:</strong> Đánh bại Boss có tỉ lệ rơi vật phẩm đặc biệt</p>
              <p><strong class="text-orange-400">Thất bại:</strong> Nếu thua hoặc rút lui khỏi Boss, game sẽ kết thúc!</p>
              <p><strong class="text-orange-400">Boss cuối:</strong> Đánh bại Boss cuối cùng (Mùa Xuân 2030) để hoàn thành game!</p>
            </div>
          </div>

          <!-- Chỉ số -->
          <div class="${section === 'general' ? '' : 'hidden'} bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-6 border border-cyan-500/30 shadow-lg">
            <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>📊</span>
              <span>Chỉ số</span>
            </h2>
            <div class="space-y-3 text-slate-300">
              <p><strong class="text-cyan-400">Trí tuệ (Wisdom):</strong> Tăng Lập luận và Phòng thủ</p>
              <p><strong class="text-cyan-400">Uy tín (Credibility):</strong> Tăng Lập luận và Phòng thủ</p>
              <p><strong class="text-cyan-400">Lòng yêu nước (Patriotism):</strong> Tăng Lập luận và Phòng thủ</p>
              <p><strong class="text-cyan-400">Lập luận (Persuasion):</strong> Sát thương bạn gây ra cho đối thủ</p>
              <p><strong class="text-cyan-400">Phòng thủ (Resilience):</strong> Giảm sát thương bạn nhận từ đối thủ</p>
              <p><strong class="text-cyan-400">Tự tin (Confidence):</strong> HP trong tranh luận, hết tự tin sẽ thua</p>
            </div>
          </div>

          <!-- Tips -->
          <div class="${section === 'general' ? '' : 'hidden'} bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-none rounded-xl p-6 border border-emerald-500/30 shadow-lg">
            <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>💡</span>
              <span>Mẹo chơi</span>
            </h2>
            <ul class="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li>Học tập ở nhiều tỉnh khác nhau để thu thập đầy đủ các loại sách</li>
              <li>Chế tạo công cụ lập luận và phòng thủ sớm để tăng sức mạnh</li>
              <li>Trang bị Di tích để nhận bonus chỉ số lớn</li>
              <li>Chuẩn bị vật phẩm hỗ trợ trước khi đối đầu với Boss</li>
              <li>Trả lời đúng câu hỏi khi đưa ra lập luận để gây nhiều sát thương hơn</li>
              <li>Sử dụng tính năng "Tự động" để tự động đưa ra lập luận</li>
              <li>Nghỉ ngơi khi tự tin thấp để phục hồi</li>
              <li>Mỗi tỉnh có độ khó khác nhau, hãy bắt đầu từ những tỉnh dễ</li>
            </ul>
          </div>

          <!-- Nút quay lại -->
          <div class="text-center">
            <button onclick="navigate('home')" class="px-6 py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 rounded-xl font-bold text-lg transition-all shadow-lg">
              ← Vào game
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
};

const renderGameOverPage = () => {
  const state = store.getState();
  const { scholar, inventory, provinceProgress, season, gameOverReason } = state;
  const stats = getScholarStats();
  
  // Calculate score
  const levelScore = scholar.level * 100;
  const expScore = scholar.exp;
  const inventoryScore = Object.values(inventory).reduce((sum, count) => sum + count, 0) * 5;
  const debatesWon = Object.values(provinceProgress).reduce((sum, p) => sum + (p.debatesWon || 0), 0);
  const debatesScore = debatesWon * 20;
  const provincesExplored = Object.keys(provinceProgress).length;
  const provincesScore = provincesExplored * 30;
  const seasonScore = (season + 1) * 10;
  const knowledgeGained = Object.values(provinceProgress).reduce((sum, p) => sum + (p.knowledgeGained || 0), 0);
  const knowledgeScore = knowledgeGained * 5;
  
  const totalScore = levelScore + expScore + inventoryScore + debatesScore + provincesScore + seasonScore + knowledgeScore;
  
  const reasonText = gameOverReason === 'lost_to_boss' 
    ? 'Bị đánh bại bởi Boss' 
    : gameOverReason === 'conceded_to_boss'
    ? 'Rút lui khỏi Boss'
    : gameOverReason === 'defeated_final_boss'
    ? 'Đánh bại Boss cuối cùng - Hoàn thành hành trình!'
    : 'Kết thúc trò chơi';
  
  return `
        <div class="min-h-full p-6 bg-gradient-to-br from-red-950 via-slate-900 to-red-950">
          <div class="max-w-4xl mx-auto">
            <div class="text-center mb-8">
              ${gameOverReason === 'defeated_final_boss' ? `
                <div class="text-8xl mb-4">🏆</div>
                <h1 class="text-5xl font-black mb-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  CHIẾN THẮNG!
                </h1>
              ` : `
                <div class="text-8xl mb-4">💀</div>
                <h1 class="text-5xl font-black mb-4 bg-gradient-to-r from-red-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
                  GAME OVER
                </h1>
              `}
              <p class="text-xl text-slate-300 mb-2">${reasonText}</p>
              <p class="text-lg text-amber-400 font-bold">Điểm số: ${totalScore.toLocaleString()}</p>
            </div>

            <div class="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-none rounded-2xl p-8 border border-red-500/50 mb-6 shadow-2xl">
              <h2 class="text-2xl font-bold mb-6 text-center text-red-400">📊 Thống kê người chơi</h2>
              
              <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="bg-slate-700/70 rounded-xl p-4 border border-slate-600/50">
                  <h3 class="font-bold mb-3 text-amber-400">👤 Thông tin nhân vật</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-slate-300">Tên:</span>
                      <span class="font-semibold">${scholar.name}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-300">Cấp độ:</span>
                      <span class="font-semibold text-amber-400">${scholar.level}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-300">Kinh nghiệm:</span>
                      <span class="font-semibold">${scholar.exp}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-300">Thuyết phục:</span>
                      <span class="font-semibold text-rose-400">${stats.persuasion}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-300">Kiên định:</span>
                      <span class="font-semibold text-blue-400">${stats.resilience}</span>
                    </div>
                  </div>
                </div>

                <div class="bg-slate-700/70 rounded-xl p-4 border border-slate-600/50">
                  <h3 class="font-bold mb-3 text-amber-400">🎮 Tiến trình</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-slate-300">Mùa đạt được:</span>
                      <span class="font-semibold text-emerald-400">${getSeasonName(season)}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-300">Tỉnh thành khám phá:</span>
                      <span class="font-semibold">${provincesExplored}/${gameData.provinces.length}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-300">Tranh luận thắng:</span>
                      <span class="font-semibold text-green-400">${debatesWon}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-300">Học liệu thu thập:</span>
                      <span class="font-semibold text-blue-400">${knowledgeGained}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-300">Tổng vật phẩm:</span>
                      <span class="font-semibold text-purple-400">${Object.values(inventory).reduce((sum, count) => sum + count, 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-slate-700/70 rounded-xl p-4 border border-slate-600/50 mb-6">
                <h3 class="font-bold mb-3 text-amber-400">📈 Chi tiết điểm số</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-300">Điểm cấp độ (${scholar.level} × 100):</span>
                    <span class="font-semibold">+${levelScore}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-300">Điểm kinh nghiệm:</span>
                    <span class="font-semibold">+${expScore}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-300">Điểm học liệu (${Object.values(inventory).reduce((sum, count) => sum + count, 0)} × 5):</span>
                    <span class="font-semibold">+${inventoryScore}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-300">Điểm tranh luận (${debatesWon} × 20):</span>
                    <span class="font-semibold">+${debatesScore}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-300">Điểm tỉnh thành (${provincesExplored} × 30):</span>
                    <span class="font-semibold">+${provincesScore}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-300">Điểm mùa (${season + 1} × 10):</span>
                    <span class="font-semibold">+${seasonScore}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-300">Điểm kiến thức (${knowledgeGained} × 5):</span>
                    <span class="font-semibold">+${knowledgeScore}</span>
                  </div>
                  <div class="pt-3 mt-3 border-t border-slate-600/50 flex justify-between">
                    <span class="text-lg font-bold text-amber-400">TỔNG ĐIỂM:</span>
                    <span class="text-2xl font-black text-amber-400">${totalScore.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div class="flex gap-4 justify-center">
                <button onclick="resetGame()" class="px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 rounded-xl font-bold text-lg transition-all shadow-lg">
                  🔄 Chơi lại
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
};

const renderToast = () => {
  const state = store.getState();
  if (!state.toast) return '';

  const colors = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    info: 'bg-amber-600'
  };

  return `
        <div class="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl ${colors[state.toast.type] || colors.info} shadow-2xl z-50 animate-slide-in border border-white/20">
          ${state.toast.message}
        </div>
      `;
};

// ==================== MAIN RENDER ====================
const render = () => {
  const state = store.getState();
  let content = '';

  switch (state.currentPage) {
    case 'intro':
      content = renderIntroPage();
      break;
    case 'home':
      content = renderHomePage();
      break;
    case 'studying':
      content = renderStudyingPage();
      break;
    case 'debate':
      content = renderDebatePage();
      break;
    case 'inventory':
      content = renderInventoryPage();
      break;
    case 'crafting':
      content = renderCraftingPage();
      break;
    case 'rules':
      content = renderRulesPage();
      break;
    case 'gameover':
      content = renderGameOverPage();
      break;
    default:
      content = renderHomePage();
  }

  document.getElementById('app').innerHTML = `
        <div class="h-full overflow-y-auto">
          ${content}
        </div>
        ${renderQuizModal()}
        ${renderLearningQuizModal()}
        ${renderArgumentQuizModal()}
        ${renderDebateQuizModal()}
        ${renderToast()}
      `;
  
  // Khởi tạo Canvas bản đồ sau khi render trang home
  if (state.currentPage === 'home' && typeof window.createMapCanvas === 'function') {
    setTimeout(() => {
      const mapContainer = document.getElementById('map-container');
      if (mapContainer) {
        // Xóa canvas cũ nếu có
        const oldCanvas = document.getElementById('vietnam-map-canvas');
        if (oldCanvas) {
          oldCanvas.remove();
        }
        // Tạo canvas mới
        const canvas = window.createMapCanvas();
        mapContainer.appendChild(canvas);
      }
    }, 100);
  }
};

// Hàm xử lý khi chọn tỉnh từ bản đồ canvas
window.selectProvinceFromMap = (provinceId) => {
  const province = gameData.provinces.find(p => p.id === provinceId);
  if (province) {
    // Sử dụng startStudying để đảm bảo studying state được khởi tạo đúng cách
    window.startStudying(provinceId);
    showToast(`📍 Đã chọn ${province.name}`, 'success');
  }
};

// ==================== ELEMENT SDK INITIALIZATION ====================
const defaultConfig = {
  game_title: "Hành Trình Tư Tưởng Hồ Chí Minh",
  player_name: "Học viên"
};

const onConfigChange = async (config) => {
  const state = store.getState();
  const scholar = { ...state.scholar };
  scholar.name = config.player_name || defaultConfig.player_name;
  store.setState({ scholar }, true);

  // Update title in DOM if exists
  const titleElements = document.querySelectorAll('h1');
  titleElements.forEach(el => {
    if (el.textContent.includes('Hành trình')) {
      el.innerHTML = `${config.game_title || defaultConfig.game_title}`.replace(/Hành trình Tư tưởng Hồ Chí Minh/i, config.game_title || defaultConfig.game_title);
    }
  });

  // Update scholar name in DOM if exists
  const nameElements = document.querySelectorAll('h2');
  nameElements.forEach(el => {
    if (el.textContent === state.scholar.name || el.textContent === 'Học viên') {
      el.textContent = config.player_name || defaultConfig.player_name;
    }
  });
};

// ==================== INITIALIZATION ====================
// Handle page refresh/close during debate
window.addEventListener('beforeunload', (e) => {
  const state = store.getState();
  if (state.currentPage === 'debate' && state.debate) {
    // Call concede function when leaving debate page
    concede();
  }
});

// Handle F5 key press during debate
window.addEventListener('keydown', (e) => {
  const state = store.getState();
  if (state.currentPage === 'debate' && state.debate && e.keyCode === 116) { // F5 key
    e.preventDefault(); // Prevent browser refresh
    confirmConcede(); // Directly concede without modal confirmation
  }
});

// Expose store to window for mapCanvas.js to access
window.store = store;
store.subscribe(render);

if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange,
    mapToCapabilities: (config) => ({
      recolorables: [],
      borderables: [],
      fontEditable: undefined,
      fontSizeable: undefined
    }),
    mapToEditPanelValues: (config) => new Map([
      ['game_title', config.game_title || defaultConfig.game_title],
      ['player_name', config.player_name || defaultConfig.player_name]
    ])
  });
}

render();

