import { INITIAL_DATA } from './storage';

// Deep merge: INITIAL_DATA provides defaults, saved data overrides
const mergeWithDefaults = (saved) => {
  if (!saved || typeof saved !== 'object') return INITIAL_DATA;
  return {
    ...INITIAL_DATA,
    ...saved,
    settings: { ...INITIAL_DATA.settings, ...(saved.settings || {}) },
    dashboard: { ...INITIAL_DATA.dashboard, ...(saved.dashboard || {}) },
    system: { ...INITIAL_DATA.system, ...(saved.system || {}) },
    habits: saved.habits?.list ? saved.habits : INITIAL_DATA.habits,
    vault: saved.vault?.notes ? saved.vault : INITIAL_DATA.vault,
    projects: saved.projects?.list ? saved.projects : INITIAL_DATA.projects,
    journal: saved.journal?.entries ? saved.journal : INITIAL_DATA.journal,
    schoolRoutine: Array.isArray(saved.schoolRoutine) && saved.schoolRoutine.length > 0 
      ? saved.schoolRoutine : INITIAL_DATA.schoolRoutine,
    holidayRoutine: Array.isArray(saved.holidayRoutine) && saved.holidayRoutine.length > 0 
      ? saved.holidayRoutine : INITIAL_DATA.holidayRoutine,
    shortTerm: Array.isArray(saved.shortTerm) ? saved.shortTerm : INITIAL_DATA.shortTerm,
    midTerm: Array.isArray(saved.midTerm) ? saved.midTerm : INITIAL_DATA.midTerm,
    longTerm: saved.longTerm?.vision ? saved.longTerm : INITIAL_DATA.longTerm,
  };
};

const STORAGE_KEY = 'empire_os_data';

export const safeStorage = {
  get: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return INITIAL_DATA;
      const parsed = JSON.parse(raw);
      return mergeWithDefaults(parsed);
    } catch (e) {
      console.error('Failed to read storage, resetting:', e);
      return INITIAL_DATA;
    }
  },
  set: (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to write storage:', e);
    }
  }
};
