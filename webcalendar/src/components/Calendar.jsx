// src/components/Calendar.jsx
import { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import NotesSection from './NotesSection';
import CalendarGrid from './CalendarGrid';

export default function Calendar() {
  // Initialize with January 2022 to match your design, or change to new Date() for today
  const [currentDate, setCurrentDate] = useState(new Date(2022, 0, 1)); 

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 py-12">
      <div className="bg-white w-full max-w-125 shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Ring Binding visual effect */}
        <div className="absolute top-0 left-0 w-full flex justify-around px-12 z-10 opacity-50">
           {Array.from({length: 20}).map((_, i) => (
             <div key={i} className="w-1 h-3 bg-gray-800 rounded-b-full"></div>
           ))}
        </div>

        {/* Pass state and handlers to Header */}
        <CalendarHeader 
          currentDate={currentDate} 
          onPrevMonth={handlePrevMonth} 
          onNextMonth={handleNextMonth} 
        />

        <div className="flex flex-row pt-6 pb-8 gap-6 px-4">
          <div className="w-1/3 border-r border-transparent"> 
            <NotesSection />
          </div>

          {/* Pass current date to Grid so it knows what to render */}
          <div className="w-2/3">
            <CalendarGrid currentDate={currentDate} />
          </div>
        </div>
        
      </div>
    </div>
  );
}