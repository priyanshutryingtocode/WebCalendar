// src/components/CalendarHeader.jsx
export default function CalendarHeader() {
  return (
    <div className="relative w-full h-80 overflow-hidden bg-gray-200">
      {/* Background Image */}
      <img 
        src="https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2000&auto=format&fit=crop" 
        alt="Mountain Climber" 
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      
      {/* Blue Geometric Overlay */}
      {/* The clip-path creates the V-shape cut seen in the design */}
      <div 
        className="absolute bottom-0 w-full h-32 bg-[#0088cc]"
        style={{ clipPath: 'polygon(0 100%, 0 40%, 45% 100%, 100% 0, 100% 100%)' }}
      >
        {/* Date Text */}
        <div className="absolute bottom-8 right-10 text-right text-white">
          <div className="text-2xl tracking-widest font-light">2022</div>
          <div className="text-4xl font-bold tracking-widest uppercase -mt-1">January</div>
        </div>
      </div>
      
      {/* White angled cutout on the left to match the paper overlap */}
      <div 
        className="absolute bottom-0 left-0 w-[45%] h-16 bg-white"
        style={{ clipPath: 'polygon(0 100%, 0 0, 100% 100%)' }}
      ></div>
    </div>
  );
}