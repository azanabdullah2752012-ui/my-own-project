const STORAGE_KEY = 'empire_os_data_v1';

export const INITIAL_DATA = {
  settings: { 
    name: 'Azan',
    activeRoutine: 'school' // 'school' or 'holiday'
  },
  dashboard: {
    mainMission: '',
    secondaryTasks: [],
    studyHours: 0,
    focusSessions: 0,
    streak: 0,
    mood: 'Normal 😐',
    dailyNote: '',
    lastReset: new Date().toISOString(),
    subjects: [],
    ghostMode: false,
    gatekeeper: { fajr: false, water: false, bed: false, dhikr: false }
  },
  goals: {
    shortTerm: [], // { id, title, deadline, done, priority: 'Low'|'Mid'|'High' }
    midTerm: [],   // { id, title, progress, nextAction, category: 'General'|'Wealth'|'Health'|'Soul'|'Career' }
    longTerm: { 
      vision: '', 
      milestones: [],
      values: [] // string array
    }
  },
  system: {
    morning: { wakeTime: '06:00', firstAction: '', phoneUsage: false },
    study: { sessionLength: 25, breakDuration: 5, sessionsPerDay: 4 },
    night: { reflection: '', tomorrowPlan: [], streakConfirmed: false },
    prayers: {}, // { [dateStr]: { fajr: bool, dhuhr: bool, asr: bool, maghrib: bool, isha: bool } }
    routineHistory: {}, // { [dateStr]: { [activityId]: bool } }
    sleep: { target: 8, history: {} }, // { [dateStr]: { hours: number, quality: 1-5 } }
    water: { target: 8, history: {} }, // { [dateStr]: number }
    quran: { lastSurah: '', lastAyah: '', history: {} }, // { [dateStr]: string }
    dhikr: { history: {} }, // { [dateStr]: { tasbih: number, tahmid: number, takbir: number } }
    sunnah: { history: {} } // { [dateStr]: { miswak: bool, charity: bool, fast: bool } }
  },
  schoolRoutine: [
    { id: 'wake', time: '06:30', end: '06:45', activity: 'Wake up & get ready', icon: '🌅' },
    { id: 'pray1', time: '06:45', end: '07:00', activity: 'Pray', icon: '🕋' },
    { id: 'bag', time: '07:00', end: '07:10', activity: 'Pack school bag', icon: '🎒' },
    { id: 'schoolwork', time: '07:10', end: '07:40', activity: 'Revise / School work', icon: '📚' },
    { id: 'bfast', time: '07:40', end: '07:55', activity: 'Breakfast', icon: '🍳' },
    { id: 'bus', time: '07:55', end: '08:00', activity: 'Wait for bus', icon: '🚌' },
    { id: 'school', time: '08:00', end: '16:00', activity: 'School', icon: '🏫' },
    { id: 'relax', time: '16:00', end: '16:30', activity: 'Refresh / Relax', icon: '💆' },
    { id: 'snack', time: '16:30', end: '16:55', activity: 'Second lunch / Snack', icon: '🍱' },
    { id: 'pray2', time: '17:00', end: '17:15', activity: 'Pray', icon: '🕋' },
    { id: 'math', time: '17:20', end: '18:20', activity: 'Math practice', icon: '🧮' },
    { id: 'pray3', time: '18:20', end: '18:45', activity: 'Pray', icon: '🕋' },
    { id: 'jump', time: '18:50', end: '19:10', activity: '500 Jumping Jacks', icon: '⚡' },
    { id: 'revise', time: '19:10', end: '19:30', activity: 'Revision', icon: '📖' },
    { id: 'other', time: '19:30', end: '20:25', activity: 'Other activities', icon: '🎨' },
    { id: 'dinner', time: '20:30', end: '21:25', activity: 'Dinner', icon: '🍽️' },
    { id: 'pray4', time: '21:25', end: '21:45', activity: 'Pray', icon: '🕋' },
    { id: 'nightready', time: '21:45', end: '22:00', activity: 'Get ready for bed', icon: '🌙' },
    { id: 'sleep', time: '22:00', end: '06:30', activity: 'Sleep 😴', icon: '🛌' }
  ],
  holidayRoutine: [
    { id: 'wake_h', time: '07:00', end: '07:30', activity: 'Wake up + refresh', icon: '🌅' },
    { id: 'pray1_h', time: '07:30', end: '08:00', activity: 'Pray', icon: '🕋' },
    { id: 'bfast_h', time: '08:00', end: '08:30', activity: 'Breakfast', icon: '🍳' },
    { id: 'deep_h', time: '08:30', end: '10:00', activity: 'Deep study session', icon: '🧠' },
    { id: 'free_h', time: '10:00', end: '11:00', activity: 'Free time', icon: '🎮' },
    { id: 'skill_h', time: '11:00', end: '12:00', activity: 'Skill building', icon: '💻' },
    { id: 'chill_h', time: '12:00', end: '13:00', activity: 'Chill', icon: '💆' },
    { id: 'lunch_h', time: '13:00', end: '14:00', activity: 'Lunch + rest', icon: '🍱' },
    { id: 'light_h', time: '14:00', end: '15:00', activity: 'Light revision', icon: '📖' },
    { id: 'fun_h', time: '15:00', end: '17:00', activity: 'Fun/gaming/friends', icon: '🔥' },
    { id: 'pray2_h', time: '17:00', end: '17:15', activity: 'Pray', icon: '🕋' },
    { id: 'ex_h', time: '17:15', end: '18:00', activity: 'Exercise', icon: '⚡' },
    { id: 'creative_h', time: '18:00', end: '19:00', activity: 'Creative/project time', icon: '🎨' },
    { id: 'dinner_h', time: '19:00', end: '20:00', activity: 'Dinner', icon: '🍽️' },
    { id: 'relax_h', time: '20:00', end: '21:30', activity: 'Relax', icon: '🍿' },
    { id: 'nightready_h', time: '21:30', end: '22:00', activity: 'Prepare for sleep', icon: '🌙' },
    { id: 'sleep_h', time: '22:00', end: '07:00', activity: 'Sleep', icon: '🛌' }
  ],
  progress: {
    metrics: [],
    reviews: []
  },
  habits: {
    list: [
      { id: 'deep_work', name: 'Deep Work Session', icon: '🧠', color: '#00FF99', history: {} },
      { id: 'french', name: 'French Intelligence', icon: '🇫🇷', color: '#4DA3FF', history: {} },
      { id: 'physical', name: 'Physical Discipline', icon: '⚔️', color: '#FF4444', history: {} },
      { id: 'knowledge', name: 'Knowledge Expansion', icon: '📚', color: '#B366FF', history: {} },
      { id: 'reset', name: 'Mental Reset', icon: '🌙', color: '#FFD700', history: {} }
    ]
  },
  objectives: {
    sprints: [
      { id: 's1', title: 'Lock Study Consistency (min 2 blocks daily)', done: false },
      { id: 's2', title: 'Refine Empire OS Usability', done: false },
      { id: 's3', title: 'Eliminate Distraction Leakage', done: false }
    ],
    monthly: [
      { id: 'm1', title: 'Academic Upgrade: Math + French', done: false },
      { id: 'm2', title: 'Deploy Stable Empire OS v1', done: false }
    ],
    ultimate: [
      { id: 'u1', title: 'Build a high-performance version of self', done: false }
    ],
    roadmap: []
  },
  vault: {
    notes: [
      { id: 'rule1', title: 'Rule 1: Discipline Before Emotion', category: 'Principles', content: 'Feelings change hourly. Systems remain. Action: Follow schedule even when motivation disappears.', createdAt: new Date().toISOString() },
      { id: 'rule2', title: 'Rule 2: Attention Is a Weapon', category: 'Principles', content: 'What controls your attention controls your future. Action: Reduce distraction exposure aggressively.', createdAt: new Date().toISOString() },
      { id: 'rule3', title: 'Rule 3: Small Actions Compound', category: 'Principles', content: 'Tiny repeated actions shape identity faster than rare bursts of intensity. Action: Prioritize consistency over perfection.', createdAt: new Date().toISOString() }
    ]
  },
  projects: {
    list: []
  },
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
