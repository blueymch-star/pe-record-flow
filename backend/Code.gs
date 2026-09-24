/**
 * 國小體育課教學評量與課後速記系統 (PE Record Flow)
 * Google Apps Script 後端服務 (Code.gs) v4.0
 * 
 * 核心特色：
 * 1. 多工作表結構自動初始化 (initDatabase / setupSheets)
 * 2. doGet 提供前端 Bootstrap 與各項唯讀查詢
 * 3. doPost 接收課後整班批次打包 JSON，Append-only 日誌防衝突、批次 setValues 高效寫入
 * 4. 體適能常模 PR25 紅燈判定與學習態度 (100分起算、±4分、[60, 100] 限制) 數學模型
 */

// -------------------------------------------------------------
// 工作表名稱常數
// -------------------------------------------------------------
const SHEETS = {
  STUDENTS: 'Students',
  TIMETABLE: 'Timetable',
  CURRICULUM: 'CurriculumPlan',
  DAILY_LOGS: 'DailyLogs',
  HEALTH_ATTITUDE_LOGS: 'HealthAttitudeLogs',
  SKILL_EXAMS: 'SkillExams',
  FITNESS_EXAMS: 'FitnessExams',
  FITNESS_NORMS: 'FitnessNorms',
  SCORE_SETTINGS: 'ScoreSettings'
};

// -------------------------------------------------------------
// 1. 初始化資料庫與工作表結構 (initDatabase)
// -------------------------------------------------------------
/**
 * 執行此函式可建立 9 張工作表、設定欄位標題與寫入預設測試資料及教育部常模範本
 */
function initDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. 各工作表定義與表頭
  const schema = {
    [SHEETS.STUDENTS]: [
      'ClassId', 'StudentId', 'SeatNo', 'Name', 'Gender', 'MedicalNotes'
    ],
    [SHEETS.TIMETABLE]: [
      'DayOfWeek', 'Period', 'ClassId', 'Location'
    ],
    [SHEETS.CURRICULUM]: [
      'WeekNo', 'UnitTitle', 'SuggestedContent', 'KeyFocus'
    ],
    [SHEETS.DAILY_LOGS]: [
      'LogId', 'Timestamp', 'Date', 'Period', 'ClassId', 'ActualContent', 'VoiceNotes'
    ],
    [SHEETS.HEALTH_ATTITUDE_LOGS]: [
      'LogId', 'Timestamp', 'Date', 'ClassId', 'StudentId', 'HealthStatus', 'ObservationNotes', 'Violations', 'Merits', 'NetAttitudeDelta'
    ],
    [SHEETS.SKILL_EXAMS]: [
      'ClassId', 'StudentId', 'ExamIndex', 'ItemName', 'RawValue', 'IsExempt'
    ],
    [SHEETS.FITNESS_EXAMS]: [
      'ClassId', 'StudentId', 'BMI', 'SitAndReach', 'CurlUps', 'StandingLongJump', 'CardioRun'
    ],
    [SHEETS.FITNESS_NORMS]: [
      'Gender', 'Age', 'Item', 'PR25', 'PR50', 'PR75', 'PR85'
    ],
    [SHEETS.SCORE_SETTINGS]: [
      'ExamIndex', 'ItemName', 'GradeScaleJSON', 'PassThreshold'
    ]
  };

  // 建立或格式化工作表
  for (const [sheetName, headers] of Object.entries(schema)) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    // 如果是全新空白表，寫入表頭並套用防呆樣式
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length)
           .setValues([headers])
           .setBackground('#1E293B')
           .setFontColor('#FFFFFF')
           .setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  }

  // 填入初始基礎測試資料 (若無資料)
  seedInitialData(ss);

  Logger.log('✅ PE Record Flow 資料表初始化與常模設定已完成！');
}

/**
 * 預載範本資料：學生名單、課表、教學進度、體適能常模
 */
