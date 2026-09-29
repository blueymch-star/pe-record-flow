/**
 * 新竹市大庄國小 115學年度第一學期 體育課程資料 (張永明 老師)
 * 依據「課表.pdf」、「五上體育教學進度表.doc」、「六上體育教學進度表.docx」建置
 */

export const STANDARD_VENUES = ['操場', '體育館', '綜合球場'];

export const MOCK_TIMETABLE = [
  {
    "dayOfWeek": 1,
    "period": 6,
    "classId": "五丁",
    "location": "操場",
    "startTime": "14:10",
    "endTime": "14:50"
  },
  {
    "dayOfWeek": 1,
    "period": 7,
    "classId": "六甲",
    "location": "操場",
    "startTime": "15:10",
    "endTime": "15:50"
  },
  {
    "dayOfWeek": 2,
    "period": 5,
    "classId": "五戊",
    "location": "綜合球場",
    "startTime": "13:20",
    "endTime": "14:00"
  },
  {
    "dayOfWeek": 2,
    "period": 7,
    "classId": "六乙",
    "location": "操場",
    "startTime": "15:10",
    "endTime": "15:50"
  },
  {
    "dayOfWeek": 4,
    "period": 5,
    "classId": "六乙",
    "location": "體育館",
    "startTime": "13:20",
    "endTime": "14:00"
  },
  {
    "dayOfWeek": 4,
    "period": 7,
    "classId": "五戊",
    "location": "操場",
    "startTime": "15:10",
    "endTime": "15:50"
  },
  {
    "dayOfWeek": 5,
    "period": 3,
    "classId": "五丁",
    "location": "體育館",
    "startTime": "10:30",
    "endTime": "11:10"
  },
  {
    "dayOfWeek": 5,
    "period": 4,
    "classId": "六甲",
    "location": "體育館",
    "startTime": "11:20",
    "endTime": "12:00"
  }
];

