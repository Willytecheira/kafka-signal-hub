import { useState, useEffect, useCallback, useRef } from 'react';
import type { Signal, ConnectionStatus } from '@/types/signal';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export function useSignals(refreshInterval = 5000) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('no-data');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const fetchSignals = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/signals`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Signal[] = await res.json();
      setSignals(data);
      setStatus(data.length > 0 ? 'connected' : 'no-data');
      setLastUpdated(new Date());
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchSignals();
    intervalRef.current = setInterval(fetchSignals, refreshInterval);
    return () => clearInterval(intervalRef.current);
  }, [fetchSignals, refreshInterval]);

  return { signals, status, lastUpdated, refetch: fetchSignals };
}
