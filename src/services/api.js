/**
 * PE Record Flow API 與離線同步模組
 */
import { MOCK_STUDENTS, MOCK_TIMETABLE, MOCK_CURRICULUM, MOCK_CLASSES, MOCK_RECENT_LOGS } from './mockData';
import { NORMS_TABLE } from './norms';

const STORAGE_KEYS = {
  GAS_URL: 'pe_gas_webapp_url',
  API_TOKEN: 'pe_api_secret_token',
  OFFLINE_QUEUE: 'pe_offline_sync_queue',
  LOCAL_DATA: 'pe_cached_bootstrap_data_v6' // 升級 v6 快取，強制載入 Google 試算表校正後的 42 週課程進度
};

const DEFAULT_API_TOKEN = 'pe-flow-sec-2026-tk99';
const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbxJghd5GpxST6PLDvmR1KSluKitKqVMa1ONeoGFd5YuIQBvw30kmPIypDRz2N81umR7/exec';

/**
 * 欄位大小寫雙向容錯標準化函式 (相容 Google 試算表 PascalCase 與 Vue camelCase)
 */
export function normalizeStudent(s) {
  if (!s) return s;
  const classId = s.classId || s.ClassId || '';
  const studentId = s.studentId || s.StudentId || '';
  const seatNo = (s.seatNo !== undefined && s.seatNo !== null && s.seatNo !== '') 
    ? Number(s.seatNo) 
    : ((s.SeatNo !== undefined && s.SeatNo !== null && s.SeatNo !== '') ? Number(s.SeatNo) : '');
  const name = s.name || s.Name || '';
  const gender = s.gender || s.Gender || 'M';
  const medicalNotes = s.medicalNotes !== undefined ? s.medicalNotes : (s.MedicalNotes !== undefined ? s.MedicalNotes : '');

  return {
    ...s,
    classId,
    ClassId: classId,
    studentId,
    StudentId: studentId,
    seatNo,
    SeatNo: seatNo,
    name,
    Name: name,
    gender,
    Gender: gender,
    medicalNotes,
    MedicalNotes: medicalNotes
  };
}

export function normalizeTimetableItem(t) {
  if (!t) return t;
  const dayOfWeek = Number(t.dayOfWeek !== undefined ? t.dayOfWeek : t.DayOfWeek);
  const period = Number(t.period !== undefined ? t.period : t.Period);
  const classId = t.classId || t.ClassId || '';
  const location = t.location || t.Location || '';
  return {
    ...t,
    dayOfWeek,
    DayOfWeek: dayOfWeek,
    period,
    Period: period,
    classId,
    ClassId: classId,
    location,
    Location: location
  };
}

export function normalizeCurriculumItem(c) {
  if (!c) return c;
  const grade = Number(c.grade !== undefined ? c.grade : c.Grade);
  const weekNo = Number(c.weekNo !== undefined ? c.weekNo : c.WeekNo);
  const dateRange = c.dateRange || c.DateRange || '';
  const schoolEvent = c.schoolEvent || c.SchoolEvent || '';
  const venue = c.venue || c.Venue || '';
  const unitTitle = c.unitTitle || c.UnitTitle || '';
  const suggestedContent = c.suggestedContent || c.SuggestedContent || '';
  const keyFocus = c.keyFocus || c.KeyFocus || '';
  const resource = c.resource || c.Resource || '';
  const evalMethod = c.evalMethod || c.EvalMethod || '';
  return {
    ...c,
    grade,
    Grade: grade,
    weekNo,
    WeekNo: weekNo,
    dateRange,
    DateRange: dateRange,
    schoolEvent,
    SchoolEvent: schoolEvent,
    venue,
    Venue: venue,
    unitTitle,
    UnitTitle: unitTitle,
    suggestedContent,
    SuggestedContent: suggestedContent,
    keyFocus,
    KeyFocus: keyFocus,
    resource,
    Resource: resource,
    evalMethod,
    EvalMethod: evalMethod
  };
}

