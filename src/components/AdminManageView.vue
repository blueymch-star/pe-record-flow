<template>
  <div class="space-y-5">
    <!-- 後台主 Header 與次選單切換 -->
    <div class="glass-panel p-4 rounded-2xl border border-slate-700/80 space-y-3.5">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div class="min-w-0 flex-1">
          <h2 class="text-base sm:text-lg font-bold text-white flex flex-wrap items-center gap-2">
            <span>🛠️ 體育教學管理後台</span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
              新竹市大庄國小 115上 · 張永明 老師
            </span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            維護 五丁、五戊、六甲、六乙 名冊與轉學生、週一至週五課表 (第1~7節)、五上/六上教學進度表 (21週)
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap flex-shrink-0">
          <button
            @click="activeSubTab = 'students'"
            class="active-press px-3.5 py-2 rounded-xl text-xs font-black transition border whitespace-nowrap"
            :class="activeSubTab === 'students' ? 'bg-emerald-600 text-white border-emerald-400 shadow' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'"
          >
            👥 班級名冊
          </button>
          <button
            @click="activeSubTab = 'timetable'"
            class="active-press px-3.5 py-2 rounded-xl text-xs font-black transition border whitespace-nowrap"
            :class="activeSubTab === 'timetable' ? 'bg-emerald-600 text-white border-emerald-400 shadow' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'"
          >
            📅 週課表 (8節)
          </button>
          <button
            @click="activeSubTab = 'curriculum'"
            class="active-press px-3.5 py-2 rounded-xl text-xs font-black transition border whitespace-nowrap"
            :class="activeSubTab === 'curriculum' ? 'bg-emerald-600 text-white border-emerald-400 shadow' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'"
          >
            📚 教學進度 (21週)
          </button>
          <button
            @click="activeSubTab = 'logs'"
            class="active-press px-3.5 py-2 rounded-xl text-xs font-black transition border whitespace-nowrap"
            :class="activeSubTab === 'logs' ? 'bg-emerald-600 text-white border-emerald-400 shadow' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'"
          >
            📜 課堂日誌
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 子分頁 1：班級與學生名冊管理 -->
    <!-- ========================================================================= -->
    <div v-show="activeSubTab === 'students'" class="space-y-4">
      <!-- 班級操作列 -->
      <div class="glass-panel p-4 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          <label class="text-xs font-bold text-slate-300 whitespace-nowrap">目前管理班級：</label>
          <select
            v-model="selectedClass"
            class="bg-slate-800 text-white font-bold text-sm rounded-xl px-3 py-2 border border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option v-for="c in classList" :key="c" :value="c">
              {{ c }} ({{ getStudentCountByClass(c) }} 人)
            </option>
          </select>

          <!-- 快速搜尋學生姓名/座號以查閱履歷 -->
          <div class="relative w-full sm:w-40">
            <input
              v-model="studentFilterKeyword"
              type="text"
              placeholder="🔍 查學生/座號..."
              class="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- 新增班級按鈕 -->
          <button
            @click="showAddClassModal = true"
            class="active-press px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold"
            title="新增班級"
          >
            ➕ 新增班級
          </button>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <!-- 隱藏原生檔案選擇器 -->
          <input
            type="file"
            ref="fileInputRef"
            accept=".csv, .txt, .tsv"
            @change="handleFileUpload"
            class="hidden"
          />

          <!-- 1. 下載範本 -->
          <button
            @click="downloadStudentTemplate"
            class="active-press px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5"
            title="下載可由 Excel 編輯的班級名冊 CSV 範本"
          >
            <span>📥 下載名冊範本</span>
          </button>

          <!-- 2. 批次上傳檔案 -->
          <button
            @click="triggerFileInput"
            class="active-press px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5"
            title="上傳 CSV 或文字檔批次匯入名冊"
          >
            <span>📤 批次上傳檔案</span>
          </button>

          <!-- 3. 批次貼上匯入 -->
          <button
            @click="showBatchImportModal = true"
            class="active-press px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5"
            title="從 Excel 複製多行直接貼上"
          >
            <span>📋 貼上匯入</span>
          </button>

          <!-- 4. 新增單筆學生 -->
          <button
            @click="openAddStudentModal"
            class="active-press px-2.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 shadow"
          >
            <span>➕ 新增學生</span>
          </button>

          <!-- 5. 儲存名冊 -->
          <button
            @click="saveStudentsData"
            :disabled="isSaving"
            class="active-press disabled:opacity-50 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black flex items-center gap-1.5 shadow-lg"
          >
            <span>💾 儲存名冊</span>
          </button>
        </div>
      </div>

      <!-- 學生列表表格 (支援手機橫向滑動與姓名單行不折行) -->
      <div class="glass-panel rounded-2xl border border-slate-700/80 p-3 overflow-x-auto">
        <table class="w-full min-w-[560px] text-xs text-left">
          <thead>
            <tr class="border-b border-slate-700 text-slate-400 font-bold whitespace-nowrap">
              <th class="py-2.5 px-2 w-16 text-center">座號</th>
              <th class="py-2.5 px-3 min-w-[76px]">學生姓名</th>
              <th class="py-2.5 px-2 w-16 text-center">性別</th>
              <th class="py-2.5 px-3">學號 (主鍵)</th>
              <th class="py-2.5 px-3">先天痼疾安全備忘 (氣喘/心臟病等)</th>
              <th class="py-2.5 px-2 w-24 text-center">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800 whitespace-nowrap">
            <tr
              v-for="student in currentClassStudents"
              :key="student.studentId || student.StudentId"
              class="hover:bg-slate-800/40 transition"
            >
              <td class="py-2 px-2 text-center font-mono font-black text-emerald-400">
                {{ student.seatNo ?? student.SeatNo }}
              </td>
              <td class="py-2 px-3 font-bold text-white whitespace-nowrap min-w-[76px]">
                <button
                  type="button"
                  @click="openStudentProfileModal(student)"
                  class="font-bold text-white hover:text-emerald-300 transition text-left underline decoration-slate-600 underline-offset-4 flex items-center gap-1 group cursor-pointer"
                  title="點擊查看歷史履歷與平時表現"
                >
                  <span>{{ student.name || student.Name }}</span>
                  <span class="text-[10px] text-slate-500 group-hover:text-emerald-400">📜</span>
                </button>
              </td>
              <td class="py-2 px-2 text-center font-semibold" :class="(student.gender || student.Gender) === 'M' ? 'text-blue-300' : 'text-pink-300'">
                {{ (student.gender || student.Gender) === 'M' ? '男' : '女' }}
              </td>
              <td class="py-2 px-3 font-mono text-slate-400">
                {{ student.studentId || student.StudentId }}
              </td>
              <td class="py-2 px-3">
                <span v-if="student.medicalNotes || student.MedicalNotes" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-950/60 text-red-300 border border-red-800/50 text-[11px] font-semibold">
                  ❤️ {{ student.medicalNotes || student.MedicalNotes }}
                </span>
                <span v-else class="text-slate-600">-</span>
              </td>
              <td class="py-2 px-2 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    @click="openStudentProfileModal(student)"
                    class="p-1 px-2 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 text-xs font-bold flex items-center gap-1 active-press"
                    title="檢視學生歷史履歷"
                  >
                    <span>📜 履歷</span>
                  </button>
                  <button
                    @click="openEditStudentModal(student)"
                    class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="編輯"
                  >
                    ✏️
                  </button>
                  <button
                    @click="deleteStudent(student.studentId)"
                    class="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-red-400"
                    title="刪除"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="currentClassStudents.length === 0">
              <td colspan="6" class="py-8 text-center text-slate-500 font-semibold">
                此班級尚無學生資料，請點擊「➕ 新增學生」或「📋 批次貼上匯入」！
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 子分頁 2：週課表設定 (依據課表.pdf，完整 1 至 7 節) -->
    <!-- ========================================================================= -->
    <div v-show="activeSubTab === 'timetable'" class="space-y-4">
      <div class="glass-panel p-4 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 class="text-sm font-bold text-white">張永明老師 週課表設定 (週一至週五，第 1 至第 7 節，共 8 節課)</h3>
          <p class="text-xs text-slate-400 mt-0.5">點選任一節次即可設定授課班級與上課地點，首頁時間感知雷達將即時連動</p>
        </div>

        <button
          @click="saveTimetableData"
          :disabled="isSaving"
          class="active-press disabled:opacity-50 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black flex items-center gap-1.5 shadow-lg"
        >
          <span>💾 儲存週課表</span>
        </button>
      </div>

      <!-- 週課表矩陣編輯器 (第 1 至 7 節) -->
      <div class="glass-panel rounded-2xl border border-slate-700/80 p-4">
        <div class="grid grid-cols-6 gap-2 text-center text-xs font-bold mb-2">
          <div class="py-2 rounded bg-slate-800/80 text-slate-400">節次</div>
          <div v-for="d in 5" :key="d" class="py-2 rounded bg-slate-800/80 text-slate-200">
            週{{ ['一', '二', '三', '四', '五'][d - 1] }}
          </div>
        </div>

        <div class="space-y-2">
          <div v-for="period in [1, 2, 3, 4, 5, 6, 7]" :key="period" class="grid grid-cols-6 gap-2">
            <!-- 節次名稱與時間 -->
            <div class="rounded-xl p-2 bg-slate-850/80 border border-slate-800 flex flex-col justify-center items-center text-center">
              <span class="font-black text-xs text-slate-300">第 {{ period }} 節</span>
              <span class="text-[10px] text-slate-500 font-mono scale-90">{{ getPeriodDefaultTime(period) }}</span>
            </div>

            <!-- 週一至週五課堂格子 -->
            <div
              v-for="day in 5"
              :key="day"
              @click="openEditLessonModal(day, period)"
              class="min-h-[58px] rounded-xl p-2 border flex flex-col justify-center items-center text-center cursor-pointer active-press transition"
              :class="getTimetableEntry(day, period)
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 hover:border-emerald-400'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-600'"
            >
              <template v-if="getTimetableEntry(day, period)">
                <span class="font-black text-sm text-emerald-300">
                  {{ getTimetableEntry(day, period).classId }}
                </span>
                <span class="text-[11px] text-slate-300 truncate max-w-full">
                  {{ getTimetableEntry(day, period).location || '操場' }}
                </span>
              </template>
              <template v-else>
                <span class="text-xs text-slate-600 font-bold">＋ 排課</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 子分頁 3：上課進度與課程規劃 (支援五年級與六年級，各 21 週) -->
    <!-- ========================================================================= -->
    <div v-show="activeSubTab === 'curriculum'" class="space-y-4">
      <div class="glass-panel p-4 rounded-2xl border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div class="min-w-0">
          <h3 class="text-sm font-bold text-white">體育教學進度與評量檢核計畫 (115學年度上學期，共21週)</h3>
          <p class="text-xs text-slate-400 mt-0.5">依據教育部課綱與學校行事曆，支援五上、六上獨立單元與評量規劃</p>
        </div>

        <div class="flex items-center gap-2 flex-wrap flex-shrink-0">
          <!-- 年級切換 -->
          <div class="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs font-bold">
            <button
              @click="curriculumGrade = 5"
              class="px-3 py-1.5 rounded-lg transition"
              :class="curriculumGrade === 5 ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'"
            >
              五年級 (21週)
            </button>
            <button
              @click="curriculumGrade = 6"
              class="px-3 py-1.5 rounded-lg transition"
              :class="curriculumGrade === 6 ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'"
            >
              六年級 (21週)
            </button>
          </div>

          <button
            @click="addNewWeekPlan"
            class="active-press px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center gap-1"
          >
            <span>➕ 新增週次</span>
          </button>
          <button
            @click="saveCurriculumData"
            :disabled="isSaving"
            class="active-press disabled:opacity-50 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black flex items-center gap-1.5 shadow-lg"
          >
            <span>💾 儲存進度計畫</span>
          </button>
        </div>
      </div>

      <!-- 週次列表 (過濾當前選取之年級) -->
      <div class="space-y-3">
        <div
          v-for="plan in filteredCurriculum"
          :key="plan.weekNo + '_' + (plan.grade || curriculumGrade)"
          class="glass-panel rounded-2xl border border-slate-700/80 p-4 space-y-3"
        >
          <div class="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 font-black flex items-center justify-center text-xs border border-emerald-500/30">
                W{{ plan.weekNo }}
              </span>
              <div>
                <span class="text-xs font-black text-white">第 {{ plan.weekNo }} 週課程單元</span>
                <span v-if="plan.dateRange" class="text-[11px] text-slate-400 font-mono ml-2">({{ plan.dateRange }})</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span v-if="plan.schoolEvent" class="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                🔔 {{ plan.schoolEvent }}
              </span>
              <button
                @click="deleteWeekPlan(plan)"
                class="p-1 rounded-lg text-slate-500 hover:text-red-400 text-xs"
                title="刪除此週"
              >
                🗑️
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">單元名稱：</label>
              <input
                v-model="plan.unitTitle"
                type="text"
                class="w-full bg-slate-800 text-slate-100 text-xs font-bold rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="例：田徑、羽球、籃球"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">上課場地：</label>
              <select
                v-model="plan.venue"
                class="w-full bg-slate-800 text-slate-100 text-xs font-bold rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option v-for="venue in STANDARD_VENUES" :key="venue" :value="venue">{{ venue }}</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">教學活動重點：</label>
              <input
                v-model="plan.suggestedContent"
                type="text"
                class="w-full bg-slate-800 text-slate-100 text-xs font-bold rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="活動內容"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">評量方式：</label>
              <input
                v-model="plan.evalMethod"
                type="text"
                class="w-full bg-slate-800 text-slate-100 text-xs font-bold rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="技能操作70% 學習態度20% 體育常識10%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 子分頁 4：課堂歷史日誌管理 (DailyLogs) -->
    <!-- ========================================================================= -->
    <div v-show="activeSubTab === 'logs'" class="space-y-4">
      <div class="glass-panel p-4 rounded-2xl border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div class="min-w-0">
          <h3 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span>📜 課堂日誌與上課日期紀錄 (DailyLogs)</span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
              共 {{ filteredAdminLogs.length }} 堂課
            </span>
          </h3>
          <p class="text-xs text-slate-400 mt-1">
            記錄每一堂課的上課日期、節次、班級、教學單元進度與課堂備忘
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <!-- 班級篩選 -->
          <select
            v-model="adminLogClassFilter"
            class="bg-slate-800 text-emerald-300 font-bold text-xs rounded-xl px-3 py-2 border border-slate-600 focus:outline-none"
          >
            <option value="ALL">全部班級 ({{ (props.recentLogs || []).length }} 筆)</option>
            <option v-for="c in classList" :key="c" :value="c">{{ c }}</option>
          </select>

          <!-- 關鍵字搜尋 -->
          <input
            v-model="adminLogKeyword"
            type="text"
            placeholder="搜尋日期、進度或筆記..."
            class="bg-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-48"
          />
        </div>
      </div>

      <!-- 日誌列表 -->
      <div class="glass-panel rounded-2xl border border-slate-700/80 p-3 overflow-x-auto">
        <table class="w-full text-xs text-left min-w-[640px]">
          <thead>
            <tr class="border-b border-slate-700 text-slate-400 font-bold whitespace-nowrap">
              <th class="py-2.5 px-3">上課日期</th>
              <th class="py-2.5 px-3">班級 / 節次</th>
              <th class="py-2.5 px-3">教學內容與進度</th>
              <th class="py-2.5 px-3">速記隨行筆記</th>
              <th class="py-2.5 px-3 text-right">同步時間</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr v-if="filteredAdminLogs.length === 0">
              <td colspan="5" class="py-10 text-center text-slate-500">
                尚未有相符的課堂日誌紀錄。課後同步時將自動記錄上課日期與內容！
              </td>
            </tr>
            <tr v-for="log in filteredAdminLogs" :key="log.logId || (log.date + '_' + log.period + '_' + log.classId)" class="hover:bg-slate-800/40">
              <td class="py-3 px-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                📅 {{ formatDisplayDate(log.date || log.Date) }}
              </td>
              <td class="py-3 px-3 font-bold text-white whitespace-nowrap">
                <span class="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-bold text-emerald-300 mr-1.5">{{ log.classId }}</span>
                <span class="text-slate-400 text-[11px]">第 {{ log.period }} 節</span>
              </td>
              <td class="py-3 px-3 text-slate-200">
                {{ log.actualContent || '-' }}
              </td>
              <td class="py-3 px-3 text-emerald-300">
                <span v-if="log.voiceNotes" class="inline-flex items-center gap-1 bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-500/20">
                  🎙️ {{ log.voiceNotes }}
                </span>
                <span v-else class="text-slate-500">-</span>
              </td>
              <td class="py-3 px-3 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ formatAdminTime(log.timestamp) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 彈窗：新增/編輯學生 Modal -->
    <!-- ========================================================================= -->
    <div
      v-if="showStudentModal"
      class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="font-black text-sm text-white">
            {{ isEditingStudent ? '✏️ 編輯學生資料' : '➕ 新增學生 (轉學生)' }}
          </h3>
          <button @click="showStudentModal = false" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-bold text-slate-400 mb-1">所屬班級：</label>
            <input
              v-model="studentForm.classId"
              type="text"
              readonly
              class="w-full bg-slate-800/60 text-slate-400 text-xs rounded-xl p-2.5 border border-slate-700"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">座號：</label>
              <input
                v-model.number="studentForm.seatNo"
                type="number"
                min="1"
                class="w-full bg-slate-800 text-slate-100 text-xs font-mono font-bold rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">性別：</label>
              <select
                v-model="studentForm.gender"
                class="w-full bg-slate-800 text-slate-100 text-xs font-bold rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="M">男生 (M)</option>
                <option value="F">女生 (F)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-400 mb-1">學生姓名：</label>
            <input
              v-model="studentForm.name"
              type="text"
              placeholder="請輸入姓名"
              class="w-full bg-slate-800 text-slate-100 text-xs font-bold rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-400 mb-1">學號 (留空自動生成)：</label>
            <input
              v-model="studentForm.studentId"
              type="text"
              placeholder="例：五丁01"
              class="w-full bg-slate-800 text-slate-100 text-xs font-mono rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-400 mb-1">先天痼疾安全備忘 (選填)：</label>
            <input
              v-model="studentForm.medicalNotes"
              type="text"
              placeholder="例：氣喘、心臟病史、對特定花粉過敏..."
              class="w-full bg-slate-800 text-slate-100 text-xs rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div class="pt-2 flex items-center justify-end gap-2">
          <button @click="showStudentModal = false" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-400">
            取消
          </button>
          <button @click="saveStudentForm" class="px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow">
            確認儲存
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 彈窗：新增班級 Modal -->
    <!-- ========================================================================= -->
    <div
      v-if="showAddClassModal"
      class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-4">
        <h3 class="font-black text-sm text-white">➕ 新增班級</h3>
        <div>
          <label class="block text-[11px] font-bold text-slate-400 mb-1">班級名稱 (例：五丁、五戊)：</label>
          <input
            v-model="newClassName"
            type="text"
            placeholder="請輸入班級名稱"
            class="w-full bg-slate-800 text-slate-100 text-xs font-bold rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
        <div class="pt-2 flex items-center justify-end gap-2">
          <button @click="showAddClassModal = false" class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400">取消</button>
          <button @click="confirmAddClass" class="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow">建立</button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 彈窗：批次文字貼上匯入 Modal -->
    <!-- ========================================================================= -->
    <div
      v-if="showBatchImportModal"
      class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-lg w-full shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="font-black text-sm text-white">📋 批次貼上匯入至 {{ selectedClass }}</h3>
            <p class="text-[11px] text-slate-400">支援從 Excel/Google Sheets 複製多行貼上</p>
          </div>
          <button @click="showBatchImportModal = false" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 mb-1">
            資料格式：每行一筆 (座號 [空格或Tab] 姓名 [空格或Tab] 性別 [空格或Tab] 痼疾)
          </label>
          <textarea
            v-model="batchImportText"
            rows="6"
            class="w-full bg-slate-800 font-mono text-xs text-slate-100 rounded-xl p-3 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="例：&#10;1  陳小明  男  輕微氣喘&#10;2  林大同  男&#10;13 林依晨  女"
          ></textarea>
        </div>

        <div class="pt-2 flex items-center justify-end gap-2">
          <button @click="showBatchImportModal = false" class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400">取消</button>
          <button @click="confirmBatchImport" class="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow">開始匯入</button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 彈窗：檔案批次上傳預覽確認 Modal -->
    <!-- ========================================================================= -->
    <div
      v-if="showUploadPreviewModal"
      class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-lg w-full shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="font-black text-sm text-white flex items-center gap-1.5">
              <span>📤 檔案匯入確認</span>
            </h3>
            <p class="text-[11px] text-slate-400 mt-0.5">
              來源檔案：<span class="text-teal-300 font-mono">{{ uploadedFileName }}</span>
            </p>
          </div>
          <button @click="showUploadPreviewModal = false" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <div class="space-y-3">
          <div class="bg-slate-850 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span class="text-slate-300">匯入目標班級：<strong class="text-emerald-400 text-sm">{{ selectedClass }}</strong></span>
            <span class="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold">
              共解析出 {{ uploadPreviewList.length }} 筆
            </span>
          </div>

          <div>
            <div class="text-[11px] font-bold text-slate-400 mb-1 flex items-center justify-between">
              <span>名冊預覽 (前 10 筆)：</span>
              <span class="text-[10px] text-slate-500">學號將自動帶入【{{ selectedClass }} + 座號】</span>
            </div>
            <div class="max-h-56 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/70 p-1">
              <table class="w-full text-xs text-left">
                <thead>
                  <tr class="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th class="py-1 px-2 text-center w-12">座號</th>
                    <th class="py-1 px-2">姓名</th>
                    <th class="py-1 px-2 text-center w-12">性別</th>
                    <th class="py-1 px-2">先天痼疾安全備忘</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60 font-mono text-[11px]">
                  <tr v-for="std in uploadPreviewList.slice(0, 10)" :key="std.seatNo">
                    <td class="py-1 px-2 text-center text-emerald-400 font-bold">{{ std.seatNo }}</td>
                    <td class="py-1 px-2 font-sans font-bold text-white">{{ std.name }}</td>
                    <td class="py-1 px-2 text-center" :class="std.gender === 'M' ? 'text-blue-300' : 'text-pink-300'">
                      {{ std.gender === 'M' ? '男' : '女' }}
                    </td>
                    <td class="py-1 px-2 font-sans text-slate-400 truncate max-w-[180px]">
                      {{ std.medicalNotes || '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-if="uploadPreviewList.length > 10" class="text-[10px] text-slate-500 text-center mt-1">
              ... 尚有 {{ uploadPreviewList.length - 10 }} 筆資料未列出 ...
            </p>
          </div>
        </div>

        <div class="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
          <button @click="showUploadPreviewModal = false" class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400">
            取消
          </button>
          <button
            @click="confirmUploadImport"
            class="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow flex items-center gap-1.5 active-press"
          >
            <span>✅ 確認匯入此名冊</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 彈窗：編輯排課節次 Modal -->
    <!-- ========================================================================= -->
    <div
      v-if="showEditLessonModal"
      class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="font-black text-sm text-white">
            📅 排課設定：週{{ ['一', '二', '三', '四', '五'][lessonForm.dayOfWeek - 1] }} 第 {{ lessonForm.period }} 節
          </h3>
          <button @click="showEditLessonModal = false" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-bold text-slate-400 mb-1">上課班級：</label>
            <select
              v-model="lessonForm.classId"
              class="w-full bg-slate-800 text-slate-100 text-xs font-bold rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">(空堂無排課)</option>
              <option v-for="c in classList" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-400 mb-1">上課場地：</label>
            <select
              v-model="lessonForm.location"
              class="w-full bg-slate-800 text-slate-100 text-xs font-bold rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option v-for="venue in STANDARD_VENUES" :key="venue" :value="venue">{{ venue }}</option>
            </select>
          </div>
        </div>

        <div class="pt-2 flex items-center justify-between gap-2">
          <button
            v-if="lessonForm.classId"
            @click="clearCurrentLesson"
            class="px-3 py-1.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40"
          >
            清空此節
          </button>
          <div class="flex items-center gap-2 ml-auto">
            <button @click="showEditLessonModal = false" class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400">取消</button>
            <button @click="saveLessonForm" class="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow">套用</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 彈窗：學生個人歷史履歷與平時表現 Modal -->
    <!-- ========================================================================= -->
    <div
      v-if="showStudentProfileModal"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-5 max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh] space-y-4">
        <!-- Header -->
        <div class="flex items-start justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-black text-lg">
              {{ activeProfileStudent?.seatNo }}
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-black text-base sm:text-lg text-white">
                  {{ activeProfileStudent?.name }}
                </h3>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700" :class="activeProfileStudent?.gender === 'M' ? 'text-blue-300' : 'text-pink-300'">
                  {{ activeProfileStudent?.gender === 'M' ? '👦 男生' : '👧 女生' }}
                </span>
                <span class="text-xs font-mono text-slate-400">
                  {{ activeProfileStudent?.classId }} · {{ activeProfileStudent?.studentId }}
                </span>
              </div>
              <p v-if="activeProfileStudent?.medicalNotes" class="text-xs text-rose-300 flex items-center gap-1 mt-0.5 font-semibold">
                <span>❤️ 先天痼疾警示：</span>
                <span>{{ activeProfileStudent?.medicalNotes }}</span>
              </p>
            </div>
          </div>
          <button @click="showStudentProfileModal = false" class="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        <!-- 評量概況卡片 (Summary Cards) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <!-- 態度總分 -->
          <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-0.5">
            <div class="text-[11px] font-bold text-slate-400">⚡ 學習態度總評</div>
            <div class="text-xl font-black font-mono" :class="studentAttitudeSummary.finalScore >= 80 ? 'text-emerald-400' : 'text-amber-400'">
              {{ studentAttitudeSummary.finalScore }} 分
            </div>
            <div class="text-[10px] text-slate-400">
              基準 100 ({{ studentAttitudeSummary.totalDelta >= 0 ? '+' : '' }}{{ studentAttitudeSummary.totalDelta }})
            </div>
          </div>

          <!-- 見習次數 -->
          <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-0.5">
            <div class="text-[11px] font-bold text-slate-400">🤕 課堂見習次數</div>
            <div class="text-xl font-black font-mono text-amber-300">
              {{ studentAttitudeSummary.observeCount }} 次
            </div>
            <div class="text-[10px] text-slate-400">
              身體微恙/見習旁聽
            </div>
          </div>

          <!-- 優良表現標籤數 -->
          <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-0.5">
            <div class="text-[11px] font-bold text-slate-400">🌟 優良表現 (+4)</div>
            <div class="text-xl font-black font-mono text-teal-300">
              {{ studentAttitudeSummary.meritsCount }} 次
            </div>
            <div class="text-[10px] text-slate-400">熱心收器材/互助</div>
          </div>

          <!-- 違規扣分次數 -->
          <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-0.5">
            <div class="text-[11px] font-bold text-slate-400">⚠️ 違規紀錄 (-4)</div>
            <div class="text-xl font-black font-mono text-rose-300">
              {{ studentAttitudeSummary.violationsCount }} 次
            </div>
            <div class="text-[10px] text-slate-400">未穿鞋服/秩序干擾</div>
          </div>
        </div>

        <!-- 履歷子分頁切換 -->
        <div class="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700 text-xs font-bold">
          <button
            @click="profileActiveTab = 'attitude'"
            class="flex-1 py-1.5 rounded-lg transition text-center"
            :class="profileActiveTab === 'attitude' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'"
          >
            📋 健康與態度歷程 ({{ studentProfileData.healthAttitudeLogs.length }})
          </button>
          <button
            @click="profileActiveTab = 'fitness'"
            class="flex-1 py-1.5 rounded-lg transition text-center"
            :class="profileActiveTab === 'fitness' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'"
          >
            🏃 體適能紀錄
          </button>
          <button
            @click="profileActiveTab = 'skills'"
            class="flex-1 py-1.5 rounded-lg transition text-center"
            :class="profileActiveTab === 'skills' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'"
          >
            🎯 技能測驗紀錄 ({{ studentProfileData.skills.length }})
          </button>
        </div>

        <!-- 內容展示區 -->
        <div class="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[180px]">
          <div v-if="isLoadingStudentProfile" class="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <span class="inline-block animate-spin text-base">⏳</span>
            <span>正在由雲端資料庫載入 {{ activeProfileStudent?.name }} 的歷史履歷...</span>
          </div>

          <!-- 子分頁 1：健康與態度詳細歷程 -->
          <div v-else-if="profileActiveTab === 'attitude'" class="space-y-2">
            <div v-if="studentProfileData.healthAttitudeLogs.length === 0" class="py-10 text-center text-slate-500 text-xs">
              目前尚無此學生的課堂健康與態度紀錄。<br/>
              每次課後速記同步後，系統將自動追加留存於此。
            </div>

            <div
              v-for="log in studentProfileData.healthAttitudeLogs"
              :key="log.LogId || log.logId || (log.Date + '_' + log.Timestamp)"
              class="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1.5 text-xs"
            >
              <div class="flex items-center justify-between flex-wrap gap-1.5">
                <div class="flex items-center gap-2">
                  <span class="font-mono font-bold text-emerald-400">📅 {{ formatDisplayDate(log.Date || log.date) }}</span>
                  <span
                    class="px-2 py-0.5 rounded-full text-[11px] font-bold border"
                    :class="(log.HealthStatus || log.healthStatus) === '見習' ? 'bg-amber-950/80 text-amber-300 border-amber-600/50' : ((log.HealthStatus || log.healthStatus) === '良好' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40' : 'bg-rose-950/80 text-rose-300 border-rose-600/50')"
                  >
                    {{ log.HealthStatus || log.healthStatus || '良好' }}
                  </span>
                </div>
                <div class="font-mono font-bold" :class="Number(log.NetAttitudeDelta !== undefined ? log.NetAttitudeDelta : (log.netAttitudeDelta || 0)) >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                  態度加減分：{{ Number(log.NetAttitudeDelta !== undefined ? log.NetAttitudeDelta : (log.netAttitudeDelta || 0)) > 0 ? '+' : '' }}{{ log.NetAttitudeDelta !== undefined ? log.NetAttitudeDelta : (log.netAttitudeDelta || 0) }} 分
                </div>
              </div>

              <!-- 行為項目標籤 -->
              <div class="flex flex-wrap gap-1 pt-0.5">
                <!-- 優良 -->
                <span
                  v-for="m in (log.Merits || log.merits ? String(log.Merits || log.merits).split(';').map(x => x.trim()).filter(Boolean) : [])"
                  :key="m"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-950/80 text-teal-300 border border-teal-700/60 text-[11px]"
                >
                  🌟 {{ m }} (+4)
                </span>
                <!-- 違規 -->
                <span
                  v-for="v in (log.Violations || log.violations ? String(log.Violations || log.violations).split(';').map(x => x.trim()).filter(Boolean) : [])"
                  :key="v"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-700/60 text-[11px]"
                >
                  ⚠️ {{ v }} (-4)
                </span>
              </div>

              <!-- 觀察筆記 -->
              <div v-if="log.ObservationNotes || log.observationNotes" class="text-slate-300 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <span class="text-slate-400 font-bold">備忘註記：</span>{{ log.ObservationNotes || log.observationNotes }}
              </div>
            </div>
          </div>

          <!-- 子分頁 2：體適能紀錄 -->
          <div v-else-if="profileActiveTab === 'fitness'" class="space-y-3">
            <div v-if="!studentProfileData.fitness" class="py-10 text-center text-slate-500 text-xs">
              尚未有體適能檢測紀錄。
            </div>
            <div v-else class="grid grid-cols-2 gap-2 text-xs">
              <div class="p-3 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                <span class="text-slate-400 font-bold">仰臥捲腹：</span>
                <div class="text-lg font-black font-mono text-emerald-400">
                  {{ studentProfileData.fitness.CurlUps || studentProfileData.fitness.curlUps || '-' }} 次
                </div>
              </div>
              <div class="p-3 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                <span class="text-slate-400 font-bold">坐姿體前彎：</span>
                <div class="text-lg font-black font-mono text-emerald-400">
                  {{ studentProfileData.fitness.SitAndReach || studentProfileData.fitness.sitAndReach || '-' }} cm
                </div>
              </div>
              <div class="p-3 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                <span class="text-slate-400 font-bold">立定跳遠：</span>
                <div class="text-lg font-black font-mono text-emerald-400">
                  {{ studentProfileData.fitness.StandingLongJump || studentProfileData.fitness.standingLongJump || '-' }} cm
                </div>
              </div>
              <div class="p-3 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                <span class="text-slate-400 font-bold">800m 跑走：</span>
                <div class="text-lg font-black font-mono text-emerald-400">
                  {{ studentProfileData.fitness.CardioRun || studentProfileData.fitness.cardioRun || '-' }} 秒
                </div>
              </div>
            </div>
          </div>

          <!-- 子分頁 3：技能測驗紀錄 -->
          <div v-else-if="profileActiveTab === 'skills'" class="space-y-2">
            <div v-if="studentProfileData.skills.length === 0" class="py-10 text-center text-slate-500 text-xs">
              尚未有技能測驗紀錄。
            </div>
            <div
              v-for="skill in studentProfileData.skills"
              :key="skill.ExamIndex || skill.examIndex"
              class="p-3 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between text-xs"
            >
              <div>
                <span class="text-slate-400 font-bold">測驗 {{ skill.ExamIndex || skill.examIndex }}：</span>
                <span class="font-bold text-white ml-1">{{ skill.ItemName || skill.itemName || '自訂項目' }}</span>
              </div>
              <div class="font-mono font-black text-emerald-400">
                {{ skill.IsExempt || skill.isExempt ? '免測' : (skill.RawValue || skill.rawValue || '-') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            @click="copyStudentSummaryText"
            class="active-press px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5"
            title="複製該學生期末評量摘要"
          >
            <span>📋 複製評量評語</span>
          </button>
          <button
            @click="showStudentProfileModal = false"
            class="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow"
          >
            關閉
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { STANDARD_VENUES } from '../services/mockData';
import { apiService, normalizeStudent, normalizeTimetableItem, normalizeCurriculumItem } from '../services/api';

const props = defineProps({
  students: {
    type: Array,
    default: () => []
  },
  timetable: {
    type: Array,
    default: () => []
  },
  curriculum: {
    type: Array,
    default: () => []
  },
  classes: {
    type: Array,
    default: () => ['五丁', '五戊', '六甲', '六乙']
  },
  recentLogs: {
    type: Array,
    default: () => []
  }
});

const adminLogClassFilter = ref('ALL');
const adminLogKeyword = ref('');

const filteredAdminLogs = computed(() => {
  let list = props.recentLogs || [];
  if (adminLogClassFilter.value && adminLogClassFilter.value !== 'ALL') {
    list = list.filter(l => String(l.classId || l.ClassId) === String(adminLogClassFilter.value));
  }
  if (adminLogKeyword.value.trim()) {
    const kw = adminLogKeyword.value.trim().toLowerCase();
    list = list.filter(l => 
      String(l.date || '').toLowerCase().includes(kw) ||
      String(l.actualContent || '').toLowerCase().includes(kw) ||
      String(l.voiceNotes || '').toLowerCase().includes(kw) ||
      String(l.classId || '').toLowerCase().includes(kw)
    );
  }
  return list;
});

function formatAdminTime(ts) {
  if (!ts) return '-';
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return String(ts);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch (e) {
    return String(ts);
  }
}

const emit = defineEmits([
  'save-students',
  'save-timetable',
  'save-curriculum',
  'toast'
]);

const activeSubTab = ref('students');
const isSaving = ref(false);
const curriculumGrade = ref(5); // 5 or 6

// 本地可編輯複本
const localStudents = ref([]);
const localTimetable = ref([]);
const localCurriculum = ref([]);
const localClasses = ref([]);
const selectedClass = ref('五丁');

// 同步傳入資料
watch(
  () => [props.students, props.timetable, props.curriculum, props.classes],
  () => {
    localStudents.value = (props.students || []).map(normalizeStudent);
    localTimetable.value = (props.timetable || []).map(normalizeTimetableItem);
    localCurriculum.value = (props.curriculum || []).map(normalizeCurriculumItem);
    localClasses.value = Array.from(new Set([
      ...(props.classes || []),
      ...localStudents.value.map(s => s.classId).filter(Boolean)
    ]));
    if (!localClasses.value.includes(selectedClass.value) && localClasses.value.length > 0) {
      selectedClass.value = localClasses.value[0];
    }
  },
  { immediate: true, deep: true }
);

const classList = computed(() => {
  return localClasses.value.length > 0 ? localClasses.value : ['五丁', '五戊', '六甲', '六乙'];
});

const studentFilterKeyword = ref('');

const currentClassStudents = computed(() => {
  let list = localStudents.value
    .filter(s => String(s.classId || s.ClassId) === String(selectedClass.value))
    .sort((a, b) => Number(a.seatNo || a.SeatNo || 0) - Number(b.seatNo || b.SeatNo || 0));

  if (studentFilterKeyword.value.trim()) {
    const kw = studentFilterKeyword.value.trim().toLowerCase();
    list = list.filter(s => 
      String(s.name || s.Name || '').toLowerCase().includes(kw) ||
      String(s.seatNo || s.SeatNo || '').includes(kw) ||
      String(s.studentId || s.StudentId || '').toLowerCase().includes(kw)
    );
  }
  return list;
});

function getStudentCountByClass(classId) {
  return localStudents.value.filter(s => String(s.classId || s.ClassId) === String(classId)).length;
}

// -------------------------------------------------------------
// 0. 學生個人歷史履歷查詢邏輯 (健康、態度、體適能、技能)
// -------------------------------------------------------------
const showStudentProfileModal = ref(false);
const activeProfileStudent = ref(null);
const isLoadingStudentProfile = ref(false);
const studentProfileData = ref({
  healthAttitudeLogs: [],
  fitness: null,
  skills: []
});
const profileActiveTab = ref('attitude'); // 'attitude' | 'fitness' | 'skills'

async function openStudentProfileModal(student) {
  activeProfileStudent.value = student;
  showStudentProfileModal.value = true;
  profileActiveTab.value = 'attitude';
  isLoadingStudentProfile.value = true;
  try {
    const res = await apiService.getStudentHistory(student.studentId || student.StudentId, student.classId || student.ClassId);
    if (res && res.success) {
      studentProfileData.value = {
        healthAttitudeLogs: res.healthAttitudeLogs || [],
        fitness: res.fitness || null,
        skills: res.skills || []
      };
    }
  } catch (e) {
    console.warn('載入學生履歷失敗:', e);
  } finally {
    isLoadingStudentProfile.value = false;
  }
}

function formatDisplayDate(val) {
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

const studentAttitudeSummary = computed(() => {
  const logs = studentProfileData.value.healthAttitudeLogs || [];
  let totalDelta = 0;
  let meritsCount = 0;
  let violationsCount = 0;
  let observeCount = 0;
  let sickCount = 0;

  logs.forEach(l => {
    const delta = Number(l.NetAttitudeDelta !== undefined ? l.NetAttitudeDelta : (l.netAttitudeDelta || 0));
    totalDelta += delta;

    const vList = (l.Violations || l.violations) ? String(l.Violations || l.violations).split(';').map(x => x.trim()).filter(Boolean) : [];
    violationsCount += vList.length;

    const mList = (l.Merits || l.merits) ? String(l.Merits || l.merits).split(';').map(x => x.trim()).filter(Boolean) : [];
    meritsCount += mList.length;

    const status = l.HealthStatus || l.healthStatus || '良好';
    if (status === '見習') observeCount++;
    if (status === '不適' || status === '受傷') sickCount++;
  });

  const rawScore = 100 + totalDelta;
  const finalScore = Math.max(60, Math.min(100, rawScore));

  return {
    baseScore: 100,
    totalDelta,
    finalScore,
    meritsCount,
    violationsCount,
    observeCount,
    sickCount,
    totalSessions: logs.length
  };
});

function copyStudentSummaryText() {
  const s = activeProfileStudent.value;
  if (!s) return;
  const sum = studentAttitudeSummary.value;
  const text = `${s.classId} ${s.seatNo}號 ${s.name}：學習態度總評 ${sum.finalScore} 分（基準100分，累計加扣分 ${sum.totalDelta >= 0 ? '+' : ''}${sum.totalDelta} 分）。本學期見習 ${sum.observeCount} 次、身體不適 ${sum.sickCount} 次。課堂表現${sum.finalScore >= 90 ? '優良主動' : (sum.finalScore >= 80 ? '良好穩定' : '尚可需再加強常規')}。`;
  navigator.clipboard.writeText(text);
  emit('toast', `📋 已複製 ${s.name} 的學習評量摘要至剪貼簿！`, 'success');
}

// -------------------------------------------------------------
// 1. 學生管理邏輯
// -------------------------------------------------------------
const showStudentModal = ref(false);
const isEditingStudent = ref(false);
const studentForm = ref({
  classId: '',
  studentId: '',
  seatNo: 1,
  name: '',
  gender: 'M',
  medicalNotes: ''
});

function openAddStudentModal() {
  isEditingStudent.value = false;
  const maxSeat = currentClassStudents.value.reduce((max, s) => Math.max(max, Number(s.seatNo || 0)), 0);
  studentForm.value = {
    classId: selectedClass.value,
    studentId: '',
    seatNo: maxSeat + 1,
    name: '',
    gender: 'M',
    medicalNotes: ''
  };
  showStudentModal.value = true;
}

function openEditStudentModal(student) {
  isEditingStudent.value = true;
  studentForm.value = {
    classId: student.classId || student.ClassId || selectedClass.value,
    studentId: student.studentId || student.StudentId,
    seatNo: student.seatNo !== undefined ? student.seatNo : student.SeatNo,
    name: student.name || student.Name,
    gender: student.gender || student.Gender || 'M',
    medicalNotes: student.medicalNotes !== undefined ? student.medicalNotes : (student.MedicalNotes || '')
  };
  showStudentModal.value = true;
}

function saveStudentForm() {
  if (!studentForm.value.name.trim()) {
    emit('toast', '請輸入學生姓名', 'error');
    return;
  }

  const generatedId = studentForm.value.studentId.trim() || `${studentForm.value.classId}${String(studentForm.value.seatNo).padStart(2, '0')}`;

  if (isEditingStudent.value) {
    const idx = localStudents.value.findIndex(s => (s.studentId || s.StudentId) === studentForm.value.studentId);
    if (idx > -1) {
      localStudents.value[idx] = normalizeStudent({
        ...localStudents.value[idx],
        seatNo: studentForm.value.seatNo,
        name: studentForm.value.name.trim(),
        gender: studentForm.value.gender,
        medicalNotes: studentForm.value.medicalNotes.trim()
      });
    }
  } else {
    const existSeat = currentClassStudents.value.find(s => Number(s.seatNo || s.SeatNo) === Number(studentForm.value.seatNo));
    if (existSeat) {
      emit('toast', `座號 ${studentForm.value.seatNo} 號已存在，請更換座號`, 'error');
      return;
    }
    localStudents.value.push(normalizeStudent({
      classId: studentForm.value.classId,
      studentId: generatedId,
      seatNo: studentForm.value.seatNo,
      name: studentForm.value.name.trim(),
      gender: studentForm.value.gender,
      age: (studentForm.value.classId.startsWith('5') || studentForm.value.classId.startsWith('五')) ? 11 : 12,
      medicalNotes: studentForm.value.medicalNotes.trim()
    }));
  }

  showStudentModal.value = false;
  emit('toast', `已儲存學生 ${studentForm.value.name}！`, 'success');
}

function deleteStudent(studentId) {
  if (confirm(`確定要刪除此位學生紀錄嗎？`)) {
    localStudents.value = localStudents.value.filter(s => (s.studentId || s.StudentId) !== studentId);
    emit('toast', '已刪除學生', 'success');
  }
}

// 新增班級
const showAddClassModal = ref(false);
const newClassName = ref('');
function confirmAddClass() {
  const name = newClassName.value.trim();
  if (!name) return;
  if (!localClasses.value.includes(name)) {
    localClasses.value.push(name);
    selectedClass.value = name;
    emit('toast', `班級 ${name} 建立成功！`, 'success');
  }
  newClassName.value = '';
  showAddClassModal.value = false;
}

// -------------------------------------------------------------
// 1-B. 範本下載與批次檔案上傳功能
// -------------------------------------------------------------
const fileInputRef = ref(null);
const showUploadPreviewModal = ref(false);
const uploadedFileName = ref('');
const uploadPreviewList = ref([]);

function triggerFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
    fileInputRef.value.click();
  }
}

function downloadStudentTemplate() {
  const headers = ['座號', '學生姓名', '性別(男/女)', '先天痼疾安全備忘(選填)'];
  const sampleRows = [
    ['1', '陳小明', '男', '輕微氣喘 (運動前自備吸入劑)'],
    ['2', '林大同', '男', ''],
    ['3', '張宇軒', '男', ''],
    ['4', '王品皓', '男', '心臟二尖瓣脫垂 (避免劇烈跑步)'],
    ['13', '黃婷萱', '女', '過敏性體質'],
    ['14', '林依晨', '女', '']
  ];

  // 加入 UTF-8 BOM (\uFEFF) 確保 Excel 雙擊開啟不亂碼
  const csvContent = '\uFEFF' + [
    headers.join(','),
    ...sampleRows.map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${selectedClass.value}_班級名冊範本.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  emit('toast', `已下載【${selectedClass.value}】名冊 CSV 範本，可用 Excel 編輯填寫！`, 'success');
}

function handleFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  uploadedFileName.value = file.name;
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const text = e.target.result;
      const parsed = parseStudentContent(text);
      if (parsed.length === 0) {
        emit('toast', '未能解析出有效學生資料，請確認檔案格式或有無標題列', 'error');
        return;
      }
      uploadPreviewList.value = parsed;
      showUploadPreviewModal.value = true;
    } catch (err) {
      console.error(err);
      emit('toast', '讀取檔案發生異常，請確認檔案編碼格式', 'error');
    }
  };

  reader.readAsText(file);
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseStudentContent(text) {
  if (!text) return [];
  // 移除 BOM
  const clean = text.replace(/^\uFEFF/, '');
  const lines = clean.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const list = [];
  let autoSeat = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 跳過標題列
    if (i === 0 && (line.includes('座號') || line.includes('姓名') || line.toLowerCase().includes('seat') || line.toLowerCase().includes('name'))) {
      continue;
    }

    let cols = [];
    if (line.includes('\t')) {
      cols = line.split('\t');
    } else if (line.includes(',')) {
      cols = parseCsvLine(line);
    } else {
      cols = line.split(/\s+/);
    }

    cols = cols.map(c => (c || '').trim().replace(/^"|"$/g, ''));
    if (cols.length >= 2) {
      const seat = parseInt(cols[0], 10) || autoSeat;
      const name = cols[1];
      const gender = (cols[2] === '女' || cols[2] === 'F' || cols[2] === 'f') ? 'F' : 'M';
      const med = cols.slice(3).join(' ') || '';

      if (name) {
        list.push({
          seatNo: seat,
          name,
          gender,
          medicalNotes: med
        });
        autoSeat = Math.max(autoSeat, seat) + 1;
      }
    }
  }

  return list.sort((a, b) => a.seatNo - b.seatNo);
}

