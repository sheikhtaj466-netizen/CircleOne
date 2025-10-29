import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // User ki saved choice ko memory (localStorage) se nikalo, ya default me 'light' rakho
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Jab bhi theme badle, usko memory me save kar do
  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Poore HTML page par theme ka attribute set kar do
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
