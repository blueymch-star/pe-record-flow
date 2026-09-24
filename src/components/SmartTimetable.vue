<template>
  <div class="space-y-5">
    <!-- 1. 時間感知卡片 (智慧推薦當前或剛結束課堂) -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 p-5 shadow-xl text-white">
      <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

      <div class="flex items-center justify-between gap-3 mb-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/40 text-emerald-200 border border-emerald-400/30">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          時間感知雷達 (即時推薦)
        </span>
        <span class="text-xs text-emerald-100 font-mono">
          {{ currentDayLabel }} {{ currentTimeStr }}
        </span>
      </div>

      <!-- 剛下課或即將上課資訊 -->
      <div class="mt-3">
        <div class="text-xs text-emerald-200 font-medium">
          {{ recommendedLesson.isPastRecent ? '🔔 剛剛下課課堂' : '⚡ 當前進行/即將到來課堂' }}
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
          時段：{{ recommendedLesson.startTime }} ~ {{ recommendedLesson.endTime }}
        </p>
      </div>

      <!-- 核心行動大按鈕 -->
      <div class="mt-4 pt-3 border-t border-emerald-400/30 flex items-center gap-3">
        <button
          @click="$emit('select-class', { classId: recommendedLesson.classId, period: recommendedLesson.period, source: 'smart' })"
          class="flex-1 active-press bg-white hover:bg-emerald-50 text-emerald-900 font-black text-base py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
        >
          <span>進入課後 10 分鐘速記</span>
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
          @click="$emit('select-class', { classId: manualClassId, period: 2, source: 'manual' })"
          class="active-press disabled:opacity-40 disabled:cursor-not-allowed bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition"
        >
          切換切入
        </button>
      </div>
    </div>

    <!-- 3. 本週智慧進度提示卡片 -->
    <div class="glass-panel rounded-xl p-4 border border-slate-700/80">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          本週課程指引 (第 {{ currentWeek }} 週)
        </span>
        <span class="text-xs text-slate-400">{{ activeCurriculum.unitTitle }}</span>
      </div>
      <p class="text-sm font-semibold text-slate-200">{{ activeCurriculum.suggestedContent }}</p>
      <div class="mt-2 text-xs text-emerald-300/90 bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/50">
        🎯 <span class="font-bold">評量檢核重點：</span>{{ activeCurriculum.keyFocus }}
      </div>
    </div>

    <!-- 4. 週課表矩陣 (過去課堂亦可單擊補登) -->
    <div class="glass-panel rounded-xl p-4 border border-slate-700/80">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          週課表矩陣 (點選任一課堂立即補登)
        </h3>
        <span class="text-xs text-slate-400">週一 ~ 週五</span>
      </div>

      <div class="grid grid-cols-5 gap-2 text-center text-xs">
        <div v-for="day in 5" :key="day" class="font-bold py-1.5 rounded bg-slate-800/80 text-slate-300">
          週{{ ['一', '二', '三', '四', '五'][day - 1] }}
        </div>
      </div>

      <div class="mt-2 space-y-1.5">
        <div v-for="period in [1, 2, 3, 4, 5]" :key="period" class="grid grid-cols-5 gap-2">
          <div
            v-for="day in 5"
            :key="day"
            class="min-h-[52px] rounded-lg p-1.5 flex flex-col justify-center items-center transition border"
            :class="getTimetableCellClass(day, period)"
            @click="handleCellClick(day, period)"
          >
            <template v-if="getLesson(day, period)">
              <span class="font-black text-xs">{{ getLesson(day, period).classId }}班</span>
              <span class="text-[10px] opacity-80 scale-90">{{ getLesson(day, period).location }}</span>
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
    default: () => ['501', '502', '601', '602']
  }
});

const emit = defineEmits(['select-class']);

const manualClassId = ref('');
const currentWeek = ref(3);

const classOptions = computed(() => {
  return props.classes.length > 0 ? props.classes : ['501', '502', '601', '602'];
});

// 時鐘感知與當前星期幾
const now = new Date();
const currentDay = now.getDay() === 0 || now.getDay() === 6 ? 1 : now.getDay(); // 週末預設顯示週一
const currentDayLabel = '星期' + ['日', '一', '二', '三', '四', '五', '六'][currentDay];
const currentTimeStr = now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });

// 推薦剛上完或即將上課課堂
const recommendedLesson = computed(() => {
  const todayLessons = props.timetable.filter(t => Number(t.dayOfWeek) === currentDay);
  if (todayLessons.length > 0) {
    // 預設推薦今日第一堂或第二堂課
    const lesson = todayLessons[0];
    return {
      classId: lesson.classId,
      period: lesson.period,
      location: lesson.location,
      startTime: lesson.startTime || '09:25',
      endTime: lesson.endTime || '10:05',
      isPastRecent: true
    };
  }
  return {
    classId: '501',
    period: 2,
    location: '操場跑道',
    startTime: '09:25',
    endTime: '10:05',
    isPastRecent: true
  };
});

// 當週教學計畫
const activeCurriculum = computed(() => {
  const found = props.curriculum.find(c => Number(c.weekNo) === currentWeek.value);
  return found || {
    unitTitle: '仰臥捲腹與核心體能檢測',
    suggestedContent: '仰臥捲腹標準姿勢檢核、腹直肌等長收縮體驗',
    keyFocus: '下背貼地、雙手平推至膝蓋、配合計時音頻'
  };
});

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
    return 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold shadow cursor-pointer active-press hover:bg-emerald-600/50';
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
