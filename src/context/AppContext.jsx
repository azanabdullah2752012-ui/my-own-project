import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(storage.get());
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('empire_os_auth') === 'true'
  );

  // Daily reset check
  useEffect(() => {
    const checkReset = () => {
      const lastReset = new Date(data.dashboard.lastReset);
      const now = new Date();
      
      // If it's a different day, reset dashboard tasks
      if (lastReset.toDateString() !== now.toDateString()) {
        const archivedMetrics = {
          date: lastReset.toISOString(),
          studyHours: data.dashboard.studyHours,
          tasksCompleted: data.dashboard.secondaryTasks.filter(t => t.done).length + (data.dashboard.mainMission ? 1 : 0),
          streak: data.dashboard.streak,
          distractionCount: 0 // Placeholder
        };

        const newData = {
          ...data,
          dashboard: {
            ...data.dashboard,
            mainMission: '',
            secondaryTasks: [],
            studyHours: 0,
            focusSessions: 0,
            dailyNote: '',
            lastReset: now.toISOString()
          },
          progress: {
            ...data.progress,
            metrics: [...data.progress.metrics, archivedMetrics]
          }
        };
        
        setData(newData);
        storage.save(newData);
      }
    };

    checkReset();
  }, [data]);

  const updateModule = (moduleName, moduleData) => {
    const newData = { ...data, [moduleName]: moduleData };
    setData(newData);
    storage.save(newData);
  };

  const login = (password) => {
    if (password === data.auth.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem('empire_os_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('empire_os_auth');
  };

  const value = {
    data,
    updateModule,
    isAuthenticated,
    login,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
