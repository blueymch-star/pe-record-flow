/**
 * PE Record Flow 預設測試資料 (Mock Data)
 * 供本機離線與首次啟動即時預覽
 */

export const MOCK_TIMETABLE = [
  { dayOfWeek: 1, period: 2, classId: '501', location: '操場跑道', startTime: '09:25', endTime: '10:05' },
  { dayOfWeek: 1, period: 4, classId: '502', location: '風雨球場', startTime: '11:10', endTime: '11:50' },
  { dayOfWeek: 2, period: 1, classId: '601', location: '活動中心', startTime: '08:35', endTime: '09:15' },
  { dayOfWeek: 2, period: 3, classId: '501', location: '操場跑道', startTime: '10:20', endTime: '11:00' },
  { dayOfWeek: 3, period: 2, classId: '602', location: '大草皮', startTime: '09:25', endTime: '10:05' },
  { dayOfWeek: 4, period: 2, classId: '502', location: '風雨球場', startTime: '09:25', endTime: '10:05' },
  { dayOfWeek: 5, period: 3, classId: '601', location: '活動中心', startTime: '10:20', endTime: '11:00' },
  { dayOfWeek: 5, period: 5, classId: '602', location: '風雨球場', startTime: '13:20', endTime: '14:00' }
];

export const MOCK_CURRICULUM = [
  { weekNo: 1, unitTitle: '常規建立與暖身', suggestedContent: '集合隊形、健康自主回報、關節操', keyFocus: '安全防護意識' },
  { weekNo: 2, unitTitle: '立定跳遠技巧', suggestedContent: '擺臂與起跳協調練習、梯形跳躍', keyFocus: '起跳屈膝蓄力' },
  { weekNo: 3, unitTitle: '仰臥捲腹核心體能', suggestedContent: '標準動作檢核、腹直肌等長收縮', keyFocus: '下背貼地、雙手平推至膝蓋' },
  { weekNo: 4, unitTitle: '800m配速跑走', suggestedContent: '操場配速講解與心率自我觀察', keyFocus: '均速節奏避免開局衝刺' }
];

export const MOCK_STUDENTS = [
  { classId: '501', studentId: '50101', seatNo: 1, name: '陳小明', gender: 'M', age: 11, medicalNotes: '輕微氣喘 (運動前需噴劑)' },
  { classId: '501', studentId: '50102', seatNo: 2, name: '林大同', gender: 'M', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50103', seatNo: 3, name: '張宇軒', gender: 'M', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50104', seatNo: 4, name: '王品皓', gender: 'M', age: 11, medicalNotes: '心臟二尖瓣脫垂 (避免劇烈跑步)' },
  { classId: '501', studentId: '50105', seatNo: 5, name: '黃俊傑', gender: 'M', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50106', seatNo: 6, name: '李承翰', gender: 'M', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50107', seatNo: 7, name: '趙冠宇', gender: 'M', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50108', seatNo: 8, name: '周子翔', gender: 'M', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50109', seatNo: 9, name: '吳志強', gender: 'M', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50110', seatNo: 10, name: '許家瑋', gender: 'M', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50111', seatNo: 11, name: '鄭天佑', gender: 'M', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50112', seatNo: 12, name: '蔡政男', gender: 'M', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50121', seatNo: 21, name: '林依晨', gender: 'F', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50122', seatNo: 22, name: '黃婷萱', gender: 'F', age: 11, medicalNotes: '過敏性體質' },
  { classId: '501', studentId: '50123', seatNo: 23, name: '張心怡', gender: 'F', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50124', seatNo: 24, name: '陳芷涵', gender: 'F', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50125', seatNo: 25, name: '劉雨潔', gender: 'F', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50126', seatNo: 26, name: '楊雅晴', gender: 'F', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50127', seatNo: 27, name: '葉佳玲', gender: 'F', age: 11, medicalNotes: '' },
  { classId: '501', studentId: '50128', seatNo: 28, name: '謝宛庭', gender: 'F', age: 11, medicalNotes: '' }
];
