import React from 'react';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext.jsx';
import { StudyRoomProvider } from './context/StudyRoomContext.jsx';

const AppRoot = ({ Router, routerProps = {} }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudyRoomProvider>
          <Router {...routerProps}>
            <App />
          </Router>
        </StudyRoomProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppRoot;
