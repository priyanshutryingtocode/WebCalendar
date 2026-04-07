// src/components/CalendarGrid.jsx
export default function CalendarGrid({ currentDate }) {
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  
  // Calculate grid data dynamically
  const generateGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get the day of the week the month starts on (0 = Sun, 1 = Mon... 6 = Sat)
    const firstDay = new Date(year, month, 1).getDay();
    // Adjust so Monday is 0, Sunday is 6
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid = [];

    // Fill previous month's trailing days
    for (let i = startOffset - 1; i >= 0; i--) {
      grid.push({
        date: daysInPrevMonth - i,
        current: false,
        weekend: (grid.length % 7 >= 5) // Indices 5 and 6 are Sat/Sun
      });
    }

    // Fill current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push({
        date: i,
        current: true,
        weekend: (grid.length % 7 >= 5)
      });
    }

    // Fill next month's leading days to complete a 42-cell grid (6 weeks)
    let nextMonthDay = 1;
    while (grid.length < 42) {
      grid.push({
        date: nextMonthDay++,
        current: false,
        weekend: (grid.length % 7 >= 5)
      });
    }

    return grid;
  };

  const gridData = generateGrid();

  return (
    <div className="w-full pr-4 pb-4">
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

      <div className="grid grid-cols-7 gap-y-4">
        {gridData.map((item, index) => {
          let colorClass = "text-gray-800 font-semibold hover:bg-gray-100 cursor-pointer rounded-full p-1"; 
          
          if (!item.current) {
            colorClass = "text-gray-300 font-medium"; 
          } else if (item.weekend) {
            colorClass = "text-[#0088cc] font-bold hover:bg-blue-50 cursor-pointer rounded-full p-1"; 
          }

          return (
            <div key={index} className={`text-sm text-center flex items-center justify-center transition-colors h-6 w-6 mx-auto ${colorClass}`}>
              {item.date}
            </div>
          );
        })}
      </div>
    </div>
  );
}