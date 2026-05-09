import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      return storage.get();
    } catch (e) {
      console.error('Storage read failed, using defaults:', e);
      return storage.get();
    }
  });

  const updateModule = (moduleName, moduleData) => {
    const newData = moduleName ? { ...data, [moduleName]: moduleData } : moduleData;
    setData(newData);
    try {
      storage.set(newData);
    } catch (e) {
      console.error('Storage save failed:', e);
    }
  };

  // Daily reset check — safe version
  useEffect(() => {
    if (!data?.dashboard) return;

    try {
      const lastReset = data.dashboard.lastReset ? new Date(data.dashboard.lastReset) : null;
      const now = new Date();

      // Only reset if we have a valid previous reset date AND it's a different day
      if (lastReset && lastReset.toDateString() !== now.toDateString()) {
        const tasksDone = (data.dashboard.secondaryTasks || []).filter(t => t.done).length
          + (data.dashboard.mainMission ? 1 : 0);
        const studyHours = data.dashboard.studyHours || 0;
        const isWin = studyHours >= 1 || tasksDone >= 2;
        const newStreak = isWin ? (data.dashboard.streak || 0) + 1 : 0;

        const newData = {
          ...data,
          dashboard: {
            ...data.dashboard,
            mainMission: '',
            secondaryTasks: [],
            studyHours: 0,
            focusSessions: 0,
            streak: newStreak,
            lastReset: now.toISOString()
          }
        };

        setData(newData);
        storage.set(newData);
      } else if (!data.dashboard.lastReset) {
        // First time — just stamp it
        const newData = {
          ...data,
          dashboard: { ...data.dashboard, lastReset: now.toISOString() }
        };
        setData(newData);
        storage.set(newData);
      }
    } catch (e) {
      console.error('Daily reset check failed:', e);
    }
  }, []); // Only on mount

  const value = {
    data,
    updateModule,
    isAuthenticated: true
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
