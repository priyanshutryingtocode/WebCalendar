// src/components/CalendarHeader.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarHeader({ currentDate, onPrevMonth, onNextMonth }) {
  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", 
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  return (
    <div 
      className="relative w-full h-80 overflow-hidden bg-gray-200"
      // We clip the bottom-left of the entire header image. 
      // This reveals the white background of the main Calendar card underneath automatically.
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 45% 100%, 0 calc(100% - 64px))' }}
    >
      {/* Background Image */}
      <img 
        src="https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2000&auto=format&fit=crop" 
        alt="Mountain Climber" 
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      
      {/* Blue Geometric Overlay */}
      {/* Restricted to w-[55%] so it strictly lives on the right side. No overlapping! */}
      <div 
        className="absolute bottom-0 right-0 w-[55%] h-32 bg-[#0088cc] transition-all duration-300"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
      >
        <div className="absolute bottom-6 right-8 text-right text-white flex flex-col items-end">
          
          <div className="flex items-center gap-4 -mb-1">
            <button onClick={onPrevMonth} className="hover:text-gray-300 transition-colors p-1">
              <ChevronLeft size={24} />
            </button>
            <div className="text-2xl tracking-widest font-light">
              {currentDate.getFullYear()}
            </div>
            <button onClick={onNextMonth} className="hover:text-gray-300 transition-colors p-1">
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="text-4xl font-bold tracking-widest uppercase">
            {monthNames[currentDate.getMonth()]}
          </div>
          
        </div>
      </div>
    </div>
  );
}