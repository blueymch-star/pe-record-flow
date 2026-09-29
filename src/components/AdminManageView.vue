<template>
  <div class="space-y-5">
    <!-- 後台主 Header 與次選單切換 -->
    <div class="glass-panel p-4 rounded-2xl border border-slate-700/80 space-y-3">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <span>🛠️ 體育教學管理後台</span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
              全域設定
            </span>
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">
            維護班級名冊與轉學生、排定全週課表、編輯各週教學單元進度
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="activeSubTab = 'students'"
            class="active-press px-3 py-1.5 rounded-xl text-xs font-black transition border"
            :class="activeSubTab === 'students' ? 'bg-emerald-600 text-white border-emerald-400 shadow' : 'bg-slate-800 text-slate-300 border-slate-700'"
          >
            👥 班級名冊
          </button>
          <button
            @click="activeSubTab = 'timetable'"
            class="active-press px-3 py-1.5 rounded-xl text-xs font-black transition border"
            :class="activeSubTab === 'timetable' ? 'bg-emerald-600 text-white border-emerald-400 shadow' : 'bg-slate-800 text-slate-300 border-slate-700'"
          >
            📅 週課表
          </button>
          <button
            @click="activeSubTab = 'curriculum'"
            class="active-press px-3 py-1.5 rounded-xl text-xs font-black transition border"
            :class="activeSubTab === 'curriculum' ? 'bg-emerald-600 text-white border-emerald-400 shadow' : 'bg-slate-800 text-slate-300 border-slate-700'"
          >
            📚 教學進度
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
        <div class="flex items-center gap-2.5 w-full sm:w-auto">
          <label class="text-xs font-bold text-slate-300 whitespace-nowrap">目前管理班級：</label>
          <select
            v-model="selectedClass"
            class="bg-slate-800 text-white font-bold text-sm rounded-xl px-3 py-2 border border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option v-for="c in classList" :key="c" :value="c">
              {{ c }} 班 ({{ getStudentCountByClass(c) }} 人)
            </option>
          </select>

          <!-- 新增班級按鈕 -->
          <button
            @click="showAddClassModal = true"
            class="active-press px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold"
            title="新增班級"
          >
            ➕ 新增班級
          </button>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            @click="showBatchImportModal = true"
            class="active-press px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5"
          >
            <span>📋 批次貼上匯入</span>
          </button>

          <button
            @click="openAddStudentModal"
            class="active-press px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 shadow"
          >
            <span>➕ 新增學生 (轉學生)</span>
          </button>

          <button
            @click="saveStudentsData"
            :disabled="isSaving"
            class="active-press disabled:opacity-50 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black flex items-center gap-1.5 shadow-lg"
          >
            <span>💾 儲存名冊</span>
          </button>
        </div>
      </div>

      <!-- 學生列表表格 -->
      <div class="glass-panel rounded-2xl border border-slate-700/80 p-3 overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead>
            <tr class="border-b border-slate-700 text-slate-400 font-bold">
              <th class="py-2.5 px-2 w-16 text-center">座號</th>
              <th class="py-2.5 px-3">學生姓名</th>
              <th class="py-2.5 px-2 w-16 text-center">性別</th>
              <th class="py-2.5 px-3">學號 (主鍵)</th>
              <th class="py-2.5 px-3">先天痼疾安全備忘 (氣喘/心臟病等)</th>
              <th class="py-2.5 px-2 w-24 text-center">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr
              v-for="student in currentClassStudents"
              :key="student.studentId"
              class="hover:bg-slate-800/40 transition"
            >
              <td class="py-2 px-2 text-center font-mono font-black text-emerald-400">
                {{ student.seatNo }}
              </td>
              <td class="py-2 px-3 font-bold text-white">
                {{ student.name }}
              </td>
              <td class="py-2 px-2 text-center font-semibold" :class="student.gender === 'M' ? 'text-blue-300' : 'text-pink-300'">
                {{ student.gender === 'M' ? '男' : '女' }}
              </td>
              <td class="py-2 px-3 font-mono text-slate-400">
                {{ student.studentId }}
              </td>
              <td class="py-2 px-3">
                <span v-if="student.medicalNotes" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-950/60 text-red-300 border border-red-800/50 text-[11px] font-semibold">
                  ❤️ {{ student.medicalNotes }}
                </span>
                <span v-else class="text-slate-600">-</span>
              </td>
              <td class="py-2 px-2 text-center">
                <div class="flex items-center justify-center gap-1.5">
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
    <!-- 子分頁 2：週課表設定 -->
    <!-- ========================================================================= -->
    <div v-show="activeSubTab === 'timetable'" class="space-y-4">
      <div class="glass-panel p-4 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 class="text-sm font-bold text-white">體育週課表編輯 (週一至週五，第 1 至第 5 節)</h3>
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

      <!-- 週課表矩陣編輯器 -->
      <div class="glass-panel rounded-2xl border border-slate-700/80 p-4">
        <div class="grid grid-cols-6 gap-2 text-center text-xs font-bold mb-2">
          <div class="py-2 rounded bg-slate-800/80 text-slate-400">節次</div>
          <div v-for="d in 5" :key="d" class="py-2 rounded bg-slate-800/80 text-slate-200">
            週{{ ['一', '二', '三', '四', '五'][d - 1] }}
          </div>
        </div>

        <div class="space-y-2">
          <div v-for="period in [1, 2, 3, 4, 5]" :key="period" class="grid grid-cols-6 gap-2">
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
              class="min-h-[64px] rounded-xl p-2 border flex flex-col justify-center items-center text-center cursor-pointer active-press transition"
              :class="getTimetableEntry(day, period)
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 hover:border-emerald-400'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-600'"
            >
              <template v-if="getTimetableEntry(day, period)">
                <span class="font-black text-sm text-emerald-300">
                  {{ getTimetableEntry(day, period).classId }} 班
                </span>
                <span class="text-[11px] text-slate-300 truncate max-w-full">
                  {{ getTimetableEntry(day, period).location || '未設地點' }}
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
    <!-- 子分頁 3：上課進度與課程規劃 -->
    <!-- ========================================================================= -->
    <div v-show="activeSubTab === 'curriculum'" class="space-y-4">
      <div class="glass-panel p-4 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 class="text-sm font-bold text-white">體育教學進度與評量檢核計畫</h3>
          <p class="text-xs text-slate-400 mt-0.5">自訂全學期各週單元主題、建議內容與檢核重點，首頁自動指引</p>
        </div>

        <div class="flex items-center gap-2">
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

      <!-- 週次列表 -->
      <div class="space-y-3">
        <div
          v-for="(plan, idx) in localCurriculum"
          :key="plan.weekNo"
          class="glass-panel rounded-2xl border border-slate-700/80 p-4 space-y-3"
        >
          <div class="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 font-black flex items-center justify-center text-xs border border-emerald-500/30">
                W{{ plan.weekNo }}
              </span>
              <span class="text-xs font-bold text-slate-400">第 {{ plan.weekNo }} 週課程單元</span>
            </div>

            <button
              @click="deleteWeekPlan(idx)"
              class="p-1 rounded-lg text-slate-500 hover:text-red-400 text-xs"
              title="刪除此週"
            >
              🗑️ 刪除
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">單元名稱：</label>
              <input
                v-model="plan.unitTitle"
                type="text"
                class="w-full bg-slate-800 text-slate-100 text-xs font-bold rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="例：立定跳遠與下肢爆發力"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">建議教學活動內容：</label>
              <input
                v-model="plan.suggestedContent"
                type="text"
                class="w-full bg-slate-800 text-slate-100 text-xs font-bold rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="例：雙腳同時起跳落地動作分析、連續跳躍"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">評量檢核重點：</label>
              <input
                v-model="plan.keyFocus"
                type="text"
                class="w-full bg-slate-800 text-slate-100 text-xs font-bold rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="例：起跳膝關節屈曲角度、落地緩衝"
              />
            </div>
          </div>
        </div>
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
              placeholder="例：50199"
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
        <h3 class="font-black text-sm text-white">➕ 新增班級代號</h3>
        <div>
          <label class="block text-[11px] font-bold text-slate-400 mb-1">班級代號 (例：503、603)：</label>
          <input
            v-model="newClassName"
            type="text"
            placeholder="請輸入班級代號"
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
            <h3 class="font-black text-sm text-white">📋 批次貼上匯入至 {{ selectedClass }} 班</h3>
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
            placeholder="例：&#10;1  陳小明  男  輕微氣喘&#10;2  林大同  男&#10;21 林依晨  女"
          ></textarea>
        </div>

        <div class="pt-2 flex items-center justify-end gap-2">
          <button @click="showBatchImportModal = false" class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400">取消</button>
          <button @click="confirmBatchImport" class="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow">開始匯入</button>
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
              <option v-for="c in classList" :key="c" :value="c">{{ c }} 班</option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-400 mb-1">上課地點：</label>
            <input
              v-model="lessonForm.location"
              type="text"
              placeholder="例：操場跑道、風雨球場、活動中心"
              class="w-full bg-slate-800 text-slate-100 text-xs font-bold rounded-xl p-2.5 border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
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

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

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
    default: () => ['501', '502', '601', '602']
  }
});

