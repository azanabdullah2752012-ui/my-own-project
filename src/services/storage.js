const STORAGE_KEY = 'empire_os_data_v1';

export const INITIAL_DATA = {
  auth: {
    password: 'password', // Default
    lastLogin: null
  },
  dashboard: {
    mainMission: '',
    secondaryTasks: [], // { id: string, title: string, done: boolean }
    studyHours: 0,
    focusSessions: 0,
    streak: 0,
    mood: 'Normal 😐',
    dailyNote: '',
    lastReset: new Date().toISOString()
  },
  goals: {
    shortTerm: [], // { id: string, title: string, deadline: string, done: boolean }
    midTerm: [], // { id: string, title: string, category: string, progress: number, nextAction: string }
    longTerm: {
      vision: '',
      milestones: [] // { id: string, title: string, done: boolean }
    }
  },
  system: {
    morning: { wakeTime: '', firstAction: '', phoneUsage: false },
    study: { sessionLength: 25, breakDuration: 5, sessionsPerDay: 4 },
    night: { reflection: '', tomorrowPlan: [], streakConfirmed: false }
  },
  progress: {
    metrics: [], // { date: string, studyHours: number, tasksCompleted: number, streak: number, distractionCount: number }
    reviews: [] // { date: string, well: string, failed: string, improve: string, score: number }
  },
  vault: {
    notes: [] // { id: string, title: string, category: string, tags: string[], content: string, createdAt: string }
  },
  projects: {
    list: [] // { id: string, name: string, status: string, priority: string, nextStep: string, deadline: string, notes: string, progress: number }
  }
};

export const storage = {
  get: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      storage.save(INITIAL_DATA);
      return INITIAL_DATA;
    }
    const parsed = JSON.parse(data);
    // Basic migration/merge for new fields
    return { ...INITIAL_DATA, ...parsed };
  },

  save: (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  updateModule: (moduleName, moduleData) => {
    const data = storage.get();
    data[moduleName] = moduleData;
    storage.save(data);
    return data;
  }
};
