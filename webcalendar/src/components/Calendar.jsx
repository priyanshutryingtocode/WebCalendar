import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Search, X } from 'lucide-react';

import { useTheme } from '../hooks/useTheme';
import { useHolidays } from '../hooks/useHolidays';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { useLocalStorage } from '../hooks/useLocalStorage';

import CalendarHeader from './CalendarHeader';
import NotesSection from './NotesSection';
import EventPanel from './EventPanel';
import CalendarGrid from './CalendarGrid';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { isDarkMode, toggleTheme } = useTheme();

  const year = currentDate.getFullYear();

  const { holidays } = useHolidays(year);
  const { events, saveEvent, deleteEvent } = useCalendarEvents();

  const [notesMap, setNotesMap] = useLocalStorage('calendar_global_notes', {});

  const [selection, setSelection] = useState({ start: null, end: null });
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const allEvents = useMemo(() => [...(events || []), ...(holidays || [])], [events, holidays]);

  const monthKey = `${year}-${currentDate.getMonth()}`;
  const notes = notesMap[monthKey] || "";

  const handleMonthChange = (dir) => {
    setDirection(dir);
    setCurrentDate(new Date(year, currentDate.getMonth() + dir, 1));
  };

  const handleSave = (data) => {
    saveEvent(data, selectedEventId);
    setSelection({ start: null, end: null });
    setSelectedEventId(null);
  };

  const handleDragStart = (dateStr) => {
    const sortedEvents = [...allEvents].sort((a, b) => {
      const lenA = new Date(a.endDate || a.startDate) - new Date(a.startDate);
      const lenB = new Date(b.endDate || b.startDate) - new Date(b.startDate);
      return lenA - lenB;
    });
    
    const clickedEvent = sortedEvents.find(ev => dateStr >= ev.startDate && dateStr <= (ev.endDate || ev.startDate));

    if (clickedEvent && selectedEventId !== clickedEvent.id) {
      setSelectedEventId(clickedEvent.id);
      setSelection({ start: null, end: null });
      return;
    }

    setIsDragging(true);
    setSelection({ start: dateStr, end: null });
    setSelectedEventId(null);
  };

  const handleDragHover = (dateStr) => {
    if (!isDragging || !selection.start) return;

    if (dateStr < selection.start) {
      setSelection({ start: dateStr, end: selection.start });
    } else {
      setSelection({ start: selection.start, end: dateStr });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (selection.start && !selection.end) {
      setSelection({ start: selection.start, end: selection.start });
    }
  };

  const activeEvent = selectedEventId
    ? allEvents.find(e => e.id === selectedEventId)
    : null;

  const showPanel = selection.start || activeEvent;

  return (
    <div 
      className="w-full p-2 sm:p-4 py-8 flex justify-center items-center relative"
      onTouchEnd={handleDragEnd}
    >

      {/* Search + Theme */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="pl-8 pr-8 py-1 rounded-full text-[10px] sm:text-xs bg-white dark:bg-gray-800 border dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0088cc] w-28 sm:w-48 transition-all dark:text-gray-200"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={10} />
            </button>
          )}
        </div>

        <button onClick={toggleTheme} className="p-1.5 sm:p-2 rounded-full shadow-sm bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-800 dark:text-gray-200">
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 w-full max-w-xl shadow-2xl relative rounded-sm perspective-[2000px]">

        {/* SPIRAL BINDING */}
        <div className="absolute top-0 left-0 w-full flex justify-around px-4 sm:px-6 z-50 opacity-70 pointer-events-none">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="w-0.5 sm:w-1 h-2 sm:h-3 bg-gray-800 dark:bg-black rounded-b-full shadow-sm"
            />
          ))}
        </div>

        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={monthKey}
            custom={direction}
            variants={{
              enter: (dir) => ({ rotateX: dir > 0 ? 90 : -90, opacity: 0, originY: 0 }),
              center: { rotateX: 0, opacity: 1, originY: 0 },
              exit: (dir) => ({ rotateX: dir > 0 ? -90 : 90, opacity: 0, originY: 0 })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col origin-top"
          >
            <CalendarHeader
              currentMonth={currentDate.getMonth()}
              currentYear={year}
              onPrevMonth={() => handleMonthChange(-1)}
              onNextMonth={() => handleMonthChange(1)}
            />

            <div className="flex flex-col md:flex-row pt-4 pb-6 gap-6 px-4 md:px-6">

              {/* Sidebar */}
              <div className="w-full md:w-[40%] flex flex-col order-2 md:order-1">
                {showPanel ? (
                  <EventPanel
                    pendingSelection={selection}
                    activeEvent={activeEvent}
                    onSave={handleSave}
                    onDelete={deleteEvent}
                    onCancel={() => {
                      setSelection({ start: null, end: null });
                      setSelectedEventId(null);
                    }}
                    isDarkMode={isDarkMode}
                  />
                ) : (
                  <NotesSection
                    notes={notes}
                    onNotesChange={(t) =>
                      setNotesMap(prev => ({ ...prev, [monthKey]: t }))
                    }
                    isDarkMode={isDarkMode}
                  />
                )}
              </div>

              {/* Grid */}
              <div className="w-full md:w-[60%] flex flex-col overflow-hidden order-1 md:order-2">
                <CalendarGrid
                  currentDate={currentDate}
                  events={allEvents}
                  searchQuery={searchQuery}
                  pendingSelection={selection}
                  onDragStart={handleDragStart}
                  onDragHover={handleDragHover}
                  onDragEnd={handleDragEnd}
                />
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}