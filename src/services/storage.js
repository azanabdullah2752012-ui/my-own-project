export const DATA_VERSION = 2; // Increment this when schedules change

export const INITIAL_DATA = {
  dataVersion: DATA_VERSION,
  settings: {
    activeRoutine: 'school',
    name: 'Azan',
    theme: 'dark'
  },
  dashboard: {
    mainMission: '',
    secondaryTasks: [],
    streak: 0,
    focusSessions: 0,
    ghostMode: false
  },
  system: {
    morning: { wakeTime: '07:30', phoneUsage: true },
    water: { target: 8, history: {} },
    prayers: {},
    routineHistory: {}
  },
  schoolRoutine: [
    { id: 'sc1',  time: '06:30', task: 'Wake Up & Get Ready',    category: 'General' },
    { id: 'sc2',  time: '06:45', task: 'Pray (Fajr)',            category: 'Faith'   },
    { id: 'sc3',  time: '07:00', task: 'Pack School Bag',        category: 'General' },
    { id: 'sc4',  time: '07:10', task: 'Revise / School Work',   category: 'Study'   },
    { id: 'sc5',  time: '07:40', task: 'Breakfast',              category: 'Health'  },
    { id: 'sc6',  time: '07:55', task: 'Wait for Bus',           category: 'General' },
    { id: 'sc7',  time: '08:00', task: 'School',                 category: 'Study'   },
    { id: 'sc8',  time: '16:00', task: 'Refresh / Relax',        category: 'General' },
    { id: 'sc9',  time: '16:30', task: 'Second Lunch / Snack',   category: 'Health'  },
    { id: 'sc10', time: '17:00', task: 'Pray',                   category: 'Faith'   },
    { id: 'sc11', time: '17:20', task: 'Math Practice',          category: 'Study'   },
    { id: 'sc12', time: '18:20', task: 'Pray',                   category: 'Faith'   },
    { id: 'sc13', time: '18:50', task: 'Exercise / Jumping Jacks', category: 'Health' },
    { id: 'sc14', time: '19:10', task: 'Revision',               category: 'Study'   },
    { id: 'sc15', time: '19:30', task: 'Other Activities',       category: 'General' },
    { id: 'sc16', time: '20:30', task: 'Dinner',                 category: 'Health'  },
    { id: 'sc17', time: '21:25', task: 'Pray',                   category: 'Faith'   },
    { id: 'sc18', time: '21:45', task: 'Get Ready for Bed',      category: 'General' },
    { id: 'sc19', time: '22:00', task: 'Sleep 😴',               category: 'General' }
  ],
  holidayRoutine: [
    { id: 'hr1',  time: '07:00', task: 'Wake Up & Refresh',      category: 'General' },
    { id: 'hr2',  time: '07:30', task: 'Pray',                   category: 'Faith'   },
    { id: 'hr3',  time: '08:00', task: 'Breakfast',              category: 'Health'  },
    { id: 'hr4',  time: '08:30', task: 'Deep Study Session',     category: 'Study'   },
    { id: 'hr5',  time: '10:00', task: 'Free Time / Relax',      category: 'General' },
    { id: 'hr6',  time: '11:00', task: 'Skill Building (Coding / French / Reading)', category: 'Study' },
    { id: 'hr7',  time: '12:00', task: 'Chill / Entertainment',  category: 'General' },
    { id: 'hr8',  time: '13:00', task: 'Lunch & Rest',           category: 'Health'  },
    { id: 'hr9',  time: '14:00', task: 'Light Revision',         category: 'Study'   },
    { id: 'hr10', time: '15:00', task: 'Gaming / Friends / Fun', category: 'General' },
    { id: 'hr11', time: '17:00', task: 'Pray',                   category: 'Faith'   },
    { id: 'hr12', time: '17:15', task: 'Exercise / Workout',     category: 'Health'  },
    { id: 'hr13', time: '18:00', task: 'Creative Projects / Hobbies', category: 'General' },
    { id: 'hr14', time: '19:00', task: 'Dinner',                 category: 'Health'  },
    { id: 'hr15', time: '20:00', task: 'Relax / Family / Entertainment', category: 'General' },
    { id: 'hr16', time: '21:30', task: 'Prepare for Sleep',      category: 'General' },
    { id: 'hr17', time: '22:00', task: 'Sleep 😴',               category: 'General' }
  ],
  habits: {
    list: [
      { id: 'deep_work', name: 'Deep Work Session', icon: '🧠', color: '#00FF99', history: {} },
      { id: 'french', name: 'French Intelligence', icon: '🇫🇷', color: '#4DA3FF', history: {} },
      { id: 'physical', name: 'Physical Discipline', icon: '⚔️', color: '#FF4444', history: {} },
      { id: 'knowledge', name: 'Knowledge Expansion', icon: '📚', color: '#B366FF', history: {} },
      { id: 'reset', name: 'Mental Reset', icon: '🌙', color: '#FFD700', history: {} }
    ]
  },
  shortTerm: [
    { id: 's1', title: 'Complete Algebra Reinforcement', priority: 'High', deadline: '7 Days', done: false, nextAction: 'Solve 80 problems' },
    { id: 's2', title: 'Stabilize Empire OS v1', priority: 'High', deadline: '7 Days', done: false, nextAction: 'Mobile responsiveness' },
    { id: 's3', title: 'French Consistency Recovery', priority: 'Mid', deadline: '7 Days', done: false, nextAction: 'Memorize 50 words' }
  ],
  midTerm: [
    { id: 'm1', title: 'Academic Performance Upgrade', progress: 5, nextAction: 'Improve Math accuracy', category: 'Career', done: false },
    { id: 'm2', title: 'Deep Work Discipline', progress: 10, nextAction: '40 focus sessions', category: 'General', done: false },
    { id: 'm3', title: 'Real Coding Development', progress: 5, nextAction: 'React fundamentals', category: 'Career', done: false }
  ],
  longTerm: {
    vision: 'Become a high-performance builder capable of excelling academically, mastering coding, and building meaningful projects without depending on motivation.',
    milestones: [
      { id: 'l1', title: 'Achieve 40 Focused Sessions', done: false },
      { id: 'l2', title: 'Build 2 Independent Features', done: false },
      { id: 'l3', title: 'Noticeable School Confidence', done: false }
    ],
    values: ['Discipline', 'Intelligence', 'Technical Mastery', 'Consistency']
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
  journal: {
    entries: []
  }
};

const STORAGE_KEY = 'empire_os_data';

export const storage = {
  get: () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_DATA;
  },
  set: (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};
