// src/components/Calendar.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react'; // Make sure lucide-react is installed!
import CalendarHeader from './CalendarHeader';
import NotesSection from './NotesSection';
import EventPanel from './EventPanel';
import CalendarGrid from './CalendarGrid';

export default function Calendar() {
  // --- NEW: Dark Mode State ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Toggle class on HTML tag and save to storage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const [currentDate, setCurrentDate] = useState(new Date(2022, 0, 1)); 
  const [direction, setDirection] = useState(0); 
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('calendar_events');
    return saved ? JSON.parse(saved) : [];
  });
  const [pendingSelection, setPendingSelection] = useState({ start: null, end: null });
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [globalNotesMap, setGlobalNotesMap] = useState(() => {
    const saved = localStorage.getItem('calendar_global_notes');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => localStorage.setItem('calendar_events', JSON.stringify(events)), [events]);
  useEffect(() => localStorage.setItem('calendar_global_notes', JSON.stringify(globalNotesMap)), [globalNotesMap]);

  const currentMonthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  const currentGlobalNotes = globalNotesMap[currentMonthKey] || "";
  const handleGlobalNotesChange = (text) => setGlobalNotesMap(prev => ({ ...prev, [currentMonthKey]: text }));
  
  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setDirection(1);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatDateStr = (dateObj) => {
    if (!dateObj) return null;
    if (typeof dateObj === 'string') return dateObj;
    const d = new Date(dateObj);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleDateClick = (clickedDate) => {
    const dateStr = formatDateStr(clickedDate);
    const clickedEvent = events.find(ev => dateStr >= ev.startDate && dateStr <= (ev.endDate || ev.startDate));

    if (clickedEvent) {
      setSelectedEventId(clickedEvent.id);
      setPendingSelection({ start: null, end: null });
      return;
    }

    setSelectedEventId(null);
    if (!pendingSelection.start || (pendingSelection.start && pendingSelection.end)) setPendingSelection({ start: dateStr, end: null });
    else if (dateStr < pendingSelection.start) setPendingSelection({ start: dateStr, end: pendingSelection.start });
    else setPendingSelection({ ...pendingSelection, end: dateStr });
  };

  const saveEvent = (newEventData) => {
    if (selectedEventId) setEvents(events.map(ev => ev.id === selectedEventId ? { ...ev, ...newEventData } : ev));
    else setEvents([...events, { ...newEventData, id: Date.now().toString() }]);
    clearSelection();
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
    clearSelection();
  };

  const clearSelection = () => {
    setPendingSelection({ start: null, end: null });
    setSelectedEventId(null);
  };

  const activeEvent = selectedEventId ? events.find(ev => ev.id === selectedEventId) : null;
  const hasActiveSelection = pendingSelection.start || activeEvent;

  const pageFlipVariants = {
    enter: (dir) => ({ rotateX: dir > 0 ? 90 : -90, opacity: 0, originY: 0 }),
    center: { rotateX: 0, opacity: 1, originY: 0 },
    exit: (dir) => ({ rotateX: dir > 0 ? -90 : 90, opacity: 0, originY: 0 })
  };

  return (
    <div className="w-full p-4 py-8 md:py-12 flex justify-center items-center relative">
      
      {/* Floating Theme Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg hover:scale-110 transition-all z-50 border border-gray-200 dark:border-gray-700"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="bg-white dark:bg-gray-900 w-full max-w-xl shadow-2xl relative rounded-sm perspective-[2000px] transition-colors duration-300">
        
        <div className="absolute top-0 left-0 w-full flex justify-around px-8 md:px-12 z-50 opacity-50 pointer-events-none">
           {Array.from({length: 20}).map((_, i) => (
             <div key={i} className="w-1 h-3 bg-gray-800 dark:bg-gray-950 rounded-b-full transition-colors"></div>
           ))}
        </div>

        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={currentMonthKey} 
            custom={direction}
            variants={pageFlipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col bg-white dark:bg-gray-900 rounded-sm origin-top overflow-hidden transition-colors duration-300" 
          >
            <CalendarHeader 
              currentMonth={currentDate.getMonth()}
              currentYear={currentDate.getFullYear()} 
              onPrevMonth={handlePrevMonth} 
              onNextMonth={handleNextMonth}
            />
            <div className="flex flex-col md:flex-row pt-4 pb-6 gap-4 px-4 md:px-6">
              <div className="w-full md:w-[40%] flex flex-col transition-all"> 
                {hasActiveSelection ? (
                  <EventPanel 
                    pendingSelection={pendingSelection} activeEvent={activeEvent}
                    onSave={saveEvent} onDelete={deleteEvent} onCancel={clearSelection}
                    isDarkMode={isDarkMode} 
                  />
                ) : (
                  <NotesSection 
                    notes={currentGlobalNotes} onNotesChange={handleGlobalNotesChange} 
                    isDarkMode={isDarkMode} 
                  />
                )}
              </div>
              <div className="w-full md:w-[60%] flex flex-col overflow-hidden"> 
                <CalendarGrid 
                  currentDate={currentDate} events={events}
                  pendingSelection={pendingSelection} onDateClick={handleDateClick}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}