import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(storage.get());
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Daily reset check
  useEffect(() => {
    const checkReset = () => {
      const lastReset = new Date(data.dashboard.lastReset);
      const now = new Date();
      
      // If it's a different day, reset dashboard tasks
      if (lastReset.toDateString() !== now.toDateString()) {
        const tasksDone = data.dashboard.secondaryTasks.filter(t => t.done).length + (data.dashboard.mainMission ? 1 : 0);
        const studyHours = data.dashboard.studyHours;
        
        // STREAK LOGIC: Win if study > 1hr OR tasks > 2
        const isWin = studyHours >= 1 || tasksDone >= 2;
        const newStreak = isWin ? (data.dashboard.streak || 0) + 1 : 0;

        const archivedMetrics = {
          date: lastReset.toISOString(),
          studyHours: studyHours,
          tasksCompleted: tasksDone,
          streak: newStreak,
          distractionCount: 0 
        };

        const newData = {
          ...data,
          dashboard: {
            ...data.dashboard,
            mainMission: '',
            secondaryTasks: [],
            studyHours: 0,
            focusSessions: 0,
            streak: newStreak, // Update streak for the new day
            lastReset: now.toISOString()
          },
          progress: {
            ...data.progress,
            metrics: [...(data.progress.metrics || []), archivedMetrics]
          }
        };
        
        setData(newData);
        storage.set(newData);
      }
    };

    checkReset();
  }, [data]);

  const updateModule = (moduleName, moduleData) => {
    // If moduleName is null, we are updating the entire state
    const newData = moduleName ? { ...data, [moduleName]: moduleData } : moduleData;
    setData(newData);
    storage.set(newData);
  };

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
