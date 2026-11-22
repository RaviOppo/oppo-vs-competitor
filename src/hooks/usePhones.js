'use client';

import { useState, useEffect, useCallback } from 'react';

export function usePhones() {
  const [oppoPhones, setOppoPhones] = useState([]);
  const [compPhones, setCompPhones] = useState([]);
  const [naskahPhones, setNaskahPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPhones = useCallback(async () => {
    try {
      setLoading(true);
      const t = Date.now();
      const [oppoRes, compRes, naskahRes] = await Promise.all([
        fetch(`/api/phones?category=oppo&_t=${t}`, { cache: 'no-store' }),
        fetch(`/api/phones?category=competitors&_t=${t}`, { cache: 'no-store' }),
        fetch(`/api/phones?category=naskah&_t=${t}`, { cache: 'no-store' }),
      ]);

      if (!oppoRes.ok || !compRes.ok || !naskahRes.ok) {
        throw new Error('Failed to fetch phones');
      }

      const oppoData = await oppoRes.json();
      const compData = await compRes.json();
      const naskahData = await naskahRes.json();

      setOppoPhones(oppoData);
      setCompPhones(compData);
      setNaskahPhones(naskahData);
      setError(null);
    } catch (err) {
      console.error('Error fetching phones:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhones();
  }, [fetchPhones]);

  const oppoTypes = [...new Set(oppoPhones.map(p => p.type))].sort();
  const compBrands = [...new Set(compPhones.map(p => p.brand))].sort();
  const naskahTypes = [...new Set(naskahPhones.map(p => p.type))].sort();
  const naskahBrands = [...new Set(naskahPhones.map(p => p.brand))].sort();

  return { oppoPhones, compPhones, naskahPhones, oppoTypes, compBrands, naskahTypes, naskahBrands, loading, error, refresh: fetchPhones };
}