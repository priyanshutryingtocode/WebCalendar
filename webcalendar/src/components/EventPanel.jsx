import { useState, useEffect } from 'react';

const CATEGORIES = {
  default: { label: 'General', color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
  work: { label: 'Work', color: 'bg-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  holiday: { label: 'Holiday', color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  personal: { label: 'Personal', color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
};

export default function EventPanel({ pendingSelection, activeEvent, onSave, onDelete, onCancel, isDarkMode }) {
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('default');

  useEffect(() => {
    if (activeEvent) {
      setNote(activeEvent.note || '');
      setCategory(activeEvent.category || 'default');
    } else {
      setNote('');
      setCategory('default');
    }
  }, [activeEvent, pendingSelection]);

  const startDateStr = activeEvent ? activeEvent.startDate : pendingSelection.start;
  const endDateStr = activeEvent ? activeEvent.endDate : pendingSelection.end;

  const handleSave = () => onSave({ startDate: startDateStr, endDate: endDateStr || startDateStr, note, category });

  const lineColor = isDarkMode ? '#374151' : '#e5e7eb';

  return (
    <div className="flex flex-col h-full pt-1 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[10px] font-bold text-[#0088cc] dark:text-[#33aaff] uppercase tracking-wide">
          {activeEvent ? 'Edit Event' : 'New Event'}
        </h3>
        {activeEvent && (
          <button onClick={() => onDelete(activeEvent.id)} className="text-[10px] text-red-500 hover:underline">
            Delete
          </button>
        )}
      </div>
      
      <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-3 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded border border-gray-100 dark:border-gray-700">
        {startDateStr} {endDateStr && endDateStr !== startDateStr ? ` to ${endDateStr}` : ''}
      </div>

      <div className="flex gap-1.5 mb-3 flex-wrap">
        {Object.entries(CATEGORIES).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium transition-all ${
              category === key 
                ? `${info.color} text-white shadow-sm` 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {info.label}
          </button>
        ))}
      </div>

      <textarea 
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add details, location, or notes..."
        className="w-full flex-1 min-h-0 resize-none outline-none text-xs text-gray-700 dark:text-gray-200 bg-transparent mb-3"
        style={{
          backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${lineColor} 27px, ${lineColor} 28px)`,
          lineHeight: '28px',
          paddingTop: '4px'
        }}
      />

      <div className="flex gap-2 mt-auto">
        <button onClick={handleSave} className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs py-1.5 rounded font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
          Save
        </button>
        <button onClick={onCancel} className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs py-1.5 rounded font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}