// src/components/Calendar.jsx
import CalendarHeader from './CalendarHeader';
import NotesSection from './NotesSection';
import CalendarGrid from './CalendarGrid';

export default function Calendar() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 py-12">
      
      {/* Calendar Card Container */}
      {/* w-[500px] ensures the proportions match a standard wall calendar */}
      <div className="bg-white w-full max-w-125 shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Ring Binding visual effect (Optional touch for realism) */}
        <div className="absolute top-0 left-0 w-full flex justify-around px-12 z-10 opacity-50">
           {Array.from({length: 20}).map((_, i) => (
             <div key={i} className="w-1 h-3 bg-gray-800 rounded-b-full"></div>
           ))}
        </div>

        <CalendarHeader />

        <div className="flex flex-row pt-6 pb-8 gap-6 px-4">
          <div className="w-1/3 border-r border-transparent"> 
            <NotesSection />
          </div>

          <div className="w-2/3">
            <CalendarGrid />
          </div>
        </div>
        
      </div>
    </div>
  );
}