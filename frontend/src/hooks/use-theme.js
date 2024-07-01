import { useSelector } from 'react-redux';

export function useTheme() {
  const local = useSelector((state) => state.local);

  return { theme: local.theme, isDark: local.theme === 'dark' };
}
