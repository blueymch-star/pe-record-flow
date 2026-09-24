<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden flex flex-col justify-end sm:justify-center items-center bg-black/75 backdrop-blur-md p-0 sm:p-4">
    <!-- 主卡片：在大螢幕置中，在手機貼底 -->
    <div class="w-full sm:max-w-md bg-slate-900 border-t sm:border border-slate-700 sm:rounded-3xl rounded-t-3xl p-4 sm:p-6 shadow-2xl flex flex-col space-y-3.5 max-h-[92vh] overflow-y-auto no-scrollbar">
      
      <!-- 頂部控制列：測驗項目切換與關閉按鈕 -->
      <div class="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <!-- 項目切換下拉選單 -->
        <select
          v-model="activeItemId"
          @change="onItemChange"
          class="bg-slate-800 text-white font-bold text-sm rounded-xl px-3 py-2 border border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          <option v-for="item in fitnessItems" :key="item.id" :value="item.id">
            🏃 {{ item.name }} ({{ item.unit }})
          </option>
        </select>

        <!-- 學生輪替與關閉 -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400 font-mono">
            {{ currentIndex + 1 }} / {{ students.length }}
          </span>
          <button @click="$emit('close')" class="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      </div>

      <!-- 當前學生資訊與座號橫向滑軌 -->
      <div class="flex items-center justify-between bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 font-black flex items-center justify-center text-lg border border-emerald-500/30">
            {{ currentStudent?.seatNo }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-base font-black text-white">{{ currentStudent?.name }}</span>
              <span class="text-xs font-semibold text-slate-400">
                {{ currentStudent?.gender === 'M' ? '男' : '女' }} · {{ currentStudent?.age || 11 }}歲
              </span>
            </div>
            <p v-if="currentStudent?.medicalNotes" class="text-[11px] text-red-400 truncate max-w-[200px]">
              ❤️ {{ currentStudent.medicalNotes }}
            </p>
          </div>
        </div>

        <!-- 免測標籤 -->
        <div v-if="isExempt" class="px-2.5 py-1 rounded-lg bg-purple-950/80 text-purple-300 border border-purple-500/50 text-xs font-bold">
          免測 (不計入分母)
        </div>
      </div>

      <!-- 數值顯示螢幕 (超大高辨識度) -->
      <div class="bg-black/40 border rounded-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden"
        :class="normResult.isWarning ? 'border-red-500/80 bg-red-950/20' : 'border-slate-700'">
        
        <div class="text-xs text-slate-400 font-semibold">
          {{ activeItemConfig.name }} 輸入值 (合理範圍: {{ activeItemConfig.min }} ~ {{ activeItemConfig.max }} {{ activeItemConfig.unit }})
        </div>

        <div class="flex items-baseline gap-1 my-1">
          <span class="text-4xl sm:text-5xl font-black font-mono tracking-tight"
            :class="normResult.isWarning ? 'text-red-400' : 'text-emerald-400'">
            {{ isExempt ? '免測' : (displayValue || '0') }}
          </span>
          <span v-if="!isExempt" class="text-sm font-bold text-slate-400">{{ activeItemConfig.unit }}</span>
        </div>

        <!-- 即時常模比對與紅燈警示 -->
        <div v-if="!isExempt && displayValue" class="flex items-center gap-2 mt-1">
          <span
            class="text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm"
            :class="normResult.isWarning ? 'bg-red-600 text-white animate-bounce' : 'bg-slate-700 text-emerald-300'"
          >
            <span v-if="normResult.isWarning">🚨 紅燈預警：</span>
            <span>{{ normResult.levelText }}</span>
          </span>

          <!-- 範圍防呆提示 -->
          <span v-if="isOutOfRange" class="text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/40">
            ⚠️ 數值超出合理範圍
          </span>
        </div>
      </div>

      <!-- 專屬超大按鈕純數字鍵盤 (連打專用，無遮擋) -->
      <div class="grid grid-cols-4 gap-2 pt-1 select-none">
        <!-- 第 1 列: 7, 8, 9, 倒退 -->
        <button @click="inputDigit('7')" class="keypad-btn">7</button>
        <button @click="inputDigit('8')" class="keypad-btn">8</button>
        <button @click="inputDigit('9')" class="keypad-btn">9</button>
        <button @click="backspace" class="keypad-action-btn bg-slate-800 text-red-400 hover:bg-slate-700">⌫ 退格</button>

        <!-- 第 2 列: 4, 5, 6, 清除 -->
        <button @click="inputDigit('4')" class="keypad-btn">4</button>
        <button @click="inputDigit('5')" class="keypad-btn">5</button>
        <button @click="inputDigit('6')" class="keypad-btn">6</button>
        <button @click="clearInput" class="keypad-action-btn bg-slate-800 text-slate-400 hover:bg-slate-700">C 清除</button>

        <!-- 第 3 列: 1, 2, 3, 免測開關 -->
        <button @click="inputDigit('1')" class="keypad-btn">1</button>
        <button @click="inputDigit('2')" class="keypad-btn">2</button>
        <button @click="inputDigit('3')" class="keypad-btn">3</button>
        <button @click="toggleExempt" class="keypad-action-btn"
          :class="isExempt ? 'bg-purple-600 text-white font-black' : 'bg-slate-800 text-purple-300 hover:bg-slate-700'">
          {{ isExempt ? '已免測' : '免測' }}
        </button>

        <!-- 第 4 列: 0, 小數點, 上一號, 確認並跳下一號 -->
        <button @click="inputDigit('0')" class="keypad-btn">0</button>
        <button @click="inputDigit('.')" class="keypad-btn">.</button>
        <button @click="prevStudent" :disabled="currentIndex === 0" class="keypad-action-btn bg-slate-800 text-slate-300 disabled:opacity-30">
          ◀ 上一號
        </button>
        <button
          @click="confirmAndNext"
          class="active-press bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl py-3 shadow-lg flex items-center justify-center gap-1"
        >
          <span>確認下一號 ▶</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { FITNESS_ITEMS, evaluateFitness } from '../services/norms';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  students: {
    type: Array,
    default: () => []
  },
  // 現存成績映射：{ [itemId]: { [studentId]: { rawValue, isExempt } } }
  existingRecords: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'save-record']);