function confirmUploadImport() {
  if (uploadPreviewList.value.length === 0) return;

  const targetClass = selectedClass.value;
  const isGrade5 = targetClass.startsWith('5') || targetClass.startsWith('五');
  const count = uploadPreviewList.value.length;

  uploadPreviewList.value.forEach(item => {
    const seat = item.seatNo;
    const stdId = `${targetClass}${String(seat).padStart(2, '0')}`;
    localStudents.value = localStudents.value.filter(
      s => !(String(s.classId) === String(targetClass) && Number(s.seatNo) === seat)
    );

    localStudents.value.push({
      classId: targetClass,
      studentId: stdId,
      seatNo: seat,
      name: item.name,
      gender: item.gender,
      age: isGrade5 ? 11 : 12,
      medicalNotes: item.medicalNotes || ''
    });
  });

  showUploadPreviewModal.value = false;
  uploadPreviewList.value = [];
  emit('toast', `🎉 成功將 ${count} 位學生資料匯入至【${targetClass}】！請點擊「💾 儲存名冊」！`, 'success');
}

// 批次貼上匯入
const showBatchImportModal = ref(false);
const batchImportText = ref('');
function confirmBatchImport() {
  const parsed = parseStudentContent(batchImportText.value);
  if (parsed.length === 0) {
    emit('toast', '未輸入有效學生文字資料，請確認格式', 'error');
    return;
  }

  const targetClass = selectedClass.value;
  const isGrade5 = targetClass.startsWith('5') || targetClass.startsWith('五');
  const addedCount = parsed.length;

  parsed.forEach((item) => {
    const seat = item.seatNo;
    const stdId = `${targetClass}${String(seat).padStart(2, '0')}`;
    localStudents.value = localStudents.value.filter(
      s => !(String(s.classId) === String(targetClass) && Number(s.seatNo) === seat)
    );

    localStudents.value.push({
      classId: targetClass,
      studentId: stdId,
      seatNo: seat,
      name: item.name,
      gender: item.gender,
      age: isGrade5 ? 11 : 12,
      medicalNotes: item.medicalNotes || ''
    });
  });

  batchImportText.value = '';
  showBatchImportModal.value = false;
  emit('toast', `成功貼上匯入 ${addedCount} 筆學生至 ${targetClass}！請記得點擊「💾 儲存名冊」！`, 'success');
}