const emit = defineEmits([
  'save-students',
  'save-timetable',
  'save-curriculum',
  'toast'
]);

const activeSubTab = ref('students');
const isSaving = ref(false);

// 本地可編輯複本
const localStudents = ref([]);
const localTimetable = ref([]);
const localCurriculum = ref([]);
const localClasses = ref([]);
const selectedClass = ref('501');

// 同步傳入資料
watch(
  () => [props.students, props.timetable, props.curriculum, props.classes],
  () => {
    localStudents.value = JSON.parse(JSON.stringify(props.students || []));
    localTimetable.value = JSON.parse(JSON.stringify(props.timetable || []));
    localCurriculum.value = JSON.parse(JSON.stringify(props.curriculum || []));
    localClasses.value = Array.from(new Set([
      ...(props.classes || []),
      ...localStudents.value.map(s => s.classId || s.ClassId).filter(Boolean)
    ]));
    if (!localClasses.value.includes(selectedClass.value) && localClasses.value.length > 0) {
      selectedClass.value = localClasses.value[0];
    }
  },
  { immediate: true, deep: true }
);

const classList = computed(() => {
  return localClasses.value.length > 0 ? localClasses.value : ['501', '502', '601', '602'];
});

const currentClassStudents = computed(() => {
  return localStudents.value
    .filter(s => String(s.classId || s.ClassId) === String(selectedClass.value))
    .sort((a, b) => Number(a.seatNo) - Number(b.seatNo));
});