export function normalizeBootstrapData(data) {
  if (!data) return data;
  if (Array.isArray(data.students)) {
    data.students = data.students.map(normalizeStudent);
  }
  if (Array.isArray(data.timetable)) {
    data.timetable = data.timetable.map(normalizeTimetableItem);
  }
  if (Array.isArray(data.curriculum)) {
    data.curriculum = data.curriculum.map(normalizeCurriculumItem);
  }
  if (Array.isArray(data.recentLogs)) {
    data.recentLogs = data.recentLogs.map(log => ({
      ...log,
      logId: log.logId || log.LogId || '',
      date: log.date || log.Date || '',
      period: Number(log.period !== undefined ? log.period : log.Period) || '',
      classId: log.classId || log.ClassId || '',
      actualContent: log.actualContent || log.ActualContent || '',
      voiceNotes: log.voiceNotes || log.VoiceNotes || '',
      timestamp: log.timestamp || log.Timestamp || ''
    }));
  } else {
    data.recentLogs = [];
  }
  if (Array.isArray(data.students)) {
    const fromStudents = Array.from(new Set(data.students.map(s => s.classId).filter(Boolean)));
    if (fromStudents.length > 0) {
      data.classes = Array.from(new Set([...(data.classes || []), ...fromStudents]));
    }
  }
  return data;
}

