import { create } from 'zustand';
import { Colors } from '../constants/colors';

type ThemeType = 'light' | 'dark';

interface ThemeState {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  colors: typeof Colors.dark;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark', // Default to Dark mode based on DESIGN.md
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light',
    colors: state.theme === 'light' ? Colors.dark : Colors.light
  })),
  setTheme: (theme) => set({ theme, colors: Colors[theme] }),
  colors: Colors.dark,
}));
