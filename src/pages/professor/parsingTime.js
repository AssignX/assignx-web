const DAY_CHARS = ['월', '화', '수', '목', '금', '토', '일'];
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const DAY_TO_INDEX = { 일: 0, 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6 };

const BASE_START_MIN = 8 * 60;
const DEFAULT_TIMETABLE_END_MIN = 20 * 60;
const SLOT_INTERVAL_MINUTES = 30;

const minutesToHHMM = (min) => {
  const h = String(Math.floor(min / 60)).padStart(2, '0');
  const m = String(min % 60).padStart(2, '0');
  return `${h}:${m}`;
};

const toDateOnly = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const formatDate = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd}`;
};

// ---- 슬롯 / 강의시간 파싱 ----
const parseSlotLabel = (label) => {
  const cleaned = label.replace(/\s+/g, '');
  const m = cleaned.match(/(\d+)([AB])/);
  if (!m) return null;
  const num = parseInt(m[1], 10);
  const half = m[2] === 'A' ? 0 : 1;
  return { num, half };
};

const slotIndex = (num, half) => num * 2 + half;

const slotToStartMinutes = (num, half) =>
  BASE_START_MIN + num * 60 + (half === 0 ? 0 : 30);

const minutesToSlotLabel = (
  minutes,
  {
    startMinutes = BASE_START_MIN,
    endMinutes = DEFAULT_TIMETABLE_END_MIN,
    intervalMinutes = SLOT_INTERVAL_MINUTES,
  } = {}
) => {
  if (minutes < startMinutes || minutes >= endMinutes) return null;

  const offset = minutes - startMinutes;
  const slotIndex = Math.floor(offset / intervalMinutes);
  const hourIndex = Math.floor(slotIndex / 2);
  const halfIndex = slotIndex % 2;
  return `${hourIndex}${halfIndex === 0 ? 'A' : 'B'}`;
};

// "01A,01B,03A,03B" → "09:00~10:00, 11:00~12:00"
const buildTimeRangesFromSlots = (slots) => {
  const parsed = slots
    .map((s) => parseSlotLabel(s))
    .filter((v) => !!v)
    .sort((a, b) => slotIndex(a.num, a.half) - slotIndex(b.num, b.half));

  if (!parsed.length) return '';

  const ranges = [];
  let rangeStart = parsed[0];
  let prev = parsed[0];

  for (let i = 1; i < parsed.length; i++) {
    const cur = parsed[i];
    const prevIdx = slotIndex(prev.num, prev.half);
    const curIdx = slotIndex(cur.num, cur.half);

    if (curIdx > prevIdx + 1) {
      const startMin = slotToStartMinutes(rangeStart.num, rangeStart.half);
      const endMin = slotToStartMinutes(prev.num, prev.half) + 30;
      ranges.push(`${minutesToHHMM(startMin)}~${minutesToHHMM(endMin)}`);
      rangeStart = cur;
    }
    prev = cur;
  }

  const startMin = slotToStartMinutes(rangeStart.num, rangeStart.half);
  const endMin = slotToStartMinutes(prev.num, prev.half) + 30;
  ranges.push(`${minutesToHHMM(startMin)}~${minutesToHHMM(endMin)}`);

  return ranges.join(', ');
};

// "목 01A,01B,03A,03B, 화 02A,02B" → [{ day:'목', slots:[...] }, { day:'화', slots:[...] }]
const parseCourseTimeToDaySlots = (courseTime) => {
  const result = [];
  if (!courseTime) return result;

  const tokens = courseTime.split(',');
  let currentDay = null;

  const addSlot = (day, slotRaw) => {
    const slot = slotRaw.replace(/\s+/g, '');
    if (!slot) return;
    let entry = result.find((r) => r.day === day);
    if (!entry) {
      entry = { day, slots: [] };
      result.push(entry);
    }
    entry.slots.push(slot);
  };

  tokens.forEach((raw) => {
    const token = raw.trim();
    if (!token) return;

    const dayChar = DAY_CHARS.find((d) => token.startsWith(d));
    if (dayChar) {
      currentDay = dayChar;
      const rest = token.substring(dayChar.length).trim();
      if (rest) addSlot(dayChar, rest);
    } else if (currentDay) {
      addSlot(currentDay, token);
    }
  });

  return result;
};

// ---- 시험 기간 내 날짜 계산 ----
const getDatesWithinPeriodForDay = (start, end, day) => {
  const targetDow = DAY_TO_INDEX[day];
  const dates = [];
  const cur = new Date(start.getTime());

  while (cur <= end) {
    if (cur.getDay() === targetDow) {
      dates.push(new Date(cur.getFullYear(), cur.getMonth(), cur.getDate()));
    }
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
};

// ---- 1차 시험 신청용 Dropdown 옵션 생성 ----
// courseTime: "목 01A,01B,03A,03B"
// examPeriod: { midFirstStartDateTime, midFirstEndDateTime, ... }
// ---- 1차 시험 신청용 Dropdown 옵션 생성 ----
// courseTime: "목 01A,01B,03A,03B"
// examPeriod: { midFirstStartDateTime, midFirstEndDateTime, ... }
const buildApplicationOptions = (courseTime, examPeriod) => {
  const startDate = toDateOnly(examPeriod.midFirstStartDateTime);
  const endDate = toDateOnly(examPeriod.midFirstEndDateTime);
  if (!startDate || !endDate) return [];

  const daySlotsList = parseCourseTimeToDaySlots(courseTime);
  const candidates = [];

  daySlotsList.forEach(({ day, slots }) => {
    const timeRangesText = buildTimeRangesFromSlots(slots);
    if (!timeRangesText) return;

    const dates = getDatesWithinPeriodForDay(startDate, endDate, day);

    dates.forEach((d) => {
      candidates.push({ date: d, day, timeRangesText });
    });
  });

  candidates.sort((a, b) => {
    const at = a.date.getTime();
    const bt = b.date.getTime();
    if (at !== bt) return at - bt;
    return DAY_TO_INDEX[a.day] - DAY_TO_INDEX[b.day];
  });

  const options = candidates.map(({ date, day, timeRangesText }) => {
    const dateStr = formatDate(date);
    const label = `${dateStr}(${day}) ${timeRangesText}`;
    return { value: label, label };
  });

  return options;
};

// "2025/10/23(목) 09:00~10:00, 11:00~12:00" → ISO 시작/끝
const parseApplicationTimeToISO = (applicationTime) => {
  if (!applicationTime) return { startTime: null, endTime: null };

  const [datePart, timePart] = applicationTime.split(' ');
  if (!datePart || !timePart) return { startTime: null, endTime: null };

  const m = datePart.match(/(\d{4})\/(\d{2})\/(\d{2})/);
  if (!m) return { startTime: null, endTime: null };
  const [, yyyy, mm, dd] = m;

  const firstRange = timePart.split(',')[0].trim();
  const [startHHMM, endHHMM] = firstRange.split('~').map((s) => s.trim());
  if (!startHHMM || !endHHMM) return { startTime: null, endTime: null };

  const datePrefix = `${yyyy}-${mm}-${dd}`;
  return {
    startTime: `${datePrefix}T${startHHMM}:00Z`,
    endTime: `${datePrefix}T${endHHMM}:00Z`,
  };
};

// ---- 확정 시간 포맷팅 ----
// ISO 두 개 → "2025/10/23(목) 13:00~15:00"
const formatExamDateTimeRange = (startIso, endIso) => {
  if (!startIso || !endIso) return '';
  const s = new Date(startIso);
  const e = new Date(endIso);

  const dateStr = formatDate(s);
  const dayChar = WEEKDAYS[s.getDay()];

  const startMinutes = s.getHours() * 60 + s.getMinutes();
  const endMinutes = e.getHours() * 60 + e.getMinutes();

  const startTime = minutesToHHMM(startMinutes);
  const endTime = minutesToHHMM(endMinutes);

  return `${dateStr}(${dayChar}) ${startTime}~${endTime}`;
};

// ---- 강의시간 → "월 09:00~11:00, 수 13:00~15:00" 텍스트 ----
const buildCourseRealTime = (courseTime) => {
  const daySlotsList = parseCourseTimeToDaySlots(courseTime);
  if (!daySlotsList.length) return '';

  const dayStrings = daySlotsList.map(({ day, slots }) => {
    const rangesText = buildTimeRangesFromSlots(slots);
    if (!rangesText) return '';
    return rangesText
      .split(',')
      .map((seg) => `${day} ${seg.trim()}`)
      .join(', ');
  });

  return dayStrings.filter(Boolean).join(', ');
};

// ---- 강의목록 → 시간표 엔트리 맵 ----
// result key: "목-01A"  value: "과목명\n코드"
const buildTimeTableEntries = (courses) => {
  const result = {};

  courses.forEach((course) => {
    const { courseTime, courseName, courseCode } = course;
    if (!courseTime) return;

    const display = `${courseName}\n${courseCode}`;
    const daySlotsList = parseCourseTimeToDaySlots(courseTime);

    daySlotsList.forEach(({ day, slots }) => {
      slots.forEach((slot) => {
        result[`${day}-${slot}`] = display;
      });
    });
  });

  return result;
};

// ---- 1차 시험 신청 기간 체크 & MID/FINAL 구분 ----
const isWithinPeriod = (now, startIso, endIso) => {
  if (!startIso || !endIso) return false;
  const t = now.getTime();
  const s = new Date(startIso).getTime();
  const e = new Date(endIso).getTime();
  return t >= s && t <= e;
};

// examPeriod: /api/exam-period 응답 객체
// 현재 시각 기준으로 1차(MID/FINAL) 중 어느 기간인지 판별
const getFirstExamTypeForNow = (examPeriod, now = new Date()) => {
  if (!examPeriod) return null;

  const inMidFirst = isWithinPeriod(
    now,
    examPeriod.midFirstStartDateTime,
    examPeriod.midFirstEndDateTime
  );

  const inFinalFirst = isWithinPeriod(
    now,
    examPeriod.finalFirstStartDateTime,
    examPeriod.finalFirstEndDateTime
  );

  if (inMidFirst && !inFinalFirst) return 'MID';
  if (!inMidFirst && inFinalFirst) return 'FINAL';

  // 둘 다 겹치거나 둘 다 아니면 처리 곤란 → null
  if (inMidFirst && inFinalFirst) return 'MID'; // 겹치는 경우에는 우선 MID로 처리
  return null;
};

export {
  // 1차 신청 관련
  buildApplicationOptions,
  parseApplicationTimeToISO,
  formatExamDateTimeRange,
  // 시간표/강의시간 관련
  buildCourseRealTime,
  buildTimeTableEntries,
  minutesToSlotLabel,
  SLOT_INTERVAL_MINUTES,
  WEEKDAYS,
  // 1차 시험
  getFirstExamTypeForNow,
};
