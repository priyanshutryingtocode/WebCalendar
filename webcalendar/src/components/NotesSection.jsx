// src/components/NotesSection.jsx
export default function NotesSection({ notes, onNotesChange }) {
  return (
    <div className="flex flex-col h-full pt-2">
      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-2">Notes</h3>
      
      <textarea 
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Jot down memos here..."
        className="w-full grow min-h-50 resize-none outline-none text-sm text-gray-700 bg-transparent"
        style={{
          // This creates the lined paper effect dynamically behind the text
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #d1d5db 31px, #d1d5db 32px)',
          lineHeight: '32px',
          paddingTop: '6px' // Aligns the first line of text with the first visual line
        }}
      />
    </div>
  );
}