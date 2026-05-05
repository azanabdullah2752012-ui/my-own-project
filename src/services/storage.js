const STORAGE_KEY = 'empire_os_data_v1';

export const INITIAL_DATA = {
  settings: { name: 'Azan' },
  dashboard: {
    mainMission: '',
    secondaryTasks: [],
    studyHours: 0,
    focusSessions: 0,
    streak: 0,
    mood: 'Normal 😐',
    dailyNote: '',
    lastReset: new Date().toISOString(),
    subjects: [] // { id, name, hours, color }
  },
  goals: {
    shortTerm: [],
    midTerm: [],
    longTerm: { vision: '', milestones: [] }
  },
  system: {
    morning: { wakeTime: '06:00', firstAction: '', phoneUsage: false },
    study: { sessionLength: 25, breakDuration: 5, sessionsPerDay: 4 },
    night: { reflection: '', tomorrowPlan: [], streakConfirmed: false }
  },
  progress: {
    metrics: [],
    reviews: []
  },
  vault: {
    notes: []
  },
  projects: {
    list: []
  },
  habits: {
    list: [],   // { id, name, icon, color, history: { [dateStr]: boolean } }
  },
  journal: {
    entries: [] // { id, date: 'YYYY-MM-DD', content, mood, title }
  }
};

export const storage = {
  get: () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { storage.save(INITIAL_DATA); return INITIAL_DATA; }
    const parsed = JSON.parse(raw);
    // deep merge — keep existing data, add new keys from INITIAL_DATA
    return deepMerge(INITIAL_DATA, parsed);
  },
  save: (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data)),
};

function deepMerge(defaults, saved) {
  const out = { ...defaults };
  for (const key of Object.keys(saved)) {
    if (saved[key] !== null && typeof saved[key] === 'object' && !Array.isArray(saved[key]) && key in defaults && typeof defaults[key] === 'object') {
      out[key] = deepMerge(defaults[key], saved[key]);
    } else {
      out[key] = saved[key];
    }
  }
  return out;
}
