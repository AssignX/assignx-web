// src/pages/professor/parsingTime.js

const DAY_CHARS = ['월', '화', '수', '목', '금', '토', '일'];
const DAY_TO_INDEX = { 일: 0, 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6 };
const BASE_START_MIN = 8 * 60;

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

const minutesToHHMM = (min) => {
  const h = String(Math.floor(min / 60)).padStart(2, '0');
  const m = String(min % 60).padStart(2, '0');
  return `${h}:${m}`;
};

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

const buildApplicationOptions = (courseTime, examPeriod) => {
  const startDate = toDateOnly(examPeriod.midFirstStartDateTime);
  const endDate = toDateOnly(examPeriod.midFirstEndDateTime);
  if (!startDate || !endDate) return [];

  const daySlotsList = parseCourseTimeToDaySlots(courseTime);
  const options = [];

  daySlotsList.forEach(({ day, slots }) => {
    const timeRangesText = buildTimeRangesFromSlots(slots);
    if (!timeRangesText) return;

    const dates = getDatesWithinPeriodForDay(startDate, endDate, day);

    dates.forEach((d) => {
      const dateStr = formatDate(d);
      const label = `${dateStr}(${day}) ${timeRangesText}`;
      options.push({ value: label, label });
    });
  });

  return options;
};

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

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

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

export {
  buildApplicationOptions,
  parseApplicationTimeToISO,
  formatExamDateTimeRange,
};
