// src/components/NotesSection.jsx
export default function NotesSection({ notes, onNotesChange }) {
  return (
    // Added animate-in so it fades smoothly just like the EventPanel
    <div className="flex flex-col h-full mt-2 pt-1 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">
          Notes
        </h3>
      </div>
      
      <textarea 
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Jot down memos here..."
        // The magic fix: flex-1 and min-h-0 forces it to fill space without pushing the parent taller
        className="w-full flex-1 min-h-0 resize-none outline-none text-xs text-gray-700 bg-transparent mb-3"
        style={{
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #e5e7eb 27px, #e5e7eb 28px)',
          lineHeight: '28px',
          paddingTop: '4px'
        }}
      />
      
    </div>
  );
}