async function saveStudentsData() {
  isSaving.value = true;
  emit('save-students', localStudents.value);
  setTimeout(() => isSaving.value = false, 600);
}

// -------------------------------------------------------------
// 2. 課表管理邏輯 (1 至 7 節)
// -------------------------------------------------------------
const showEditLessonModal = ref(false);
const lessonForm = ref({
  dayOfWeek: 1,
  period: 1,
  classId: '',
  location: ''
});

function getTimetableEntry(day, period) {
  return localTimetable.value.find(t => Number(t.dayOfWeek) === Number(day) && Number(t.period) === Number(period));
}

function getPeriodDefaultTime(p) {
  const times = {
    1: '08:40~09:20',
    2: '09:30~10:10',
    3: '10:30~11:10',
    4: '11:20~12:00',
    5: '13:20~14:00',
    6: '14:10~14:50',
    7: '15:10~15:50'
  };
  return times[p] || '';
}

function openEditLessonModal(day, period) {
  const entry = getTimetableEntry(day, period);
  lessonForm.value = {
    dayOfWeek: day,
    period,
    classId: entry ? entry.classId : selectedClass.value,
    location: entry ? entry.location : '操場'
  };
  showEditLessonModal.value = true;
}

function saveLessonForm() {
  localTimetable.value = localTimetable.value.filter(
    t => !(Number(t.dayOfWeek) === Number(lessonForm.value.dayOfWeek) && Number(t.period) === Number(lessonForm.value.period))
  );

  if (lessonForm.value.classId) {
    localTimetable.value.push({
      dayOfWeek: Number(lessonForm.value.dayOfWeek),
      period: Number(lessonForm.value.period),
      classId: lessonForm.value.classId,
      location: lessonForm.value.location.trim() || '操場'
    });
  }

  showEditLessonModal.value = false;
  emit('toast', `週課表節次已更新`, 'success');
}

