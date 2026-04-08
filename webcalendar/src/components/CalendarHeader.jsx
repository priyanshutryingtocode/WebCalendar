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

const monthImages = [
  janImg, febImg, marImg, aprImg, mayImg, junImg,
  julImg, augImg, sepImg, octImg, novImg, decImg
];

const monthNames = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

export default function CalendarHeader({
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth
}) {
  const safeMonthIndex = Math.max(0, Math.min(11, currentMonth));

  return (
    <div
      className="relative w-full h-75 overflow-hidden bg-gray-200"
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 45% 100%, 0 calc(100% - 32px))'
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={safeMonthIndex}
          src={monthImages[safeMonthIndex]}
          alt={`${monthNames[safeMonthIndex]} Header`}
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/10 z-10"></div>

      <div
        className="absolute bottom-0 right-0 w-[60%] h-24 bg-[#0088cc] z-20"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
      >
        <div className="absolute bottom-5 right-6 text-white flex flex-col items-center gap-0.5">

          {/* Navigation */}
          <div className="flex items-center">
            <button
              onClick={onPrevMonth}
              className="p-1 rounded hover:bg-white/20 active:scale-90 transition"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>

            <div className="text-xs tracking-[0.2em] font-light w-12 text-center">
              {currentYear}
            </div>

            <button
              onClick={onNextMonth}
              className="p-1 rounded hover:bg-white/20 active:scale-90 transition"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>

          {/* Month */}
          <div className="text-lg leading-none font-bold tracking-widest uppercase">
            {monthNames[safeMonthIndex]}
          </div>

        </div>
      </div>
    </div>
  );
}