/**
 * PE Record Flow API 與離線同步模組
 */
import { MOCK_STUDENTS, MOCK_TIMETABLE, MOCK_CURRICULUM } from './mockData';
import { NORMS_TABLE } from './norms';

const STORAGE_KEYS = {
  GAS_URL: 'pe_gas_webapp_url',
  OFFLINE_QUEUE: 'pe_offline_sync_queue',
  LOCAL_DATA: 'pe_cached_bootstrap_data'
};

export const apiService = {
  /**
   * 取得已設定的 GAS Web App URL
   */
  getGasUrl() {
    return localStorage.getItem(STORAGE_KEYS.GAS_URL) || '';
  },

  /**
   * 儲存使用者的 GAS Web App URL
   */
  setGasUrl(url) {
    localStorage.setItem(STORAGE_KEYS.GAS_URL, (url || '').trim());
  },

  /**
   * 取得系統初始化資料 (優先拉取 GAS，無網路或未設定時使用快取或 Mock 資料)
   */
  async getBootstrapData() {
    const gasUrl = this.getGasUrl();

    if (gasUrl) {
      try {
        const resp = await fetch(`${gasUrl}?action=getBootstrapData`);
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.success) {
            localStorage.setItem(STORAGE_KEYS.LOCAL_DATA, JSON.stringify(data));
            return data;
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

    // 預設 Mock 資料
    return {
      success: true,
      isMock: true,
      classes: ['501', '502', '601', '602'],
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
