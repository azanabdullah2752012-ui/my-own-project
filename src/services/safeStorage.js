import { INITIAL_DATA, DATA_VERSION } from './storage';

// Merges saved data with defaults.
// If dataVersion is old, forces routines to be replaced.
const mergeWithDefaults = (saved) => {
  if (!saved || typeof saved !== 'object') return { ...INITIAL_DATA };

  const forceUpdateRoutines = !saved.dataVersion || saved.dataVersion < DATA_VERSION;

  return {
    ...INITIAL_DATA,
    ...saved,
    dataVersion: DATA_VERSION,
    settings:  { ...INITIAL_DATA.settings,  ...(saved.settings  || {}) },
    dashboard: { ...INITIAL_DATA.dashboard, ...(saved.dashboard || {}) },
    system:    { ...INITIAL_DATA.system,    ...(saved.system    || {}) },
    habits:    saved.habits?.list?.length   ? saved.habits    : INITIAL_DATA.habits,
    vault:     saved.vault?.notes?.length   ? saved.vault     : INITIAL_DATA.vault,
    projects:  saved.projects               ? saved.projects  : INITIAL_DATA.projects,
    journal:   saved.journal                ? saved.journal   : INITIAL_DATA.journal,
    // Force-replace schedules when version is old
    schoolRoutine:  forceUpdateRoutines ? INITIAL_DATA.schoolRoutine  : (saved.schoolRoutine?.length  > 0 ? saved.schoolRoutine  : INITIAL_DATA.schoolRoutine),
    holidayRoutine: forceUpdateRoutines ? INITIAL_DATA.holidayRoutine : (saved.holidayRoutine?.length > 0 ? saved.holidayRoutine : INITIAL_DATA.holidayRoutine),
  };
};

const STORAGE_KEY = 'empire_os_data';

export const safeStorage = {
  get: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...INITIAL_DATA };
      const parsed = JSON.parse(raw);
      const merged = mergeWithDefaults(parsed);
      // Save the merged (versioned) data back so next load is fast
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } catch (e) {
      console.error('Storage read failed, resetting:', e);
      return { ...INITIAL_DATA };
    }
  },
  set: (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Storage save failed:', e);
    }
  }
};