function seedInitialData(ss) {
  // 1. 課表範本
  const timetableSheet = ss.getSheetByName(SHEETS.TIMETABLE);
  if (timetableSheet.getLastRow() <= 1) {
    const defaultTimetable = [
      [1, 2, '501', '操場跑道'],
      [1, 4, '502', '風雨球場'],
      [2, 1, '601', '活動中心'],
      [2, 3, '501', '操場跑道'],
      [3, 2, '602', '大草皮'],
      [4, 2, '502', '風雨球場'],
      [5, 3, '601', '活動中心'],
      [5, 5, '602', '風雨球場']
    ];
    timetableSheet.getRange(2, 1, defaultTimetable.length, defaultTimetable[0].length).setValues(defaultTimetable);
  }

  // 2. 學生名冊範本 (以 501 班為例)
  const studentsSheet = ss.getSheetByName(SHEETS.STUDENTS);
  if (studentsSheet.getLastRow() <= 1) {
    const defaultStudents = [
      ['501', '50101', 1, '陳小明', 'M', '輕微氣喘 (自備吸入劑)'],
      ['501', '50102', 2, '林大同', 'M', ''],
      ['501', '50103', 3, '張宇軒', 'M', ''],
      ['501', '50104', 4, '王品皓', 'M', '心臟二尖瓣脫垂 (避免劇烈耐力跑)'],
      ['501', '50105', 5, '黃俊傑', 'M', ''],
      ['501', '50106', 6, '李承翰', 'M', ''],
      ['501', '50107', 7, '趙冠宇', 'M', ''],
      ['501', '50108', 8, '周子翔', 'M', ''],
      ['501', '50121', 21, '林依晨', 'F', ''],
      ['501', '50122', 22, '黃婷萱', 'F', '過敏性體質'],
      ['501', '50123', 23, '張心怡', 'F', ''],
      ['501', '50124', 24, '陳芷涵', 'F', ''],
      ['501', '50125', 25, '劉雨潔', 'F', '']
    ];
    studentsSheet.getRange(2, 1, defaultStudents.length, defaultStudents[0].length).setValues(defaultStudents);
  }

  // 3. 課程規劃範本
  const curriculumSheet = ss.getSheetByName(SHEETS.CURRICULUM);
  if (curriculumSheet.getLastRow() <= 1) {
    const defaultCurriculum = [
      [1, '常規建立與體能評估', '課堂常規、集合隊形、健康檢查回報與伸展操', '體能安全與運動防護概念'],
      [2, '立定跳遠與下肢爆發力', '雙腳同時起跳落地動作分析、連續梯形跳練習', '起跳膝關節屈曲角度'],
      [3, '仰臥捲腹與核心肌群', '仰臥捲腹標準姿勢檢核、腹直肌等長收縮體驗', '下背貼地、雙手平推至膝蓋'],
      [4, '體適能檢測：跑走800m', '配速策略講解、800m跑走檢測與心率監測', '均速跑與終點衝刺安全'],
      [5, '籃球基礎：運球與傳接', '低重心運球、胸前傳球與兩人行進傳接球', '運球眼睛不看球、傳球跨步推送']
    ];
    curriculumSheet.getRange(2, 1, defaultCurriculum.length, defaultCurriculum[0].length).setValues(defaultCurriculum);
  }

  // 4. 體適能教育部男女各年齡常模基準表 (含仰臥捲腹最新指標)
  const normsSheet = ss.getSheetByName(SHEETS.FITNESS_NORMS);
  if (normsSheet.getLastRow() <= 1) {
    // 欄位：Gender, Age, Item, PR25, PR50, PR75, PR85
    // 注意：CardioRun (800m跑走) 單位為秒，數值越低越佳，PR25門檻秒數較高
    const defaultNorms = [
      // 10~11歲 男生 (國小高年級)
      ['M', 11, 'CurlUps', 18, 26, 35, 42],          // 次數
      ['M', 11, 'SitAndReach', 18, 23, 29, 34],      // cm
      ['M', 11, 'StandingLongJump', 135, 155, 175, 190], // cm
      ['M', 11, 'CardioRun', 310, 275, 245, 225],    // 秒 (越快越好)

      // 10~11歲 女生
      ['F', 11, 'CurlUps', 14, 21, 30, 36],
      ['F', 11, 'SitAndReach', 20, 26, 32, 37],
      ['F', 11, 'StandingLongJump', 120, 140, 158, 172],
      ['F', 11, 'CardioRun', 330, 295, 265, 240]
    ];
    normsSheet.getRange(2, 1, defaultNorms.length, defaultNorms[0].length).setValues(defaultNorms);
  }

  // 5. 技能測驗自訂級距換算表
  const scoreSettingsSheet = ss.getSheetByName(SHEETS.SCORE_SETTINGS);
  if (scoreSettingsSheet.getLastRow() <= 1) {
    const defaultSettings = [
      [1, '立定跳遠 (cm)', JSON.stringify({ type: 'norm' }), 60],
      [2, '仰臥捲腹 (次/分)', JSON.stringify({ type: 'norm' }), 60],
      [3, '運球繞錐上籃 (分)', JSON.stringify({
        type: 'custom',
        thresholds: [
          { min: 90, score: 95 },
          { min: 80, score: 85 },
          { min: 70, score: 75 },
          { min: 60, score: 65 },
          { min: 0, score: 55 }
        ]
      }), 60],
      [4, '羽球發高遠球 (顆/10顆)', JSON.stringify({
        type: 'custom',
        thresholds: [
          { min: 8, score: 95 },
          { min: 6, score: 85 },
          { min: 4, score: 75 },
          { min: 2, score: 65 },
          { min: 0, score: 55 }
        ]
      }), 60]
    ];
    scoreSettingsSheet.getRange(2, 1, defaultSettings.length, defaultSettings[0].length).setValues(defaultSettings);
  }
}

