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
  // 11 歲 男生 (國小高年級)
  { gender: 'M', age: 11, item: 'CurlUps', PR25: 18, PR50: 26, PR75: 35, PR85: 42 },
  { gender: 'M', age: 11, item: 'SitAndReach', PR25: 18, PR50: 23, PR75: 29, PR85: 34 },
  { gender: 'M', age: 11, item: 'StandingLongJump', PR25: 135, PR50: 155, PR75: 175, PR85: 190 },
  { gender: 'M', age: 11, item: 'CardioRun', PR25: 310, PR50: 275, PR75: 245, PR85: 225 },

  // 11 歲 女生
  { gender: 'F', age: 11, item: 'CurlUps', PR25: 14, PR50: 21, PR75: 30, PR85: 36 },
  { gender: 'F', age: 11, item: 'SitAndReach', PR25: 20, PR50: 26, PR75: 32, PR85: 37 },
  { gender: 'F', age: 11, item: 'StandingLongJump', PR25: 120, PR50: 140, PR75: 158, PR85: 172 },
  { gender: 'F', age: 11, item: 'CardioRun', PR25: 330, PR50: 295, PR75: 265, PR85: 240 }
];

/**
 * 依據數值判斷體適能等第與 PR25 紅燈
 */
export function evaluateFitness(gender = 'M', age = 11, item = 'CurlUps', rawValue) {
  if (rawValue === '' || rawValue === null || rawValue === undefined || isNaN(rawValue)) {
    return { levelText: '未測驗', isWarning: false, prBadge: 'grey' };
  }

  const val = Number(rawValue);
  const norm = NORMS_TABLE.find(n => n.gender === gender && n.age === age && n.item === item)
    || NORMS_TABLE.find(n => n.gender === gender && n.item === item);

  if (!norm) {
    return { levelText: '已記錄', isWarning: false, prBadge: 'neutral' };
  }

  const isCardio = (item === 'CardioRun');

  if (!isCardio) {
    if (val < norm.PR25) {
      return { levelText: '待加強 (< PR25)', isWarning: true, prBadge: 'red', threshold: norm.PR25 };
    } else if (val < norm.PR50) {
      return { levelText: '中等 (PR25~50)', isWarning: false, prBadge: 'yellow', threshold: norm.PR50 };
    } else if (val < norm.PR75) {
      return { levelText: '銅牌 (PR50~75)', isWarning: false, prBadge: 'blue', threshold: norm.PR75 };
    } else if (val < norm.PR85) {
      return { levelText: '銀牌 (PR75~85)', isWarning: false, prBadge: 'indigo', threshold: norm.PR85 };
    } else {
      return { levelText: '金牌 (>= PR85)', isWarning: false, prBadge: 'emerald', threshold: norm.PR85 };
    }
  } else {
    // 800m 跑走：秒數越高越慢
    if (val > norm.PR25) {
      return { levelText: '待加強 (< PR25)', isWarning: true, prBadge: 'red', threshold: norm.PR25 };
    } else if (val > norm.PR50) {
      return { levelText: '中等 (PR25~50)', isWarning: false, prBadge: 'yellow', threshold: norm.PR50 };
    } else if (val > norm.PR75) {
      return { levelText: '銅牌 (PR50~75)', isWarning: false, prBadge: 'blue', threshold: norm.PR75 };
    } else if (val > norm.PR85) {
      return { levelText: '銀牌 (PR75~85)', isWarning: false, prBadge: 'indigo', threshold: norm.PR85 };
    } else {
      return { levelText: '金牌 (>= PR85)', isWarning: false, prBadge: 'emerald', threshold: norm.PR85 };
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
