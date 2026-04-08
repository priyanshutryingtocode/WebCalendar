import { useEffect, useState } from 'react';
import Holidays from 'date-holidays';

const cache = {};

export function useHolidays(year) {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cache[year]) {
      setHolidays(cache[year]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const hd = new Holidays('IN');
      
      const rawHolidays = hd.getHolidays(year);

      const formatted = rawHolidays
        .filter(h => h.type === 'public')
        .map(h => {
          const dateStr = h.date.split(' ')[0]; 

          return {
            id: `holiday-${dateStr}-${h.name.replace(/\s+/g, '-')}`,
            startDate: dateStr,
            endDate: dateStr,
            note: h.name,
            category: 'holiday',
            isReadOnly: true
          };
        });

      cache[year] = formatted;
      setHolidays(formatted);

    } catch (error) {
      console.error("Failed to calculate holidays:", error);
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  }, [year]);

  return { holidays, loading };
}