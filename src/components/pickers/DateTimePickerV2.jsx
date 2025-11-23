// src/components/pickers/DateTimePickerV2.jsx

import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { CalendarDaysIcon } from '@/assets/icons';
import ButtonGroup from '../buttons/ButtonGroup';

function parseTime(str) {
  if (!str) return null;
  const [h, m] = str.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return { h, m };
}

function combineDateAndTime(date, timeStr) {
  if (!date || !timeStr) return null;
  const t = parseTime(timeStr);
  if (!t) return null;

  // dayjs로 timezone-safe date 생성
  return dayjs(date)
    .set('hour', t.h)
    .set('minute', t.m)
    .set('second', 0)
    .set('millisecond', 0)
    .toDate();
}

function formatPlaceholder(date, startStr, endStr) {
  if (!date || !startStr || !endStr) return '날짜/시간을 선택해 주세요.';
  return `${dayjs(date).format('YYYY.MM.DD.')} ${startStr}~${endStr}`;
}

export default function DateTimePickerV2({
  initialDate,
  initialStart,
  initialEnd,
  onUpdate,
}) {
  // ---------- 내부 상태 ----------
  const [date, setDate] = useState(null);
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');

  const [editDate, setEditDate] = useState(new Date());
  const [editStart, setEditStart] = useState('09:00');
  const [editEnd, setEditEnd] = useState('12:00');

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // ---------- initial값 업데이트 ----------
  useEffect(() => {
    // 날짜
    if (initialDate) {
      const d =
        initialDate instanceof Date
          ? initialDate
          : dayjs(initialDate).isValid()
          ? dayjs(initialDate).toDate()
          : null;
      setDate(d);
      setEditDate(d ?? new Date());
    }

    // 시작 시간
    if (initialStart) {
      const s =
        initialStart instanceof Date
          ? dayjs(initialStart).format('HH:mm')
          : initialStart;
      setStartStr(s);
      setEditStart(s || '09:00');
    }

    // 종료 시간
    if (initialEnd) {
      const e =
        initialEnd instanceof Date
          ? dayjs(initialEnd).format('HH:mm')
          : initialEnd;
      setEndStr(e);
      setEditEnd(e || '12:00');
    }
  }, [initialDate, initialStart, initialEnd]);

  // ---------- 편집기 오픈 ----------
  const openEditor = () => {
    setEditDate(date ?? new Date());
    setEditStart(startStr || '09:00');
    setEditEnd(endStr || '12:00');
    setOpen(true);
  };

  // ---------- 저장 ----------
  const handleUpdate = () => {
    const finalStart = editStart;
    const finalEnd = editEnd;

    const from = combineDateAndTime(editDate, finalStart);
    const to = combineDateAndTime(editDate, finalEnd);

    setDate(editDate);
    setStartStr(finalStart);
    setEndStr(finalEnd);
    setOpen(false);

    if (onUpdate) onUpdate({ range: { from, to } });
  };

  // ---------- 바깥 클릭 close ----------
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const placeholder = formatPlaceholder(date, startStr, endStr);

  return (
    <div className="relative inline-flex w-full">
      {/* 버튼 */}
      <button
        onClick={openEditor}
        type="button"
        className="border-light-gray flex w-full items-center justify-between border p-[10px]"
        style={{ cursor: 'pointer', fontSize: '13px' }}
      >
        <span>{placeholder}</span>
        <CalendarDaysIcon />
      </button>

      {/* 팝오버 */}
      {open && (
        <div
          ref={ref}
          className="absolute top-full left-0 z-50 w-full rounded border bg-white p-3 shadow-lg"
        >
          {/* 날짜 */}
          <div className="mb-3">
            <div className="text-xs text-text-sub mb-1">날짜</div>
            <input
              type="date"
              className="border-light-gray w-full rounded border px-2 py-1 text-sm"
              value={dayjs(editDate).format('YYYY-MM-DD')}
              onChange={(e) => {
                const d = dayjs(e.target.value, 'YYYY-MM-DD', true);
                if (d.isValid()) setEditDate(d.toDate());
              }}
            />
          </div>

          {/* 시간 */}
          <div className="mb-3">
            <div className="text-xs text-text-sub mb-1">시간</div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                className="border-light-gray w-full rounded border px-2 py-1 text-sm"
                value={editStart}
                onChange={(e) => setEditStart(e.target.value)}
              />
              <span>~</span>
              <input
                type="time"
                className="border-light-gray w-full rounded border px-2 py-1 text-sm"
                value={editEnd}
                onChange={(e) => setEditEnd(e.target.value)}
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end">
            <ButtonGroup
              buttons={[
                {
                  text: '취소',
                  color: 'lightgray',
                  onClick: () => setOpen(false),
                },
                {
                  text: '확인',
                  color: 'red',
                  onClick: handleUpdate,
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

DateTimePickerV2.propTypes = {
  initialDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
  initialStart: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
  initialEnd: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
  onUpdate: PropTypes.func,
};
