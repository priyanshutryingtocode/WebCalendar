// src/components/CalendarGrid.jsx
export default function CalendarGrid() {
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  
  // Hardcoded to match the exact January 2022 layout from the image
  const gridData = [
    { date: 27, current: false }, { date: 28, current: false }, { date: 29, current: false }, { date: 30, current: false }, { date: 31, current: false }, { date: 1, current: true, weekend: true }, { date: 2, current: true, weekend: true },
    { date: 3, current: true }, { date: 4, current: true }, { date: 5, current: true }, { date: 6, current: true }, { date: 7, current: true }, { date: 8, current: true, weekend: true }, { date: 9, current: true, weekend: true },
    { date: 10, current: true }, { date: 11, current: true }, { date: 12, current: true }, { date: 13, current: true }, { date: 14, current: true }, { date: 15, current: true, weekend: true }, { date: 16, current: true, weekend: true },
    { date: 17, current: true }, { date: 18, current: true }, { date: 19, current: true }, { date: 20, current: true }, { date: 21, current: true }, { date: 22, current: true, weekend: true }, { date: 23, current: true, weekend: true },
    { date: 24, current: true }, { date: 25, current: true }, { date: 26, current: true }, { date: 27, current: true }, { date: 28, current: true }, { date: 29, current: true, weekend: true }, { date: 30, current: true, weekend: true },
    { date: 31, current: true }, { date: 1, current: false }, { date: 2, current: false }, { date: 3, current: false }, { date: 4, current: false }, { date: 5, current: false, weekend: true }, { date: 6, current: false, weekend: true },
  ];

  return (
    <div className="w-full pr-4 pb-4">
      {/* Days of the Week Header */}
      <div className="grid grid-cols-7 mb-4">
        {daysOfWeek.map((day, index) => (
          <div 
            key={day} 
            className={`text-[10px] font-bold text-center tracking-wider ${
              index >= 5 ? 'text-[#0088cc]' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-4">
        {gridData.map((item, index) => {
          // Determine text color based on the design rules
          let colorClass = "text-gray-800 font-semibold"; // Default weekday
          
          if (!item.current) {
            colorClass = "text-gray-300 font-medium"; // Out of month
          } else if (item.weekend) {
            colorClass = "text-[#0088cc] font-bold"; // Current month weekend
          }

          return (
            <div 
              key={index} 
              className={`text-sm text-center ${colorClass}`}
            >
              {item.date}
            </div>
          );
        })}
      </div>
    </div>
  );
}