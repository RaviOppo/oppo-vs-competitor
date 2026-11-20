'use client';

import { useState, useEffect } from 'react';

export function usePhones() {
  const [oppoPhones, setOppoPhones] = useState([]);
  const [compPhones, setCompPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPhones() {
      try {
        setLoading(true);
        const [oppoRes, compRes] = await Promise.all([
          fetch('/api/phones?category=oppo'),
          fetch('/api/phones?category=competitors'),
        ]);

        if (!oppoRes.ok || !compRes.ok) {
          throw new Error('Failed to fetch phones');
        }

        const oppoData = await oppoRes.json();
        const compData = await compRes.json();

        setOppoPhones(oppoData);
        setCompPhones(compData);
      } catch (err) {
        console.error('Error fetching phones:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPhones();
  }, []);

  const oppoTypes = [...new Set(oppoPhones.map(p => p.type))].sort();
  const compBrands = [...new Set(compPhones.map(p => p.brand))].sort();

  return { oppoPhones, compPhones, oppoTypes, compBrands, loading, error };
}