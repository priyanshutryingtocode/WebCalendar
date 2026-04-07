// src/components/CalendarHeader.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendarHeader({ currentDate, onPrevMonth, onNextMonth, direction }) {
  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", 
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  // Animation variants for the text sliding
  const slideVariants = {
    enter: (dir) => ({ y: dir > 0 ? 20 : -20, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (dir) => ({ y: dir < 0 ? 20 : -20, opacity: 0 })
  };

  return (
    <div 
      className="relative w-full h-80 overflow-hidden bg-gray-200"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 45% 100%, 0 calc(100% - 64px))' }}
    >
      <img 
        src="https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2000&auto=format&fit=crop" 
        alt="Mountain Climber" 
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      
      <div 
        className="absolute bottom-0 right-0 w-[55%] h-32 bg-[#0088cc] transition-all duration-300"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
      >
        <div className="absolute bottom-6 right-8 text-right text-white flex flex-col items-end">
          
          <div className="flex items-center gap-4 -mb-1">
            <button onClick={onPrevMonth} className="hover:text-gray-300 transition-colors p-1 z-10">
              <ChevronLeft size={24} />
            </button>
            
            {/* Animated Year */}
            <div className="text-2xl tracking-widest font-light relative h-8 overflow-hidden flex items-center justify-end min-w-17.5">
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={currentDate.getFullYear()}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {currentDate.getFullYear()}
                </motion.div>
              </AnimatePresence>
            </div>

            <button onClick={onNextMonth} className="hover:text-gray-300 transition-colors p-1 z-10">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Animated Month */}
          <div className="text-4xl font-bold tracking-widest uppercase relative h-10 overflow-hidden flex items-center justify-end min-w-50">
             <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={currentDate.getMonth()}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  {monthNames[currentDate.getMonth()]}
                </motion.div>
              </AnimatePresence>
          </div>
          
        </div>
      </div>
    </div>
  );
}