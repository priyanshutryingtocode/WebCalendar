// src/components/Calendar.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Search, X } from 'lucide-react';
import CalendarHeader from './CalendarHeader';
import NotesSection from './NotesSection';
import EventPanel from './EventPanel';
import CalendarGrid from './CalendarGrid';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2022, 0, 1));
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [isDarkMode]);

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

  const handlePrevMonth = () => { setDirection(-1); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); };
  const handleNextMonth = () => { setDirection(1); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); };

  const formatDateStr = (dateObj) => {
    if (!dateObj) return null;
    if (typeof dateObj === 'string') return dateObj;
    const d = new Date(dateObj);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const onDragStart = (dateStr) => {
    const sortedEvents = [...events].sort((a, b) => (new Date(a.endDate) - new Date(a.startDate)) - (new Date(b.endDate) - new Date(b.startDate)));
    const clickedEvent = sortedEvents.find(ev => dateStr >= ev.startDate && dateStr <= (ev.endDate || ev.startDate));

    if (clickedEvent && selectedEventId !== clickedEvent.id) {
      setSelectedEventId(clickedEvent.id);
      setPendingSelection({ start: null, end: null });
      return;
    }

    setIsDragging(true);
    setDragStart(dateStr);
    setSelectedEventId(null);
    setPendingSelection({ start: dateStr, end: null });
  };

  const onDragHover = (dateStr) => {
    if (!isDragging) return;
    if (dateStr < dragStart) setPendingSelection({ start: dateStr, end: dragStart });
    else setPendingSelection({ start: dragStart, end: dateStr });
  };

  const onDragEnd = () => { setIsDragging(false); setDragStart(null); };

  const saveEvent = (newEventData) => {
    if (selectedEventId) {
      setEvents(events.map(ev => ev.id === selectedEventId ? { ...ev, ...newEventData } : ev));
    } else {
      const newEntry = { ...newEventData, id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
      setEvents([...events, newEntry]);
    }
    clearSelection();
  };

  const deleteEvent = (id) => { setEvents(events.filter(ev => ev.id !== id)); clearSelection(); };
  const clearSelection = () => { setPendingSelection({ start: null, end: null }); setSelectedEventId(null); };

  const activeEvent = selectedEventId ? events.find(ev => ev.id === selectedEventId) : null;
  const hasActiveSelection = pendingSelection.start || activeEvent;

  return (
    <div className="w-full p-4 py-8 md:py-12 flex justify-center items-center relative">
      
      {/* Search and Theme Controls */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2 z-50">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-[11px] text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0088cc] w-32 md:w-48 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={12} />
            </button>
          )}
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 w-full max-w-xl shadow-2xl relative rounded-sm perspective-[2000px] transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full flex justify-around px-8 z-50 opacity-50 pointer-events-none">
           {Array.from({length: 20}).map((_, i) => (
             <div key={i} className="w-1 h-3 bg-gray-800 dark:bg-black rounded-b-full shadow-[0_1px_2px_rgba(0,0,0,0.2)]"></div>
           ))}
        </div>

        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={currentMonthKey}
            custom={direction}
            variants={{
              enter: (dir) => ({ rotateX: dir > 0 ? 90 : -90, opacity: 0, originY: 0 }),
              center: { rotateX: 0, opacity: 1, originY: 0 },
              exit: (dir) => ({ rotateX: dir > 0 ? -90 : 90, opacity: 0, originY: 0 })
            }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col bg-white dark:bg-gray-900 rounded-sm origin-top overflow-hidden" 
          >
            <CalendarHeader currentMonth={currentDate.getMonth()} currentYear={currentDate.getFullYear()} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />
            <div className="flex flex-col md:flex-row pt-4 pb-6 gap-4 px-4 md:px-6">
              <div className="w-full md:w-[40%] flex flex-col"> 
                {hasActiveSelection ? (
                  <EventPanel pendingSelection={pendingSelection} activeEvent={activeEvent} onSave={saveEvent} onDelete={deleteEvent} onCancel={clearSelection} isDarkMode={isDarkMode} />
                ) : (
                  <NotesSection notes={currentGlobalNotes} onNotesChange={(t) => setGlobalNotesMap(p => ({...p, [currentMonthKey]: t}))} isDarkMode={isDarkMode} />
                )}
              </div>
              <div className="w-full md:w-[60%] flex flex-col overflow-hidden"> 
                <CalendarGrid 
                  currentDate={currentDate} events={events} pendingSelection={pendingSelection} searchQuery={searchQuery}
                  onDragStart={onDragStart} onDragHover={onDragHover} onDragEnd={onDragEnd}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}