// -------------------------------------------------------------
// 2. HTTP GET 介面：提供前端 Bootstrap 與查詢 API
// -------------------------------------------------------------
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'getBootstrapData';
    let responseData = {};

    switch (action) {
      case 'getBootstrapData':
        responseData = handleGetBootstrapData();
        break;
      case 'getStudents':
        responseData = handleGetStudents(e.parameter.classId);
        break;
      case 'getTimetable':
        responseData = handleGetTimetable();
        break;
      case 'getNorms':
        responseData = handleGetNorms();
        break;
      case 'getDailyLogs':
        responseData = handleGetDailyLogs(e.parameter.classId);
        break;
      default:
        responseData = { success: false, error: 'Unknown action: ' + action };
    }

    return createJsonResponse(responseData);
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString(),
      stack: error.stack
    });
  }
}

/**
 * 一次性拉取前端初始化所需的資料集合 (降低手機連線請求次數)
 */
function handleGetBootstrapData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const students = getSheetDataAsObjects(ss.getSheetByName(SHEETS.STUDENTS));
  const timetable = getSheetDataAsObjects(ss.getSheetByName(SHEETS.TIMETABLE));
  const curriculum = getSheetDataAsObjects(ss.getSheetByName(SHEETS.CURRICULUM));
  const norms = getSheetDataAsObjects(ss.getSheetByName(SHEETS.FITNESS_NORMS));
  const scoreSettings = getSheetDataAsObjects(ss.getSheetByName(SHEETS.SCORE_SETTINGS));
  
  // 取得不重複的班級列表
  const classSet = new Set();
  students.forEach(s => { if (s.ClassId) classSet.add(s.ClassId); });
  timetable.forEach(t => { if (t.ClassId) classSet.add(t.ClassId); });

  // 取得最新 10 筆 DailyLogs 作為參考
  const logsSheet = ss.getSheetByName(SHEETS.DAILY_LOGS);
  const recentLogs = getSheetDataAsObjects(logsSheet).slice(-10);

  return {
    success: true,
    serverTime: new Date().toISOString(),
    classes: Array.from(classSet),
    students,
    timetable,
    curriculum,
    norms,
    scoreSettings,
    recentLogs
  };
}

function handleGetStudents(classId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let students = getSheetDataAsObjects(ss.getSheetByName(SHEETS.STUDENTS));
  if (classId) {
    students = students.filter(s => String(s.ClassId) === String(classId));
  }
  return { success: true, students };
}

function handleGetTimetable() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return { success: true, timetable: getSheetDataAsObjects(ss.getSheetByName(SHEETS.TIMETABLE)) };
}

function handleGetNorms() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return { success: true, norms: getSheetDataAsObjects(ss.getSheetByName(SHEETS.FITNESS_NORMS)) };
}

function handleGetDailyLogs(classId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let logs = getSheetDataAsObjects(ss.getSheetByName(SHEETS.DAILY_LOGS));
  if (classId) {
    logs = logs.filter(l => String(l.ClassId) === String(classId));
  }
  return { success: true, logs };
}

// -------------------------------------------------------------
// 3. HTTP POST 介面：課後單一 JSON 打包批次寫入 (Append-only)
// -------------------------------------------------------------
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // 取得互斥鎖，防多裝置並行覆蓋衝突 (最多等 10 秒)
    lock.waitLock(10000);

    const payload = JSON.parse(e.postData.contents);
    const action = payload.action || 'saveClassSession';
    let result = {};

    switch (action) {
      case 'saveClassSession':
        result = handleSaveClassSession(payload.data);
        break;
      case 'batchImportStudents':
        result = handleBatchImportStudents(payload.data);
        break;
      default:
        result = { success: false, error: 'Unknown post action: ' + action };
    }

    return createJsonResponse(result);
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString(),
      stack: error.stack
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * 處理課後速記整班批次儲存
 * payload 格式：
 * {
 *   dailyLog: { date, period, classId, actualContent, voiceNotes },
 *   healthAttitudeList: [
 *     { studentId, healthStatus, observationNotes, violations: ['未穿運動鞋服'], merits: ['熱心收器材'], netAttitudeDelta: 0 }
 *   ],
 *   fitnessList: [ ... ],
 *   skillsList: [ ... ]
 * }
 */
