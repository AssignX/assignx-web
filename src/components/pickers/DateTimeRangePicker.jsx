import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { CalendarDaysIcon } from '@/assets/icons';
import ButtonGroup from '../buttons/ButtonGroup';

// 시간 문자열 파싱 함수 "HH:mm" -> {h, m}
const parseTime = (str) => {
  if (!str) return null;
  const [h, m] = str.split(':').map((v) => parseInt(v, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return { h, m };
};

// date 객체 통합 함수
const combineDateAndTime = (date, timeStr) => {
  if (!date || !timeStr) return undefined;
  const t = parseTime(timeStr);
  if (!t) return undefined;
  const d = new Date(date);
  d.setHours(t.h, t.m, 0, 0);
  return d;
};

// placeholer 생성 함수
const formatPlaceholder = (date, startStr, endStr) => {
  if (!date || !startStr || !endStr) return '날짜/시간을 선택해 주세요.';
  const d = dayjs(date);
  if (!d.isValid()) return '날짜/시간을 선택해 주세요.';
  return `${d.format('YYYY.MM.DD.')} ${startStr}~${endStr}`;
};

function DateTimeRangePicker({
  initialDate,
  initialStart,
  initialEnd,
  onUpdate,
}) {
  const [date, setDate] = useState(() => {
    if (!initialDate) return undefined;
    if (initialDate instanceof Date) return initialDate;
    const d = dayjs(initialDate, 'YYYY-MM-DD', true);
    return d.isValid() ? d.toDate() : undefined;
  });
  const [startStr, setStartStr] = useState(() => {
    if (!initialStart) return '';
    if (initialStart instanceof Date)
      return dayjs(initialStart).format('HH:mm');
    return initialStart;
  });
  const [endStr, setEndStr] = useState(() => {
    if (!initialEnd) return '';
    if (initialEnd instanceof Date) return dayjs(initialEnd).format('HH:mm');
    return initialEnd;
  });

  // PopOver 상태 관리 변수
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  // 시간 관리 변수
  const [editDate, setEditDate] = useState(new Date());
  const [editStart, setEditStart] = useState('09:00');
  const [editEnd, setEditEnd] = useState('12:00');

  // handlers
  const openEditor = () => {
    setEditDate(date ?? new Date());
    setEditStart(startStr || '09:00');
    setEditEnd(endStr || '12:00');
    setOpen(true);
  };
  const handleCancel = () => {
    setEditDate(date ?? new Date());
    setEditStart(startStr || '09:00');
    setEditEnd(endStr || '12:00');
    setOpen(true);
  };
  const handleUpdate = () => {
    const [sh, sm] = (editStart || '').split(':').map(Number);
    const [eh, em] = (editEnd || '').split(':').map(Number);
    const endIsBeforeStart =
      Number.isFinite(sh) &&
      Number.isFinite(sm) &&
      Number.isFinite(eh) &&
      Number.isFinite(em) &&
      (eh < sh || (eh === sh && em < sm));

    const finalStart = editStart;
    const finalEnd = endIsBeforeStart ? editStart : editEnd;

    setDate(editDate);
    setStartStr(finalStart);
    setEndStr(finalEnd);
    setOpen(false);

    if (onUpdate) {
      const from = combineDateAndTime(editDate, finalStart);
      const to = combineDateAndTime(editDate, finalEnd);
      onUpdate({ range: { from, to } });
    }
  };

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e) => {
      if (!popoverRef.current) return;
      if (!popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  const placeholder = formatPlaceholder(date, startStr, endStr);

  return (
    <div className='relative inline-flex w-full'>
      {/* Trigger */}
      <button
        type='button'
        onClick={openEditor}
        className='border-light-gray flex w-full items-center justify-between border p-[10px]'
        style={{ cursor: 'pointer', fontSize: '13px' }}
      >
        <span className='leading-[16px]'>{placeholder}</span>
        <CalendarDaysIcon />
      </button>

      {/* Popover */}
      {open && (
        <>
          <div
            ref={popoverRef}
            className='border-light-gray absolute top-full left-0 z-50 w-full rounded border bg-white p-3 shadow-lg'
            role='dialog'
            aria-modal='true'
          >
            <div>
              <div className='flex flex-col gap-2'>
                {/* 상단: DatePicker */}
                <div>
                  <div className='text-text-sub mb-1 text-xs'>날짜</div>
                  <input
                    type='date'
                    className='border-light-gray w-full rounded border px-2 py-1 text-sm'
                    value={
                      editDate
                        ? dayjs(editDate).format('YYYY-MM-DD')
                        : dayjs().format('YYYY-MM-DD')
                    }
                    onChange={(e) => {
                      const d = dayjs(e.target.value, 'YYYY-MM-DD', true);
                      if (d.isValid()) setEditDate(d.toDate());
                    }}
                  />
                </div>

                {/* 하단: TimePicker */}
                <div>
                  <div className='text-text-sub mb-1 text-xs'>시간</div>
                  <div className='flex items-center gap-2'>
                    <input
                      type='time'
                      className='border-light-gray w-full rounded border px-2 py-1 text-sm'
                      value={editStart}
                      onChange={(e) => setEditStart(e.target.value)}
                    />
                    <span className='text-sm'>~</span>
                    <input
                      type='time'
                      className='border-light-gray w-full rounded border px-2 py-1 text-sm'
                      value={editEnd}
                      onChange={(e) => setEditEnd(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className='flex items-center justify-end pt-3'>
              <ButtonGroup
                buttons={[
                  { text: '취소', color: 'lightgray', onClick: handleCancel },
                  { text: '확인', color: 'red', onClick: handleUpdate },
                ]}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

DateTimeRangePicker.propTypes = {
  initialDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string, // "YYYY-MM-DD"
  ]),
  initialStart: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string, // "HH:mm"
  ]),
  initialEnd: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string, // "HH:mm"
  ]),
  onUpdate: PropTypes.func,
};

export default DateTimeRangePicker;
