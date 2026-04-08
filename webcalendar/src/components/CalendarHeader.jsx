// src/components/CalendarHeader.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

import janImg from '../assets/images/month-headers/january.jpg';
import febImg from '../assets/images/month-headers/february.jpg';
import marImg from '../assets/images/month-headers/march.jpg';
import aprImg from '../assets/images/month-headers/april.jpg';
import mayImg from '../assets/images/month-headers/may.jpg';
import junImg from '../assets/images/month-headers/june.jpg';
import julImg from '../assets/images/month-headers/july.jpg';
import augImg from '../assets/images/month-headers/august.jpg';
import sepImg from '../assets/images/month-headers/september.jpg';
import octImg from '../assets/images/month-headers/october.jpg';
import novImg from '../assets/images/month-headers/november.jpg';
import decImg from '../assets/images/month-headers/december.jpg';

const monthImages = [janImg, febImg, marImg, aprImg, mayImg, junImg, julImg, augImg, sepImg, octImg, novImg, decImg];
const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

export default function CalendarHeader({ currentMonth, currentYear, onPrevMonth, onNextMonth }) {
  const safeMonthIndex = Math.max(0, Math.min(11, currentMonth));
  const currentHeaderImage = monthImages[safeMonthIndex];

  return (
    <div 
      className="relative w-full h-75 overflow-hidden bg-gray-200"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 45% 100%, 0 calc(100% - 32px))' }}
    >
      <img 
        src={currentHeaderImage} 
        alt={`${monthNames[safeMonthIndex]} Header`} 
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      
      <div 
        className="absolute bottom-0 right-0 w-[55%] h-24 bg-[#0088cc] z-20"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
      >
        <div className="absolute bottom-4 right-6 text-right text-white flex flex-col items-end">
          
          <div className="flex items-center gap-3 -mb-1">
            <button onClick={onPrevMonth} className="hover:text-gray-300 transition-colors p-1 z-10">
              <ChevronLeft size={20} />
            </button>
            <div className="text-xl tracking-widest font-light relative h-6 flex items-center justify-end min-w-15">
              {currentYear}
            </div>
            <button onClick={onNextMonth} className="hover:text-gray-300 transition-colors p-1 z-10">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="text-2xl font-bold tracking-widest uppercase relative h-8 flex items-center justify-end min-w-37.5">
             {monthNames[safeMonthIndex]}
          </div>
          
        </div>
      </div>
    </div>
  );
}