export const MOCK_CURRICULUM_GRADE5 = [
  {
    "grade": 5,
    "weekNo": 1,
    "weekStr": "一",
    "dateRange": "08.31~09.06",
    "schoolEvent": "8/31 開學",
    "venue": "體育館",
    "unitTitle": "課程說明",
    "suggestedContent": "柔軟度測驗仰臥起坐",
    "keyFocus": "8/31 開學 | 場地: 體育館",
    "resource": "體前彎測量器",
    "evalMethod": "技能操作70%學習態度10%體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 2,
    "weekStr": "二",
    "dateRange": "09.07~09.13",
    "schoolEvent": "9/12 班親會",
    "venue": "體育館",
    "unitTitle": "田徑",
    "suggestedContent": "跑姿、起跑教學",
    "keyFocus": "9/12 班親會 | 場地: 體育館",
    "resource": "角錐、圓盤",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 3,
    "weekStr": "三",
    "dateRange": "09.14~09.20",
    "schoolEvent": "",
    "venue": "體育館",
    "unitTitle": "躲避球",
    "suggestedContent": "傳接球練習閃躲練習",
    "keyFocus": "場地: 體育館",
    "resource": "躲避球",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 4,
    "weekStr": "四",
    "dateRange": "09.21~09.27",
    "schoolEvent": "9/22-24 市運會9/25 中秋節放假",
    "venue": "籃球場",
    "unitTitle": "躲避球",
    "suggestedContent": "分組比賽",
    "keyFocus": "9/22-24 市運會9/25 中秋節放假 | 場地: 籃球場",
    "resource": "躲避球",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 5,
    "weekStr": "五",
    "dateRange": "09.28~10.04",
    "schoolEvent": "9/28 教師節放假",
    "venue": "籃球場",
    "unitTitle": "田徑",
    "suggestedContent": "測100、200M",
    "keyFocus": "9/28 教師節放假 | 場地: 籃球場",
    "resource": "角錐、圓盤",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 6,
    "weekStr": "六",
    "dateRange": "10.05~10.11",
    "schoolEvent": "10/09國慶日補假",
    "venue": "操場",
    "unitTitle": "樂樂棒球",
    "suggestedContent": "傳接球練習",
    "keyFocus": "10/09國慶日補假 | 場地: 操場",
    "resource": "樂樂棒球",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 7,
    "weekStr": "七",
    "dateRange": "10.12~10.18",
    "schoolEvent": "10/13 流感疫苗接種校慶運動競賽預賽",
    "venue": "操場",
    "unitTitle": "大隊接力",
    "suggestedContent": "接傳棒教學",
    "keyFocus": "10/13 流感疫苗接種校慶運動競賽預賽 | 場地: 操場",
    "resource": "接力棒、角錐",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 8,
    "weekStr": "八",
    "dateRange": "10.19~10.25",
    "schoolEvent": "中小學排球校際聯賽",
    "venue": "操場",
    "unitTitle": "大隊接力",
    "suggestedContent": "接傳棒練習",
    "keyFocus": "中小學排球校際聯賽 | 場地: 操場",
    "resource": "接力棒、角錐",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 9,
    "weekStr": "九",
    "dateRange": "10.26~11.01",
    "schoolEvent": "10/26 光復節補假校慶運動競賽預賽",
    "venue": "操場",
    "unitTitle": "樂樂棒球",
    "suggestedContent": "打擊練習",
    "keyFocus": "10/26 光復節補假校慶運動競賽預賽 | 場地: 操場",
    "resource": "打擊座、球棒",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 10,
    "weekStr": "十",
    "dateRange": "11.02~11.08",
    "schoolEvent": "11/5-6 期中考",
    "venue": "體育館",
    "unitTitle": "樂樂棒球",
    "suggestedContent": "防守練習",
    "keyFocus": "11/5-6 期中考 | 場地: 體育館",
    "resource": "打擊座、球棒",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 11,
    "weekStr": "十一",
    "dateRange": "11.10~11.16",
    "schoolEvent": "校慶運動競賽決賽",
    "venue": "體育館",
    "unitTitle": "樂樂棒球",
    "suggestedContent": "傳接球測驗",
    "keyFocus": "校慶運動競賽決賽 | 場地: 體育館",
    "resource": "打擊座、球棒",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 12,
    "weekStr": "十二",
    "dateRange": "11.16~11.22",
    "schoolEvent": "11/20 戲劇比賽",
    "venue": "體育館",
    "unitTitle": "樂樂棒球",
    "suggestedContent": "打擊測驗",
    "keyFocus": "11/20 戲劇比賽 | 場地: 體育館",
    "resource": "打擊座、球棒",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 13,
    "weekStr": "十三",
    "dateRange": "11.23~11.29",
    "schoolEvent": "",
    "venue": "體育館",
    "unitTitle": "體適能檢測",
    "suggestedContent": "立定跳遠、800M",
    "keyFocus": "場地: 體育館",
    "resource": "皮尺",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 14,
    "weekStr": "十四",
    "dateRange": "11.30~12.06",
    "schoolEvent": "",
    "venue": "體育館",
    "unitTitle": "飛盤",
    "suggestedContent": "反手擲",
    "keyFocus": "場地: 體育館",
    "resource": "飛盤",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 15,
    "weekStr": "十五",
    "dateRange": "12.07~12.13",
    "schoolEvent": "校慶週12/12校慶",
    "venue": "體育館",
    "unitTitle": "飛盤",
    "suggestedContent": "擲準練習",
    "keyFocus": "校慶週12/12校慶 | 場地: 體育館",
    "resource": "飛盤",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 16,
    "weekStr": "十六",
    "dateRange": "12.14~12.20",
    "schoolEvent": "12/20 奧匹科學競賽",
    "venue": "體育館",
    "unitTitle": "飛盤",
    "suggestedContent": "測驗",
    "keyFocus": "12/20 奧匹科學競賽 | 場地: 體育館",
    "resource": "飛盤",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 17,
    "weekStr": "十七",
    "dateRange": "12.21~12.27",
    "schoolEvent": "12/25 行憲紀念日放假",
    "venue": "籃球場",
    "unitTitle": "籃球",
    "suggestedContent": "球感練習、運球",
    "keyFocus": "12/25 行憲紀念日放假 | 場地: 籃球場",
    "resource": "籃球",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 18,
    "weekStr": "十八",
    "dateRange": "12.28~01.03",
    "schoolEvent": "12/31 校慶補假1/1  元旦放假",
    "venue": "籃球場",
    "unitTitle": "籃球",
    "suggestedContent": "行徑間運球運球測驗",
    "keyFocus": "12/31 校慶補假1/1  元旦放假 | 場地: 籃球場",
    "resource": "籃球、角錐",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 19,
    "weekStr": "十九",
    "dateRange": "01.04~01.10",
    "schoolEvent": "",
    "venue": "體育館",
    "unitTitle": "排球",
    "suggestedContent": "低手傳球",
    "keyFocus": "場地: 體育館",
    "resource": "安全排球",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 20,
    "weekStr": "二十",
    "dateRange": "01.11~01.17",
    "schoolEvent": "1/12-13 期末考",
    "venue": "體育館",
    "unitTitle": "排球",
    "suggestedContent": "低手發球",
    "keyFocus": "1/12-13 期末考 | 場地: 體育館",
    "resource": "安全排球",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  },
  {
    "grade": 5,
    "weekNo": 21,
    "weekStr": "二十一",
    "dateRange": "01.18~01.24",
    "schoolEvent": "1/20 休業式",
    "venue": "籃球場",
    "unitTitle": "體適能",
    "suggestedContent": "心肺耐力遊戲",
    "keyFocus": "1/20 休業式 | 場地: 籃球場",
    "resource": "",
    "evalMethod": "技能操作70% 學習態度10% 體育常識20%"
  }
];