export const apiService = {
  /**
   * 取得已設定的 GAS Web App URL (具備自動升級舊部署網址機制)
   */
  getGasUrl() {
    const stored = localStorage.getItem(STORAGE_KEYS.GAS_URL);
    // 自動修復：若手機/電腦存有舊版 deployment ID，自動切換至最新 @6 部署網址
    if (stored && stored !== DEFAULT_GAS_URL) {
      if (!stored.includes('AKfycbxJghd5GpxST6PLDvmR1KSluKitKqVMa1ONeoGFd5YuIQBvw30kmPIypDRz2N81umR7')) {
        localStorage.setItem(STORAGE_KEYS.GAS_URL, DEFAULT_GAS_URL);
        return DEFAULT_GAS_URL;
      }
    }
    return stored || DEFAULT_GAS_URL;
  },

  /**
   * 儲存使用者的 GAS Web App URL
   */
  setGasUrl(url) {
    localStorage.setItem(STORAGE_KEYS.GAS_URL, (url || '').trim());
  },

  /**
   * 取得已設定的 API 驗證金鑰 (Secret Token)
   */
  getApiToken() {
    const stored = localStorage.getItem(STORAGE_KEYS.API_TOKEN);
    if (!stored || stored.trim() === '') {
      localStorage.setItem(STORAGE_KEYS.API_TOKEN, DEFAULT_API_TOKEN);
      return DEFAULT_API_TOKEN;
    }
    return stored;
  },

  /**
   * 儲存使用者的 API 驗證金鑰
   */
  setApiToken(token) {
    localStorage.setItem(STORAGE_KEYS.API_TOKEN, (token || '').trim());
  },

  /**
   * 測試與 Google Apps Script 雲端試算表之連線狀態
   */
  async testConnection(url, token) {
    const targetUrl = (url || this.getGasUrl()).trim();
    const targetToken = (token !== undefined ? token : this.getApiToken()).trim();
    if (!targetUrl) {
      return { success: false, error: '未輸入 Google Apps Script 網頁應用程式網址' };
    }
    try {
      const resp = await fetch(`${targetUrl}?action=getBootstrapData&token=${encodeURIComponent(targetToken)}&_t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (!resp.ok) {
        return { success: false, error: `HTTP 連線錯誤 (${resp.status} ${resp.statusText})` };
      }
      const data = await resp.json();
      if (data && data.success) {
        const normalized = normalizeBootstrapData(data);
        return {
          success: true,
          message: `連線成功！已成功連線 Google 試算表，包含 ${normalized.classes?.length || 0} 個班級、${normalized.students?.length || 0} 位學生、${normalized.curriculum?.length || 0} 週上課進度。`,
          data: normalized
        };
      }
      return { success: false, error: data?.error || '試算表未回應正確格式' };
    } catch (err) {
      return { success: false, error: '連線逾時或跨網域失敗：' + (err.message || err.toString()) };
    }
  },

  /**
   * 一鍵全量推播本機名冊、課表與上課進度至 Google 試算表
   */
  async syncAllToGAS(data) {
    return this.postActionToGAS('syncAllInitialData', data, '全量資料已同步至本機與雲端試算表');
  },

  /**
   * 清除本機所有快取與名冊（公用電腦登出使用，徹底清除所有 pe_ 前綴紀錄）
   */
  clearAllLocalData() {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('pe_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('清除本機儲存失敗:', e);
    }
  },

  /**
   * 取得系統初始化資料 (優先拉取 GAS，無網路或未設定時使用快取或 Mock 資料)
   * @param {boolean} forceRefresh 是否強制略過本機快取重新由雲端拉取
   */
  async getBootstrapData(forceRefresh = false) {
    const gasUrl = this.getGasUrl();
    const token = this.getApiToken();

    // 如果非強制刷新，且處於離線狀態，可直接嘗試讀取快取
    if (!forceRefresh && typeof navigator !== 'undefined' && !navigator.onLine) {
      const cached = localStorage.getItem(STORAGE_KEYS.LOCAL_DATA);
      if (cached) {
        try {
          return normalizeBootstrapData(JSON.parse(cached));
        } catch (e) {
          // ignore parse error
        }
      }
    }

    if (gasUrl) {
      try {
        // 加上時間戳記 & no-store 防止 iOS Safari 與 Chrome 行動端 HTTP 304 暫存
        const queryUrl = `${gasUrl}?action=getBootstrapData&token=${encodeURIComponent(token)}&_t=${Date.now()}`;
        const resp = await fetch(queryUrl, {
          cache: 'no-store'
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.success) {
            const normalized = normalizeBootstrapData(data);
            localStorage.setItem(STORAGE_KEYS.LOCAL_DATA, JSON.stringify(normalized));
            return normalized;
          } else if (data && data.error && data.error.includes('Unauthorized')) {
            console.warn('GAS API 驗證金鑰不正確:', data.error);
          }
        }
      } catch (err) {
        console.warn('無法連線至 Google Apps Script，啟用本機離線模式:', err);
      }
    }

    // 網路連線失敗或未配置時，檢查是否有先前的本機快取
    const cached = localStorage.getItem(STORAGE_KEYS.LOCAL_DATA);
    if (cached) {
      try {
        return normalizeBootstrapData(JSON.parse(cached));
      } catch (e) {
        // ignore parse error
      }
    }

    // 預設 Mock 資料 (張永明老師：五丁、五戊、六甲、六乙，115學年度上學期)
    return normalizeBootstrapData({
      success: true,
      isMock: true,
      teacher: '張永明',
      classes: MOCK_CLASSES,
      students: MOCK_STUDENTS,
      timetable: MOCK_TIMETABLE,
      curriculum: MOCK_CURRICULUM,
      norms: NORMS_TABLE,
      scoreSettings: [],
      recentLogs: MOCK_RECENT_LOGS
    });
  },

  /**
   * 課後整班資料打包儲存 (Append-only 批次送出，支援斷網自動入佇列)
   */
  async saveClassSession(sessionPayload) {
    const gasUrl = this.getGasUrl();
    const payload = {
      action: 'saveClassSession',
      token: this.getApiToken(),
      data: sessionPayload,
      savedAt: new Date().toISOString()
    };

    if (!gasUrl) {
      // 未配置 GAS URL，存入本機離線佇列
      this.enqueueOfflineData(payload);
      return {
        success: true,
        offline: true,
        message: '已暫存於本機離線資料庫 (尚未配置 GAS 網址)'
      };
    }

    try {
      const resp = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const result = await resp.json();
      if (result && result.success && sessionPayload?.dailyLog) {
        this.appendRecentLogToLocal(sessionPayload.dailyLog);
      }
      return result;
    } catch (err) {
      console.warn('網路傳輸失敗，加入離線重試佇列:', err);
      this.enqueueOfflineData(payload);
      if (sessionPayload?.dailyLog) {
        this.appendRecentLogToLocal(sessionPayload.dailyLog);
      }
      return {
        success: true,
        offline: true,
        message: '網路斷線，紀錄已加入離線待傳佇列，連線後自動補傳！'
      };
    }
  },

  /**
   * 將剛儲存的日誌加入本機快取最前面
   */
  appendRecentLogToLocal(dailyLog) {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.LOCAL_DATA);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (!Array.isArray(parsed.recentLogs)) parsed.recentLogs = [];
        const newLog = {
          logId: 'LOG_' + Date.now(),
          date: dailyLog.date,
          period: Number(dailyLog.period) || 1,
          classId: dailyLog.classId,
          actualContent: dailyLog.actualContent || '',
          voiceNotes: dailyLog.voiceNotes || '',
          timestamp: new Date().toISOString()
        };
        // 避免重複加入相同日期與節次
        parsed.recentLogs = [newLog, ...parsed.recentLogs.filter(l => !(l.date === newLog.date && String(l.period) === String(newLog.period) && l.classId === newLog.classId))].slice(0, 50);
        localStorage.setItem(STORAGE_KEYS.LOCAL_DATA, JSON.stringify(parsed));
      }
    } catch (e) {
      console.warn('加入本地 recentLogs 失敗:', e);
    }
  },

  /**
   * 查詢指定班級或全校課堂日誌紀錄 (可指定 classId，空字串表示全部)
   */
  async getDailyLogs(classId = '') {
    const gasUrl = this.getGasUrl();
    const token = this.getApiToken();
    if (gasUrl) {
      try {
        const queryUrl = `${gasUrl}?action=getDailyLogs&token=${encodeURIComponent(token)}${classId ? `&classId=${encodeURIComponent(classId)}` : ''}&_t=${Date.now()}`;
        const resp = await fetch(queryUrl, { cache: 'no-store' });
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.success && Array.isArray(data.logs)) {
            return data.logs.map(log => ({
              ...log,
              logId: log.logId || log.LogId || '',
              date: log.date || log.Date || '',
              period: Number(log.period !== undefined ? log.period : log.Period) || '',
              classId: log.classId || log.ClassId || '',
              actualContent: log.actualContent || log.ActualContent || '',
              voiceNotes: log.voiceNotes || log.VoiceNotes || '',
              timestamp: log.timestamp || log.Timestamp || ''
            }));
          }
        }
      } catch (e) {
        console.warn('獲取 DailyLogs 失敗:', e);
      }
    }

    const cached = localStorage.getItem(STORAGE_KEYS.LOCAL_DATA);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        let logs = parsed.recentLogs || [];
        if (classId && classId !== 'ALL') {
          logs = logs.filter(l => String(l.classId || l.ClassId) === String(classId));
        }
        return logs;
      } catch (e) {}
    }
    return [];
  },

  /**
   * 查詢個別學生歷史履歷 (包含健康狀況、學習態度加減分軌跡、體適能與技能測驗)
   */
  async getStudentHistory(studentId, classId = '') {
    const gasUrl = this.getGasUrl();
    const token = this.getApiToken();
    if (gasUrl) {
      try {
        const queryUrl = `${gasUrl}?action=getStudentHistory&token=${encodeURIComponent(token)}&studentId=${encodeURIComponent(studentId || '')}&classId=${encodeURIComponent(classId || '')}&_t=${Date.now()}`;
        const resp = await fetch(queryUrl, { cache: 'no-store' });
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.success) {
            return data;
          }
        }
      } catch (e) {
        console.warn('獲取學生歷史履歷失敗:', e);
      }
    }

    // 本機備援快取
    return {
      success: true,
      studentId,
      classId,
      healthAttitudeLogs: [],
      fitness: null,
      skills: []
    };
  },

  /**
   * 後台儲存學生名冊 (包含本機即時持久化與 GAS 同步)
   */
  async saveStudents(students) {
    this.updateCachedField('students', students);
    // 重新計算班級列表
    const classSet = new Set(students.map(s => s.classId || s.ClassId).filter(Boolean));
    if (classSet.size > 0) {
      this.updateCachedField('classes', Array.from(classSet));
    }
    return this.postActionToGAS('saveStudents', students, '名冊已於本機儲存');
  },

  /**
   * 後台儲存課表 (包含本機即時持久化與 GAS 同步)
   */
  async saveTimetable(timetable) {
    this.updateCachedField('timetable', timetable);
    return this.postActionToGAS('saveTimetable', timetable, '課表已於本機儲存');
  },

  /**
   * 後台儲存上課進度 (包含本機即時持久化與 GAS 同步)
   */
  async saveCurriculum(curriculum) {
    this.updateCachedField('curriculum', curriculum);
    return this.postActionToGAS('saveCurriculum', curriculum, '課程進度已於本機儲存');
  },

  /**
   * 通用 POST 動作至 GAS
   */
  async postActionToGAS(action, data, localSuccessMsg) {
    const gasUrl = this.getGasUrl();
    if (!gasUrl) {
      return {
        success: true,
        offline: true,
        message: `${localSuccessMsg} (尚未配置 GAS 網址，已離線保存)`
      };
    }

    try {
      const resp = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ 
          action, 
          token: this.getApiToken(),
          data, 
          timestamp: new Date().toISOString() 
        })
      });
      const result = await resp.json();
      return result;
    } catch (err) {
      console.warn(`同步 ${action} 至 GAS 失敗:`, err);
      return {
        success: true,
        offline: true,
        message: `${localSuccessMsg} (雲端同步暫時受阻，已本機保存)`
      };
    }
  },

  /**
   * 更新本機 bootstrap 快取指定欄位
   */
  updateCachedField(field, value) {
    try {
      const cached = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_DATA) || '{}');
      cached[field] = value;
      localStorage.setItem(STORAGE_KEYS.LOCAL_DATA, JSON.stringify(cached));
    } catch (e) {
      console.warn('更新本機快取失敗', e);
    }
  },

  enqueueOfflineData(item) {
    const queue = this.getOfflineQueue();
    queue.push(item);
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  },

  getOfflineQueue() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || '[]');
    } catch {
      return [];
    }
  },

  clearOfflineQueue() {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
  }
};

