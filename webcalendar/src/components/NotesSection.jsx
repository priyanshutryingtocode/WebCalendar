import { StickyNote, Trash2 } from 'lucide-react';

export default function NotesSection({ notes, onNotesChange, isDarkMode }) {
  const lineColor = isDarkMode ? '#37415180' : '#e5e7eb80';

  const handleChange = (e) => onNotesChange(e.target.value);
  const clearNotes = () => onNotesChange('');

  return (
    <div className="flex flex-col h-60 pt-1 animate-in fade-in duration-300 group mt-2">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          <StickyNote size={12} className="text-gray-400 dark:text-gray-500" />
          <h3 className="text-[10px] font-bold text-gray-800 dark:text-gray-300 uppercase tracking-widest">
            Monthly Memos
          </h3>
        </div>
        {notes && (
          <button
            onClick={clearNotes}
            title="Clear notes"
            className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors opacity-50 hover:opacity-100"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
      <textarea
        value={notes || ""}
        onChange={handleChange}
        placeholder="Jot down your goals or thoughts..."
        className="
          w-full flex-1 min-h-0 resize-none outline-none text-xs
          text-gray-700 dark:text-gray-200 bg-transparent mb-2
          placeholder:text-gray-300 dark:placeholder:text-gray-600
        "
        style={{
          backgroundImage: `repeating-linear-gradient(
            transparent,
            transparent 27px,
            ${lineColor} 27px,
            ${lineColor} 28px
          )`,
          lineHeight: '28px',
          paddingTop: '4px'
        }}
      />
    </div>
  );
}