export const MOCK_CURRICULUM_GRADE6 = [
  {
    "grade": 6,
    "weekNo": 1,
    "weekStr": "一",
    "dateRange": "08.31~09.06",
    "schoolEvent": "8/31 開學",
    "venue": "體育館",
    "unitTitle": "課程說明",
    "suggestedContent": "柔軟度測驗、仰臥起坐",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 體育館",
    "resource": "體前彎測量器",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 2,
    "weekStr": "二",
    "dateRange": "09.07~09.13",
    "schoolEvent": "9/12 班親會",
    "venue": "體育館",
    "unitTitle": "羽球",
    "suggestedContent": "正手發球",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 體育館",
    "resource": "羽球拍",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 3,
    "weekStr": "三",
    "dateRange": "09.14~09.20",
    "schoolEvent": "",
    "venue": "體育館",
    "unitTitle": "羽球",
    "suggestedContent": "正手高遠球",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 體育館",
    "resource": "羽球拍",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 4,
    "weekStr": "四",
    "dateRange": "09.21~09.27",
    "schoolEvent": "9/22-24 市運會 9/25 中秋節放假",
    "venue": "體育館",
    "unitTitle": "羽球",
    "suggestedContent": "正手發球",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 體育館",
    "resource": "羽球拍",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 5,
    "weekStr": "五",
    "dateRange": "09.28~10.04",
    "schoolEvent": "9/28 教師節放假",
    "venue": "操場",
    "unitTitle": "田徑",
    "suggestedContent": "測100M、200M",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 操場",
    "resource": "角錐、圓盤",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 6,
    "weekStr": "六",
    "dateRange": "10.05~10.11",
    "schoolEvent": "10/09國慶日補假",
    "venue": "操場",
    "unitTitle": "羽球",
    "suggestedContent": "正手高遠球",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 操場",
    "resource": "羽球拍",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 7,
    "weekStr": "七",
    "dateRange": "10.12~10.18",
    "schoolEvent": "10/13 流感疫苗接種 校慶運動競賽預賽",
    "venue": "操場",
    "unitTitle": "羽球",
    "suggestedContent": "正手發球測驗",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 操場",
    "resource": "羽球拍",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 8,
    "weekStr": "八",
    "dateRange": "10.19~10.25",
    "schoolEvent": "中小學排球校際聯賽",
    "venue": "操場",
    "unitTitle": "田徑",
    "suggestedContent": "接力練習",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 操場",
    "resource": "接力棒、角錐",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 9,
    "weekStr": "九",
    "dateRange": "10.26~11.01",
    "schoolEvent": "10/26 光復節補假 校慶運動競賽預賽",
    "venue": "操場",
    "unitTitle": "田徑",
    "suggestedContent": "接力練習",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 操場",
    "resource": "接力棒、角錐",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 10,
    "weekStr": "十",
    "dateRange": "11.02~11.08",
    "schoolEvent": "11/5-6 期中考",
    "venue": "操場",
    "unitTitle": "羽球",
    "suggestedContent": "正手高遠球測驗",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 操場",
    "resource": "羽球拍",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 11,
    "weekStr": "十一",
    "dateRange": "11.10~11.16",
    "schoolEvent": "校慶運動競賽決賽",
    "venue": "體育館",
    "unitTitle": "田徑",
    "suggestedContent": "跳高落墊、起跳",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 體育館",
    "resource": "橡皮繩",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 12,
    "weekStr": "十二",
    "dateRange": "11.16~11.22",
    "schoolEvent": "11/20 戲劇比賽",
    "venue": "體育館",
    "unitTitle": "田徑",
    "suggestedContent": "跳高助跑、跳高全程跳",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 體育館",
    "resource": "橡皮繩",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 13,
    "weekStr": "十三",
    "dateRange": "11.23~11.29",
    "schoolEvent": "",
    "venue": "體育館",
    "unitTitle": "田徑",
    "suggestedContent": "跳高測驗",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 體育館",
    "resource": "橡皮繩",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 14,
    "weekStr": "十四",
    "dateRange": "11.30~12.06",
    "schoolEvent": "",
    "venue": "體育館",
    "unitTitle": "體適能檢測",
    "suggestedContent": "立定跳遠、800M",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 體育館",
    "resource": "皮尺",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 15,
    "weekStr": "十五",
    "dateRange": "12.07~12.13",
    "schoolEvent": "校慶週12/12校慶",
    "venue": "籃球場",
    "unitTitle": "籃球",
    "suggestedContent": "球感練習、運球",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 籃球場",
    "resource": "籃球",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 16,
    "weekStr": "十六",
    "dateRange": "12.14~12.20",
    "schoolEvent": "12/20 奧匹科學競賽",
    "venue": "籃球場",
    "unitTitle": "籃球",
    "suggestedContent": "傳球練習",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 籃球場",
    "resource": "籃球",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 17,
    "weekStr": "十七",
    "dateRange": "12.21~12.27",
    "schoolEvent": "12/25 行憲紀念日放假",
    "venue": "籃球場",
    "unitTitle": "籃球",
    "suggestedContent": "帶球上籃",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 籃球場",
    "resource": "籃球",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 18,
    "weekStr": "十八",
    "dateRange": "12.28~01.03",
    "schoolEvent": "12/31 校慶補假 1/1  元旦放假",
    "venue": "籃球場",
    "unitTitle": "籃球",
    "suggestedContent": "傳接投籃",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 籃球場",
    "resource": "籃球",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 19,
    "weekStr": "十九",
    "dateRange": "01.04~01.10",
    "schoolEvent": "",
    "venue": "體育館",
    "unitTitle": "籃球",
    "suggestedContent": "測驗",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 體育館",
    "resource": "測驗",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 20,
    "weekStr": "二十",
    "dateRange": "01.11~01.17",
    "schoolEvent": "1/12-13 期末考",
    "venue": "體育館",
    "unitTitle": "籃球",
    "suggestedContent": "測驗",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 體育館",
    "resource": "測驗",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  },
  {
    "grade": 6,
    "weekNo": 21,
    "weekStr": "二十一",
    "dateRange": "01.18~01.24",
    "schoolEvent": "1/20 休業式",
    "venue": "操場",
    "unitTitle": "樂樂棒球",
    "suggestedContent": "期末評量",
    "keyFocus": "評量: 技能操作70% 學習態度20% 體育常識10% | 場地: 操場",
    "resource": "期末評量",
    "evalMethod": "技能操作70% 學習態度20% 體育常識10%"
  }
];

