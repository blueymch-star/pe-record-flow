/**
 * PE Record Flow API 與離線同步模組
 */
import { MOCK_STUDENTS, MOCK_TIMETABLE, MOCK_CURRICULUM, MOCK_CLASSES } from './mockData';
import { NORMS_TABLE } from './norms';

const STORAGE_KEYS = {
  GAS_URL: 'pe_gas_webapp_url',
  API_TOKEN: 'pe_api_secret_token',
  OFFLINE_QUEUE: 'pe_offline_sync_queue',
  LOCAL_DATA: 'pe_cached_bootstrap_data_v3' // 確保載入簡化班級名稱 (五丁、五戊、六甲、六乙)
};

const DEFAULT_API_TOKEN = 'pe-flow-sec-2026-tk99';
const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbwk30K9oEXpfsC5xdDL6KtMd99-hVH6bq-I_cZNKgUO8N-wNKf0bI4KA-juOhuTqAQm/exec';

export const apiService = {
  /**
   * 取得已設定的 GAS Web App URL
   */
  getGasUrl() {
    return localStorage.getItem(STORAGE_KEYS.GAS_URL) || DEFAULT_GAS_URL;
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
    return localStorage.getItem(STORAGE_KEYS.API_TOKEN) || DEFAULT_API_TOKEN;
  },

  /**
   * 儲存使用者的 API 驗證金鑰
   */
  setApiToken(token) {
    localStorage.setItem(STORAGE_KEYS.API_TOKEN, (token || '').trim());
  },

  /**
   * 清除本機所有快取與名冊（公用電腦登出使用）
   */
  clearAllLocalData() {
    localStorage.removeItem(STORAGE_KEYS.LOCAL_DATA);
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
    localStorage.removeItem('pe_selected_class');
    localStorage.removeItem('pe_current_tab');
  },

  /**
   * 取得系統初始化資料 (優先拉取 GAS，無網路或未設定時使用快取或 Mock 資料)
   */
  async getBootstrapData() {
    const gasUrl = this.getGasUrl();
    const token = this.getApiToken();

    if (gasUrl) {
      try {
        const queryUrl = `${gasUrl}?action=getBootstrapData&token=${encodeURIComponent(token)}`;
        const resp = await fetch(queryUrl);
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.success) {
            localStorage.setItem(STORAGE_KEYS.LOCAL_DATA, JSON.stringify(data));
            return data;
          } else if (data && data.error && data.error.includes('Unauthorized')) {
            console.warn('GAS API 驗證金鑰不正確:', data.error);
          }
        }
      } catch (err) {
        console.warn('無法連線至 Google Apps Script，啟用本機離線模式:', err);
      }
    }

    // 檢查是否有先前的本機快取
    const cached = localStorage.getItem(STORAGE_KEYS.LOCAL_DATA);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // ignore parse error
      }
    }

    // 預設 Mock 資料 (張永明老師：五丁、五戊、六甲、六乙，115學年度上學期)
    return {
      success: true,
      isMock: true,
      teacher: '張永明',
      classes: MOCK_CLASSES,
      students: MOCK_STUDENTS,
      timetable: MOCK_TIMETABLE,
      curriculum: MOCK_CURRICULUM,
      norms: NORMS_TABLE,
      scoreSettings: []
    };
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
      return result;
    } catch (err) {
      console.warn('網路傳輸失敗，加入離線重試佇列:', err);
      this.enqueueOfflineData(payload);
      return {
        success: true,
        offline: true,
        message: '網路斷線，紀錄已加入離線待傳佇列，連線後自動補傳！'
      };
    }
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

