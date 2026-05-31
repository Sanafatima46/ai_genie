export const GROWTH_TABS = [
  { id: 'roadmap', label: 'Learning Roadmap', icon: 'Map' },
  { id: 'courses', label: 'Free Courses', icon: 'BookOpen' },
  { id: 'quiz', label: 'Skill Quiz', icon: 'Brain' },
  { id: 'certs', label: 'Certifications', icon: 'Award' },
  { id: 'reminder', label: 'Daily Reminder', icon: 'Bell' },
  { id: 'stories', label: 'Success Stories', icon: 'Star' },
  { id: 'mentors', label: 'Mentor Connect', icon: 'Users' },
  { id: 'salary', label: 'Salary Predictor', icon: 'DollarSign' },
  { id: 'ats', label: 'ATS Score', icon: 'FileCheck' },
];

export function cardClass(extra = '') {
  return `rounded-[20px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm ${extra}`;
}

export function inputClass(extra = '') {
  return `w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none ${extra}`;
}

export function btnPrimary(extra = '') {
  return `inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-purple-400 px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50 ${extra}`;
}

export function btnSecondary(extra = '') {
  return `inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:opacity-50 ${extra}`;
}
