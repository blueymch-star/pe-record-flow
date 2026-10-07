/**
 * 體適能常模與評分計算邏輯
 * 依據教育部體育署最新國小常模門檻 (包含最新項目：仰臥捲腹 CurlUps)
 */

export const FITNESS_ITEMS = [
  { id: 'CurlUps', name: '仰臥捲腹', unit: '次', min: 0, max: 80, step: 1, lowerBetter: false, defaultVal: 20 },
  { id: 'SitAndReach', name: '坐姿體前彎', unit: 'cm', min: -10, max: 60, step: 1, lowerBetter: false, defaultVal: 25 },
  { id: 'StandingLongJump', name: '立定跳遠', unit: 'cm', min: 50, max: 280, step: 1, lowerBetter: false, defaultVal: 150 },
  { id: 'CardioRun', name: '800m跑走', unit: '秒', min: 120, max: 600, step: 1, lowerBetter: true, defaultVal: 270 }
];

export const NORMS_TABLE = [
  // 11 歲 男生 (五年級)
  { gender: 'M', age: 11, item: 'CurlUps', PR25: 12, PR50: 21, PR75: 32, PR85: 41 },
  { gender: 'M', age: 11, item: 'SitAndReach', PR25: 18, PR50: 24, PR75: 29, PR85: 32 },
  { gender: 'M', age: 11, item: 'StandingLongJump', PR25: 128, PR50: 144, PR75: 160, PR85: 169 },
  { gender: 'M', age: 11, item: 'CardioRun', PR25: 322, PR50: 280, PR75: 242, PR85: 228 },

  // 11 歲 女生 (五年級)
  { gender: 'F', age: 11, item: 'CurlUps', PR25: 12, PR50: 20, PR75: 31, PR85: 39 },
  { gender: 'F', age: 11, item: 'SitAndReach', PR25: 24, PR50: 29, PR75: 34, PR85: 37 },
  { gender: 'F', age: 11, item: 'StandingLongJump', PR25: 117, PR50: 131, PR75: 146, PR85: 155 },
  { gender: 'F', age: 11, item: 'CardioRun', PR25: 329, PR50: 296, PR75: 262, PR85: 249 },

  // 12 歲 男生 (六年級)
  { gender: 'M', age: 12, item: 'CurlUps', PR25: 14, PR50: 24, PR75: 35, PR85: 42 },
  { gender: 'M', age: 12, item: 'SitAndReach', PR25: 17, PR50: 23, PR75: 29, PR85: 31 },
  { gender: 'M', age: 12, item: 'StandingLongJump', PR25: 136, PR50: 155, PR75: 172, PR85: 181 },
  { gender: 'M', age: 12, item: 'CardioRun', PR25: 297, PR50: 257, PR75: 223, PR85: 212 },

  // 12 歲 女生 (六年級)
  { gender: 'F', age: 12, item: 'CurlUps', PR25: 12, PR50: 21, PR75: 32, PR85: 40 },
  { gender: 'F', age: 12, item: 'SitAndReach', PR25: 23, PR50: 29, PR75: 35, PR85: 38 },
  { gender: 'F', age: 12, item: 'StandingLongJump', PR25: 120, PR50: 135, PR75: 150, PR85: 162 },
  { gender: 'F', age: 12, item: 'CardioRun', PR25: 315, PR50: 284, PR75: 255, PR85: 243 }
];

/**
 * 依據班級或學生資料自動判定對照年齡
 * 五年級對照 11 歲、六年級對照 12 歲
 */
export function getStudentNormAge(studentOrClass, fallbackClass = '') {
  let classStr = '';
  if (typeof studentOrClass === 'object' && studentOrClass !== null) {
    classStr = String(studentOrClass.classId || studentOrClass.ClassId || fallbackClass || '').trim();
    if (/六|6/.test(classStr)) return 12;
    if (/五|5/.test(classStr)) return 11;
    if (studentOrClass.age || studentOrClass.Age) return Number(studentOrClass.age || studentOrClass.Age);
  } else if (typeof studentOrClass === 'string') {
    classStr = studentOrClass.trim();
    if (/六|6/.test(classStr)) return 12;
    if (/五|5/.test(classStr)) return 11;
  }
  return 11; // 預設 11 歲
}

