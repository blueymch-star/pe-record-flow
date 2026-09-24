# 國小體育課教學評量與課後速記系統 (PE Record Flow) v4.0

依據《國小體育課教學評量與課後速記系統系統規格書 v4.0》開發之完整前後端系統。

---

## 專案結構

```
├── backend/
│   ├── Code.gs             # Google Apps Script 完整後端 (doGet, doPost, 初始化, 常模判定)
│   ├── appsscript.json     # GAS 時區與 Web App 設定
│   └── README_GAS.md       # GAS 試算表綁定與部署教學
├── src/
│   ├── components/
│   │   ├── SmartTimetable.vue  # 首頁智慧課表推薦 + 逃生門 + 週課表矩陣
│   │   ├── SeatGrid.vue        # 手機端大按鈕座號網格 + 痼疾紅心 + 狀態快篩
│   │   ├── AttitudeDrawer.vue  # 學習態度 ±4 分抽屜 + [60, 100] 邊界運算 + 一鍵歸檔
│   │   └── NumberPadInput.vue  # 純數字連打鍵盤 + 仰臥捲腹/體適能 + PR25紅燈 + 自動跳號
│   ├── services/
│   │   ├── api.js          # GAS 批次寫入 API + 離線佇列
│   │   ├── norms.js        # 教育部常模判定與態度分數學模型
│   │   └── mockData.js     # 預設名冊、課表與測試資料
│   ├── App.vue             # 整合主畫面 (首頁/速記/體能/語音日誌)
│   ├── main.js
│   └── style.css           # Tailwind CSS 與行動端極大靶區觸控反饋
├── package.json
└── vite.config.js
```

---

## 快速啟動前端 (本機 / 手機測試)

```bash
# 啟動開發伺服器
npm run dev
```

啟動後於瀏覽器開啟 `http://localhost:5173`。系統預設搭載完整離線測試資料（Mock Data），無需設定後端即可直接完整體驗所有功能：
- **首頁智慧課表推薦**：自動偵測時間並推薦剛下課課堂，支援手動切換逃生門與週課表點擊補登。
- **手機端大靶區座號網格**：綠（良好）/ 黃（不適）/ 橘（見習）單擊切換，先天痼疾紅心 ❤️ 點擊查看安全備忘。
- **學習態度抽屜**：點擊座號彈出抽屜，違規統一 -4 分、優良統一 +4 分，即時動態截斷於 60 ~ 100 分。
- **純數字連打鍵盤**：體適能專屬純數字大鍵盤，內建合理值防呆與教育部常模 PR25 紅燈預警，按「確認下一號」自動跳焦無縫連打。
- **語音備忘錄**：支援 Web Speech API 語音轉文字。

---

## 部署 Google Apps Script 後端

請參閱 [backend/README_GAS.md](file:///c:/Users/User/Documents/2026%20PE%20Record%20Flow/backend/README_GAS.md) 的 3 步驟指示：
1. 建立一個全新的 Google 試算表。
2. 點擊「擴充功能」->「Apps Script」，將 `backend/Code.gs` 與 `backend/appsscript.json` 貼上。
3. 執行一次 `initDatabase()` 函式（自動建立 9 張工作表與預載常模）。
4. 點選「部署」->「新部署」為「網頁應用程式 (Web App)」，權限選擇「所有人 (Anyone)」。
5. 將獲得的 Web App 網址複製並貼到系統前端右上角 ⚙️「系統設定」中，即可直接線上雙向連線！
