import { useEffect, useState } from 'react';

const cache = {};

export function useHolidays(year) {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolidays = async () => {
      if (cache[year]) {
        setHolidays(cache[year]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/IN`);
        const data = await res.json();

        const formatted = data.map(h => ({
          id: `holiday-${h.date}-${h.name}`,
          startDate: h.date,
          endDate: h.date,
          note: h.localName || h.name,
          category: 'holiday',
          isReadOnly: true
        }));

        cache[year] = formatted;
        setHolidays(formatted);
      } catch {
        setHolidays([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [year]);

  return { holidays, loading };
}