/**
 * 取得年級常模說明文字 (例如: '五年級 (11歲常模)' 或 '六年級 (12歲常模)')
 */
export function getNormGradeLabel(age) {
  return Number(age) === 12 ? '六年級 (12歲常模)' : '五年級 (11歲常模)';
}

/**
 * 依據數值判斷體適能等第與 PR25 紅燈
 * 支援傳入動態常模表 (customNormsTable)
 */
export function evaluateFitness(gender = 'M', age = 11, item = 'CurlUps', rawValue, customNormsTable = null) {
  if (rawValue === '' || rawValue === null || rawValue === undefined || isNaN(rawValue)) {
    return { levelText: '未測驗', isWarning: false, prBadge: 'grey' };
  }

  const val = Number(rawValue);
  const targetAge = Number(age) || 11;
  const table = (Array.isArray(customNormsTable) && customNormsTable.length > 0) ? customNormsTable : NORMS_TABLE;

  const norm = table.find(n => {
    const nGender = (n.gender || n.Gender || '').toUpperCase();
    const nAge = Number(n.age !== undefined ? n.age : n.Age);
    const nItem = n.item || n.Item;
    return nGender === String(gender).toUpperCase() && nAge === targetAge && nItem === item;
  }) || table.find(n => {
    const nGender = (n.gender || n.Gender || '').toUpperCase();
    const nItem = n.item || n.Item;
    return nGender === String(gender).toUpperCase() && nItem === item;
  });

  if (!norm) {
    return { levelText: '已記錄', isWarning: false, prBadge: 'neutral' };
  }

  const pr25 = Number(norm.PR25 !== undefined ? norm.PR25 : (norm.pR25 || 0));
  const pr50 = Number(norm.PR50 !== undefined ? norm.PR50 : (norm.pR50 || 0));
  const pr75 = Number(norm.PR75 !== undefined ? norm.PR75 : (norm.pR75 || 0));
  const pr85 = Number(norm.PR85 !== undefined ? norm.PR85 : (norm.pR85 || 0));

  const isCardio = (item === 'CardioRun');

  if (!isCardio) {
    if (val < pr25) {
      return { levelText: '待加強 (< PR25)', isWarning: true, prBadge: 'red', threshold: pr25 };
    } else if (val < pr50) {
      return { levelText: '中等 (PR25~50)', isWarning: false, prBadge: 'yellow', threshold: pr50 };
    } else if (val < pr75) {
      return { levelText: '銅牌 (PR50~75)', isWarning: false, prBadge: 'blue', threshold: pr75 };
    } else if (val < pr85) {
      return { levelText: '銀牌 (PR75~85)', isWarning: false, prBadge: 'indigo', threshold: pr85 };
    } else {
      return { levelText: '金牌 (>= PR85)', isWarning: false, prBadge: 'emerald', threshold: pr85 };
    }
  } else {
    // 800m 跑走：秒數越高越慢
    if (val > pr25) {
      return { levelText: '待加強 (< PR25)', isWarning: true, prBadge: 'red', threshold: pr25 };
    } else if (val > pr50) {
      return { levelText: '中等 (PR25~50)', isWarning: false, prBadge: 'yellow', threshold: pr50 };
    } else if (val > pr75) {
      return { levelText: '銅牌 (PR50~75)', isWarning: false, prBadge: 'blue', threshold: pr75 };
    } else if (val > pr85) {
      return { levelText: '銀牌 (PR75~85)', isWarning: false, prBadge: 'indigo', threshold: pr85 };
    } else {
      return { levelText: '金牌 (>= PR85)', isWarning: false, prBadge: 'emerald', threshold: pr85 };
    }
  }
}

/**
 * 學習態度評分模型
 * 起始分 100 分，違規 -4 分，優良 +4 分，最終落在 [60, 100] 之間
 */
export function calculateAttitudeScore(merits = [], violations = []) {
  const initial = 100;
  const netDelta = (merits.length * 4) - (violations.length * 4);
  const scoreRaw = initial + netDelta;
  const score = Math.max(60, Math.min(100, scoreRaw));

  return {
    initial,
    netDelta,
    score,
    isCappedMin: scoreRaw < 60,
    isCappedMax: scoreRaw > 100
  };
}
