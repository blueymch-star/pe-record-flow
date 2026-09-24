<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-200" @click.self="closeDrawer">
    <!-- 底部向上滑出抽屜 Panel -->
    <div class="bg-slate-900 border-t border-slate-700 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl flex flex-col space-y-4">
      <!-- 拖曳手把與標題列 -->
      <div class="flex flex-col items-center">
        <div class="w-12 h-1.5 rounded-full bg-slate-700 mb-2"></div>
        <div class="w-full flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 font-black flex items-center justify-center text-sm border border-emerald-500/30">
              {{ student?.seatNo }}
            </span>
            <div>
              <h3 class="text-lg font-black text-white flex items-center gap-2">
                <span>{{ student?.name }}</span>
                <span class="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {{ student?.gender === 'M' ? '男生' : '女生' }}
                </span>
              </h3>
              <p class="text-xs text-slate-400">學期態度初始 100 分 · 單次違規 -4 / 優良 +4</p>
            </div>
          </div>
          <button @click="closeDrawer" class="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800">
            ✕
          </button>
        </div>
      </div>

      <!-- 即時得分計分看板 -->
      <div class="p-3.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-850 border border-slate-700 flex items-center justify-between">
        <div>
          <span class="text-xs text-slate-400">目前態度總評換算</span>
          <div class="flex items-baseline gap-1.5 mt-0.5">
            <span class="text-3xl font-black" :class="scoreColor">
              {{ attitudeCalc.score }}
            </span>
            <span class="text-xs text-slate-400">/ 100 分</span>
          </div>
        </div>

        <div class="text-right">
          <span class="text-xs text-slate-400">本次課堂異動</span>
          <div class="text-base font-bold font-mono" :class="attitudeCalc.netDelta >= 0 ? 'text-emerald-400' : 'text-red-400'">
            {{ attitudeCalc.netDelta > 0 ? '+' : '' }}{{ attitudeCalc.netDelta }} 分
          </div>
          <span v-if="attitudeCalc.isCappedMin" class="text-[10px] text-amber-400">達到最低 60 分下限</span>
          <span v-if="attitudeCalc.isCappedMax" class="text-[10px] text-emerald-400">達到最高 100 分上限</span>
        </div>
      </div>

      <!-- 違規扣分項 (統一 -4 分) -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-red-400 uppercase tracking-wide flex items-center gap-1">
            <span>⚠️</span> 違規扣分項目 (每次 -4 分)
          </span>
          <span class="text-xs text-slate-400">已選 {{ selectedViolations.length }} 項 (-{{ selectedViolations.length * 4 }}分)</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            v-for="item in violationOptions"
            :key="item"
            @click="toggleViolation(item)"
            class="active-press text-xs font-semibold p-2.5 rounded-xl border text-left flex items-center justify-between transition"
            :class="selectedViolations.includes(item)
              ? 'bg-red-950/60 border-red-500 text-red-200 shadow'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'"
          >
            <span>{{ item }}</span>
            <span class="text-xs font-mono font-bold" :class="selectedViolations.includes(item) ? 'text-red-400' : 'text-slate-500'">-4</span>
          </button>
        </div>
      </div>

      <!-- 優良加分項 (統一 +4 分) -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1">
            <span>✨</span> 優良表現項目 (每次 +4 分)
          </span>
          <span class="text-xs text-slate-400">已選 {{ selectedMerits.length }} 項 (+{{ selectedMerits.length * 4 }}分)</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            v-for="item in meritOptions"
            :key="item"
            @click="toggleMerit(item)"
            class="active-press text-xs font-semibold p-2.5 rounded-xl border text-left flex items-center justify-between transition"
            :class="selectedMerits.includes(item)
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'"
          >
            <span>{{ item }}</span>
            <span class="text-xs font-mono font-bold" :class="selectedMerits.includes(item) ? 'text-emerald-400' : 'text-slate-500'">+4</span>
          </button>
        </div>
      </div>

      <!-- 課堂觀察隨筆備忘 -->
      <div>
        <label class="block text-xs font-bold text-slate-300 mb-1">
          💬 個人課堂觀察備忘 (選填)：
        </label>
        <textarea
          v-model="observationNotes"
          rows="2"
          placeholder="例：跳繩動作進步明顯、課後主動協助排球收納..."
          class="w-full bg-slate-800 text-slate-100 text-xs rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        ></textarea>
      </div>

      <!-- 底部動作列 -->
      <div class="pt-2 border-t border-slate-800 flex items-center gap-3">
        <button
          @click="saveStudentAttitude"
          class="flex-1 active-press bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition text-sm flex items-center justify-center gap-2"
        >
          <span>儲存 {{ student?.name }} 紀錄</span>
        </button>

        <button
          @click="$emit('quick-archive-all')"
          class="active-press bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold py-3.5 px-3 rounded-xl transition text-xs flex items-center gap-1.5"
          title="全班今日正常表現，一鍵歸檔"
        >
          <span>⚡ 全班正常一鍵歸檔</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { calculateAttitudeScore } from '../services/norms';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  student: {
    type: Object,
    default: null
  },
  initialAttitude: {
    type: Object,
    default: () => ({ violations: [], merits: [], observationNotes: '' })
  }
});

const emit = defineEmits(['close', 'save', 'quick-archive-all']);

// 規格書內定違規與優良清單
const violationOptions = [
  '未穿運動鞋服',
  '干擾秩序推擠',
  '危險動作嬉戲',
  '消極敷衍逃避',
  '器材破壞未歸'
];

const meritOptions = [
  '熱心收器材',
  '團隊互助合作',
  '主動協助同學',
  '運動家精神',
  '熱烈參與挑戰'
];

const selectedViolations = ref([]);
const selectedMerits = ref([]);
const observationNotes = ref('');

// 同步初始值
watch(
  () => props.student,
  () => {
    if (props.initialAttitude) {
      selectedViolations.value = [...(props.initialAttitude.violations || [])];
      selectedMerits.value = [...(props.initialAttitude.merits || [])];
      observationNotes.value = props.initialAttitude.observationNotes || '';
    } else {
      selectedViolations.value = [];
      selectedMerits.value = [];
      observationNotes.value = '';
    }
  },
  { immediate: true }
);

const attitudeCalc = computed(() => {
  return calculateAttitudeScore(selectedMerits.value, selectedViolations.value);
});

const scoreColor = computed(() => {
  const s = attitudeCalc.value.score;
  if (s >= 90) return 'text-emerald-400';
  if (s >= 80) return 'text-teal-300';
  if (s >= 70) return 'text-amber-300';
  return 'text-red-400';
});

function toggleViolation(item) {
  const idx = selectedViolations.value.indexOf(item);
  if (idx > -1) {
    selectedViolations.value.splice(idx, 1);
  } else {
    selectedViolations.value.push(item);
  }
}

function toggleMerit(item) {
  const idx = selectedMerits.value.indexOf(item);
  if (idx > -1) {
    selectedMerits.value.splice(idx, 1);
  } else {
    selectedMerits.value.push(item);
  }
}

function closeDrawer() {
  emit('close');
}

function saveStudentAttitude() {
  emit('save', {
    studentId: props.student.studentId,
    violations: [...selectedViolations.value],
    merits: [...selectedMerits.value],
    netDelta: attitudeCalc.value.netDelta,
    observationNotes: observationNotes.value
  });
  closeDrawer();
}
</script>