function handleSaveClassSession(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestamp = new Date().toISOString();
  const baseLogId = 'LOG_' + Utilities.formatDate(new Date(), 'GMT+8', 'yyyyMMdd_HHmmss') + '_' + (data.dailyLog?.classId || 'CLS');

  let writtenCounts = {
    dailyLog: 0,
    healthAttitude: 0,
    fitness: 0,
    skills: 0
  };

  // 1. 寫入 DailyLogs (課堂日誌)
  if (data.dailyLog) {
    const dailySheet = ss.getSheetByName(SHEETS.DAILY_LOGS);
    const logRow = [
      baseLogId,
      timestamp,
      data.dailyLog.date || Utilities.formatDate(new Date(), 'GMT+8', 'yyyy-MM-dd'),
      data.dailyLog.period || '',
      data.dailyLog.classId || '',
      data.dailyLog.actualContent || '',
      data.dailyLog.voiceNotes || ''
    ];
    dailySheet.appendRow(logRow);
    writtenCounts.dailyLog = 1;
  }

  // 2. 批次寫入 HealthAttitudeLogs (Append-only)
  if (data.healthAttitudeList && Array.isArray(data.healthAttitudeList) && data.healthAttitudeList.length > 0) {
    const haSheet = ss.getSheetByName(SHEETS.HEALTH_ATTITUDE_LOGS);
    const haRows = [];

    data.healthAttitudeList.forEach((item, idx) => {
      const violationsStr = Array.isArray(item.violations) ? item.violations.join('; ') : (item.violations || '');
      const meritsStr = Array.isArray(item.merits) ? item.merits.join('; ') : (item.merits || '');
      
      // 計算淨加減分：每項違規 -4、每項優良 +4
      const vCount = Array.isArray(item.violations) ? item.violations.length : 0;
      const mCount = Array.isArray(item.merits) ? item.merits.length : 0;
      const calcDelta = (mCount * 4) - (vCount * 4);
      const delta = (item.netAttitudeDelta !== undefined) ? item.netAttitudeDelta : calcDelta;

      haRows.push([
        `${baseLogId}_HA_${idx + 1}`,
        timestamp,
        data.dailyLog?.date || Utilities.formatDate(new Date(), 'GMT+8', 'yyyy-MM-dd'),
        data.dailyLog?.classId || item.classId || '',
        item.studentId,
        item.healthStatus || '良好',
        item.observationNotes || '',
        violationsStr,
        meritsStr,
        delta
      ]);
    });

    if (haRows.length > 0) {
      const startRow = haSheet.getLastRow() + 1;
      haSheet.getRange(startRow, 1, haRows.length, haRows[0].length).setValues(haRows);
      writtenCounts.healthAttitude = haRows.length;
    }
  }

  // 3. 批次寫入 FitnessExams (體適能檢測)
  if (data.fitnessList && Array.isArray(data.fitnessList) && data.fitnessList.length > 0) {
    const fitnessSheet = ss.getSheetByName(SHEETS.FITNESS_EXAMS);
    const fitnessRows = [];

    data.fitnessList.forEach(item => {
      fitnessRows.push([
        data.dailyLog?.classId || item.classId || '',
        item.studentId,
        item.bmi || '',
        item.sitAndReach || '',
        item.curlUps || '',
        item.standingLongJump || '',
        item.cardioRun || ''
      ]);
    });

    if (fitnessRows.length > 0) {
      const startRow = fitnessSheet.getLastRow() + 1;
      fitnessSheet.getRange(startRow, 1, fitnessRows.length, fitnessRows[0].length).setValues(fitnessRows);
      writtenCounts.fitness = fitnessRows.length;
    }
  }

  // 4. 批次寫入 SkillExams (技能測驗)
  if (data.skillsList && Array.isArray(data.skillsList) && data.skillsList.length > 0) {
    const skillSheet = ss.getSheetByName(SHEETS.SKILL_EXAMS);
    const skillRows = [];

    data.skillsList.forEach(item => {
      skillRows.push([
        data.dailyLog?.classId || item.classId || '',
        item.studentId,
        item.examIndex || 1,
        item.itemName || '',
        item.rawValue || '',
        Boolean(item.isExempt)
      ]);
    });

    if (skillRows.length > 0) {
      const startRow = skillSheet.getLastRow() + 1;
      skillSheet.getRange(startRow, 1, skillRows.length, skillRows[0].length).setValues(skillRows);
      writtenCounts.skills = skillRows.length;
    }
  }

  return {
    success: true,
    message: '課堂紀錄與學生成績已批次同步完成',
    logId: baseLogId,
    timestamp,
    writtenCounts
  };
}

