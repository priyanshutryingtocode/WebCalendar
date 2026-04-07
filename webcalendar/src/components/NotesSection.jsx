// src/components/NotesSection.jsx
export default function NotesSection() {
  // Creating an array of 8 empty slots to render the lines
  const lines = Array.from({ length: 8 });

  return (
    <div className="flex flex-col h-full pl-4 pt-2">
      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-4">Notes</h3>
      
      <div className="flex flex-col gap-4 mt-2">
        {lines.map((_, index) => (
          <div 
            key={index} 
            className="w-full border-b border-gray-300"
          ></div>
        ))}
      </div>
    </div>
  );
}