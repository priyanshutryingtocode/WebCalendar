import { motion } from 'framer-motion';

const THEMES = {
  default: { core: 'bg-blue-500' },
  work: { core: 'bg-indigo-500' },
  holiday: { core: 'bg-emerald-500' },
  personal: { core: 'bg-amber-500' },
  pending: { core: 'bg-blue-400' } 
};

const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function CalendarGrid({
  currentDate,
  events,
  searchQuery,
  pendingSelection,
  onDragStart,
  onDragHover,
  onDragEnd
}) {
  const todayStr = getTodayStr();

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const generateGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const grid = [];

    for (let i = offset - 1; i >= 0; i--) {
      grid.push({ date: daysInPrev - i, str: formatDate(new Date(year, month - 1, daysInPrev - i)), current: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      grid.push({ date: i, str: formatDate(new Date(year, month, i)), current: true });
    }

    while (grid.length < 42) {
      const next = grid.length - daysInMonth - offset + 1;
      grid.push({ date: next, str: formatDate(new Date(year, month + 1, next)), current: false });
    }

    return grid;
  };

  const getDayStatus = (dateStr) => {
    const overlappingEvents = (events || [])
      .filter(ev => dateStr >= ev.startDate && dateStr <= (ev.endDate || ev.startDate))
      .sort((a, b) => {
        const lenA = new Date(a.endDate || a.startDate) - new Date(a.startDate);
        const lenB = new Date(b.endDate || b.startDate) - new Date(b.startDate);
        return lenA - lenB; 
      });

    let bgType = null;
    let bgTheme = null;
    let focusType = null;
    let fgTheme = null;
    let isMatch = true;

    if (overlappingEvents.length > 0) {
      const focusEvent = overlappingEvents[0]; 
      fgTheme = THEMES[focusEvent.category] || THEMES.default;
      
      if (focusEvent.startDate === (focusEvent.endDate || focusEvent.startDate)) focusType = 'single';
      else if (dateStr === focusEvent.startDate) focusType = 'start';
      else if (dateStr === focusEvent.endDate) focusType = 'end';
      else focusType = 'in-range';

      isMatch = !searchQuery || 
        focusEvent.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        focusEvent.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const backgroundEvent = overlappingEvents[overlappingEvents.length - 1];
      bgTheme = THEMES[backgroundEvent.category] || THEMES.default;
      
      if (backgroundEvent.startDate === (backgroundEvent.endDate || backgroundEvent.startDate)) bgType = 'single';
      else if (dateStr === backgroundEvent.startDate) bgType = 'start';
      else if (dateStr === backgroundEvent.endDate) bgType = 'end';
      else bgType = 'in-range';
    }

    if (pendingSelection?.start) {
      const { start, end } = pendingSelection;
      
      if (start === end || !end) {
        if (dateStr === start) {
          focusType = 'single';
          fgTheme = THEMES.pending;
        }
      } 
      else if (start && end) {
        if (dateStr === start) { focusType = 'start'; bgType = 'start'; fgTheme = THEMES.pending; bgTheme = THEMES.pending; }
        else if (dateStr === end) { focusType = 'end'; bgType = 'end'; fgTheme = THEMES.pending; bgTheme = THEMES.pending; }
        else if (dateStr > start && dateStr < end) { focusType = 'in-range'; bgType = 'in-range'; fgTheme = THEMES.pending; bgTheme = THEMES.pending; }
      }
    }

    return {
      bgType,
      bgCoreClass: bgTheme ? bgTheme.core : null,
      focusType,
      fgCoreClass: fgTheme ? fgTheme.core : null,
      isMatch
    };
  };

  const handleTouchMove = (e) => {
    if (!e.touches[0]) return;
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const dateStr = el?.getAttribute('data-date');
    if (dateStr) onDragHover(dateStr);
  };

  return (
    <div 
      className="w-full select-none mt-2 sm:mt-4 touch-none" 
      onMouseUp={onDragEnd} 
      onMouseLeave={onDragEnd}
    >
      <div className="grid grid-cols-7 mb-2 text-[8px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 text-center uppercase tracking-widest">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {generateGrid().map((item, i) => {
          const status = getDayStatus(item.str);
          const isToday = item.str === todayStr;
          
          const filterClass = (searchQuery && status && !status.isMatch) 
            ? 'opacity-20 grayscale pointer-events-none' 
            : 'opacity-100 transition-all duration-300';

          return (
            <div
              key={i}
              data-date={item.str} 
              className={`relative flex justify-center py-0.5 ${filterClass}`}
              onMouseEnter={() => onDragHover(item.str)}
              onTouchMove={handleTouchMove}
            >
              {status?.bgType === 'single' && (
                <div className={`absolute h-6 sm:h-7 w-6 sm:w-7 top-1/2 -translate-y-1/2 rounded-full ${status.bgCoreClass} opacity-25 dark:opacity-30`}></div>
              )}
              {status?.bgType === 'in-range' && (
                <div className={`absolute h-6 sm:h-7 top-1/2 -translate-y-1/2 inset-x-0 ${status.bgCoreClass} opacity-25 dark:opacity-30`}></div>
              )}
              {status?.bgType === 'start' && (
                <div className={`absolute h-6 sm:h-7 top-1/2 -translate-y-1/2 right-0 w-[calc(50%+12px)] sm:w-[calc(50%+14px)] rounded-l-full ${status.bgCoreClass} opacity-25 dark:opacity-30`}></div>
              )}
              {status?.bgType === 'end' && (
                <div className={`absolute h-6 sm:h-7 top-1/2 -translate-y-1/2 left-0 w-[calc(50%+12px)] sm:w-[calc(50%+14px)] rounded-r-full ${status.bgCoreClass} opacity-25 dark:opacity-30`}></div>
              )}

              <motion.button
                layout
                whileTap={{ scale: 0.9 }}
                animate={{ scale: status?.focusType ? 1.05 : 1 }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onDragStart(item.str);
                }}
                onTouchStart={() => onDragStart(item.str)}
                className={`
                  relative z-10 w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center text-[10px] sm:text-xs font-medium rounded-full transition-all
                  ${!item.current ? 'text-gray-300 dark:text-gray-600' : 'text-gray-800 dark:text-gray-100'}
                  
                  ${(status?.focusType === 'start' || status?.focusType === 'end' || status?.focusType === 'single') 
                      ? `${status.fgCoreClass} text-white shadow-sm` 
                      : (!status && item.current ? 'hover:bg-gray-200 dark:hover:bg-gray-800' : '')}
                  
                  ${isToday ? 'ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-white font-bold' : ''}
                `}
              >
                <span className="pointer-events-none">{item.date}</span>
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
}