<template>
  <div class="space-y-4">
    <!-- 頂部卡片：4 次技能測驗切換與自訂項目名稱 -->
    <div class="glass-panel p-4 rounded-2xl border border-slate-700/80 space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <span>🎯 技能測驗輸入模式</span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/40">
              佔學期總成績 70%
            </span>
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">
            共 4 次技能測驗，支援自訂項目、純數字鍵盤連打、免測自動扣減分母
          </p>
        </div>

        <button
          @click="openKeypadForSkillExam"
          class="active-press bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-3.5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5"
        >
          <span>⚡ 啟動數字連打</span>
        </button>
      </div>

      <!-- 4 次測驗標籤切換 (Exam 1 ~ 4) -->
      <div class="grid grid-cols-4 gap-2 pt-1">
        <button
          v-for="idx in 4"
          :key="idx"
          @click="currentExamIndex = idx"
          class="py-2.5 rounded-xl text-xs font-black transition border text-center relative overflow-hidden"
          :class="currentExamIndex === idx
            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'"
        >
          <span>第 {{ idx }} 次測驗</span>
          <!-- 完成度指示條 -->
          <div
            class="absolute bottom-0 left-0 h-1 bg-emerald-400 transition-all duration-300"
            :style="{ width: getExamProgressPercent(idx) + '%' }"
          ></div>
        </button>
      </div>

      <!-- 當前測驗自訂項目設定 -->
      <div class="bg-slate-850/80 rounded-xl p-3 border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div class="flex-1 w-full sm:w-auto">
          <label class="block text-[11px] font-bold text-slate-400 mb-1">
            測驗項目名稱與單位 (可自由自訂)：
          </label>
          <div class="flex items-center gap-2">
            <input
              v-model="examSettings[currentExamIndex].itemName"
              type="text"
              class="flex-1 bg-slate-900 text-slate-100 text-xs font-bold rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="例：運球繞錐上籃"
            />
            <input
              v-model="examSettings[currentExamIndex].unit"
              type="text"
              class="w-20 bg-slate-900 text-slate-100 text-xs font-bold rounded-lg px-2.5 py-2 border border-slate-600 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="單位 (分/秒/次)"
            />
          </div>
        </div>

        <!-- 簡易統計 -->
        <div class="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 self-stretch sm:self-auto justify-around">
          <div>
            <span class="text-slate-400 text-[10px] block">已登錄</span>
            <span class="font-mono font-black text-emerald-400">{{ getRecordedCount(currentExamIndex) }} / {{ students.length }}</span>
          </div>
          <div class="w-px h-6 bg-slate-700"></div>
          <div>
            <span class="text-slate-400 text-[10px] block">免測人數</span>
            <span class="font-mono font-black text-purple-400">{{ getExemptCount(currentExamIndex) }}</span>
          </div>
          <div class="w-px h-6 bg-slate-700"></div>
          <div>
            <span class="text-slate-400 text-[10px] block">測驗平均</span>
            <span class="font-mono font-black text-amber-300">{{ getAverageScore(currentExamIndex) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 學生名單快速輸入列表 (支援單擊免測、數字填寫) -->
    <div class="glass-panel rounded-2xl border border-slate-700/80 p-3 space-y-2">
      <div class="flex items-center justify-between text-xs text-slate-400 font-bold px-2 py-1 border-b border-slate-800">
        <span class="w-16">座號/性別</span>
        <span class="w-24">學生姓名</span>
        <span class="flex-1 text-center">實測成績 ({{ examSettings[currentExamIndex].unit || '單位' }})</span>
        <span class="w-20 text-center">免測/補測</span>
        <span class="w-16 text-right">換算分</span>
      </div>

      <div class="divide-y divide-slate-800/60 max-h-[55vh] overflow-y-auto no-scrollbar">
        <div
          v-for="student in students"
          :key="student.studentId"
          class="flex items-center justify-between px-2 py-2 text-xs hover:bg-slate-800/50 rounded-xl transition"
          :class="isStudentExempt(student.studentId) ? 'bg-purple-950/20' : ''"
        >
          <!-- 座號與性別 -->
          <div class="w-16 flex items-center gap-1.5">
            <span class="w-6 h-6 rounded-md bg-slate-800 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs border border-slate-700">
              {{ student.seatNo }}
            </span>
            <span class="text-[10px] text-slate-400">{{ student.gender === 'M' ? '男' : '女' }}</span>
          </div>

          <!-- 姓名與痼疾 -->
          <div class="w-24 truncate font-bold text-slate-200 flex items-center gap-1">
            <span>{{ student.name }}</span>
            <span v-if="student.medicalNotes" class="text-[10px]" title="痼疾">❤️</span>
          </div>

          <!-- 原始客觀數據輸入框 -->
          <div class="flex-1 px-2 flex justify-center">
            <div class="relative w-28">
              <input
                :disabled="isStudentExempt(student.studentId)"
                :value="getStudentRaw(student.studentId)"
                @input="updateRawValue(student.studentId, $event.target.value)"
                type="number"
                step="any"
                placeholder="輸入數值"
                class="w-full bg-slate-900 disabled:opacity-40 disabled:bg-slate-950 text-center font-mono font-bold text-sm text-slate-100 rounded-lg py-1.5 px-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span class="absolute right-2 top-1.5 text-[10px] text-slate-500 pointer-events-none">
                {{ examSettings[currentExamIndex].unit }}
              </span>
            </div>
          </div>

          <!-- 單擊免測 / 補測按鈕 -->
          <div class="w-20 text-center">
            <button
              @click="toggleExempt(student.studentId)"
              class="active-press px-2 py-1 rounded-lg text-[11px] font-bold transition border"
              :class="isStudentExempt(student.studentId)
                ? 'bg-purple-600 text-white border-purple-400 shadow'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'"
            >
              {{ isStudentExempt(student.studentId) ? '免測中' : '免測' }}
            </button>
          </div>

          <!-- 百分制折算分數預覽 -->
          <div class="w-16 text-right font-mono font-bold">
            <span v-if="isStudentExempt(student.studentId)" class="text-purple-400 text-[11px]">
              免計
            </span>
            <span v-else-if="getStudentRaw(student.studentId) !== null && getStudentRaw(student.studentId) !== ''" class="text-emerald-400">
              {{ convertTo100Scale(getStudentRaw(student.studentId)) }}
            </span>
            <span v-else class="text-slate-600">-</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 技能測驗大數字鍵盤連打 Modal -->
    <div
      v-if="isKeypadOpen"
      class="fixed inset-0 z-50 overflow-hidden flex flex-col justify-end sm:justify-center items-center bg-black/75 backdrop-blur-md p-0 sm:p-4"
    >
      <div class="w-full sm:max-w-md bg-slate-900 border-t sm:border border-slate-700 sm:rounded-3xl rounded-t-3xl p-4 sm:p-6 shadow-2xl flex flex-col space-y-3.5 max-h-[92vh] overflow-y-auto no-scrollbar">
        <!-- 鍵盤標題列 -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="font-black text-sm text-white flex items-center gap-1.5">
              <span>🎯 第 {{ currentExamIndex }} 次技能測驗連打</span>
              <span class="text-xs text-indigo-400 font-semibold">
                {{ examSettings[currentExamIndex].itemName }} ({{ examSettings[currentExamIndex].unit }})
              </span>
            </h3>
          </div>
          <button @click="isKeypadOpen = false" class="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <!-- 當前學生卡片 -->
        <div class="flex items-center justify-between bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 font-black flex items-center justify-center text-lg border border-indigo-500/30">
              {{ currentKeypadStudent?.seatNo }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-base font-black text-white">{{ currentKeypadStudent?.name }}</span>
                <span class="text-xs text-slate-400">
                  {{ currentKeypadStudent?.gender === 'M' ? '男' : '女' }}
                </span>
              </div>
              <p v-if="currentKeypadStudent?.medicalNotes" class="text-[11px] text-red-400 truncate max-w-[200px]">
                ❤️ {{ currentKeypadStudent.medicalNotes }}
              </p>
            </div>
          </div>

          <div class="text-xs font-mono text-slate-400">
            {{ keypadStudentIndex + 1 }} / {{ students.length }}
          </div>
        </div>

        <!-- 數值顯示幕 -->
        <div class="bg-black/50 border border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center">
          <div class="text-xs text-slate-400 font-semibold">
            {{ examSettings[currentExamIndex].itemName }} 實測數據
          </div>
          <div class="flex items-baseline gap-1.5 my-1">
            <span class="text-5xl font-black font-mono tracking-tight" :class="isKeypadExempt ? 'text-purple-400' : 'text-indigo-400'">
              {{ isKeypadExempt ? '免測' : (keypadDisplayValue || '0') }}
            </span>
            <span v-if="!isKeypadExempt" class="text-sm font-bold text-slate-400">
              {{ examSettings[currentExamIndex].unit }}
            </span>
          </div>
          <div v-if="!isKeypadExempt && keypadDisplayValue" class="text-xs text-emerald-400 font-bold">
            百分制折算約：{{ convertTo100Scale(Number(keypadDisplayValue)) }} 分
          </div>
        </div>

        <!-- 專屬超大數字鍵盤 (連打專用) -->
        <div class="grid grid-cols-4 gap-2 pt-1 select-none">
          <button @click="keypadInput('7')" class="keypad-btn">7</button>
          <button @click="keypadInput('8')" class="keypad-btn">8</button>
          <button @click="keypadInput('9')" class="keypad-btn">9</button>
          <button @click="keypadBackspace" class="keypad-action-btn bg-slate-800 text-red-400">⌫ 退格</button>

          <button @click="keypadInput('4')" class="keypad-btn">4</button>
          <button @click="keypadInput('5')" class="keypad-btn">5</button>
          <button @click="keypadInput('6')" class="keypad-btn">6</button>
          <button @click="keypadClear" class="keypad-action-btn bg-slate-800 text-slate-400">C 清除</button>

          <button @click="keypadInput('1')" class="keypad-btn">1</button>
          <button @click="keypadInput('2')" class="keypad-btn">2</button>
          <button @click="keypadInput('3')" class="keypad-btn">3</button>
          <button
            @click="keypadToggleExempt"
            class="keypad-action-btn"
            :class="isKeypadExempt ? 'bg-purple-600 text-white font-black' : 'bg-slate-800 text-purple-300'"
          >
            {{ isKeypadExempt ? '已免測' : '免測' }}
          </button>

          <button @click="keypadInput('0')" class="keypad-btn">0</button>
          <button @click="keypadInput('.')" class="keypad-btn">.</button>
          <button @click="keypadPrev" :disabled="keypadStudentIndex === 0" class="keypad-action-btn bg-slate-800 text-slate-300 disabled:opacity-30">
            ◀ 上一號
          </button>
          <button
            @click="keypadConfirmNext"
            class="active-press bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-2xl py-3 shadow-lg flex items-center justify-center gap-1"
          >
            <span>確認下一號 ▶</span>
          </button>
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
  // 技能測驗紀錄映射：{ [examIndex]: { [studentId]: { rawValue, isExempt } } }
  skillRecords: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update-skill-record']);

const currentExamIndex = ref(1);

// 4 次測驗的自訂項目名稱與單位
const examSettings = ref({
  1: { itemName: '立定跳遠', unit: 'cm' },
  2: { itemName: '仰臥捲腹', unit: '次' },
  3: { itemName: '運球繞錐上籃', unit: '分' },
  4: { itemName: '羽球發高遠球', unit: '顆' }
});

// 數字鍵盤狀態
const isKeypadOpen = ref(false);
const keypadStudentIndex = ref(0);
const keypadDisplayValue = ref('');
const isKeypadExempt = ref(false);

const currentKeypadStudent = computed(() => {
  return props.students[keypadStudentIndex.value] || null;
});

function getStudentRecord(studentId, examIdx = currentExamIndex.value) {
  return props.skillRecords?.[examIdx]?.[studentId];
}

function getStudentRaw(studentId, examIdx = currentExamIndex.value) {
  const rec = getStudentRecord(studentId, examIdx);
  return rec ? rec.rawValue : null;
}

function isStudentExempt(studentId, examIdx = currentExamIndex.value) {
  const rec = getStudentRecord(studentId, examIdx);
  return Boolean(rec?.isExempt);
}

function updateRawValue(studentId, val) {
  emit('update-skill-record', {
    examIndex: currentExamIndex.value,
    studentId,
    itemName: examSettings.value[currentExamIndex.value].itemName,
    rawValue: val === '' ? null : Number(val),
    isExempt: false
  });
}

function toggleExempt(studentId) {
  const currentExempt = isStudentExempt(studentId);
  emit('update-skill-record', {
    examIndex: currentExamIndex.value,
    studentId,
    itemName: examSettings.value[currentExamIndex.value].itemName,
    rawValue: currentExempt ? 0 : null,
    isExempt: !currentExempt
  });
}

// 百分制換算公式 (折算百分制供教師即時參考)
function convertTo100Scale(raw) {
  if (raw === null || raw === undefined || raw === '') return '-';
  const num = Number(raw);
  if (isNaN(num)) return '-';
  // 簡易級距折算範本 (若數值大於 100，或本身就是百分制)
  if (num >= 90) return Math.min(100, Math.round(num));
  if (num >= 60) return Math.round(num);
  // 若為計次 (例 0~20 次)，自動乘倍率
  if (num <= 30 && examSettings.value[currentExamIndex.value].unit === '次') {
    return Math.min(100, Math.round(60 + num * 1.5));
  }
  return Math.min(100, Math.max(50, Math.round(num)));
}

// 統計資訊
function getRecordedCount(examIdx) {
  const recs = props.skillRecords?.[examIdx] || {};
  return Object.values(recs).filter(r => (r.rawValue !== null && r.rawValue !== undefined) || r.isExempt).length;
}

function getExemptCount(examIdx) {
  const recs = props.skillRecords?.[examIdx] || {};
  return Object.values(recs).filter(r => r.isExempt).length;
}

function getExamProgressPercent(examIdx) {
  if (!props.students.length) return 0;
  return Math.round((getRecordedCount(examIdx) / props.students.length) * 100);
}

function getAverageScore(examIdx) {
  const recs = props.skillRecords?.[examIdx] || {};
  const validVals = Object.values(recs)
    .filter(r => !r.isExempt && r.rawValue !== null && r.rawValue !== undefined && !isNaN(r.rawValue))
    .map(r => Number(r.rawValue));
  if (!validVals.length) return '-';
  const sum = validVals.reduce((acc, v) => acc + v, 0);
  return (sum / validVals.length).toFixed(1);
}

// 數字鍵盤功能
function openKeypadForSkillExam() {
  keypadStudentIndex.value = 0;
  loadKeypadStudentData();
  isKeypadOpen.value = true;
}

function loadKeypadStudentData() {
  if (!currentKeypadStudent.value) return;
  const rec = getStudentRecord(currentKeypadStudent.value.studentId, currentExamIndex.value);
  if (rec) {
    keypadDisplayValue.value = rec.rawValue !== null && rec.rawValue !== undefined ? String(rec.rawValue) : '';
    isKeypadExempt.value = Boolean(rec.isExempt);
  } else {
    keypadDisplayValue.value = '';
    isKeypadExempt.value = false;
  }
}

watch(keypadStudentIndex, () => {
  loadKeypadStudentData();
});

function keypadInput(digit) {
  if (isKeypadExempt.value) isKeypadExempt.value = false;
  if (digit === '.') {
    if (!keypadDisplayValue.value.includes('.')) {
      keypadDisplayValue.value = keypadDisplayValue.value ? keypadDisplayValue.value + '.' : '0.';
    }
    return;
  }
  if (keypadDisplayValue.value === '0') {
    keypadDisplayValue.value = digit;
  } else {
    keypadDisplayValue.value += digit;
  }
}

function keypadBackspace() {
  if (isKeypadExempt.value) {
    isKeypadExempt.value = false;
    return;
  }
  if (keypadDisplayValue.value.length > 0) {
    keypadDisplayValue.value = keypadDisplayValue.value.slice(0, -1);
  }
}

function keypadClear() {
  keypadDisplayValue.value = '';
  isKeypadExempt.value = false;
}

function keypadToggleExempt() {
  isKeypadExempt.value = !isKeypadExempt.value;
  if (isKeypadExempt.value) {
    keypadDisplayValue.value = '';
  }
}

function keypadPrev() {
  if (keypadStudentIndex.value > 0) {
    keypadStudentIndex.value--;
  }
}

function keypadConfirmNext() {
  if (!currentKeypadStudent.value) return;

  emit('update-skill-record', {
    examIndex: currentExamIndex.value,
    studentId: currentKeypadStudent.value.studentId,
    itemName: examSettings.value[currentExamIndex.value].itemName,
    rawValue: isKeypadExempt.value ? null : (keypadDisplayValue.value !== '' ? Number(keypadDisplayValue.value) : null),
    isExempt: isKeypadExempt.value
  });

  if (keypadStudentIndex.value < props.students.length - 1) {
    keypadStudentIndex.value++;
  } else {
    isKeypadOpen.value = false;
  }
}
</script>

<style scoped>
.keypad-btn {
  @apply min-h-[58px] bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-black text-2xl rounded-2xl border border-slate-700 flex items-center justify-center transition shadow-md;
}
.keypad-action-btn {
  @apply min-h-[58px] active:scale-95 font-bold text-xs rounded-2xl border border-slate-700 flex items-center justify-center transition shadow-md;
}
</style>
