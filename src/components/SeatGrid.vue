<template>
  <div class="space-y-4">
    <!-- 頂部操作列：狀態圖例與快速統計 -->
    <div class="glass-panel p-3 rounded-xl flex items-center justify-between gap-2 border border-slate-700/80">
      <div class="flex items-center gap-3 text-xs font-medium">
        <span class="flex items-center gap-1.5 text-emerald-400">
          <span class="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
          良好 ({{ countByStatus('良好') }})
        </span>
        <span class="flex items-center gap-1.5 text-amber-400">
          <span class="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
          不適/傷 ({{ countByStatus('不適') }})
        </span>
        <span class="flex items-center gap-1.5 text-orange-400">
          <span class="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50"></span>
          見習 ({{ countByStatus('見習') }})
        </span>
      </div>

      <!-- 模式切換：單手點擊健康切換 VS 點擊開抽屜態度記分 -->
      <button
        @click="toggleMode"
        class="active-press text-xs font-bold px-2.5 py-1.5 rounded-lg border flex items-center gap-1"
        :class="quickToggleMode ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-700 text-slate-300 border-slate-600'"
      >
        <span>{{ quickToggleMode ? '⚡ 單擊切健康' : '📝 點擊記態度' }}</span>
      </button>
    </div>

    <!-- 戶外單手大觸控靶區座號網格 (Min Height 68px) -->
    <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
      <div
        v-for="student in students"
        :key="student.studentId"
        class="relative min-h-[72px] rounded-xl p-2 flex flex-col justify-between items-center transition select-none cursor-pointer border active-press"
        :class="getSeatCardClass(student)"
        @click="handleSeatClick(student)"
      >
        <!-- 右上角痼疾紅心 Icon -->
        <button
          v-if="student.medicalNotes"
          @click.stop="openMedicalAlert(student)"
          class="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px] shadow-lg animate-pulse"
          title="痼疾註記"
        >
          ❤️
        </button>

        <!-- 座號與姓名 -->
        <div class="w-full flex items-center justify-between text-xs">
          <span class="font-black text-sm px-1.5 py-0.5 rounded bg-black/25">
            {{ student.seatNo }}
          </span>
          <span class="text-[10px] font-semibold opacity-75">
            {{ student.gender === 'M' ? '男' : '女' }}
          </span>
        </div>

        <div class="text-sm font-bold truncate max-w-full my-0.5">
          {{ student.name }}
        </div>

        <!-- 底部微狀態：健康標籤 或 態度加減分徽章 -->
        <div class="w-full flex items-center justify-between text-[11px] font-semibold pt-1 border-t border-black/10">
          <span>{{ getStudentHealth(student.studentId) }}</span>
          
          <!-- 態度加減分微徽章 -->
          <span
            v-if="getAttitudeDelta(student.studentId) !== 0"
            class="px-1 rounded font-black text-[10px]"
            :class="getAttitudeDelta(student.studentId) > 0 ? 'bg-emerald-900/60 text-emerald-200' : 'bg-red-900/60 text-red-200'"
          >
            {{ getAttitudeDelta(student.studentId) > 0 ? '+' : '' }}{{ getAttitudeDelta(student.studentId) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 痼疾彈窗提示 (Modal) -->
    <div
      v-if="activeMedicalStudent"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="activeMedicalStudent = null"
    >
      <div class="bg-slate-800 border border-red-500/40 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
        <div class="flex items-center gap-3 text-red-400">
          <span class="text-3xl">🩺</span>
          <div>
            <h4 class="font-black text-lg text-white">學生先天痼疾安全備忘</h4>
            <p class="text-xs text-slate-400">
              {{ activeMedicalStudent.seatNo }} 號 {{ activeMedicalStudent.name }}
            </p>
          </div>
        </div>

        <div class="p-3.5 bg-red-950/40 border border-red-800/50 rounded-xl text-red-200 text-sm font-semibold leading-relaxed">
          {{ activeMedicalStudent.medicalNotes }}
        </div>

        <button
          @click="activeMedicalStudent = null"
          class="w-full active-press py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition"
        >
          確認了解
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  students: {
    type: Array,
    default: () => []
  },
  // 記錄整班健康狀態：{ [studentId]: '良好' | '不適' | '見習' }
  healthRecords: {
    type: Object,
    default: () => ({})
  },
  // 記錄學習態度加減分：{ [studentId]: { netDelta: 0, violations: [], merits: [] } }
  attitudeRecords: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update-health', 'open-attitude-drawer', 'open-fitness-entry']);

const quickToggleMode = ref(false); // true: 點擊輪替健康狀態; false: 點擊打開態度抽屜
const activeMedicalStudent = ref(null);

function toggleMode() {
  quickToggleMode.value = !quickToggleMode.value;
}

function getStudentHealth(studentId) {
  return props.healthRecords[studentId] || '良好';
}

function getAttitudeDelta(studentId) {
  return props.attitudeRecords[studentId]?.netDelta || 0;
}

function countByStatus(status) {
  return props.students.filter(s => getStudentHealth(s.studentId) === status).length;
}

function getSeatCardClass(student) {
  const status = getStudentHealth(student.studentId);
  if (status === '見習') {
    return 'bg-orange-500/25 border-orange-500/80 text-orange-200 shadow-md shadow-orange-950/50';
  } else if (status === '不適') {
    return 'bg-amber-500/25 border-amber-500/80 text-amber-200 shadow-md shadow-amber-950/50';
  }
  // 預設良好 (綠色系)
  return 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100 hover:border-emerald-400';
}

function handleSeatClick(student) {
  if (quickToggleMode.value) {
    // 快速輪替三種健康狀態：良好 -> 不適 -> 見習 -> 良好
    const current = getStudentHealth(student.studentId);
    let next = '良好';
    if (current === '良好') next = '不適';
    else if (current === '不適') next = '見習';
    else next = '良好';

    emit('update-health', { studentId: student.studentId, healthStatus: next });
  } else {
    // 點擊開啟學習態度 ±4 分抽屜
    emit('open-attitude-drawer', student);
  }
}

function openMedicalAlert(student) {
  activeMedicalStudent.value = student;
}
</script>
