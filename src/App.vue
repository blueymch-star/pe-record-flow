<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full max-w-2xl lg:max-w-6xl mx-auto pb-24 shadow-2xl relative font-sans">
    
    <!-- 頂部 Header -->
    <header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 shadow-md flex-shrink-0 text-sm">
          ⚡
        </div>
        <div class="min-w-0">
          <h1 class="font-black text-sm sm:text-base tracking-tight leading-tight flex items-center gap-1.5 whitespace-nowrap">
            <span>PE Record Flow</span>
            <span class="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">v4.0</span>
          </h1>
          <p class="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
            <span>班級：<strong class="text-emerald-300">{{ selectedClassId }}</strong></span>
            <span>·</span>
            <span><strong class="text-emerald-300">{{ currentVenue }}</strong></span>
            <span>·</span>
            <span>{{ currentStudents.length }}人</span>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-1.5 flex-shrink-0">
        <!-- 後台管理快速切換按鈕 -->
        <button
          @click="currentTab = currentTab === 'admin' ? 'home' : 'admin'"
          class="active-press px-2.5 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1 whitespace-nowrap flex-shrink-0 transition"
          :class="currentTab === 'admin' ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'"
          title="切換後台資料編輯"
        >
          <span>{{ currentTab === 'admin' ? '📋 返回速記' : '🛠️ 後台管理' }}</span>
        </button>

        <!-- 雲端同步與連線狀態指示 (點擊開啟設定與診斷) -->
        <button
          @click="showSettingsModal = true"
          class="text-[10px] sm:text-[11px] font-semibold px-2 py-1 rounded-full border flex items-center gap-1 whitespace-nowrap flex-shrink-0 cursor-pointer active-press transition"
          :class="isCloudConnected ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : (isOnline ? 'bg-amber-950/60 border-amber-500/40 text-amber-300' : 'bg-red-950/60 border-red-500/40 text-red-300')"
          :title="isCloudConnected ? '已成功連線 Google 試算表雲端資料庫' : '目前為本機快取模式，點擊測試連線'"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="isCloudConnected ? 'bg-emerald-400' : (isOnline ? 'bg-amber-400 animate-pulse' : 'bg-red-400')"></span>
          <span>{{ isCloudConnected ? '雲端已連線' : (isOnline ? '本機快取' : '離線') }}</span>
        </button>

        <!-- 一鍵自雲端強制同步最新資料 (手機/電腦即時對齊) -->
        <button
          @click="refreshFromCloud(true)"
          :disabled="isRefreshing"
          class="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex-shrink-0 active-press disabled:opacity-50"
          :title="isRefreshing ? '正在同步雲端資料庫...' : '點擊立即與 Google 試算表同步最新名冊與進度'"
        >
          <span :class="{'inline-block animate-spin': isRefreshing}">🔄</span>
        </button>

        <!-- 設定 GAS URL 按鈕 -->
        <button
          @click="showSettingsModal = true"
          class="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex-shrink-0"
          title="系統設定"
        >
          ⚙️
        </button>
      </div>
    </header>

    <!-- 主要內容區 -->
    <main class="flex-1 p-3 sm:p-4 space-y-4 sm:space-y-5">

      <!-- 分頁導航列 (6 大核心模式，永遠保持可見，電腦版與手機版隨時切換) -->
      <nav class="grid grid-cols-6 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold">
        <button
          @click="currentTab = 'home'"
          class="py-2 sm:py-2.5 rounded-lg transition text-center whitespace-nowrap text-[11px] sm:text-xs"
          :class="currentTab === 'home' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'"
        >
          🏠 首頁
        </button>
        <button
          @click="currentTab = 'record'"
          class="py-2 sm:py-2.5 rounded-lg transition text-center whitespace-nowrap text-[11px] sm:text-xs"
          :class="currentTab === 'record' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'"
        >
          📋 速記
        </button>
        <button
          @click="currentTab = 'fitness'"
          class="py-2 sm:py-2.5 rounded-lg transition text-center whitespace-nowrap text-[11px] sm:text-xs"
          :class="currentTab === 'fitness' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'"
        >
          🏃 體適能
        </button>
        <button
          @click="currentTab = 'skill'"
          class="py-2 sm:py-2.5 rounded-lg transition text-center whitespace-nowrap text-[11px] sm:text-xs"
          :class="currentTab === 'skill' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'"
        >
          🎯 技能
        </button>
        <button
          @click="currentTab = 'voice'"
          class="py-2 sm:py-2.5 rounded-lg transition text-center whitespace-nowrap text-[11px] sm:text-xs"
          :class="currentTab === 'voice' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'"
        >
          🎙️ 語音
        </button>
        <button
          @click="currentTab = 'admin'"
          class="py-2 sm:py-2.5 rounded-lg transition text-center whitespace-nowrap text-[11px] sm:text-xs"
          :class="currentTab === 'admin' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'"
        >
          🛠️ 後台
        </button>
      </nav>

      <!-- 視圖 1: 首頁智慧課表推薦 -->
      <div v-show="currentTab === 'home'">
        <SmartTimetable
          :timetable="bootstrapData.timetable"
          :curriculum="bootstrapData.curriculum"
          :classes="bootstrapData.classes"
          @select-class="handleSelectClass"
        />
      </div>

      <!-- 視圖 2: 手機端大按鈕座號網格與速記 (身體狀況快篩 + 學習態度快記 + 上課場地編輯) -->
      <div v-show="currentTab === 'record'" class="space-y-4">
        <div class="glass-panel p-3.5 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="w-full sm:w-auto">
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-base font-bold text-white flex items-center gap-1.5">
                <span>{{ selectedClassId }} 課後速記</span>
              </h2>

              <!-- 日期選擇 -->
              <div class="flex items-center gap-1 bg-slate-800/90 px-2.5 py-1 rounded-xl border border-slate-700">
                <span class="text-xs text-slate-400 font-bold">📅 日期：</span>
                <input
                  type="date"
                  v-model="selectedDate"
                  class="bg-transparent text-emerald-300 font-bold text-xs focus:outline-none cursor-pointer font-mono"
                />
                <button
                  v-if="selectedDate !== todayStr"
                  @click="selectedDate = todayStr"
                  class="text-[10px] text-amber-300 hover:text-white px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-600/50"
                  title="回今天"
                >
                  今天
                </button>
              </div>

              <!-- 節次選擇 -->
              <div class="flex items-center gap-1 bg-slate-800/90 px-2.5 py-1 rounded-xl border border-slate-700">
                <span class="text-xs text-slate-400 font-bold">⏰ 節次：</span>
                <select
                  v-model.number="currentPeriod"
                  class="bg-transparent text-emerald-300 font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option v-for="p in [1, 2, 3, 4, 5, 6, 7, 8]" :key="p" :value="p" class="bg-slate-800 text-white">第 {{ p }} 節</option>
                </select>
              </div>

              <!-- 場地選擇 -->
              <div class="flex items-center gap-1 bg-slate-800/90 px-2.5 py-1 rounded-xl border border-slate-700">
                <span class="text-xs text-slate-400 font-bold">📍 場地：</span>
                <select
                  v-model="currentVenue"
                  class="bg-transparent text-emerald-300 font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option v-for="venue in STANDARD_VENUES" :key="venue" :value="venue" class="bg-slate-800 text-white">{{ venue }}</option>
                </select>
              </div>
            </div>
            <p class="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>當前記錄：<strong class="text-emerald-300">{{ selectedDate }}</strong> 第 <strong class="text-emerald-300">{{ currentPeriod }}</strong> 節 ({{ currentVenue }})</span>
              <span class="text-slate-600">·</span>
              <span class="truncate max-w-full sm:max-w-xs text-slate-300">📌 進度：<strong class="text-emerald-300">{{ lessonActualContent }}</strong></span>
            </p>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <button
              @click="openHistoryModal"
              class="active-press bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-lg border border-slate-600 flex items-center gap-1 shadow whitespace-nowrap"
              title="查看課堂歷史日誌"
            >
              <span>📜 課堂歷史日誌</span>
            </button>
            <button
              @click="quickArchiveAll"
              class="active-press bg-emerald-700/60 hover:bg-emerald-600 text-emerald-200 text-xs font-bold px-3 py-2 rounded-lg border border-emerald-500/50 flex items-center gap-1 shadow whitespace-nowrap"
            >
              <span>⚡ 全班正常歸檔</span>
            </button>
          </div>
        </div>

        <SeatGrid
          :students="currentStudents"
          :health-records="healthRecords"
          :attitude-records="attitudeRecords"
          @update-health="handleUpdateHealth"
          @open-attitude-drawer="handleOpenAttitudeDrawer"
        />
      </div>

      <!-- 視圖 3: 體適能檢測連打模式 -->
      <div v-show="currentTab === 'fitness'" class="space-y-4">
        <div class="glass-panel p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-bold text-white">教育部體適能檢測連打模式</h2>
            <p class="text-xs text-slate-400">支援最新仰臥捲腹、大數字鍵盤、PR25紅燈警示與自動跳號</p>
          </div>
          <button
            @click="isKeypadOpen = true"
            class="w-full sm:w-auto active-press bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm px-4 py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
          >
            <span>🚀 啟動連打鍵盤</span>
          </button>
        </div>

        <!-- 體適能檢測即時清單 (支援手機端單行姓名、橫向滾動與凍結首欄) -->
        <div class="glass-panel rounded-2xl border border-slate-700/80 p-3 overflow-x-auto">
          <table class="w-full min-w-[480px] text-xs text-left">
            <thead>
              <tr class="border-b border-slate-700 text-slate-400 font-bold whitespace-nowrap">
                <th class="py-2.5 px-2 w-12 text-center sticky left-0 bg-slate-900 z-10">座號</th>
                <th class="py-2.5 px-3 min-w-[76px] sticky left-12 bg-slate-900 z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.5)]">姓名</th>
                <th class="py-2.5 px-3 text-center">仰臥捲腹</th>
                <th class="py-2.5 px-3 text-center">坐姿體前彎</th>
                <th class="py-2.5 px-3 text-center">立定跳遠</th>
                <th class="py-2.5 px-3 text-center">800m跑走</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 whitespace-nowrap">
              <tr v-for="s in currentStudents" :key="s.studentId" class="hover:bg-slate-800/40">
                <td class="py-2.5 px-2 font-mono font-bold text-emerald-400 text-center sticky left-0 bg-slate-900/95 z-10">{{ s.seatNo }}</td>
                <td class="py-2.5 px-3 font-bold text-white whitespace-nowrap sticky left-12 bg-slate-900/95 z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.5)]">{{ s.name }}</td>
                <td class="py-2.5 px-3 text-center font-mono">{{ getFitnessCell(s.studentId, 'CurlUps') }}</td>
                <td class="py-2.5 px-3 text-center font-mono">{{ getFitnessCell(s.studentId, 'SitAndReach') }}</td>
                <td class="py-2.5 px-3 text-center font-mono">{{ getFitnessCell(s.studentId, 'StandingLongJump') }}</td>
                <td class="py-2.5 px-3 text-center font-mono">{{ getFitnessCell(s.studentId, 'CardioRun') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 視圖 4: 技能測驗輸入模式 (4 次測驗自訂名稱、免測機制、百分制折算) -->
      <div v-show="currentTab === 'skill'" class="space-y-4">
        <SkillExamView
          :students="currentStudents"
          :skill-records="skillRecords"
          @update-skill-record="handleUpdateSkillRecord"
        />
      </div>

      <!-- 視圖 5: 語音備忘錄 (Web Speech API) -->
      <div v-show="currentTab === 'voice'" class="space-y-4">
        <div class="glass-panel p-5 rounded-2xl border border-slate-700 text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mx-auto border border-emerald-500/30">
            🎙️
          </div>
          <div>
            <h3 class="text-base font-bold text-white">語音轉文字課堂隨行速記</h3>
            <p class="text-xs text-slate-400 mt-1">單手長按或點擊開始口述，自動辨識寫入本堂日誌</p>
          </div>

          <div class="flex justify-center">
            <button
              @click="toggleSpeechRecognition"
              class="active-press px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl transition"
              :class="isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500 text-white'"
            >
              <span>{{ isRecording ? '🛑 停止錄音' : '🎤 開始語音速記' }}</span>
            </button>
          </div>

          <!-- 教學內容與進度自訂編輯區 (自動依上課日期與班級帶入該週進度) -->
          <div class="text-left bg-slate-900/90 rounded-2xl p-4 border border-slate-700/80 space-y-2.5">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <label class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>📌 本堂教學內容與進度 (課堂日誌內容)：</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  第 {{ currentLessonWeek }} 週進度自動帶入
                </span>
              </label>

              <button
                type="button"
                @click="resetLessonContentToDefault"
                class="active-press text-[11px] text-amber-300 hover:text-white px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-1"
                title="重新帶入該週標準教學進度"
              >
                <span>↩️ 重設為預設進度</span>
              </button>
            </div>

            <!-- 可編輯文字框 -->
            <textarea
              v-model="lessonActualContent"
              @input="isContentManuallyEdited = true"
              rows="2"
              class="w-full bg-slate-950/60 text-xs sm:text-sm text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium leading-relaxed resize-none"
              placeholder="系統自動帶入本週教學進度，亦可在此自由修改..."
            ></textarea>

            <div class="flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-1">
              <span>班級：<strong class="text-white">{{ selectedClassId }}</strong> · 日期：<strong class="text-emerald-300 font-mono">{{ selectedDate }}</strong></span>
              <span v-if="matchedCurriculumPlan?.unitTitle" class="text-slate-400">
                單元：<strong class="text-slate-200">{{ matchedCurriculumPlan.unitTitle }}</strong>
              </span>
            </div>
          </div>

          <!-- 辨識結果顯示區 -->
          <div class="text-left bg-slate-900/90 rounded-2xl p-4 border border-slate-700/80 space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>📝 即時口述速記內容：</span>
                <span v-if="isRecording" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 text-[10px] font-bold border border-red-700/60 animate-pulse">
                  <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span> 錄音中
                </span>
              </label>
              <div class="flex items-center gap-1.5">
                <button
                  v-if="voiceNoteText"
                  @click="copyVoiceNote"
                  class="active-press px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700"
                  title="複製文字"
                >
                  📋 複製
                </button>
                <button
                  v-if="voiceNoteText || interimVoiceText"
                  @click="clearVoiceNote"
                  class="active-press px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-red-950/50 text-red-400 text-xs font-bold border border-slate-700"
                  title="清空文字"
                >
                  🧹 清空
                </button>
              </div>
            </div>

            <!-- 即時語音暫態回饋 (防止字詞重複堆疊) -->
            <div v-if="interimVoiceText" class="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <span class="animate-pulse text-sm">🎙️</span>
              <span class="font-medium italic">正在辨識：「{{ interimVoiceText }}」...</span>
            </div>

            <textarea
              v-model="voiceNoteText"
              rows="4"
              class="w-full bg-slate-950/60 text-sm text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-medium leading-relaxed"
              placeholder="口述內容將即時顯示於此，例如：「今日五丁進行田徑彎道加速跑，全班活動常規良好，無運動傷害...」"
            ></textarea>

            <!-- 常用速記快速短語推薦點擊填入 -->
            <div>
              <div class="text-[11px] font-bold text-slate-400 mb-1.5">⚡ 點擊快速插入常用語句：</div>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="phrase in ['全班運動常規良好', '完成分組技能測驗', '下課確實清點器材', '1人身體不適在旁見習', '操場跑道濕滑改體育館']"
                  :key="phrase"
                  @click="appendQuickPhrase(phrase)"
                  class="active-press px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition"
                >
                  + {{ phrase }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 視圖 6: 體育教學管理後台 (編輯班級名冊、週課表、上課進度) -->
      <div v-show="currentTab === 'admin'" class="space-y-4">
        <AdminManageView
          :students="bootstrapData.students"
          :timetable="bootstrapData.timetable"
          :curriculum="bootstrapData.curriculum"
          :classes="bootstrapData.classes"
          :recent-logs="bootstrapData.recentLogs"
          :norms="bootstrapData.norms"
          @save-students="handleSaveStudentsFromAdmin"
          @save-timetable="handleSaveTimetableFromAdmin"
          @save-curriculum="handleSaveCurriculumFromAdmin"
          @toast="showToast"
        />
      </div>

    </main>

    <!-- 底部固定儲存浮動列 (前台課後 10 分鐘一鍵批次同步，後台時自動隱藏) -->
    <div v-if="currentTab !== 'admin'" class="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2.5 max-w-2xl mx-auto flex items-center justify-between gap-2">
      <div class="text-xs text-slate-400 whitespace-nowrap min-w-0 truncate">
        <span class="font-bold text-white">{{ selectedClassId }}</span>
        <span class="text-slate-400 text-[11px] ml-1">({{ selectedDate }} 第{{ currentPeriod }}節·{{ currentVenue }})</span>
        <span class="ml-1 text-[11px] text-emerald-400 font-mono">異動 {{ unsavedCount }} 筆</span>
      </div>

      <button
        @click="handleBatchSaveToGAS"
        :disabled="isSaving"
        class="active-press disabled:opacity-50 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-lg flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
      >
        <span v-if="isSaving">⏳ 批次寫入中...</span>
        <span v-else>💾 課後一鍵批次同步</span>
      </button>
    </div>

    <!-- 元件 3: 學習態度 ±4 分抽屜 -->
    <AttitudeDrawer
      :is-open="isAttitudeDrawerOpen"
      :student="activeAttitudeStudent"
      :initial-attitude="attitudeRecords[activeAttitudeStudent?.studentId]"
      @close="isAttitudeDrawerOpen = false"
      @save="handleSaveStudentAttitude"
      @quick-archive-all="quickArchiveAll"
    />

    <!-- 元件 4: 純數字鍵盤連打跳號模組 -->
    <NumberPadInput
      :is-open="isKeypadOpen"
      :students="currentStudents"
      :existing-records="fitnessRecords"
      :norms="bootstrapData.norms"
      :class-id="selectedClassId"
      @close="isKeypadOpen = false"
      @save-record="handleSaveFitnessRecord"
    />

    <!-- 系統設定彈窗 (設定 Google Apps Script Web App URL) -->
    <div v-if="showSettingsModal" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="font-black text-base text-white flex items-center gap-2">
            <span>⚙️ 系統設定與後端串接</span>
          </h3>
          <button @click="showSettingsModal = false" class="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        <div class="space-y-3.5">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">
              Google Apps Script 網頁應用程式網址 (Web App URL)：
            </label>
            <input
              v-model="gasUrlInput"
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              class="w-full bg-slate-800 text-slate-100 text-xs rounded-xl p-3 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <p class="text-[11px] text-slate-400 mt-1">
              將部署獲得的網址貼於此處，即可即時連線 Google Sheets 資料庫。未輸入時自動啟用本機離線與測試模式。
            </p>
          </div>

          <!-- 資安防護：API 驗證金鑰 (Secret Token) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>🔐 API 驗證金鑰 (Secret Token)：</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">防爬蟲加固</span>
              </label>
              <button
                type="button"
                @click="showToken = !showToken"
                class="text-[11px] text-slate-400 hover:text-slate-200"
              >
                {{ showToken ? '👁️ 隱藏金鑰' : '👁️‍🗨️ 顯示金鑰' }}
              </button>
            </div>
            <input
              v-model="apiTokenInput"
              :type="showToken ? 'text' : 'password'"
              placeholder="請輸入 API 驗證金鑰"
              class="w-full bg-slate-800 text-slate-100 text-xs rounded-xl p-3 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
            />
            <p class="text-[11px] text-slate-400 mt-1">
              金鑰需與 Google Apps Script 雲端一致，可杜絕任意惡意爬蟲或未授權寫入。
            </p>
          </div>

          <!-- 資料庫連線測試與手動全量推播 -->
          <div class="space-y-2 pt-2 border-t border-slate-800">
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="handleTestConnection"
                :disabled="isTestingConnection"
                class="active-press disabled:opacity-50 flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>{{ isTestingConnection ? '⏳ 連線測試中...' : '🔍 測試資料庫連線' }}</span>
              </button>
              <button
                type="button"
                @click="handleFullSyncToGAS"
                :disabled="isSyncingAll"
                class="active-press disabled:opacity-50 flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-teal-400 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>{{ isSyncingAll ? '⏳ 雲端同步中...' : '🔄 全量推播至試算表' }}</span>
              </button>
            </div>

            <!-- 連線測試結果提示區塊 -->
            <div
              v-if="connectionTestResult"
              class="p-2.5 rounded-xl text-xs font-medium border"
              :class="connectionTestResult.success ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/60 border-rose-500/50 text-rose-300'"
            >
              {{ connectionTestResult.message || connectionTestResult.error }}
            </div>
          </div>

          <!-- 公用電腦隱私防護 -->
          <div class="pt-2 border-t border-slate-800">
            <button
              type="button"
              @click="handleClearLocalData"
              class="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 font-bold transition hover:underline"
            >
              <span>🧹 公用電腦安全登出（清除本機名冊與快取）</span>
            </button>
          </div>
        </div>

        <div class="pt-2 flex items-center justify-end gap-2">
          <button @click="showSettingsModal = false" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white">
            取消
          </button>
          <button @click="saveSettings" class="px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow">
            儲存設定
          </button>
        </div>
      </div>
    </div>

    <!-- 歷史課堂日誌彈窗 (DailyLogs 歷程檢視) -->
    <div v-if="showHistoryModal" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div class="bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-5 max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh]">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <h3 class="font-black text-sm sm:text-base text-white flex items-center gap-1.5">
              <span>📜 課堂歷史日誌歷程</span>
            </h3>
            <span class="text-[11px] text-slate-400">({{ displayedLogs.length }} 堂課)</span>
          </div>
          <button @click="showHistoryModal = false" class="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        <!-- 班級篩選與重整按鈕 -->
        <div class="flex items-center justify-between gap-2 py-3 border-b border-slate-800 flex-wrap">
          <div class="flex items-center gap-2">
            <label class="text-xs font-bold text-slate-300">班級篩選：</label>
            <select
              v-model="historyClassFilter"
              @change="fetchHistoryLogs"
              class="bg-slate-800 text-emerald-300 font-bold text-xs rounded-xl px-2.5 py-1.5 border border-slate-700 focus:outline-none"
            >
              <option value="ALL">全部班級</option>
              <option v-for="c in bootstrapData.classes" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <button
            @click="fetchHistoryLogs"
            :disabled="isFetchingHistory"
            class="active-press px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1"
          >
            <span :class="{'inline-block animate-spin': isFetchingHistory}">🔄</span>
            <span>重新載入</span>
          </button>
        </div>

        <!-- 日誌內容列表 -->
        <div class="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
          <div v-if="displayedLogs.length === 0" class="text-center py-10 text-slate-500 text-xs">
            目前暫無此班級的課堂歷史日誌。<br/>
            進行課後同步時，將自動以當前選擇之上課日期寫入日誌記錄！
          </div>

          <div
            v-for="log in displayedLogs"
            :key="log.logId || (log.date + '_' + log.period + '_' + log.classId)"
            class="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-emerald-500/40 transition space-y-2"
          >
            <div class="flex items-center justify-between flex-wrap gap-1.5">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                  📅 {{ formatLogDate(log.date || log.Date) }}
                </span>
                <span class="text-xs font-bold text-white">
                  {{ log.classId }} · 第 {{ log.period }} 節
                </span>
              </div>
              <span v-if="log.timestamp" class="text-[10px] text-slate-400 font-mono">
                同步於 {{ formatLogTime(log.timestamp) }}
              </span>
            </div>

            <div v-if="log.actualContent" class="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
              <span class="text-slate-400 font-bold">📌 進度：</span>{{ log.actualContent }}
            </div>

            <div v-if="log.voiceNotes" class="text-xs text-emerald-200/90 bg-emerald-950/30 p-2 rounded-xl border border-emerald-500/20 flex items-start gap-1.5">
              <span class="text-sm">🎙️</span>
              <div class="flex-1">
                <span class="text-emerald-400 font-bold">隨行筆記：</span>{{ log.voiceNotes }}
              </div>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-800 flex justify-end">
          <button @click="showHistoryModal = false" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white">
            關閉
          </button>
        </div>
      </div>
    </div>

    <!-- 提示訊息 Toast -->
    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-2" leave-active-class="transition duration-150 ease-in" leave-to-class="opacity-0 translate-y-2">
      <div
        v-if="toastMessage"
        class="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold border backdrop-blur-md flex items-center gap-2"
        :class="toastType === 'success' ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50' : 'bg-red-950/90 text-red-200 border-red-500/50'"
      >
        <span>{{ toastType === 'success' ? '✅' : '⚠️' }}</span>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import SmartTimetable from './components/SmartTimetable.vue';
import SeatGrid from './components/SeatGrid.vue';
import AttitudeDrawer from './components/AttitudeDrawer.vue';
import NumberPadInput from './components/NumberPadInput.vue';
import SkillExamView from './components/SkillExamView.vue';
import AdminManageView from './components/AdminManageView.vue';
import { apiService } from './services/api';
import { STANDARD_VENUES } from './services/mockData';

const currentTab = ref('home');
const selectedClassId = ref('五丁');
const currentPeriod = ref(6);
const currentVenue = ref('操場');
const selectedDate = ref(new Date().toLocaleDateString('sv'));
const todayStr = computed(() => new Date().toLocaleDateString('sv'));

const showHistoryModal = ref(false);
const historyClassFilter = ref('ALL');
const isFetchingHistory = ref(false);

const isOnline = ref(navigator.onLine);
const isCloudConnected = ref(false);
const isSaving = ref(false);
const isTestingConnection = ref(false);
const isSyncingAll = ref(false);
const connectionTestResult = ref(null);
const showSettingsModal = ref(false);
const gasUrlInput = ref(apiService.getGasUrl());
const apiTokenInput = ref(apiService.getApiToken());
const showToken = ref(false);

const isAttitudeDrawerOpen = ref(false);
const activeAttitudeStudent = ref(null);
const isKeypadOpen = ref(false);

const toastMessage = ref('');
const toastType = ref('success');

// 初始資料集合 (大庄國小 115上 體育科)
const bootstrapData = ref({
  classes: ['五丁', '五戊', '六甲', '六乙'],
  students: [],
  timetable: [],
  curriculum: [],
  norms: [],
  recentLogs: []
});

const displayedLogs = computed(() => {
  const list = bootstrapData.value.recentLogs || [];
  if (!historyClassFilter.value || historyClassFilter.value === 'ALL') {
    return list;
  }
  return list.filter(l => String(l.classId || l.ClassId) === String(historyClassFilter.value));
});

async function openHistoryModal() {
  historyClassFilter.value = selectedClassId.value;
  showHistoryModal.value = true;
  await fetchHistoryLogs();
}

async function fetchHistoryLogs() {
  isFetchingHistory.value = true;
  try {
    const logs = await apiService.getDailyLogs(historyClassFilter.value);
    if (logs && logs.length > 0) {
      const existing = bootstrapData.value.recentLogs || [];
      const map = new Map();
      [...logs, ...existing].forEach(l => {
        const key = `${l.date}_${l.period}_${l.classId}`;
        if (!map.has(key)) map.set(key, l);
      });
      bootstrapData.value.recentLogs = Array.from(map.values());
    }
  } catch (e) {
    console.warn('載入歷史日誌失敗:', e);
  } finally {
    isFetchingHistory.value = false;
  }
}

function formatLogDate(val) {
  if (!val) return '';
  if (typeof val === 'string' && val.includes('T')) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  return String(val).slice(0, 10);
}

function formatLogTime(ts) {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return String(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch (e) {
    return String(ts);
  }
}

// -------------------------------------------------------------
// 教學進度自動推算與自訂編輯邏輯
// -------------------------------------------------------------
function getWeekNumberFromDate(dateStr) {
  if (!dateStr) return 1;
  const d = new Date(dateStr + 'T00:00:00');
  const semesterStart = new Date(2026, 7, 31); // 2026-08-31
  const diffTime = d.getTime() - semesterStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 1;
  const week = Math.floor(diffDays / 7) + 1;
  return Math.min(Math.max(week, 1), 21);
}

const currentGrade = computed(() => {
  const cid = String(selectedClassId.value || '');
  if (cid.includes('五') || cid.includes('5')) return 5;
  if (cid.includes('六') || cid.includes('6')) return 6;
  return 5;
});

const currentLessonWeek = computed(() => {
  return getWeekNumberFromDate(selectedDate.value);
});

const matchedCurriculumPlan = computed(() => {
  const list = bootstrapData.value.curriculum || [];
  const g = currentGrade.value;
  const w = currentLessonWeek.value;
  return list.find(c => Number(c.grade || c.Grade) === g && Number(c.weekNo || c.WeekNo) === w) || null;
});

function generateDefaultLessonContent() {
  const g = currentGrade.value;
  const w = currentLessonWeek.value;
  const plan = matchedCurriculumPlan.value;
  if (plan) {
    const title = plan.unitTitle || plan.UnitTitle || '';
    const content = plan.suggestedContent || plan.SuggestedContent || '';
    if (content) {
      return `${g === 5 ? '五上' : '六上'}第${w}週 ${title}：${content}`;
    }
    return `${g === 5 ? '五上' : '六上'}第${w}週 ${title}`;
  }
  return `${g === 5 ? '五上' : '六上'}第${w}週 體育教學活動`;
}

const lessonActualContent = ref('');
const isContentManuallyEdited = ref(false);

watch(
  () => [selectedDate.value, selectedClassId.value, bootstrapData.value.curriculum],
  () => {
    if (!isContentManuallyEdited.value) {
      lessonActualContent.value = generateDefaultLessonContent();
    }
  },
  { immediate: true, deep: true }
);

function resetLessonContentToDefault() {
  isContentManuallyEdited.value = false;
  lessonActualContent.value = generateDefaultLessonContent();
  showToast('已重設為當週標準教學進度', 'success');
}

// 當前速記資料模型
const healthRecords = ref({}); // { [studentId]: '良好' | '不適' | '見習' }
const attitudeRecords = ref({}); // { [studentId]: { netDelta: 0, violations: [], merits: [], observationNotes: '' } }
const fitnessRecords = ref({}); // { [itemId]: { [studentId]: { rawValue, isExempt } } }
const skillRecords = ref({}); // { [examIndex]: { [studentId]: { examIndex, itemName, rawValue, isExempt } } }
const voiceNoteText = ref('');
const isRecording = ref(false);

// 當前班級學生清單
const currentStudents = computed(() => {
  return bootstrapData.value.students.filter(
    s => String(s.classId) === String(selectedClassId.value)
  );
});

const unsavedCount = computed(() => {
  const hCount = Object.keys(healthRecords.value).length;
  const aCount = Object.keys(attitudeRecords.value).length;
  let fCount = 0;
  Object.values(fitnessRecords.value).forEach(itemMap => {
    fCount += Object.keys(itemMap).length;
  });
  let sCount = 0;
  Object.values(skillRecords.value).forEach(examMap => {
    sCount += Object.keys(examMap).length;
  });
  return hCount + aCount + fCount + sCount + (voiceNoteText.value ? 1 : 0);
});

const isRefreshing = ref(false);

onMounted(async () => {
  window.addEventListener('online', () => isOnline.value = true);
  window.addEventListener('offline', () => {
    isOnline.value = false;
    isCloudConnected.value = false;
  });

  // 啟動時強制嘗試由雲端獲取最新資料
  await refreshFromCloud(false);
});

async function refreshFromCloud(isManual = false) {
  isRefreshing.value = true;
  try {
    const data = await apiService.getBootstrapData(true);
    if (data) {
      bootstrapData.value = data;
      isCloudConnected.value = !data.isMock;

      // 班級自動校正：確保選取的班級存在於最新班級名單中（避免舊快取殘留「五年戊班」導致對應不到）
      const classList = bootstrapData.value.classes || [];
      if (classList.length > 0 && !classList.includes(selectedClassId.value)) {
        const matched = classList.find(c => selectedClassId.value.includes(c) || c.includes(selectedClassId.value));
        selectedClassId.value = matched || classList[0];
      }
      initDefaultHealth(selectedClassId.value);
      if (isManual) {
        showToast(`🎉 雲端同步完成！已取得 ${data.students?.length || 0} 位學生、${data.curriculum?.length || 0} 週課程`, 'success');
      }
    }
  } catch (err) {
    if (isManual) {
      showToast('雲端同步失敗，請檢查網路或金鑰', 'error');
    }
  } finally {
    isRefreshing.value = false;
  }
}

function initDefaultHealth(classId) {
  const studs = bootstrapData.value.students.filter(s => String(s.classId) === String(classId));
  const initH = {};
  studs.forEach(s => {
    initH[s.studentId] = '良好';
  });
  healthRecords.value = initH;
}

function handleSelectClass({ classId, period, location }) {
  selectedClassId.value = classId;
  if (period) currentPeriod.value = Number(period);
  if (location && STANDARD_VENUES.includes(location)) {
    currentVenue.value = location;
  }
  selectedDate.value = new Date().toLocaleDateString('sv');
  initDefaultHealth(classId);
  currentTab.value = 'record';
  showToast(`已切換至 ${classId} (第 ${period || 2} 節，${currentVenue.value})`, 'success');
}

function handleUpdateHealth({ studentId, healthStatus }) {
  healthRecords.value[studentId] = healthStatus;
}

function handleOpenAttitudeDrawer(student) {
  activeAttitudeStudent.value = student;
  isAttitudeDrawerOpen.value = true;
}

function handleSaveStudentAttitude(data) {
  attitudeRecords.value[data.studentId] = data;
  showToast(`已記錄 ${data.studentId} 學習態度 (異動 ${data.netDelta > 0 ? '+' : ''}${data.netDelta} 分)`, 'success');
}

function handleSaveFitnessRecord({ studentId, itemId, rawValue, isExempt }) {
  if (!fitnessRecords.value[itemId]) {
    fitnessRecords.value[itemId] = {};
  }
  fitnessRecords.value[itemId][studentId] = { rawValue, isExempt };
}

function handleUpdateSkillRecord({ examIndex, studentId, itemName, rawValue, isExempt }) {
  if (!skillRecords.value[examIndex]) {
    skillRecords.value[examIndex] = {};
  }
  skillRecords.value[examIndex][studentId] = {
    examIndex,
    studentId,
    itemName,
    rawValue,
    isExempt
  };
}

function getFitnessCell(studentId, itemId) {
  const rec = fitnessRecords.value?.[itemId]?.[studentId];
  if (!rec) return '-';
  if (rec.isExempt) return '免測';
  return rec.rawValue !== null && rec.rawValue !== undefined ? rec.rawValue : '-';
}

function quickArchiveAll() {
  currentStudents.value.forEach(s => {
    if (!healthRecords.value[s.studentId]) {
      healthRecords.value[s.studentId] = '良好';
    }
  });
  showToast('⚡ 全班今日健康正常，已快捷預填歸檔！', 'success');
}

// 課後一鍵批次同步至 GAS
async function handleBatchSaveToGAS() {
  isSaving.value = true;

  const healthAttitudeList = currentStudents.value.map(s => {
    const att = attitudeRecords.value[s.studentId] || {};
    return {
      studentId: s.studentId,
      classId: selectedClassId.value,
      healthStatus: healthRecords.value[s.studentId] || '良好',
      observationNotes: att.observationNotes || '',
      violations: att.violations || [],
      merits: att.merits || [],
      netAttitudeDelta: att.netDelta || 0
    };
  });

  const fitnessList = [];
  currentStudents.value.forEach(s => {
    const curl = fitnessRecords.value?.['CurlUps']?.[s.studentId];
    const reach = fitnessRecords.value?.['SitAndReach']?.[s.studentId];
    const jump = fitnessRecords.value?.['StandingLongJump']?.[s.studentId];
    const run = fitnessRecords.value?.['CardioRun']?.[s.studentId];

    if (curl || reach || jump || run) {
      fitnessList.push({
        studentId: s.studentId,
        classId: selectedClassId.value,
        curlUps: curl?.rawValue || '',
        sitAndReach: reach?.rawValue || '',
        standingLongJump: jump?.rawValue || '',
        cardioRun: run?.rawValue || ''
      });
    }
  });

  const skillsList = [];
  Object.values(skillRecords.value).forEach(examMap => {
    Object.values(examMap).forEach(rec => {
      skillsList.push({
        studentId: rec.studentId,
        classId: selectedClassId.value,
        examIndex: rec.examIndex,
        itemName: rec.itemName,
        rawValue: rec.rawValue,
        isExempt: Boolean(rec.isExempt)
      });
    });
  });

  const saveDate = selectedDate.value || new Date().toLocaleDateString('sv');
  const savePeriod = Number(currentPeriod.value) || 2;
  const saveContent = (lessonActualContent.value || '').trim() || generateDefaultLessonContent();

  const payload = {
    dailyLog: {
      date: saveDate,
      period: savePeriod,
      classId: selectedClassId.value,
      location: currentVenue.value,
      actualContent: saveContent,
      voiceNotes: voiceNoteText.value
    },
    healthAttitudeList,
    fitnessList,
    skillsList
  };

  try {
    const res = await apiService.saveClassSession(payload);
    if (res && res.success) {
      showToast(`🎉 已成功同步 ${selectedClassId.value} [${saveDate} 第 ${savePeriod} 節] 課堂紀錄！`, 'success');
      const newLog = {
        logId: 'LOG_' + Date.now(),
        date: saveDate,
        period: savePeriod,
        classId: selectedClassId.value,
        actualContent: saveContent,
        voiceNotes: payload.dailyLog.voiceNotes,
        timestamp: new Date().toISOString()
      };
      if (!Array.isArray(bootstrapData.value.recentLogs)) {
        bootstrapData.value.recentLogs = [];
      }
      bootstrapData.value.recentLogs.unshift(newLog);
    } else {
      showToast('同步失敗: ' + (res?.error || '請檢查網路連線'), 'error');
    }
  } catch (err) {
    showToast('連線異常，已暫存於離線佇列', 'error');
  } finally {
    isSaving.value = false;
  }
}

// 語音識別 (Web Speech API) - 修正重疊字詞重複堆疊問題
let recognition = null;
const interimVoiceText = ref('');

function toggleSpeechRecognition() {
  if (isRecording.value) {
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
    }
    if (interimVoiceText.value.trim()) {
      voiceNoteText.value = (voiceNoteText.value.trim() ? voiceNoteText.value.trim() + ' ' : '') + interimVoiceText.value.trim();
      interimVoiceText.value = '';
    }
    isRecording.value = false;
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('此瀏覽器不支援 Web Speech API，請使用 Chrome 或直接打字輸入', 'error');
    return;
  }

  try {
    recognition = new SpeechRecognition();
    recognition.lang = 'zh-TW';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isRecording.value = true;
      interimVoiceText.value = '';
      showToast('🎤 麥克風已啟動，請開始口述課堂速記...', 'success');
    };

    recognition.onresult = (event) => {
      let finalChunk = '';
      let interimChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = res[0]?.transcript || '';
        if (res.isFinal) {
          finalChunk += text;
        } else {
          interimChunk += text;
        }
      }

      if (finalChunk.trim()) {
        const cleaned = finalChunk.trim();
        voiceNoteText.value = (voiceNoteText.value.trim() ? voiceNoteText.value.trim() + ' ' : '') + cleaned;
      }
      interimVoiceText.value = interimChunk.trim();
    };

    recognition.onerror = (e) => {
      console.warn('Speech recognition error:', e);
      if (e.error === 'not-allowed') {
        showToast('無法存取麥克風，請檢查瀏覽器麥克風權限', 'error');
      } else if (e.error !== 'no-speech') {
        showToast(`語音辨識提示: ${e.error}`, 'error');
      }
      isRecording.value = false;
      interimVoiceText.value = '';
    };

    recognition.onend = () => {
      if (interimVoiceText.value.trim()) {
        voiceNoteText.value = (voiceNoteText.value.trim() ? voiceNoteText.value.trim() + ' ' : '') + interimVoiceText.value.trim();
        interimVoiceText.value = '';
      }
      isRecording.value = false;
    };

    recognition.start();
  } catch (err) {
    console.error('Failed to start speech recognition:', err);
    showToast('啟動語音辨識失敗，請檢查麥克風權限', 'error');
    isRecording.value = false;
  }
}

function clearVoiceNote() {
  voiceNoteText.value = '';
  interimVoiceText.value = '';
  showToast('已清空語音速記內容', 'success');
}

function copyVoiceNote() {
  if (!voiceNoteText.value) return;
  navigator.clipboard.writeText(voiceNoteText.value)
    .then(() => showToast('已複製速記內容至剪貼簿！', 'success'))
    .catch(() => showToast('複製失敗', 'error'));
}

function appendQuickPhrase(phrase) {
  voiceNoteText.value = (voiceNoteText.value.trim() ? voiceNoteText.value.trim() + ' ' : '') + phrase;
}

function saveSettings() {
  apiService.setGasUrl(gasUrlInput.value);
  apiService.setApiToken(apiTokenInput.value);
  showSettingsModal.value = false;
  showToast('GAS 伺服器網址與 API 金鑰已儲存！正在同步雲端...', 'success');
  refreshFromCloud(true);
}

async function handleTestConnection() {
  isTestingConnection.value = true;
  connectionTestResult.value = null;
  try {
    const res = await apiService.testConnection(gasUrlInput.value, apiTokenInput.value);
    connectionTestResult.value = res;
    if (res.success) {
      isCloudConnected.value = true;
      if (res.data) {
        bootstrapData.value = res.data;
        const classList = bootstrapData.value.classes || [];
        if (classList.length > 0 && !classList.includes(selectedClassId.value)) {
          const matched = classList.find(c => selectedClassId.value.includes(c) || c.includes(selectedClassId.value));
          selectedClassId.value = matched || classList[0];
        }
        initDefaultHealth(selectedClassId.value);
      }
      showToast('🎉 資料庫連線測試成功！已與雲端同步', 'success');
    } else {
      isCloudConnected.value = false;
      showToast('連線測試失敗: ' + (res.error || '請檢查網址或金鑰'), 'error');
    }
  } catch (e) {
    connectionTestResult.value = { success: false, error: e.message || '測試異常' };
    isCloudConnected.value = false;
  } finally {
    isTestingConnection.value = false;
  }
}

async function handleFullSyncToGAS() {
  isSyncingAll.value = true;
  try {
    const payload = {
      students: bootstrapData.value.students,
      timetable: bootstrapData.value.timetable,
      curriculum: bootstrapData.value.curriculum
    };
    const res = await apiService.syncAllToGAS(payload);
    if (res && res.success) {
      isCloudConnected.value = true;
      showToast(res.message || '全量資料已同步至 Google 試算表！', 'success');
    } else {
      showToast('同步失敗: ' + (res?.error || '請檢查網路連線'), 'error');
    }
  } catch (err) {
    showToast('同步異常：' + (err.message || '連線逾時'), 'error');
  } finally {
    isSyncingAll.value = false;
  }
}

function handleClearLocalData() {
  if (confirm('確定要清除本機所有快取資料與班級名冊嗎？（適合於公用電腦使用完畢後清除隱私紀錄）')) {
    apiService.clearAllLocalData();
    showSettingsModal.value = false;
    showToast('本機暫存與名冊已完全清除！正在重新載入...', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

function showToast(msg, type = 'success') {
  toastMessage.value = msg;
  toastType.value = type;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3200);
}

// -------------------------------------------------------------
// 後台管理存檔動作 (班級名冊、週課表、上課進度)
// -------------------------------------------------------------
async function handleSaveStudentsFromAdmin(updatedStudents) {
  bootstrapData.value.students = updatedStudents;
  const newClasses = Array.from(new Set(updatedStudents.map(s => s.classId || s.ClassId).filter(Boolean)));
  if (newClasses.length > 0) {
    bootstrapData.value.classes = newClasses;
  }
  initDefaultHealth(selectedClassId.value);
  const res = await apiService.saveStudents(updatedStudents);
  showToast(res.message || '學生名冊已成功更新！', res.success ? 'success' : 'error');
}

async function handleSaveTimetableFromAdmin(updatedTimetable) {
  bootstrapData.value.timetable = updatedTimetable;
  const res = await apiService.saveTimetable(updatedTimetable);
  showToast(res.message || '週課表已成功更新！', res.success ? 'success' : 'error');
}

async function handleSaveCurriculumFromAdmin(updatedCurriculum) {
  bootstrapData.value.curriculum = updatedCurriculum;
  const res = await apiService.saveCurriculum(updatedCurriculum);
  showToast(res.message || '上課進度計畫已成功更新！', res.success ? 'success' : 'error');
}
</script>
