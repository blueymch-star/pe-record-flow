「交付 Antigravity 2.0 完整開發提示詞與技術規格書（Master PRD v4.0）」

---

```markdown
# 國小體育課教學評量與課後速記系統 (PE Record Flow) 系統規格書 v4.0

## 一、 專案核心定位與架構
* **使用者**：國小體育科任教師。
* **核心情境**：
  1. **下課 10 分鐘速記（手機/平板 PWA）**：單手大觸控靶區，預設全班正常，僅記錄極端值（身體微恙、見習、違規-4分、優良+4分）或測驗連打。
  2. **期末結算與管理（桌機 Web）**：開學名冊/課表匯入、自訂技能級距、常模自動對比、一鍵匯出校務系統格式。
* **技術棧**：
  - 前端：Vue 3 (Composition API) + Tailwind CSS + Vite + PWA (離線支援)
  - 本機儲存：IndexedDB / LocalStorage (離線佇列，連線時自動背景重試同步)
  - 後端與資料庫：Google Apps Script (GAS) Web App + Google Sheets (試算表作為資料庫，零主機維護成本)
  - 輔助 API：Web Speech Recognition API (語音轉文字備忘)、SheetJS (xlsx 匯入匯出)

```

---

## 二、 Google Sheets 資料表結構 (Database Schema)

1. `Students`：`ClassId`, `StudentId` (主鍵), `SeatNo`, `Name`, `Gender`, `MedicalNotes` (痼疾註記，如氣喘/心臟病)
2. `Timetable`：`DayOfWeek` (1-5), `Period` (1-7), `ClassId`, `Location`
3. `CurriculumPlan`：`WeekNo`, `UnitTitle`, `SuggestedContent`, `KeyFocus`
4. `DailyLogs`：`LogId`, `Timestamp`, `Date`, `Period`, `ClassId`, `ActualContent`, `VoiceNotes`
5. `HealthAttitudeLogs`：`LogId`, `Timestamp`, `Date`, `ClassId`, `StudentId`, `HealthStatus` (良好/不適/受傷/見習/公假), `ObservationNotes`, `Violations` (違規標籤), `Merits` (優良標籤), `NetAttitudeDelta` (增減分累計)
6. `SkillExams`：`ClassId`, `StudentId`, `ExamIndex` (1-4), `ItemName` (自訂項目名稱), `RawValue` (客觀數據：公分/秒數/次數), `IsExempt` (布林值，是否免測)
7. `FitnessExams`：`ClassId`, `StudentId`, `BMI`, `SitAndReach` (cm), `CurlUps` (仰臥捲腹次數), `StandingLongJump` (cm), `CardioRun` (800m秒數)
8. `FitnessNorms`：教育部/運動部最新男女各年齡常模靜態表（預載於 Sheet 與前端 JSON）
9. `ScoreSettings`：4 次技能測驗自訂級距換算表、常態評分門檻

---

## 三、 業務邏輯與計分數學模型

### 1. 學期成績配比與計算公式

$$\text{學期總成績} = (\text{技能測驗換算平均} \times 70\%) + (\text{學習態度總評} \times 30\%)$$

* **學習態度（30%）**：
* 起始分：一律 100 分起算（含學期中手動新增之轉學生）。
* 違規項：每次違規標籤統一扣 4 分（可多項累計扣分）。
* 優良項：每次優良表現統一加 4 分（累計加分）。
* 邊界限制：$60 \le \text{學習態度總評} \le 100$。期末累計低於 60 分以 60 分計，高於 100 分以 100 分計。


* **技能測驗（70%，共 4 次）**：
* 測驗項目可自由輸入名稱。
* 速度與遠度項目強制比對常模；其餘項目依 `ScoreSettings` 級距對照表將客觀數據動態折算百分制。
* **長期受傷/免測機制**：學生標記 `IsExempt = true` 時，分母自動扣減（如 1 項免測，則取其餘 3 項之平均；全免測則以平時態度分替代或註記免計）。


* **體適能檢測**：
* 包含最新項目：**仰臥捲腹**、坐姿體前彎、立定跳遠、800m 跑走。
* **紅燈預警門檻**：換算後低於教育部常模百分位 25（待加強）者，介面自動標記紅燈警示。



---

## 四、 前端介面與互動體驗規格

### 1. 首頁：智慧儀表板 (Dashboard)

* **時間感知卡片**：比對當前時鐘，自動置頂顯示「剛上完課堂（例：5年2班 體育 第2節）」，附帶「進入課後速記」大按鈕。
* **手動切換逃生門**：推薦卡片旁常駐「班級切換下拉選單」，因應雨天、調代課、合班狀況。
* **智慧進度提示**：顯示本週建議進度與該班上次實際進度/語音日誌摘要。
* **週課表矩陣**：完整週課表，可隨時點選過去課堂補登。

### 2. 手機端：課後 10 分鐘極速記錄流 (Tabs)

* **Tab 1: 身體狀況快篩**
* 全班座號網格，預設全員健康良好（綠色）。
* 異常點選切換：黃色（受傷/不適）、橘色（見習）。常駐學生先天痼疾紅心 Icon。


* **Tab 2: 學習態度快記 (100分扣分制)**
* 點擊座號彈出抽屜標籤。
* 扣分項（統一 -4 分）：未穿運動鞋服、干擾秩序推擠、危險動作、消極敷衍、器材破壞未歸。
* 加分項（統一 +4 分）：熱心收器材、團隊互助、主動協助同學。
* 提供「全班今日正常表現，一鍵歸檔」快捷鍵。


* **Tab 3: 體適能檢測連打模式**
* 選擇項目後開啟專屬大按鈕純數字鍵盤。
* 鍵入數值按確認自動聚焦下一號，即時對照常模顯示等第，小於 PR25 亮紅燈。包含合理數值上下限防呆機制。


* **Tab 4: 技能測驗輸入模式**
* 顯示當前測驗項目名稱與單位。支援數字連打與「免測/補測」單擊按鈕。


* **Tab 5: 語音備忘錄 (Web Speech API)**
* 單鍵按住口述課堂狀況，自動轉文字寫入日誌。



### 3. 桌機端：管理與匯出

* **名冊/課表上傳**：上傳 Excel/CSV 自動解析寫入試算表，支援手動增刪轉學生。
* **DataGrid 總表**：類 Excel 試算表檢視，動態運算各項百分制與加權總分。
* **一鍵匯出**：匯出校務行政系統標準 CSV，以及教育部體適能格式上傳報表。

---

## 五、 資料同步與防護機制

1. **批次打包傳輸**：課後儲存時，前端將整班數據打包為單一 JSON Payload 呼叫 GAS `doPost`，大幅降低 API 請求次數與時間延遲。
2. **離線容錯與佇列**：無網路時資料存入 IndexedDB，待網路恢復自動背景重試同步。
3. **時間戳記防覆蓋**：寫入時以時間戳記日誌（Append-only log）為基準，避免跨裝置修改時的資料覆蓋衝突。

```

