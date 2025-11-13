import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('darkMode', darkMode);
    
    if (darkMode) {
      root.classList.add('dark');
      console.log('Dark mode enabled - dark class added to HTML');
    } else {
      root.classList.remove('dark');
      console.log('Light mode enabled - dark class removed from HTML');
    }
    
    // Log current classes for debugging
    console.log('HTML classes:', root.className);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
