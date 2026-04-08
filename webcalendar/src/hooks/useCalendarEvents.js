import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useCalendarEvents() {
  const [events, setEvents] = useLocalStorage('calendar_events', []);

  const saveEvent = (event, selectedId) => {
    if (selectedId) {
      setEvents(prev => prev.map(e => e.id === selectedId ? { ...e, ...event } : e));
    } else {
      setEvents(prev => [...prev, {
        ...event,
        id: crypto.randomUUID()
      }]);
    }
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const normalizedEvents = useMemo(() => {
    return events.map(e => ({
      ...e,
      start: new Date(e.startDate),
      end: new Date(e.endDate || e.startDate)
    }));
  }, [events]);

  return { events, normalizedEvents, saveEvent, deleteEvent };
}