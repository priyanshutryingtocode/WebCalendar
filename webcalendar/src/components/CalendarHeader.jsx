// src/components/CalendarHeader.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        // Slightly reduced height back to h-24 to match the smaller text scale
        className="absolute bottom-0 right-0 w-[60%] h-24 bg-[#0088cc] z-20"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
      >
        {/* CHANGED MARGIN: right-10 is now right-6 to push it closer to the edge */}
        <div className="absolute bottom-5 right-6 text-white flex flex-col items-center gap-0.5">
          
          <div className="flex items-center">
            <button onClick={onPrevMonth} className="hover:text-white/70 transition-colors p-1 z-10">
              {/* SHRUNK ICONS: Dropped from 18 to 16 */}
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            
            {/* SHRUNK YEAR: text-sm -> text-xs, narrowed container to w-12 */}
            <div className="text-xs tracking-[0.2em] font-light w-12 text-center">
              {currentYear}
            </div>
            
            <button onClick={onNextMonth} className="hover:text-white/70 transition-colors p-1 z-10">
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>

          {/* SHRUNK MONTH: text-xl -> text-lg */}
          <div className="text-lg leading-none font-bold tracking-widest uppercase">
             {monthNames[safeMonthIndex]}
          </div>
          
        </div>
      </div>
    </div>
  );
}