import { useContext } from 'react';
import { DiffContext } from '../context/contexts';

export function useDiff() {
  const ctx = useContext(DiffContext);
  if (!ctx) throw new Error('useDiff must be used within DiffProvider');
  return ctx;
}
