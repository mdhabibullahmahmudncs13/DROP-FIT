'use client';

import { useState, useEffect } from 'react';
import { getAllDrops, getActiveDrops, getUpcomingDrops } from '@/lib/appwrite/drops';
import { Drop } from '@/types/drop';

export function useDrops(type: 'all' | 'active' | 'upcoming' = 'all') {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDrops();
  }, [type]);

  async function fetchDrops() {
    try {
      setLoading(true);
      setError(null);

      let fetchedDrops: Drop[];

      switch (type) {
        case 'active':
          fetchedDrops = await getActiveDrops();
          break;
        case 'upcoming':
          fetchedDrops = await getUpcomingDrops();
          break;
        default:
          fetchedDrops = await getAllDrops();
      }

      setDrops(fetchedDrops);
    } catch (err) {
      setError('Failed to load drops');
      console.error('Error fetching drops:', err);
    } finally {
      setLoading(false);
    }
  }

  return { drops, loading, error, refetch: fetchDrops };
}
