// src/components/CalendarGrid.jsx
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendarGrid({ currentDate, startDate, endDate, onDateClick, direction }) {
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  
  const generateGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      grid.push({
        date: daysInPrevMonth - i,
        fullDate: new Date(year, month - 1, daysInPrevMonth - i),
        current: false,
        weekend: (grid.length % 7 >= 5)
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      grid.push({
        date: i,
        fullDate: new Date(year, month, i),
        current: true,
        weekend: (grid.length % 7 >= 5)
      });
    }

    let nextMonthDay = 1;
    while (grid.length < 42) {
      grid.push({
        date: nextMonthDay,
        fullDate: new Date(year, month + 1, nextMonthDay),
        current: false,
        weekend: (grid.length % 7 >= 5)
      });
      nextMonthDay++;
    }

    return grid;
  };

  const gridData = generateGrid();
  const isSameDay = (d1, d2) => d1 && d2 && d1.toDateString() === d2.toDateString();

  return (
    <div className="w-full pb-4">
      <div className="grid grid-cols-7 mb-4">
        {daysOfWeek.map((day, index) => (
          <div 
            key={day} 
            className={`text-[10px] font-bold text-center tracking-wider ${
              index >= 5 ? 'text-[#0088cc]' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div 
          key={currentDate.toISOString()} // Changing the key triggers the animation
          initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="grid grid-cols-7 gap-y-2"
        >
          {gridData.map((item, index) => {
            const isStart = isSameDay(item.fullDate, startDate);
            const isEnd = isSameDay(item.fullDate, endDate);
            const isInRange = startDate && endDate && item.fullDate > startDate && item.fullDate < endDate;
            
            let textColor = "text-gray-800";
            if (!item.current) textColor = "text-gray-300";
            else if (item.weekend) textColor = "text-[#0088cc]";
            
            if (isStart || isEnd) textColor = "text-white";

            return (
              <div key={index} className="relative flex justify-center py-1">
                {isInRange && (
                  <div className="absolute inset-y-1 inset-x-0 bg-[#e6f3fa]"></div>
                )}
                {isStart && endDate && (
                  <div className="absolute inset-y-1 right-0 w-1/2 bg-[#e6f3fa]"></div>
                )}
                {isEnd && startDate && (
                  <div className="absolute inset-y-1 left-0 w-1/2 bg-[#e6f3fa]"></div>
                )}

                {/* Framer Motion applied to the interactive button */}
                <motion.button 
                  onClick={() => onDateClick(item.fullDate)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={`
                    relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors
                    ${textColor}
                    ${isStart || isEnd ? 'bg-[#0088cc] font-bold shadow-md' : 'hover:bg-gray-200 font-medium'}
                    ${!item.current && !isStart && !isEnd ? 'font-normal' : ''}
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