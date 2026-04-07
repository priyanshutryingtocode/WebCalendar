// src/components/Calendar.jsx
import { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import NotesSection from './NotesSection';
import CalendarGrid from './CalendarGrid';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2022, 0, 1)); 
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  const [notesMap, setNotesMap] = useState({});
  const currentMonthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  const currentNotes = notesMap[currentMonthKey] || "";

  const handleNotesChange = (text) => {
    setNotesMap(prev => ({ ...prev, [currentMonthKey]: text }));
  };

  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDirection(1);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (clickedDate) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (clickedDate < startDate) {
      setStartDate(clickedDate);
    } else {
      setEndDate(clickedDate);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 py-8 md:py-12">
      <div className="bg-white w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col relative rounded-sm">
        
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
          <div className="w-full md:w-1/3"> 
            <NotesSection notes={currentNotes} onNotesChange={handleNotesChange} />
          </div>

          <div className="w-full md:w-2/3 overflow-hidden"> {/* Added overflow-hidden to contain the slides */}
            <CalendarGrid 
              currentDate={currentDate} 
              startDate={startDate}
              endDate={endDate}
              onDateClick={handleDateClick}
              direction={direction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}