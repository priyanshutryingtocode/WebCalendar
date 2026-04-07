// src/components/Calendar.jsx
import CalendarHeader from './CalendarHeader';
import NotesSection from './NotesSection';
import CalendarGrid from './CalendarGrid';

export default function Calendar() {
  return (
    // The main background wrapper centering the calendar
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      
      // The physical "paper" of the calendar
      <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Image & Blue Angled Header */}
        <CalendarHeader />

        {/* Bottom Section: Notes and Grid Side-by-Side */}
        <div className="flex flex-col md:flex-row p-6 gap-8">
          
          {/* Left Side: Notes */}
          <div className="w-full md:w-1/3">
            <NotesSection />
          </div>

          {/* Right Side: Dates Grid */}
          <div className="w-full md:w-2/3">
            <CalendarGrid />
          </div>

        </div>
      </div>
      
    </div>
  );
}