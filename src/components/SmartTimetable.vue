<template>
  <div class="space-y-5">
    <!-- 1. 時間感知卡片 (智慧推薦當前或剛結束課堂) -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 p-5 shadow-xl text-white">
      <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

      <div class="flex items-center justify-between gap-3 mb-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/40 text-emerald-200 border border-emerald-400/30">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          時間感知雷達 (新竹市大庄國小 115上)
        </span>
        <span class="text-xs text-emerald-100 font-mono">
          {{ currentDayLabel }} {{ currentTimeStr }}
        </span>
      </div>

      <!-- 剛下課或即將上課資訊 -->
      <div class="mt-3">
        <div class="text-xs text-emerald-200 font-medium">
          {{ recommendedLesson.isPastRecent ? '🔔 剛剛下課/當前課堂' : '⚡ 當前進行/即將到來課堂' }}
        </div>
        <div class="flex items-baseline gap-2 mt-1">
          <h2 class="text-3xl font-black tracking-tight text-white">
            {{ recommendedLesson.classId }} 班
          </h2>
          <span class="text-lg font-bold text-emerald-200">
            第 {{ recommendedLesson.period }} 節 ({{ recommendedLesson.location }})
          </span>
        </div>
        <p class="text-xs text-emerald-100/90 mt-1 line-clamp-1">
          時段：{{ recommendedLesson.startTime }} ~ {{ recommendedLesson.endTime }} · 任課教師：張永明 老師
        </p>
      </div>

      <!-- 核心行動大按鈕 -->
      <div class="mt-4 pt-3 border-t border-emerald-400/30 flex items-center gap-3">
        <button
          @click="$emit('select-class', { classId: recommendedLesson.classId, period: recommendedLesson.period, source: 'smart' })"
          class="flex-1 active-press bg-white hover:bg-emerald-50 text-emerald-900 font-black text-base py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
        >
          <span>進入 {{ recommendedLesson.classId }} 班速記</span>
          <svg class="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 2. 手動切換逃生門 (因應雨天、代課、合班) -->
    <div class="glass-panel rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-700">
      <div class="flex items-center gap-2 text-slate-300 text-sm font-medium w-full sm:w-auto">
        <span class="text-amber-400 text-lg">🚪</span>
        <span>快速逃生門 (調代課 / 雨天)：</span>
      </div>
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select
          v-model="manualClassId"
          class="flex-1 sm:w-36 bg-slate-800 text-slate-100 text-sm font-semibold rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="" disabled>選擇班級</option>
          <option v-for="c in classOptions" :key="c" :value="c">
            {{ c }} 班
          </option>
        </select>
        <button
          :disabled="!manualClassId"
          @click="$emit('select-class', { classId: manualClassId, period: 5, source: 'manual' })"
          class="active-press disabled:opacity-40 disabled:cursor-not-allowed bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition"
        >
          切換切入
        </button>
      </div>
    </div>

    <!-- 3. 本週智慧進度提示卡片 (連動五上/六上教學進度表) -->
    <div class="glass-panel rounded-xl p-4 border border-slate-700/80 space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            教學進度指引
          </span>
          <!-- 年級切換 -->
          <div class="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-[11px] font-bold">
            <button
              @click="curriculumGrade = 5"
              class="px-2 py-0.5 rounded transition"
              :class="curriculumGrade === 5 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'"
            >
              五年級
            </button>
            <button
              @click="curriculumGrade = 6"
              class="px-2 py-0.5 rounded transition"
              :class="curriculumGrade === 6 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'"
            >
              六年級
            </button>
          </div>
        </div>

        <!-- 週次下拉選單 (第 1 ~ 21 週) -->
        <div class="flex items-center gap-1.5 text-xs text-slate-400">
          <span>週次：</span>
          <select
            v-model.number="currentWeek"
            class="bg-slate-800 text-emerald-300 font-bold rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none"
          >
            <option v-for="w in 21" :key="w" :value="w">
              第 {{ w }} 週 ({{ getWeekDate(w) }})
            </option>
          </select>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between gap-2">
          <h4 class="text-sm font-black text-white flex items-center gap-2">
            <span>{{ activeCurriculum.unitTitle }}</span>
            <span v-if="activeCurriculum.venue" class="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              📍 {{ activeCurriculum.venue }}
            </span>
          </h4>
          <span v-if="activeCurriculum.schoolEvent" class="text-[11px] text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
            🔔 {{ activeCurriculum.schoolEvent }}
          </span>
        </div>
        <p class="text-xs font-semibold text-slate-300 mt-1.5 leading-relaxed">
          活動重點：{{ activeCurriculum.suggestedContent }}
        </p>
      </div>

      <div class="text-[11px] text-emerald-300/90 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-900/50 flex items-center justify-between">
        <span>🎯 <span class="font-bold">評量方式：</span>{{ activeCurriculum.evalMethod || '技能操作70% 學習態度20% 體育常識10%' }}</span>
        <span v-if="activeCurriculum.resource" class="text-slate-400">器材：{{ activeCurriculum.resource }}</span>
      </div>
    </div>

    <!-- 4. 週課表矩陣 (參照課表.pdf，完整 1 至 7 節) -->
    <div class="glass-panel rounded-xl p-4 border border-slate-700/80">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          張永明老師 週課表 (8節) · 點選任一課堂立即補登
        </h3>
        <span class="text-xs text-slate-400">週一 ~ 週五</span>
      </div>

      <div class="grid grid-cols-6 gap-1.5 text-center text-xs mb-2">
        <div class="font-bold py-1.5 rounded bg-slate-850 text-slate-400 text-[11px]">節次</div>
        <div v-for="day in 5" :key="day" class="font-bold py-1.5 rounded bg-slate-800 text-slate-200">
          週{{ ['一', '二', '三', '四', '五'][day - 1] }}
        </div>
      </div>

      <div class="space-y-1.5">
        <div v-for="period in [1, 2, 3, 4, 5, 6, 7]" :key="period" class="grid grid-cols-6 gap-1.5">
          <!-- 節次與時間標籤 -->
          <div class="rounded-lg p-1 bg-slate-850/60 border border-slate-800/80 flex flex-col justify-center items-center text-center">
            <span class="font-black text-[11px] text-slate-300">第{{ period }}節</span>
            <span class="text-[9px] text-slate-500 font-mono scale-90">{{ periodTimeLabels[period] }}</span>
          </div>

          <!-- 週一至週五課堂格子 -->
          <div
            v-for="day in 5"
            :key="day"
            class="min-h-[50px] rounded-lg p-1 flex flex-col justify-center items-center transition border"
            :class="getTimetableCellClass(day, period)"
            @click="handleCellClick(day, period)"
          >
            <template v-if="getLesson(day, period)">
              <span class="font-black text-xs">{{ getLesson(day, period).classId }}班</span>
              <span class="text-[10px] opacity-80 scale-90 truncate max-w-full">{{ getLesson(day, period).location }}</span>
            </template>
            <template v-else>
              <span class="text-[10px] text-slate-600 font-mono">-</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
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
    default: () => ['5丁', '5戊', '6甲', '6乙']
  }
});

