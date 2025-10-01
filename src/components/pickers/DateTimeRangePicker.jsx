import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { CalendarDaysIcon } from '@/assets/icons';
import ButtonGroup from '../buttons/ButtonGroup';

function DateTimeRangePicker() {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  const [editDate, setEditDate] = useState(new Date());
  const [editStart, setEditStart] = useState('09:00');
  const [editEnd, setEditEnd] = useState('12:00');

  const handleCancel = () => setOpen(false);
  const handleUpdate = () => {
    setOpen(false);
  };

  return (
    <div className='relative inline-flex w-full'>
      {/* 트리거 (버튼 대용) */}
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='border-light-gray flex w-full items-center justify-between border p-[10px]'
        style={{ cursor: 'pointer', fontSize: '13px' }}
      >
        <span className='leading-[16px]'>text</span>
        <CalendarDaysIcon />
      </button>
      {/* Popover 패널 */}
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
                {/* 좌측: 날짜 */}
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

                {/* 우측: 시간 범위 */}
                <div>
                  <div className='text-text-sub mb-1 text-xs'>시간</div>
                  <div className='flex items-center gap-2'>
                    <input
                      type='time'
                      step={300} // 5분 단위
                      className='border-light-gray w-full rounded border px-2 py-1 text-sm'
                      value={editStart}
                      onChange={(e) => setEditStart(e.target.value)}
                    />
                    <span className='text-sm'>~</span>
                    <input
                      type='time'
                      step={300}
                      className='border-light-gray w-full rounded border px-2 py-1 text-sm'
                      value={editEnd}
                      onChange={(e) => setEditEnd(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 푸터 액션 */}
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
  // initialDate: PropTypes.oneOfType([
  //   PropTypes.instanceOf(Date),
  //   PropTypes.string, // "YYYY-MM-DD"
  // ]),
  // initialStart: PropTypes.oneOfType([
  //   PropTypes.instanceOf(Date),
  //   PropTypes.string, // "HH:mm"
  // ]),
  // initialEnd: PropTypes.oneOfType([
  //   PropTypes.instanceOf(Date),
  //   PropTypes.string, // "HH:mm"
  // ]),
  // onUpdate: PropTypes.func,
};

export default DateTimeRangePicker;
