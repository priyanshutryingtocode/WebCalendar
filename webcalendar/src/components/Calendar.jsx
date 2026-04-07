// src/components/Calendar.jsx
import { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import NotesSection from './NotesSection'; // Bring this back!
import EventPanel from './EventPanel';
import CalendarGrid from './CalendarGrid';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2022, 0, 1)); 
  const [direction, setDirection] = useState(0); 
  
  // -- Event State --
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('calendar_events');
    return saved ? JSON.parse(saved) : [];
  });

  const [pendingSelection, setPendingSelection] = useState({ start: null, end: null });
  const [selectedEventId, setSelectedEventId] = useState(null);

  // -- Global Monthly Notes State --
  const [globalNotesMap, setGlobalNotesMap] = useState(() => {
    const saved = localStorage.getItem('calendar_global_notes');
    return saved ? JSON.parse(saved) : {};
  });

  // Sync to LocalStorage
  useEffect(() => localStorage.setItem('calendar_events', JSON.stringify(events)), [events]);
  useEffect(() => localStorage.setItem('calendar_global_notes', JSON.stringify(globalNotesMap)), [globalNotesMap]);

  // General Notes Logic
  const currentMonthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  const currentGlobalNotes = globalNotesMap[currentMonthKey] || "";
  const handleGlobalNotesChange = (text) => {
    setGlobalNotesMap(prev => ({ ...prev, [currentMonthKey]: text }));
  };

  // Navigation Logic
  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setDirection(1);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Selection Logic
  const formatDateStr = (dateObj) => {
    if (!dateObj) return null;
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
    if (!pendingSelection.start || (pendingSelection.start && pendingSelection.end)) {
      setPendingSelection({ start: dateStr, end: null });
    } else if (dateStr < pendingSelection.start) {
      setPendingSelection({ start: dateStr, end: pendingSelection.start });
    } else {
      setPendingSelection({ ...pendingSelection, end: dateStr });
    }
  };

  // Event CRUD Operations
  const saveEvent = (newEventData) => {
    if (selectedEventId) {
      setEvents(events.map(ev => ev.id === selectedEventId ? { ...ev, ...newEventData } : ev));
    } else {
      setEvents([...events, { ...newEventData, id: Date.now().toString() }]);
    }
    setPendingSelection({ start: null, end: null });
    setSelectedEventId(null);
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
    setSelectedEventId(null);
  };

  const clearSelection = () => {
    setPendingSelection({ start: null, end: null });
    setSelectedEventId(null);
  };

  const activeEvent = selectedEventId ? events.find(ev => ev.id === selectedEventId) : null;
  
  // Determine which panel to show on the left
  const hasActiveSelection = pendingSelection.start || activeEvent;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 py-8 md:py-12">
      <div className="bg-white w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col relative rounded-sm">
        
        <div className="absolute top-0 left-0 w-full flex justify-around px-8 md:px-16 z-10 opacity-50">
           {Array.from({length: 24}).map((_, i) => (
             <div key={i} className="w-1 h-3 bg-gray-800 rounded-b-full"></div>
           ))}
        </div>

        <CalendarHeader 
          currentDate={currentDate} 
          onPrevMonth={handlePrevMonth} 
          onNextMonth={handleNextMonth}
          direction={direction} 
        />

        <div className="flex flex-col md:flex-row pt-6 pb-8 gap-8 px-6 md:px-8">
          <div className="w-full md:w-[40%] transition-all"> 
            
            {/* THE CONDITIONAL RENDER */}
            {hasActiveSelection ? (
              <EventPanel 
                pendingSelection={pendingSelection}
                activeEvent={activeEvent}
                onSave={saveEvent}
                onDelete={deleteEvent}
                onCancel={clearSelection}
              />
            ) : (
              <NotesSection 
                notes={currentGlobalNotes} 
                onNotesChange={handleGlobalNotesChange} 
              />
            )}

          </div>

          <div className="w-full md:w-[60%] overflow-hidden"> 
            <CalendarGrid 
              currentDate={currentDate} 
              events={events}
              pendingSelection={pendingSelection}
              onDateClick={handleDateClick}
              direction={direction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}