// 預設綜合課程進度 (包含五年級與六年級，附 grade 欄位標記)
export const MOCK_CURRICULUM = [
  ...MOCK_CURRICULUM_GRADE5,
  ...MOCK_CURRICULUM_GRADE6
];

export const MOCK_CLASSES = ['五丁', '五戊', '六甲', '六乙'];

export const MOCK_STUDENTS = [
  {
    "classId": "五丁",
    "studentId": "五丁01",
    "seatNo": 1,
    "name": "張小明",
    "gender": "M",
    "age": 11,
    "medicalNotes": "輕微氣喘 (運動前自備吸入劑)"
  },
  {
    "classId": "五丁",
    "studentId": "五丁02",
    "seatNo": 2,
    "name": "吳大同",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁03",
    "seatNo": 3,
    "name": "楊宇軒",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁04",
    "seatNo": 4,
    "name": "謝品皓",
    "gender": "M",
    "age": 11,
    "medicalNotes": "心臟二尖瓣脫垂 (避免劇烈跑步)"
  },
  {
    "classId": "五丁",
    "studentId": "五丁05",
    "seatNo": 5,
    "name": "邱俊傑",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁06",
    "seatNo": 6,
    "name": "陳承翰",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁07",
    "seatNo": 7,
    "name": "張冠宇",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁08",
    "seatNo": 8,
    "name": "吳子翔",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁09",
    "seatNo": 9,
    "name": "楊志強",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁10",
    "seatNo": 10,
    "name": "謝家瑋",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁11",
    "seatNo": 11,
    "name": "邱天佑",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁12",
    "seatNo": 12,
    "name": "陳政男",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁13",
    "seatNo": 13,
    "name": "張依晨",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁14",
    "seatNo": 14,
    "name": "吳婷萱",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁15",
    "seatNo": 15,
    "name": "楊心怡",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁16",
    "seatNo": 16,
    "name": "謝芷涵",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁17",
    "seatNo": 17,
    "name": "邱雨潔",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁18",
    "seatNo": 18,
    "name": "陳雅晴",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁19",
    "seatNo": 19,
    "name": "張佳玲",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五丁",
    "studentId": "五丁20",
    "seatNo": 20,
    "name": "吳宛庭",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊01",
    "seatNo": 1,
    "name": "張小明",
    "gender": "M",
    "age": 11,
    "medicalNotes": "輕微氣喘 (運動前自備吸入劑)"
  },
  {
    "classId": "五戊",
    "studentId": "五戊02",
    "seatNo": 2,
    "name": "吳大同",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊03",
    "seatNo": 3,
    "name": "楊宇軒",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊04",
    "seatNo": 4,
    "name": "謝品皓",
    "gender": "M",
    "age": 11,
    "medicalNotes": "心臟二尖瓣脫垂 (避免劇烈跑步)"
  },
  {
    "classId": "五戊",
    "studentId": "五戊05",
    "seatNo": 5,
    "name": "邱俊傑",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊06",
    "seatNo": 6,
    "name": "陳承翰",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊07",
    "seatNo": 7,
    "name": "張冠宇",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊08",
    "seatNo": 8,
    "name": "吳子翔",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊09",
    "seatNo": 9,
    "name": "楊志強",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊10",
    "seatNo": 10,
    "name": "謝家瑋",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊11",
    "seatNo": 11,
    "name": "邱天佑",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊12",
    "seatNo": 12,
    "name": "陳政男",
    "gender": "M",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊13",
    "seatNo": 13,
    "name": "張依晨",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊14",
    "seatNo": 14,
    "name": "吳婷萱",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊15",
    "seatNo": 15,
    "name": "楊心怡",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊16",
    "seatNo": 16,
    "name": "謝芷涵",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊17",
    "seatNo": 17,
    "name": "邱雨潔",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊18",
    "seatNo": 18,
    "name": "陳雅晴",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊19",
    "seatNo": 19,
    "name": "張佳玲",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "五戊",
    "studentId": "五戊20",
    "seatNo": 20,
    "name": "吳宛庭",
    "gender": "F",
    "age": 11,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲01",
    "seatNo": 1,
    "name": "張小明",
    "gender": "M",
    "age": 12,
    "medicalNotes": "輕微氣喘 (運動前自備吸入劑)"
  },
  {
    "classId": "六甲",
    "studentId": "六甲02",
    "seatNo": 2,
    "name": "吳大同",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲03",
    "seatNo": 3,
    "name": "楊宇軒",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲04",
    "seatNo": 4,
    "name": "謝品皓",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲05",
    "seatNo": 5,
    "name": "邱俊傑",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲06",
    "seatNo": 6,
    "name": "陳承翰",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲07",
    "seatNo": 7,
    "name": "張冠宇",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲08",
    "seatNo": 8,
    "name": "吳子翔",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲09",
    "seatNo": 9,
    "name": "楊志強",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲10",
    "seatNo": 10,
    "name": "謝家瑋",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲11",
    "seatNo": 11,
    "name": "邱天佑",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲12",
    "seatNo": 12,
    "name": "陳政男",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲13",
    "seatNo": 13,
    "name": "張依晨",
    "gender": "F",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲14",
    "seatNo": 14,
    "name": "吳婷萱",
    "gender": "F",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲15",
    "seatNo": 15,
    "name": "楊心怡",
    "gender": "F",
    "age": 12,
    "medicalNotes": "過敏性體質 (劇烈運動後易咳嗽)"
  },
  {
    "classId": "六甲",
    "studentId": "六甲16",
    "seatNo": 16,
    "name": "謝芷涵",
    "gender": "F",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲17",
    "seatNo": 17,
    "name": "邱雨潔",
    "gender": "F",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲18",
    "seatNo": 18,
    "name": "陳雅晴",
    "gender": "F",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲19",
    "seatNo": 19,
    "name": "張佳玲",
    "gender": "F",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六甲",
    "studentId": "六甲20",
    "seatNo": 20,
    "name": "吳宛庭",
    "gender": "F",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙01",
    "seatNo": 1,
    "name": "張小明",
    "gender": "M",
    "age": 12,
    "medicalNotes": "輕微氣喘 (運動前自備吸入劑)"
  },
  {
    "classId": "六乙",
    "studentId": "六乙02",
    "seatNo": 2,
    "name": "吳大同",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙03",
    "seatNo": 3,
    "name": "楊宇軒",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙04",
    "seatNo": 4,
    "name": "謝品皓",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙05",
    "seatNo": 5,
    "name": "邱俊傑",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙06",
    "seatNo": 6,
    "name": "陳承翰",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙07",
    "seatNo": 7,
    "name": "張冠宇",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙08",
    "seatNo": 8,
    "name": "吳子翔",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙09",
    "seatNo": 9,
    "name": "楊志強",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙10",
    "seatNo": 10,
    "name": "謝家瑋",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙11",
    "seatNo": 11,
    "name": "邱天佑",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙12",
    "seatNo": 12,
    "name": "陳政男",
    "gender": "M",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙13",
    "seatNo": 13,
    "name": "張依晨",
    "gender": "F",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙14",
    "seatNo": 14,
    "name": "吳婷萱",
    "gender": "F",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙15",
    "seatNo": 15,
    "name": "楊心怡",
    "gender": "F",
    "age": 12,
    "medicalNotes": "過敏性體質 (劇烈運動後易咳嗽)"
  },
  {
    "classId": "六乙",
    "studentId": "六乙16",
    "seatNo": 16,
    "name": "謝芷涵",
    "gender": "F",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙17",
    "seatNo": 17,
    "name": "邱雨潔",
    "gender": "F",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙18",
    "seatNo": 18,
    "name": "陳雅晴",
    "gender": "F",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙19",
    "seatNo": 19,
    "name": "張佳玲",
    "gender": "F",
    "age": 12,
    "medicalNotes": ""
  },
  {
    "classId": "六乙",
    "studentId": "六乙20",
    "seatNo": 20,
    "name": "吳宛庭",
    "gender": "F",
    "age": 12,
    "medicalNotes": ""
  }
];
