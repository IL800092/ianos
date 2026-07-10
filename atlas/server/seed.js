// Seed data written to data/*.json on first boot only (see server/index.js —
// existing data is never overwritten).

export const seed = {
  profile: {
    name: 'Ian',
    grade: 'Grade 12',
    school: 'Bayview Glen, Toronto',
    music: 'Alto sax + piano (10+ yrs)',
    sports: [
      { season: 'Fall', sport: 'Volleyball', months: [9, 10, 11] },
      { season: 'Winter', sport: 'Basketball', months: [12, 1, 2, 3] },
      { season: 'Spring', sport: 'Tennis / Ultimate', months: [4, 5, 6] },
      { season: 'Summer', sport: 'Offseason training', months: [7, 8] },
    ],
    activities: [
      'Canadian Regional Director, World Wave Music Festival',
      'DECA',
      'HOSA',
      'Skyky Foundation',
    ],
  },

  academics: {
    grade11Average: 97,
    grade11: [
      { code: 'MHF4U', name: 'Advanced Functions', grade: 97 },
      { code: 'ICS4U', name: 'Computer Science', grade: 97 },
      { code: 'MDM4U', name: 'Data Management', grade: 96 },
      { code: 'SCH3U', name: 'Chemistry', grade: 98 },
      { code: 'ENG3U', name: 'English', grade: 94 },
      { code: 'AMU3MB', name: 'Music', grade: 98 },
      { code: 'SPH3UC', name: 'Physics', grade: 97 },
      { code: 'BIO', name: 'Biology (external)', grade: 98 },
    ],
    grade12: [
      { code: 'AP CALC', name: 'AP Calculus' },
      { code: 'AP BIO', name: 'AP Biology' },
      { code: 'AP CHEM', name: 'AP Chemistry' },
      { code: 'AP PHYS', name: 'AP Physics' },
      { code: 'MUSIC', name: 'Music' },
      { code: 'ENG4U', name: 'English' },
    ],
  },

  sat: {
    targetBand: [1450, 1500],
    retakeWindow: 'Aug/Sep 2026',
    attempts: [
      {
        id: 'sat-1',
        date: '2026-06-06',
        total: 1360,
        rw: null,
        math: null,
        kind: 'official',
        notes: 'First official sitting',
      },
    ],
  },

  university: {
    schools: [
      {
        id: 'uni-ucas',
        school: 'UK Medical Schools',
        program: 'Medicine (A100)',
        platform: 'UCAS',
        deadline: '2026-10-15',
        status: 'In progress',
        notes: 'UCAT required — summer 2026 window',
      },
      {
        id: 'uni-waterloo',
        school: 'University of Waterloo',
        program: 'Mechatronics Engineering',
        platform: 'OUAC',
        deadline: '2027-01-15',
        status: 'Not started',
        notes: '',
      },
      {
        id: 'uni-mcmaster',
        school: 'McMaster University',
        program: 'Mechatronics (iBioMed/Eng)',
        platform: 'OUAC',
        deadline: '2027-01-15',
        status: 'Not started',
        notes: '',
      },
      {
        id: 'uni-tmu',
        school: 'Toronto Metropolitan University',
        program: 'Mechanical Engineering',
        platform: 'OUAC',
        deadline: '2027-01-15',
        status: 'Not started',
        notes: '',
      },
      {
        id: 'uni-berkeley',
        school: 'UC Berkeley',
        program: 'Mechanical Engineering / EECS',
        platform: 'UC Application',
        deadline: '2026-11-30',
        status: 'Not started',
        notes: 'Test-blind — SAT not considered',
      },
      {
        id: 'uni-commonapp',
        school: 'US Schools (Regular Decision)',
        program: 'Mechatronics / MechE',
        platform: 'Common App',
        deadline: '2027-01-01',
        status: 'Not started',
        notes: 'No ED decision yet',
      },
    ],
    milestones: [
      {
        id: 'mil-ucat',
        label: 'UCAT exam (summer window)',
        date: '2026-08-15',
      },
      { id: 'mil-sat', label: 'SAT retake (Aug sitting)', date: '2026-08-22' },
    ],
  },

  projects: [
    {
      id: 'proj-ianos',
      name: 'IAN.OS',
      description:
        'Personal JARVIS dashboard — Claude-powered assistant with 3D particle orb, voice/text input, dynamic panels.',
      status: 'active',
      nextAction: 'Wire voice input',
      link: 'https://IL800092.github.io/ianos',
    },
    {
      id: 'proj-clinicos',
      name: 'ClinicOS',
      description:
        'Vue.js + MongoDB EMR built with Arees — 11,254 drugs indexed.',
      status: 'active',
      nextAction: 'Drug-interaction checker MVP',
      link: '',
    },
    {
      id: 'proj-studyhub',
      name: 'StudyHub',
      description: 'React/Vite grade tracker.',
      status: 'paused',
      nextAction: 'Ship grade-trend charts',
      link: 'https://IL800092.github.io/studyhub',
    },
    {
      id: 'proj-portfolio',
      name: 'Portfolio site',
      description: 'Personal portfolio for university applications.',
      status: 'paused',
      nextAction: 'Draft project case studies',
      link: '',
    },
  ],

  training: {
    goal: { label: 'Touch rim at 5\'9"', targetInches: 120 },
    entries: [],
  },

  todos: [
    {
      id: 'todo-1',
      text: 'SAT practice test — full timed sitting',
      priority: 'high',
      due: '2026-07-12',
      tag: 'school',
      done: false,
      createdAt: '2026-07-08',
    },
    {
      id: 'todo-2',
      text: 'UCAT: 2 Verbal Reasoning drill sets',
      priority: 'high',
      due: '2026-07-14',
      tag: 'uni',
      done: false,
      createdAt: '2026-07-08',
    },
    {
      id: 'todo-3',
      text: 'Draft UCAS personal statement outline',
      priority: 'med',
      due: '2026-07-20',
      tag: 'uni',
      done: false,
      createdAt: '2026-07-08',
    },
    {
      id: 'todo-4',
      text: 'IAN.OS: wire voice input',
      priority: 'med',
      due: '2026-07-18',
      tag: 'project',
      done: false,
      createdAt: '2026-07-08',
    },
  ],
}
