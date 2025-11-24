import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { CalendarDaysIcon } from '@/assets/icons';
import ButtonGroup from '../buttons/ButtonGroup';

const parseTime = (str) => {
  if (!str) return null;
  const [h, m] = str.split(':').map((v) => parseInt(v, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return { h, m };
};

const combineDateAndTime = (date, timeStr) => {
  if (!date || !timeStr) return undefined;
  const t = parseTime(timeStr);
  if (!t) return undefined;
  const d = new Date(date);
  d.setHours(t.h, t.m, 0, 0);
  return d;
};

const formatPlaceholder = (date, startStr, endStr) => {
  if (!date || !startStr || !endStr) return '날짜/시간을 선택해 주세요.';
  const d = dayjs(date);
  if (!d.isValid()) return '날짜/시간을 선택해 주세요.';
  return `${d.format('YYYY.MM.DD.')} ${startStr}~${endStr}`;
};

const addMinutesToTime = (timeStr, minutes) => {
  const t = parseTime(timeStr);
  if (!t) return timeStr;
  let total = t.h * 60 + t.m + minutes;
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}`;
};

function DateTimePicker({ initialDate, initialStart, initialEnd, onUpdate }) {
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

  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);
  const wrapperRef = useRef(null);
  const [anchorStyle, setAnchorStyle] = useState(null);

  const [editDate, setEditDate] = useState(new Date());
  const [editStart, setEditStart] = useState('09:00');
  const [editEnd, setEditEnd] = useState('12:00');

  const openEditor = () => {
    setEditDate(date ?? new Date());
    setEditStart(startStr || '09:00');
    setEditEnd(endStr || '12:00');

    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setAnchorStyle({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }

    setOpen(true);
  };

  const handleCancel = () => {
    setEditDate(date ?? new Date());
    setEditStart(startStr || '09:00');
    setEditEnd(endStr || '12:00');
    setOpen(false);
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
    <div ref={wrapperRef} className='relative inline-flex w-full'>
      <button
        type='button'
        onClick={openEditor}
        className='border-light-gray flex w-full items-center justify-between border p-[10px]'
        style={{ cursor: 'pointer', fontSize: '13px' }}
      >
        <span className='leading-[16px]'>{placeholder}</span>
        <CalendarDaysIcon />
      </button>

      {open && (
        <div
          ref={popoverRef}
          className='border-light-gray z-[9999] rounded border bg-white p-3 shadow-lg'
          role='dialog'
          aria-modal='true'
          style={{
            position: 'fixed',
            top: anchorStyle?.top ?? 0,
            left: anchorStyle?.left ?? 0,
            width: anchorStyle?.width ?? 'auto',
          }}
        >
          <div>
            <div className='flex flex-col gap-2'>
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

              <div>
                <div className='text-text-sub mb-1 text-xs'>시간</div>
                <div className='flex items-center gap-2'>
                  <input
                    type='time'
                    className='border-light-gray w-full rounded border px-2 py-1 text-sm'
                    value={editStart}
                    onChange={(e) => {
                      const v = e.target.value;
                      setEditStart(v);
                      setEditEnd(addMinutesToTime(v, 90));
                    }}
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

          <div className='flex items-center justify-end pt-3'>
            <ButtonGroup
              buttons={[
                { text: '취소', color: 'lightgray', onClick: handleCancel },
                { text: '확인', color: 'red', onClick: handleUpdate },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

DateTimePicker.propTypes = {
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

export default DateTimePicker;
