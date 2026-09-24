<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col max-w-2xl mx-auto pb-24 shadow-2xl relative font-sans">
    
    <!-- 頂部 Header -->
    <header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 shadow-md">
          ⚡
        </div>
        <div>
          <h1 class="font-black text-base tracking-tight leading-tight flex items-center gap-1.5">
            <span>PE Record Flow</span>
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">v4.0</span>
          </h1>
          <p class="text-[11px] text-slate-400">
            目前班級：<span class="font-bold text-emerald-300">{{ selectedClassId }} 班</span> (共 {{ currentStudents.length }} 人)
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- 離線 / 連線狀態指示 -->
        <span
          class="text-[11px] font-semibold px-2 py-1 rounded-full border flex items-center gap-1"
          :class="isOnline ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-amber-950/60 border-amber-500/40 text-amber-300'"
        >
          <span class="w-2 h-2 rounded-full" :class="isOnline ? 'bg-emerald-400' : 'bg-amber-400'"></span>
          {{ isOnline ? '已就緒' : '離線暫存' }}
        </span>

        <!-- 設定 GAS URL 按鈕 -->
        <button
          @click="showSettingsModal = true"
          class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          title="系統設定"
        >
          ⚙️
        </button>
      </div>
    </header>

    <!-- 主要內容區 -->
    <main class="flex-1 p-4 space-y-5">

      <!-- 分頁導航列 (Tab Navigation) -->
      <nav class="grid grid-cols-4 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold">
        <button
          @click="currentTab = 'home'"
          class="py-2.5 rounded-lg transition text-center"
          :class="currentTab === 'home' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'"
        >
          🏠 首頁課表
        </button>
        <button
          @click="currentTab = 'record'"
          class="py-2.5 rounded-lg transition text-center"
          :class="currentTab === 'record' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'"
        >
          📋 速記網格
        </button>
        <button
          @click="currentTab = 'fitness'"
          class="py-2.5 rounded-lg transition text-center"
          :class="currentTab === 'fitness' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'"
        >
          🏃 體能連打
        </button>
        <button
          @click="currentTab = 'voice'"
          class="py-2.5 rounded-lg transition text-center"
          :class="currentTab === 'voice' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'"
        >
          🎙️ 語音日誌
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

      <!-- 視圖 2: 手機端大按鈕座號網格與速記 -->
      <div v-show="currentTab === 'record'" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-1.5">
              <span>{{ selectedClassId }} 班 課後 10 分鐘速記</span>
            </h2>
            <p class="text-xs text-slate-400">點擊座號可記態度 ±4 分，右上方愛心為先天痼疾警示</p>
          </div>
          <button
            @click="quickArchiveAll"
            class="active-press bg-emerald-700/60 hover:bg-emerald-600 text-emerald-200 text-xs font-bold px-3 py-2 rounded-lg border border-emerald-500/50 flex items-center gap-1 shadow"
          >
            <span>⚡ 全班正常歸檔</span>
          </button>
        </div>

        <SeatGrid
          :students="currentStudents"
          :health-records="healthRecords"
          :attitude-records="attitudeRecords"
          @update-health="handleUpdateHealth"
          @open-attitude-drawer="handleOpenAttitudeDrawer"
        />
      </div>

      <!-- 視圖 3: 體適能檢測概覽與啟動連打 -->
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

        <!-- 體適能檢測即時清單 -->
        <div class="glass-panel rounded-2xl border border-slate-700/80 p-3 overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="border-b border-slate-700 text-slate-400 font-bold">
                <th class="py-2 px-1">座號</th>
                <th class="py-2 px-2">姓名</th>
                <th class="py-2 px-2">仰臥捲腹</th>
                <th class="py-2 px-2">坐姿體前彎</th>
                <th class="py-2 px-2">立定跳遠</th>
                <th class="py-2 px-2">800m跑走</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr v-for="s in currentStudents" :key="s.studentId" class="hover:bg-slate-800/40">
                <td class="py-2 px-1 font-mono font-bold text-emerald-400">{{ s.seatNo }}</td>
                <td class="py-2 px-2 font-bold">{{ s.name }}</td>
                <td class="py-2 px-2">{{ getFitnessCell(s.studentId, 'CurlUps') }}</td>
                <td class="py-2 px-2">{{ getFitnessCell(s.studentId, 'SitAndReach') }}</td>
                <td class="py-2 px-2">{{ getFitnessCell(s.studentId, 'StandingLongJump') }}</td>
                <td class="py-2 px-2">{{ getFitnessCell(s.studentId, 'CardioRun') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 視圖 4: 語音備忘錄 (Web Speech API) -->
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

          <!-- 辨識結果顯示區 -->
          <div class="text-left bg-slate-900/90 rounded-xl p-3 border border-slate-700">
            <label class="block text-xs font-bold text-slate-400 mb-1">即時口述辨識內容：</label>
            <textarea
              v-model="voiceNoteText"
              rows="4"
              class="w-full bg-transparent text-sm text-slate-100 focus:outline-none resize-none"
              placeholder="口述內容將即時顯示於此，例如：「今日501班進行立定跳遠第二次測驗，整體起跳擺臂動作良好...」"
            ></textarea>
          </div>
        </div>
      </div>

    </main>

    <!-- 底部固定儲存浮動列 (課後 10 分鐘一鍵批次同步) -->
    <div class="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 max-w-2xl mx-auto flex items-center justify-between gap-3">
      <div class="text-xs text-slate-400">
        <span class="font-bold text-white">{{ selectedClassId }} 班速記</span>
        <span class="ml-1 text-[11px]">異動 {{ unsavedCount }} 筆</span>
      </div>

      <button
        @click="handleBatchSaveToGAS"
        :disabled="isSaving"
        class="active-press disabled:opacity-50 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
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

        <div class="space-y-3">
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
import { ref, computed, onMounted } from 'vue';
import SmartTimetable from './components/SmartTimetable.vue';
import SeatGrid from './components/SeatGrid.vue';
import AttitudeDrawer from './components/AttitudeDrawer.vue';
import NumberPadInput from './components/NumberPadInput.vue';
import { apiService } from './services/api';

const currentTab = ref('home');
const selectedClassId = ref('501');
const currentPeriod = ref(2);

const isOnline = ref(navigator.onLine);
const isSaving = ref(false);
const showSettingsModal = ref(false);
const gasUrlInput = ref(apiService.getGasUrl());

const isAttitudeDrawerOpen = ref(false);
const activeAttitudeStudent = ref(null);
const isKeypadOpen = ref(false);

const toastMessage = ref('');
const toastType = ref('success');

// 初始資料集合
const bootstrapData = ref({
  classes: ['501', '502', '601', '602'],
  students: [],
  timetable: [],
  curriculum: [],
  norms: []
});

// 當前速記資料模型
const healthRecords = ref({}); // { [studentId]: '良好' | '不適' | '見習' }
const attitudeRecords = ref({}); // { [studentId]: { netDelta: 0, violations: [], merits: [], observationNotes: '' } }
const fitnessRecords = ref({}); // { [itemId]: { [studentId]: { rawValue, isExempt } } }
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
  return hCount + aCount + fCount + (voiceNoteText.value ? 1 : 0);
});

