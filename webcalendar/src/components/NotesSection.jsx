export default function NotesSection({ notes, onNotesChange, isDarkMode }) {
  const lineColor = isDarkMode ? '#374151' : '#e5e7eb';

  return (
    <div className="flex flex-col h-full pt-1 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[10px] font-bold text-gray-800 dark:text-gray-300 uppercase tracking-wide">
          Notes
        </h3>
      </div>
      
      <textarea 
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Jot down memos here..."
        className="w-full flex-1 min-h-0 resize-none outline-none text-xs text-gray-700 dark:text-gray-200 bg-transparent mb-3"
        style={{
          backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${lineColor} 27px, ${lineColor} 28px)`,
          lineHeight: '28px',
          paddingTop: '4px'
        }}
      />
    </div>
  );
}