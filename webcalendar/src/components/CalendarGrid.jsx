// src/components/CalendarGrid.jsx
import { motion, AnimatePresence } from 'framer-motion';

// Mapping categories to their specific Tailwind color themes
const THEMES = {
  default: { core: 'bg-blue-500', range: 'bg-blue-50' },
  work: { core: 'bg-indigo-600', range: 'bg-indigo-50' },
  holiday: { core: 'bg-emerald-500', range: 'bg-emerald-50' },
  personal: { core: 'bg-amber-500', range: 'bg-amber-50' },
  pending: { core: 'bg-gray-400', range: 'bg-gray-100' } // For unsaved selections
};

export default function CalendarGrid({ currentDate, events, pendingSelection, onDateClick, direction }) {
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  
  const generateGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid = [];

    // Helper to format Date objects to YYYY-MM-DD for comparison
    const fmt = (y, m, d) => {
        const date = new Date(y, m, d);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    for (let i = startOffset - 1; i >= 0; i--) grid.push({ date: daysInPrevMonth - i, str: fmt(year, month - 1, daysInPrevMonth - i), current: false, weekend: (grid.length % 7 >= 5) });
    for (let i = 1; i <= daysInMonth; i++) grid.push({ date: i, str: fmt(year, month, i), current: true, weekend: (grid.length % 7 >= 5) });
    
    let nextDay = 1;
    while (grid.length < 42) {
      grid.push({ date: nextDay, str: fmt(year, month + 1, nextDay), current: false, weekend: (grid.length % 7 >= 5) });
      nextDay++;
    }
    return grid;
  };

  const gridData = generateGrid();

  // Determine what theme a specific date gets
  const getDayStatus = (dateStr) => {
    // 1. Check if it's currently being selected (pending)
    if (pendingSelection.start) {
      const { start, end } = pendingSelection;
      if (dateStr === start) return { type: 'start', theme: THEMES.pending };
      if (end && dateStr === end) return { type: 'end', theme: THEMES.pending };
      if (end && dateStr > start && dateStr < end) return { type: 'in-range', theme: THEMES.pending };
    }

    // 2. Check saved events
    const event = events.find(ev => dateStr >= ev.startDate && dateStr <= (ev.endDate || ev.startDate));
    if (event) {
      const theme = THEMES[event.category || 'default'];
      if (dateStr === event.startDate && dateStr === event.endDate) return { type: 'single', theme };
      if (dateStr === event.startDate) return { type: 'start', theme };
      if (dateStr === event.endDate) return { type: 'end', theme };
      return { type: 'in-range', theme };
    }

    return null; // Normal day
  };

  return (
    <div className="w-full pb-2">
      {/* Reduced bottom margin from mb-4 to mb-2 */}
      <div className="grid grid-cols-7 mt-4 mb-2">
        {daysOfWeek.map((day, index) => (
          <div key={day} className={`text-[10px] font-bold text-center tracking-wider ${index >= 5 ? 'text-[#0088cc]' : 'text-gray-600'}`}>
            {day}
          </div>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div 
          key={currentDate.toISOString()} 
          initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          // Reduced vertical gap from gap-y-2 to gap-y-1
          className="grid grid-cols-7 gap-y-1"
        >
          {gridData.map((item, index) => {
            const status = getDayStatus(item.str);
            
            let textColor = "text-gray-800";
            if (!item.current) textColor = "text-gray-300";
            else if (item.weekend) textColor = "text-[#0088cc]";
            
            // Override text color for solid nodes
            if (status && (status.type === 'start' || status.type === 'end' || status.type === 'single')) {
                textColor = "text-white";
            }

            return (
              // Reduced vertical padding from py-1 to py-0.5
              <div key={index} className="relative flex justify-center py-0.5">
                {/* Visual connectors for ranges based on category theme */}
                {status && status.type === 'in-range' && (
                  <div className={`absolute inset-y-0.5 inset-x-0 ${status.theme.range}`}></div>
                )}
                {status && status.type === 'start' && status.type !== 'single' && (
                  <div className={`absolute inset-y-0.5 right-0 w-1/2 ${status.theme.range}`}></div>
                )}
                {status && status.type === 'end' && (
                  <div className={`absolute inset-y-0.5 left-0 w-1/2 ${status.theme.range}`}></div>
                )}

                {/* Clickable Circle: Shrunk w-8 h-8 to w-7 h-7, and text-sm to text-xs */}
                <motion.button 
                  onClick={() => onDateClick(item.str)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={`
                    relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors font-medium
                    ${textColor}
                    ${status && (status.type === 'start' || status.type === 'end' || status.type === 'single') ? `${status.theme.core} shadow-md` : 'hover:bg-gray-200'}
                  `}
                >
                  {item.date}
                </motion.button>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}