onMounted(async () => {
  window.addEventListener('online', () => isOnline.value = true);
  window.addEventListener('offline', () => isOnline.value = false);

  const data = await apiService.getBootstrapData();
  if (data) {
    bootstrapData.value = data;
    // 預設全班健康狀態為「良好」
    initDefaultHealth(selectedClassId.value);
  }
});

function initDefaultHealth(classId) {
  const studs = bootstrapData.value.students.filter(s => String(s.classId) === String(classId));
  const initH = {};
  studs.forEach(s => {
    initH[s.studentId] = '良好';
  });
  healthRecords.value = initH;
}

function handleSelectClass({ classId, period }) {
  selectedClassId.value = classId;
  if (period) currentPeriod.value = period;
  initDefaultHealth(classId);
  currentTab.value = 'record';
  showToast(`已切換至 ${classId} 班 (第 ${period || 2} 節)`, 'success');
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

  const payload = {
    dailyLog: {
      date: new Date().toLocaleDateString('sv'), // YYYY-MM-DD
      period: currentPeriod.value,
      classId: selectedClassId.value,
      actualContent: '常規檢核、體能評量與運動常規表現',
      voiceNotes: voiceNoteText.value
    },
    healthAttitudeList,
    fitnessList
  };

  try {
    const res = await apiService.saveClassSession(payload);
    if (res && res.success) {
      showToast(res.message || '課堂紀錄與學生成績已批次同步完成！', 'success');
    } else {
      showToast('同步失敗: ' + (res?.error || '請檢查網路連線'), 'error');
    }
  } catch (err) {
    showToast('連線異常，已暫存於離線佇列', 'error');
  } finally {
    isSaving.value = false;
  }
}

// 語音識別 (Web Speech API)
let recognition = null;
function toggleSpeechRecognition() {
  if (isRecording.value) {
    if (recognition) recognition.stop();
    isRecording.value = false;
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('此瀏覽器不支援 Web Speech API，請直接輸入文字備忘', 'error');
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'zh-TW';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    isRecording.value = true;
    showToast('語音辨識中，請開始口述...', 'success');
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    voiceNoteText.value = (voiceNoteText.value ? voiceNoteText.value + ' ' : '') + transcript;
  };

  recognition.onerror = (e) => {
    console.warn('Speech recognition error:', e);
    isRecording.value = false;
  };

  recognition.onend = () => {
    isRecording.value = false;
  };

  recognition.start();
}

function saveSettings() {
  apiService.setGasUrl(gasUrlInput.value);
  showSettingsModal.value = false;
  showToast('GAS 伺服器網址已更新！', 'success');
}

function showToast(msg, type = 'success') {
  toastMessage.value = msg;
  toastType.value = type;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3200);
}
</script>
