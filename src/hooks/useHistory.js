import { useContext } from 'react';
import { HistoryContext } from '../context/contexts';

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be used within HistoryProvider');
  return ctx;
}