function clearCurrentLesson() {
  localTimetable.value = localTimetable.value.filter(
    t => !(Number(t.dayOfWeek) === Number(lessonForm.value.dayOfWeek) && Number(t.period) === Number(lessonForm.value.period))
  );
  showEditLessonModal.value = false;
  emit('toast', `已清空此節課堂`, 'success');
}

async function saveTimetableData() {
  isSaving.value = true;
  emit('save-timetable', localTimetable.value);
  setTimeout(() => isSaving.value = false, 600);
}

// -------------------------------------------------------------
// 3. 上課進度與課程規劃管理 (五上 / 六上)
// -------------------------------------------------------------
const filteredCurriculum = computed(() => {
  return localCurriculum.value
    .filter(c => (c.grade ? Number(c.grade) === curriculumGrade.value : true))
    .sort((a, b) => Number(a.weekNo) - Number(b.weekNo));
});

function addNewWeekPlan() {
  const currentList = filteredCurriculum.value;
  const maxWeek = currentList.reduce((max, c) => Math.max(max, Number(c.weekNo || 0)), 0);
  localCurriculum.value.push({
    grade: curriculumGrade.value,
    weekNo: maxWeek + 1,
    unitTitle: `第 ${maxWeek + 1} 週體育單元`,
    suggestedContent: '單元基礎技能與分組實戰',
    venue: '體育館',
    keyFocus: '動作規範與安全防護',
    evalMethod: '技能操作70% 學習態度20% 體育常識10%'
  });
  emit('toast', `已新增${curriculumGrade.value}年級第 ${maxWeek + 1} 週進度計畫`, 'success');
}

function deleteWeekPlan(plan) {
  if (confirm(`確定要刪除此週次的進度計畫嗎？`)) {
    const idx = localCurriculum.value.findIndex(
      c => c.weekNo === plan.weekNo && (c.grade ? c.grade === plan.grade : true)
    );
    if (idx > -1) {
      localCurriculum.value.splice(idx, 1);
      emit('toast', `已刪除週次進度`, 'success');
    }
  }
}

async function saveCurriculumData() {
  isSaving.value = true;
  emit('save-curriculum', localCurriculum.value);
  setTimeout(() => isSaving.value = false, 600);
}
</script>
