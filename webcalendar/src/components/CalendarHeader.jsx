// src/components/CalendarHeader.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORTANT: Import your 12 local images here ---
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

export default function CalendarHeader({ currentMonth, currentYear, onPrevMonth, onNextMonth, direction }) {
  
  const safeMonthIndex = Math.max(0, Math.min(11, currentMonth));
  const currentHeaderImage = monthImages[safeMonthIndex];

  // Text sliding animation
  const textSlideVariants = {
    enter: (dir) => ({ y: dir > 0 ? 20 : -20, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (dir) => ({ y: dir < 0 ? 20 : -20, opacity: 0 })
  };

  // NEW: Image sliding animation synced with the direction prop
  const imageSlideVariants = {
    enter: (dir) => ({ 
      x: dir > 0 ? 30 : -30, // Slides from right (50) if going next, left (-50) if going prev
      opacity: 0 
    }),
    center: { 
      x: 0, 
      opacity: 1 
    },
    exit: (dir) => ({ 
      x: dir > 0 ? -30 : 30, // Exits to the opposite side
      opacity: 0 
    })
  };

  return (
    <div 
      className="relative w-full h-75 overflow-hidden bg-gray-200"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 45% 100%, 0 calc(100% - 32px))' }}
    >
      {/* We add custom={direction} to the AnimatePresence so it can pass the dir to our variants */}
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.img 
          key={`${currentYear}-${safeMonthIndex}`}
          custom={direction} // Tells the variant which way we are moving
          src={currentHeaderImage} 
          alt={`${monthNames[safeMonthIndex]} Header`} 
          className="absolute inset-0 w-full h-full object-cover object-center"
          
          // Apply the new sliding variants
          variants={imageSlideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </AnimatePresence>
      
      {/* BLUE OVERLAY */}
      <div 
        className="absolute bottom-0 right-0 w-[55%] h-24 bg-[#0088cc] z-20"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
      >
        <div className="absolute bottom-4 right-6 text-right text-white flex flex-col items-end">
          
          <div className="flex items-center gap-3 -mb-1">
            <button onClick={onPrevMonth} className="hover:text-gray-300 transition-colors p-1 z-10">
              <ChevronLeft size={20} />
            </button>
            
            <div className="text-xl tracking-widest font-light relative h-6 overflow-hidden flex items-center justify-end min-w-15">
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={currentYear}
                  custom={direction}
                  variants={textSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {currentYear}
                </motion.div>
              </AnimatePresence>
            </div>

            <button onClick={onNextMonth} className="hover:text-gray-300 transition-colors p-1 z-10">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="text-2xl font-bold tracking-widest uppercase relative h-8 overflow-hidden flex items-center justify-end min-w-37.5">
             <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={safeMonthIndex}
                  custom={direction}
                  variants={textSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  {monthNames[safeMonthIndex]}
                </motion.div>
              </AnimatePresence>
          </div>
          
        </div>
      </div>
    </div>
  );
}