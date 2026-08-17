import { useContext } from 'react';
import { ThemeContext } from '../context/contexts';

export function useAppTheme() {
  return useContext(ThemeContext);
}
