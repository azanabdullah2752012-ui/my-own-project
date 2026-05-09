export const INITIAL_DATA = {
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
    { id: 'sc1', time: '07:30', task: 'Wake Up + AM Protocol', category: 'General' },
    { id: 'sc2', time: '08:00', task: 'School Preparation', category: 'General' },
    { id: 'sc3', time: '09:00', task: 'Academic Block A', category: 'Study' },
    { id: 'sc4', time: '13:00', task: 'Mid-Day Reset', category: 'General' },
    { id: 'sc5', time: '15:00', task: 'Deep Work: Coding Foundations', category: 'Study' },
    { id: 'sc6', time: '17:00', task: 'Physical Discipline', category: 'Health' },
    { id: 'sc7', time: '19:00', task: 'French Intelligence Mastery', category: 'Study' },
    { id: 'sc8', time: '21:00', task: 'Journal + Digital Sunset', category: 'General' },
    { id: 'sc9', time: '22:00', task: 'Lights Out / Recovery', category: 'General' }
  ],
  holidayRoutine: [
    { id: 'hr1', time: '08:30', task: 'Late AM Protocol', category: 'General' },
    { id: 'hr2', time: '10:00', task: 'Deep Work Block Alpha', category: 'Study' },
    { id: 'hr3', time: '13:00', task: 'Skill Expansion (French/Coding)', category: 'Study' },
    { id: 'hr4', time: '15:00', task: 'Project Build Phase', category: 'Study' },
    { id: 'hr5', time: '18:00', task: 'Physical Discipline', category: 'Health' },
    { id: 'hr6', time: '21:00', task: 'Nightly Reflection', category: 'General' },
    { id: 'hr7', time: '22:30', task: 'Sleep', category: 'General' }
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