const emit = defineEmits(['select-class']);

const manualClassId = ref('');
const currentWeek = ref(1);
const curriculumGrade = ref(5);

const periodTimeLabels = {
  1: '08:40',
  2: '09:30',
  3: '10:30',
  4: '11:20',
  5: '13:20',
  6: '14:10',
  7: '15:10'
};

const classOptions = computed(() => {
  return props.classes.length > 0 ? props.classes : ['5丁', '5戊', '6甲', '6乙'];
});

// 時鐘感知與當前星期幾
const now = new Date();
const currentDay = now.getDay() === 0 || now.getDay() === 6 ? 1 : now.getDay();
const currentDayLabel = '星期' + ['日', '一', '二', '三', '四', '五', '六'][currentDay];
const currentTimeStr = now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });

// 推薦剛上完或即將上課課堂
const recommendedLesson = computed(() => {
  const todayLessons = props.timetable.filter(t => Number(t.dayOfWeek) === currentDay);
  if (todayLessons.length > 0) {
    const lesson = todayLessons[0];
    return {
      classId: lesson.classId,
      period: lesson.period,
      location: lesson.location,
      startTime: lesson.startTime || '14:10',
      endTime: lesson.endTime || '14:50',
      isPastRecent: true
    };
  }
  // 預設推薦週一第6節 5丁
  return {
    classId: '5丁',
    period: 6,
    location: '操場',
    startTime: '14:10',
    endTime: '14:50',
    isPastRecent: true
  };
});

// 當週教學計畫 (自動比對年級與週次)
const activeCurriculum = computed(() => {
  const found = props.curriculum.find(
    c => Number(c.weekNo) === currentWeek.value && (c.grade ? Number(c.grade) === curriculumGrade.value : true)
  );
  if (found) return found;

  return {
    unitTitle: curriculumGrade.value === 5 ? '田徑 (跑姿、起跑教學)' : '羽球 (正手發球)',
    suggestedContent: curriculumGrade.value === 5 ? '跑姿起跑教學與角錐練習' : '正手發球動作要領練習',
    keyFocus: '場地: 體育館',
    venue: '體育館',
    evalMethod: '技能操作70% 學習態度20% 體育常識10%'
  };
});

function getWeekDate(w) {
  const found = props.curriculum.find(c => Number(c.weekNo) === w);
  return found?.dateRange || `第${w}週`;
}

function getLesson(day, period) {
  return props.timetable.find(t => Number(t.dayOfWeek) === Number(day) && Number(t.period) === Number(period));
}

function getTimetableCellClass(day, period) {
  const lesson = getLesson(day, period);
  if (!lesson) {
    return 'bg-slate-900/40 border-slate-800 text-slate-600';
  }
  const isMatchRecommend = lesson.classId === recommendedLesson.value.classId && Number(lesson.period) === Number(recommendedLesson.value.period);
  if (isMatchRecommend) {
    return 'bg-emerald-600/35 border-emerald-500 text-emerald-300 font-bold shadow cursor-pointer active-press hover:bg-emerald-600/50';
  }
  return 'bg-slate-800/80 border-slate-700 text-slate-200 cursor-pointer active-press hover:bg-slate-700';
}

function handleCellClick(day, period) {
  const lesson = getLesson(day, period);
  if (lesson) {
    emit('select-class', { classId: lesson.classId, period: lesson.period, source: 'timetable' });
  }
}
</script>
