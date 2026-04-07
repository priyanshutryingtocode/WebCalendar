// src/components/EventPanel.jsx
import { useState, useEffect } from 'react';

const CATEGORIES = {
  default: { label: 'General', color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
  work: { label: 'Work', color: 'bg-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  holiday: { label: 'Holiday', color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  personal: { label: 'Personal', color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
};

export default function EventPanel({ pendingSelection, activeEvent, onSave, onDelete, onCancel }) {
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

  const handleSave = () => {
    onSave({
      startDate: startDateStr,
      endDate: endDateStr || startDateStr,
      note,
      category
    });
  };

  return (
    <div className="flex flex-col h-full pt-2 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-[#0088cc] uppercase tracking-wide">
          {activeEvent ? 'Edit Event' : 'New Event'}
        </h3>
        {activeEvent && (
          <button onClick={() => onDelete(activeEvent.id)} className="text-xs text-red-500 hover:underline">
            Delete
          </button>
        )}
      </div>
      
      <div className="text-sm font-medium text-gray-600 mb-4 bg-gray-50 p-2 rounded border border-gray-100">
        {startDateStr} {endDateStr && endDateStr !== startDateStr ? ` to ${endDateStr}` : ''}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.entries(CATEGORIES).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
              category === key 
                ? `${info.color} text-white shadow-sm` 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
        className="w-full grow min-h-30 resize-none outline-none text-sm text-gray-700 bg-transparent mb-4"
        style={{
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)',
          lineHeight: '32px',
          paddingTop: '6px'
        }}
      />

      <div className="flex gap-2 mt-auto">
        <button onClick={handleSave} className="flex-1 bg-gray-900 text-white text-sm py-2 rounded font-medium hover:bg-gray-800 transition-colors">
          Save
        </button>
        <button onClick={onCancel} className="flex-1 bg-gray-100 text-gray-700 text-sm py-2 rounded font-medium hover:bg-gray-200 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}