'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Leer preferencia guardada o preferencia del sistema
    const guardado = localStorage.getItem('bitacora_theme') as Theme | null;
    const inicial: Theme = guardado === 'light' ? 'light' : 'dark';

    setThemeState(inicial);
    aplicarTemaEnDOM(inicial);
    setMounted(true);
  }, []);

  const aplicarTemaEnDOM = (nuevoTema: Theme) => {
    const root = document.documentElement;
    if (nuevoTema === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  };

  const setTheme = (nuevoTema: Theme) => {
    setThemeState(nuevoTema);
    localStorage.setItem('bitacora_theme', nuevoTema);
    aplicarTemaEnDOM(nuevoTema);
  };

  const toggleTheme = () => {
    const siguienteTema = theme === 'dark' ? 'light' : 'dark';
    setTheme(siguienteTema);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser utilizado dentro de un ThemeProvider');
  }
  return context;
}
