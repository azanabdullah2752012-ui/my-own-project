import React, { createContext, useContext, useState } from 'react';
import { safeStorage } from '../services/safeStorage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => safeStorage.get());

  const updateModule = (moduleName, moduleData) => {
    const newData = moduleName ? { ...data, [moduleName]: moduleData } : moduleData;
    setData(newData);
    safeStorage.set(newData);
  };

  return (
    <AppContext.Provider value={{ data, updateModule, isAuthenticated: true }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
