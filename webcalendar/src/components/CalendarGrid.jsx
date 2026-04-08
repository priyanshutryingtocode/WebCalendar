// src/components/CalendarGrid.jsx
import { motion } from 'framer-motion';

const THEMES = {
  default: { core: 'bg-blue-500', range: 'bg-blue-50 dark:bg-blue-500/20' },
  work: { core: 'bg-indigo-600', range: 'bg-indigo-50 dark:bg-indigo-500/20' },
  holiday: { core: 'bg-emerald-500', range: 'bg-emerald-50 dark:bg-emerald-500/20' },
  personal: { core: 'bg-amber-500', range: 'bg-amber-50 dark:bg-amber-500/20' },
  pending: { core: 'bg-gray-400', range: 'bg-gray-100 dark:bg-gray-700/50' }
};

export default function CalendarGrid({ currentDate, events, pendingSelection, onDateClick }) {
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  
  const generateGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid = [];
    const fmt = (y, m, d) => {
        const date = new Date(y, m, d);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    for (let i = startOffset - 1; i >= 0; i--) grid.push({ date: daysInPrevMonth - i, str: fmt(year, month - 1, daysInPrevMonth - i), current: false });
    for (let i = 1; i <= daysInMonth; i++) grid.push({ date: i, str: fmt(year, month, i), current: true });
    
    let nextDay = 1;
    while (grid.length < 42) {
      grid.push({ date: nextDay, str: fmt(year, month + 1, nextDay), current: false });
      nextDay++;
    }
    return grid;
  };

  const getDayStatus = (dateStr) => {
    // 1. Pending Check
    if (pendingSelection.start) {
      const { start, end } = pendingSelection;
      if (start && !end && dateStr === start) return { type: 'single', theme: THEMES.pending };
      if (start && end) {
        if (dateStr === start) return { type: 'start', theme: THEMES.pending };
        if (dateStr === end) return { type: 'end', theme: THEMES.pending };
        if (dateStr > start && dateStr < end) return { type: 'in-range', theme: THEMES.pending };
      }
    }

    // 2. Event Sorting (Longest for BG, Shortest for Marker)
    const sortedEvents = [...events].sort((a, b) => {
        const lenA = new Date(a.endDate) - new Date(a.startDate);
        const lenB = new Date(b.endDate) - new Date(b.startDate);
        return lenA - lenB;
    });

    const focusEvent = sortedEvents.find(ev => dateStr >= ev.startDate && dateStr <= (ev.endDate || ev.startDate));
    if (!focusEvent) return null;

    const backgroundEvent = sortedEvents[sortedEvents.length - 1]; // Longest
    const focusTheme = THEMES[focusEvent.category || 'default'];
    const bgTheme = THEMES[backgroundEvent.category || 'default'];

    let focusType = 'in-range';
    if (focusEvent.startDate === focusEvent.endDate) focusType = 'single';
    else if (dateStr === focusEvent.startDate) focusType = 'start';
    else if (dateStr === focusEvent.endDate) focusType = 'end';

    return {
      type: focusType,
      theme: focusTheme,
      bgRangeClass: bgTheme.range,
      isBridged: backgroundEvent.id !== focusEvent.id && dateStr >= backgroundEvent.startDate && dateStr <= backgroundEvent.endDate
    };
  };

  const gridData = generateGrid();

  return (
    <div className="w-full pb-2">
      <div className="grid grid-cols-7 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-[10px] font-bold text-center text-gray-600 dark:text-gray-400 uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {gridData.map((item, index) => {
          const status = getDayStatus(item.str);
          
          return (
            <div key={index} className="relative flex justify-center py-0.5">
              {/* THE CONTINUOUS BRIDGE */}
              {(status?.type === 'in-range' || status?.isBridged) && (
                <div className={`absolute inset-y-0.5 inset-x-0 ${status.bgRangeClass || status.theme.range}`}></div>
              )}

              {/* START/END CAPS (Only if not bridged) */}
              {status?.type === 'start' && !status?.isBridged && (
                <div className={`absolute inset-y-0.5 right-0 w-1/2 ${status.theme.range}`}></div>
              )}
              {status?.type === 'end' && !status?.isBridged && (
                <div className={`absolute inset-y-0.5 left-0 w-1/2 ${status.theme.range}`}></div>
              )}

              <motion.button 
                onClick={() => onDateClick(item.str)}
                className={`
                  relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors font-medium
                  ${!item.current ? 'text-gray-300 dark:text-gray-600' : 'text-gray-800 dark:text-gray-100'}
                  ${(status?.type === 'start' || status?.type === 'end' || status?.type === 'single') ? `${status.theme.core} text-white! shadow-md` : 'hover:bg-gray-200 dark:hover:bg-gray-800'}
                `}
              >
                {item.date}
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
}