const fitnessItems = FITNESS_ITEMS;
const activeItemId = ref('CurlUps');
const currentIndex = ref(0);
const displayValue = ref('');
const isExempt = ref(false);

const currentStudent = computed(() => {
  return props.students[currentIndex.value] || null;
});

const activeItemConfig = computed(() => {
  return fitnessItems.find(i => i.id === activeItemId.value) || fitnessItems[0];
});

// 當前數值之常模評估
const normResult = computed(() => {
  if (isExempt.value || !displayValue.value || !currentStudent.value) {
    return { levelText: '', isWarning: false };
  }
  return evaluateFitness(
    currentStudent.value.gender || 'M',
    currentStudent.value.age || 11,
    activeItemId.value,
    Number(displayValue.value)
  );
});

// 防呆判斷
const isOutOfRange = computed(() => {
  if (!displayValue.value || isExempt.value) return false;
  const num = Number(displayValue.value);
  const cfg = activeItemConfig.value;
  return num < cfg.min || num > cfg.max;
});

// 載入當前學生已存數值
function loadCurrentStudentData() {
  if (!currentStudent.value) return;
  const rec = props.existingRecords?.[activeItemId.value]?.[currentStudent.value.studentId];
  if (rec) {
    displayValue.value = rec.rawValue !== undefined && rec.rawValue !== null ? String(rec.rawValue) : '';
    isExempt.value = Boolean(rec.isExempt);
  } else {
    displayValue.value = '';
    isExempt.value = false;
  }
}

watch([currentIndex, activeItemId], () => {
  loadCurrentStudentData();
}, { immediate: true });

function onItemChange() {
  loadCurrentStudentData();
}

function inputDigit(digit) {
  if (isExempt.value) isExempt.value = false;
  if (digit === '.') {
    if (!displayValue.value.includes('.')) {
      displayValue.value = displayValue.value ? displayValue.value + '.' : '0.';
    }
    return;
  }
  if (displayValue.value === '0') {
    displayValue.value = digit;
  } else {
    displayValue.value += digit;
  }
}

function backspace() {
  if (isExempt.value) {
    isExempt.value = false;
    return;
  }
  if (displayValue.value.length > 0) {
    displayValue.value = displayValue.value.slice(0, -1);
  }
}

function clearInput() {
  displayValue.value = '';
  isExempt.value = false;
}

function toggleExempt() {
  isExempt.value = !isExempt.value;
  if (isExempt.value) {
    displayValue.value = '';
  }
}

function prevStudent() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function confirmAndNext() {
  if (!currentStudent.value) return;

  // 發出儲存事件
  emit('save-record', {
    studentId: currentStudent.value.studentId,
    itemId: activeItemId.value,
    rawValue: displayValue.value !== '' ? Number(displayValue.value) : null,
    isExempt: isExempt.value
  });

  // 自動聚焦下一號
  if (currentIndex.value < props.students.length - 1) {
    currentIndex.value++;
  } else {
    // 全班連打結束
    emit('close');
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
