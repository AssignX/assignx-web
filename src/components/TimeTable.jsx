import PropTypes from 'prop-types';

// HH:mm → 총 분수
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map((n) => parseInt(n, 10));
  return h * 60 + m;
};

// 분수 → HH:mm
const fromMinutes = (min) => {
  const h = String(Math.floor(min / 60)).padStart(2, '0');
  const m = String(min % 60).padStart(2, '0');
  return `${h}:${m}`;
};

// 30분 단위 슬롯 생성
function buildSlots(startHHMM, endHHMM) {
  const start = toMinutes(startHHMM);
  const end = toMinutes(endHHMM);
  const slots = [];
  let idxHour = 0;

  for (let t = start; t < end; t += 30) {
    const from = t;
    const to = Math.min(t + 30, end);
    const delta = t - start;
    const isA = delta % 60 === 0;
    if (delta > 0 && delta % 60 === 0) idxHour++;

    const label = `${idxHour}${isA ? 'A' : 'B'}`;
    slots.push({
      key: `${label}`,
      label,
      rangeText: `(${fromMinutes(from)}~${fromMinutes(to)})`,
      from: fromMinutes(from),
      to: fromMinutes(to),
    });
  }
  return slots;
}

/**
 * Timetable 컴포넌트
 * @props {string} startTime - 시작 시간 ("HH:mm" 형식, 예: "08:00")
 * @props {string} endTime - 종료 시간 ("HH:mm" 형식, 예: "18:00")
 * @props {string[]} dayRange - 요일 배열 (예: ["월", "화", "수", "목", "금", "토", "일"])
 * @props {Object.<string, string>} [entries] - 시간표에 표시할 데이터 객체 (기본값: {})
 *   키 형식: "요일-슬롯" (예: "월-0A", "수-2B")
 *   값: 해당 칸에 표시할 텍스트 (\n 가능)
 * @props {string} [maxHeight] - 테이블 최대 높이 (예: "400px"), 지정 시 스크롤 가능 (기본 height: auto)
 *
 * @example
 * <Timetable
 *   startTime="08:00"
 *   endTime="18:00"
 *   dayRange={["월", "화", "수", "목", "금"]}
 *   entries={{
 *     "월-0A": "대학글쓰기\nCLTF0205054",
 *     "수-2B": "종합설계프로젝트1\nITEC0401003",
 *   }}
 * />
 */
function Timetable({ startTime, endTime, dayRange, entries = {}, maxHeight }) {
  const slots = buildSlots(startTime, endTime);

  return (
    <div
      className={`w-full ${maxHeight ? 'overflow-y-auto' : ''} whitespace-pre-line`}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <table className='w-full table-fixed border-collapse text-[13px]'>
        {/* 헤더 */}
        <thead>
          <tr>
            <th className='border-table-border bg-table-header-background h-[40px] w-[104px] border p-2 text-center'>
              시간
            </th>
            {dayRange.map((d) => (
              <th
                key={d}
                className='border-table-border bg-table-header-background border p-2 text-center'
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>

        {/* 바디 */}
        <tbody>
          {slots.map((slot) => (
            <tr key={slot.key}>
              {/* 왼쪽 시간 라벨 */}
              <td className='border-table-border w-fit border px-[8px] py-[4px] text-center align-middle whitespace-nowrap'>
                <div className='text-text-main'>{slot.label}</div>
                <div className='text-text-main'>{slot.rangeText}</div>
              </td>

              {/* 요일별 셀 */}
              {dayRange.map((d) => {
                const cellKey = `${d}-${slot.label}`; // 예: "월-0A"
                return (
                  <td
                    key={cellKey}
                    className='border-table-border text-text-main h-[50px] min-h-[50px] w-full border px-[8px] py-[4px] text-center'
                  >
                    {entries[cellKey] || ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Timetable.propTypes = {
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  dayRange: PropTypes.arrayOf(PropTypes.string).isRequired,
  entries: PropTypes.object,
  maxHeight: PropTypes.string,
};

export default Timetable;