function getStudentCountByClass(classId) {
  return localStudents.value.filter(s => String(s.classId || s.ClassId) === String(classId)).length;
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
  // 自動推薦下一個座號
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
    classId: student.classId || selectedClass.value,
    studentId: student.studentId,
    seatNo: student.seatNo,
    name: student.name,
    gender: student.gender || 'M',
    medicalNotes: student.medicalNotes || ''
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
    const idx = localStudents.value.findIndex(s => s.studentId === studentForm.value.studentId);
    if (idx > -1) {
      localStudents.value[idx] = {
        ...localStudents.value[idx],
        seatNo: studentForm.value.seatNo,
        name: studentForm.value.name.trim(),
        gender: studentForm.value.gender,
        medicalNotes: studentForm.value.medicalNotes.trim()
      };
    }
  } else {
    // 檢查學號或座號是否重複
    const existSeat = currentClassStudents.value.find(s => Number(s.seatNo) === Number(studentForm.value.seatNo));
    if (existSeat) {
      emit('toast', `座號 ${studentForm.value.seatNo} 號已存在，請更換座號`, 'error');
      return;
    }
    localStudents.value.push({
      classId: studentForm.value.classId,
      studentId: generatedId,
      seatNo: studentForm.value.seatNo,
      name: studentForm.value.name.trim(),
      gender: studentForm.value.gender,
      age: 11,
      medicalNotes: studentForm.value.medicalNotes.trim()
    });
  }

  showStudentModal.value = false;
  emit('toast', `已儲存學生 ${studentForm.value.name}！`, 'success');
}

