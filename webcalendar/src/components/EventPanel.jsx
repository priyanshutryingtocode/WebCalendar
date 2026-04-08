import { useState, useEffect } from 'react';
import { Edit3, Plus, Sparkles, Trash2, CalendarDays } from 'lucide-react';

const CATEGORIES = {
  default: { label: 'General', color: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
  work: { label: 'Work', color: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400' },
  personal: { label: 'Personal', color: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
  holiday: { label: 'Holiday', color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' }
};

const formatNiceDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function EventPanel({
  pendingSelection,
  activeEvent,
  onSave,
  onDelete,
  onCancel,
  isDarkMode
}) {
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('default');

  useEffect(() => {
    if (activeEvent) {
      setNote(activeEvent.note || '');
      setCategory(activeEvent.category || 'default');
    } else if (pendingSelection?.start) {
      setNote('');
      setCategory('default');
    }
  }, [activeEvent, pendingSelection]);

  const isReadOnly = activeEvent?.isReadOnly || false;
  const startDateStr = activeEvent?.startDate || pendingSelection?.start || null;
  const endDateStr = activeEvent?.endDate || pendingSelection?.end || pendingSelection?.start || null;

  const niceStart = formatNiceDate(startDateStr);
  const niceEnd = formatNiceDate(endDateStr);

  const lineColor = isDarkMode ? '#37415180' : '#e5e7eb80';

  return (
    <div className="flex flex-col h-60 animate-in fade-in duration-300 mt-2">
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          {isReadOnly ? <Sparkles size={12} className="text-emerald-500" /> :
           activeEvent ? <Edit3 size={12} className="text-[#0088cc]" /> :
           <Plus size={12} className="text-[#0088cc]" />}
          <h3 className="text-[10px] font-bold text-[#0088cc] uppercase tracking-widest">
            {isReadOnly ? 'Public Holiday' : activeEvent ? 'Edit Event' : 'New Event'}
          </h3>
        </div>
        {!isReadOnly && activeEvent && (
          <button
            onClick={() => onDelete(activeEvent.id)}
            title="Delete Event"
            className="text-gray-300 hover:text-red-500 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-3 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-md border border-gray-100 dark:border-gray-700/50">
        <CalendarDays size={12} className="text-gray-400" />
        <span>{niceStart}</span>
        {endDateStr && endDateStr !== startDateStr && (
          <>
            <span className="text-gray-300 dark:text-gray-600">→</span>
            <span>{niceEnd}</span>
          </>
        )}
      </div>

      <textarea
        disabled={isReadOnly}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={isReadOnly ? "No details provided" : "Write event details..."}
        className={`w-full flex-1 bg-transparent text-xs outline-none dark:text-gray-200 resize-none ${
          isReadOnly ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        style={{
          backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${lineColor} 27px, ${lineColor} 28px)`,
          lineHeight: '28px',
          paddingTop: '4px'
        }}
      />

      {!isReadOnly && (
        <div className="flex gap-2 mt-4 flex-wrap">
          {Object.entries(CATEGORIES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`
                px-2.5 py-1 text-[10px] font-medium rounded-full border transition-all duration-200
                flex items-center gap-1.5
                ${category === key
                    ? `${val.color} text-white border-transparent shadow-sm scale-105`
                    : `border-gray-200 dark:border-gray-700 ${val.text} hover:bg-gray-50 dark:hover:bg-gray-800`
                }
              `}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${category === key ? 'bg-white' : val.color}`} />
              {val.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-5">
        {!isReadOnly && (
          <button
            onClick={() => onSave({ note, category, startDate: startDateStr, endDate: endDateStr })}
            disabled={!startDateStr || !note.trim()}
            className="flex-1 bg-gray-900 dark:bg-white dark:text-gray-900 text-white py-2 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            Save
          </button>
        )}
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 text-gray-700 py-2 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all active:scale-95"
        >
          {isReadOnly ? 'Close' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}