/**
 * 批次名冊匯入 (桌機端功能)
 */
function handleBatchImportStudents(students) {
  if (!Array.isArray(students) || students.length === 0) {
    return { success: false, error: '名冊資料為空' };
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.STUDENTS);
  const rows = students.map(s => [
    s.ClassId, s.StudentId, s.SeatNo, s.Name, s.Gender, s.MedicalNotes || ''
  ]);
  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rows.length, rows[0].length).setValues(rows);
  return { success: true, count: rows.length };
}

// -------------------------------------------------------------
// 4. 體適能常模與學期成績核心運算邏輯
// -------------------------------------------------------------

/**
 * 依據性別、年齡、測驗項目與 rawValue 判定常模 PR 門檻與是否亮紅燈
 * @param {string} gender 'M' | 'F'
 * @param {number} age 年齡 (例 11)
 * @param {string} item 'CurlUps' | 'SitAndReach' | 'StandingLongJump' | 'CardioRun'
 * @param {number} rawValue 實測數值
 * @returns {object} { prLevel: 'PR25以下'|'PR25~50'|'PR50~75'|'PR75以上', isWarning: boolean, rawValue }
 */
function evaluateFitnessNorm(gender, age, item, rawValue) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const norms = getSheetDataAsObjects(ss.getSheetByName(SHEETS.FITNESS_NORMS));
  
  // 比對常模
  const row = norms.find(n => n.Gender === gender && Number(n.Age) === Number(age) && n.Item === item);
  if (!row) {
    return { evaluated: false, reason: '找不到對應常模基準' };
  }

  const val = Number(rawValue);
  const isCardio = (item === 'CardioRun'); // 800m 跑走為秒數，越小越佳

  let isWarning = false;
  let prLevel = '';

  if (!isCardio) {
    // 數值越大越好
    if (val < row.PR25) {
      isWarning = true;
      prLevel = '< PR25 (待加強)';
    } else if (val < row.PR50) {
      prLevel = 'PR25~PR50 (中等)';
    } else if (val < row.PR75) {
      prLevel = 'PR50~PR75 (銅牌)';
    } else if (val < row.PR85) {
      prLevel = 'PR75~PR85 (銀牌)';
    } else {
      prLevel = '>= PR85 (金牌)';
    }
  } else {
    // 800m 跑走：秒數越高代表越慢，超過 PR25 門檻秒數為待加強
    if (val > row.PR25) {
      isWarning = true;
      prLevel = '< PR25 (待加強)';
    } else if (val > row.PR50) {
      prLevel = 'PR25~PR50 (中等)';
    } else if (val > row.PR75) {
      prLevel = 'PR50~PR75 (銅牌)';
    } else if (val > row.PR85) {
      prLevel = 'PR75~PR85 (銀牌)';
    } else {
      prLevel = '>= PR85 (金牌)';
    }
  }

  return {
    evaluated: true,
    gender,
    age,
    item,
    rawValue: val,
    isWarning, // PR < 25 標記紅燈
    prLevel,
    thresholdPR25: row.PR25
  };
}

/**
 * 學習態度總評分數學模型
 * 起始分 100 分，違規 -4 分，優良 +4 分，邊界截斷於 [60, 100]
 */
function calculateAttitudeScore(meritsCount, violationsCount) {
  const initial = 100;
  const netDelta = (meritsCount * 4) - (violationsCount * 4);
  let finalScore = initial + netDelta;
  if (finalScore < 60) finalScore = 60;
  if (finalScore > 100) finalScore = 100;
  return {
    initial,
    meritsCount,
    violationsCount,
    netDelta,
    finalScore
  };
}

// -------------------------------------------------------------
// 輔助函式 (Helper Functions)
// -------------------------------------------------------------

/**
 * 將指定 Sheet 的全部內容轉換為物件陣列 (以第一列為 key)
 */
function getSheetDataAsObjects(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  const range = sheet.getDataRange();
  const values = range.getValues();
  const headers = values[0];
  const objects = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    // 若整行皆為空字串則忽略
    if (row.every(cell => cell === '' || cell === null)) continue;
    const obj = {};
    headers.forEach((header, colIdx) => {
      obj[header] = row[colIdx];
    });
    objects.push(obj);
  }
  return objects;
}

/**
 * 建立標準 JSON HTTP Response
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
