# Google Apps Script 後端部署指南 (Code.gs)

本專案使用 Google 試算表搭配 Google Apps Script (GAS) 作為零主機成本、高可靠度之資料庫後端。

---

## 步驟 1：建立 Google 試算表與開啟 Apps Script

1. 前往 [Google 雲端硬碟](https://drive.google.com/)，新增一個全新的「Google 試算表」，命名為：`國小體育教學評量資料庫`。
2. 點選試算表頂端選單的 **「擴充功能」 -> 「Apps Script」**。

---

## 步驟 2：貼上程式碼與設定

1. 清空編輯器內的程式碼，將本專案 [`backend/Code.gs`](file:///c:/Users/User/Documents/2026%20PE%20Record%20Flow/backend/Code.gs) 的完整內容複製並貼上到 `Code.gs`。
2. 點選「專案設定 (齒輪圖示)」，勾選「在編輯器中顯示 appsscript.json 資訊清單檔案」，將 [`backend/appsscript.json`](file:///c:/Users/User/Documents/2026%20PE%20Record%20Flow/backend/appsscript.json) 的內容貼上，確保時區為 `Asia/Taipei`。
3. 儲存專案 (Ctrl + S)。

---

## 步驟 3：執行一鍵初始化 (`initDatabase`)

1. 在 Apps Script 頂端函式下拉選單中，選擇 **`initDatabase`**。
2. 點擊 **「執行」**（第一次執行需點「審查權限」並同意存取試算表）。
3. 執行完成後回到 Google 試算表，您會發現系統已自動建立了 9 張標準工作表，並填入表頭與教育部體適能最新男女常模門檻（包含仰臥捲腹）：
   - `Students` (學生資料與痼疾)
   - `Timetable` (課表)
   - `CurriculumPlan` (教學進度)
   - `DailyLogs` (課堂日誌)
   - `HealthAttitudeLogs` (健康與態度紀錄)
   - `SkillExams` (技能測驗)
   - `FitnessExams` (體適能檢測)
   - `FitnessNorms` (常模基準)
   - `ScoreSettings` (評分標準)

---

## 步驟 4：發布為網頁應用程式 (Web App)

1. 點擊右上角藍色按鈕 **「部署」 -> 「新增部署」**。
2. 點選左側齒輪，選擇 **「網頁應用程式 (Web app)」**。
3. 設定參數：
   - **說明**：`PE Record Flow API v4.0`
   - **以何身分執行**：`我 (您的 Google 帳號)`
   - **誰可以存取**：`所有人 (Anyone)` *(注意：若選僅限自己，前端跨網域 Fetch 會受阻)*
4. 點擊 **「部署」**，複製產生的 **網頁應用程式網址**（以 `https://script.google.com/macros/s/.../exec` 結尾）。
5. 回到前端系統，點選右上角 ⚙️「系統設定」，貼上此網址即可開始同步資料！