function deleteStudent(studentId) {
  if (confirm(`確定要刪除此位學生紀錄嗎？`)) {
    localStudents.value = localStudents.value.filter(s => s.studentId !== studentId);
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

// 批次匯入
const showBatchImportModal = ref(false);
const batchImportText = ref('');
function confirmBatchImport() {
  const lines = batchImportText.value.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return;

  let addedCount = 0;
  lines.forEach((line) => {
    // 支援 Tab 或多個空白分隔
    const parts = line.split(/[\t\s]+/);
    if (parts.length >= 2) {
      const seat = parseInt(parts[0], 10) || (addedCount + 1);
      const name = parts[1];
      const gender = (parts[2] === '女' || parts[2] === 'F') ? 'F' : 'M';
      const med = parts.slice(3).join(' ') || '';

      const stdId = `${selectedClass.value}${String(seat).padStart(2, '0')}`;
      // 移除原座號如果存在
      localStudents.value = localStudents.value.filter(
        s => !(String(s.classId) === String(selectedClass.value) && Number(s.seatNo) === seat)
      );

      localStudents.value.push({
        classId: selectedClass.value,
        studentId: stdId,
        seatNo: seat,
        name,
        gender,
        age: 11,
        medicalNotes: med
      });
      addedCount++;
    }
  });

  batchImportText.value = '';
  showBatchImportModal.value = false;
  emit('toast', `成功匯入 ${addedCount} 筆學生至 ${selectedClass.value} 班！`, 'success');
}

async function saveStudentsData() {
  isSaving.value = true;
  emit('save-students', localStudents.value);
  setTimeout(() => isSaving.value = false, 600);
}

// -------------------------------------------------------------
// 2. 課表管理邏輯
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
    1: '08:35~09:15',
    2: '09:25~10:05',
    3: '10:20~11:00',
    4: '11:10~11:50',
    5: '13:20~14:00'
  };
  return times[p] || '';
}

function openEditLessonModal(day, period) {
  const entry = getTimetableEntry(day, period);
  lessonForm.value = {
    dayOfWeek: day,
    period,
    classId: entry ? entry.classId : selectedClass.value,
    location: entry ? entry.location : '操場跑道'
  };
  showEditLessonModal.value = true;
}

function saveLessonForm() {
  // 移除既有節次
  localTimetable.value = localTimetable.value.filter(
    t => !(Number(t.dayOfWeek) === Number(lessonForm.value.dayOfWeek) && Number(t.period) === Number(lessonForm.value.period))
  );

  if (lessonForm.value.classId) {
    localTimetable.value.push({
      dayOfWeek: Number(lessonForm.value.dayOfWeek),
      period: Number(lessonForm.value.period),
      classId: lessonForm.value.classId,
      location: lessonForm.value.location.trim() || '操場跑道'
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
// 3. 上課進度與課程規劃管理
// -------------------------------------------------------------
function addNewWeekPlan() {
  const maxWeek = localCurriculum.value.reduce((max, c) => Math.max(max, Number(c.weekNo || 0)), 0);
  localCurriculum.value.push({
    weekNo: maxWeek + 1,
    unitTitle: `第 ${maxWeek + 1} 週體育單元`,
    suggestedContent: '單元基礎技能與分組實戰',
    keyFocus: '動作規範與安全防護'
  });
  emit('toast', `已新增第 ${maxWeek + 1} 週進度計畫`, 'success');
}

function deleteWeekPlan(index) {
  if (confirm(`確定要刪除此週次的進度計畫嗎？`)) {
    localCurriculum.value.splice(index, 1);
    emit('toast', `已刪除週次進度`, 'success');
  }
}

async function saveCurriculumData() {
  isSaving.value = true;
  emit('save-curriculum', localCurriculum.value);
  setTimeout(() => isSaving.value = false, 600);
}
</script>
