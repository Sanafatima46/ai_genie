import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Map,
  BookOpen,
  Brain,
  Award,
  Bell,
  Star,
  Users,
  DollarSign,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LearningRoadmapPanel from '../components/growth/LearningRoadmapPanel';
import CourseSuggestionsPanel from '../components/growth/CourseSuggestionsPanel';
import SkillQuizPanel from '../components/growth/SkillQuizPanel';
import CertificationTrackerPanel from '../components/growth/CertificationTrackerPanel';
import LearningReminderPanel from '../components/growth/LearningReminderPanel';
import SuccessStoriesPanel from '../components/growth/SuccessStoriesPanel';
import MentorConnectPanel from '../components/growth/MentorConnectPanel';
import SalaryPredictorPanel from '../components/growth/SalaryPredictorPanel';
import AtsScorePanel from '../components/growth/AtsScorePanel';

const TABS = [
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'quiz', label: 'Quiz', icon: Brain },
  { id: 'certs', label: 'Certs', icon: Award },
  { id: 'reminder', label: 'Reminder', icon: Bell },
  { id: 'stories', label: 'Stories', icon: Star },
  { id: 'mentors', label: 'Mentors', icon: Users },
  { id: 'salary', label: 'Salary', icon: DollarSign },
  { id: 'ats', label: 'ATS', icon: FileCheck },
];

const PANELS = {
  roadmap: LearningRoadmapPanel,
  courses: CourseSuggestionsPanel,
  quiz: SkillQuizPanel,
  certs: CertificationTrackerPanel,
  reminder: LearningReminderPanel,
  stories: SuccessStoriesPanel,
  mentors: MentorConnectPanel,
  salary: SalaryPredictorPanel,
  ats: AtsScorePanel,
};

export default function GrowthHub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState('roadmap');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const ActivePanel = PANELS[tab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#1a1a3e] to-[#0f0c29] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="text-purple-400" size={24} />
              <h1 className="text-3xl font-black text-white">Growth Hub</h1>
            </div>
            <p className="text-slate-400">
              Learn, assess, track certifications, connect with mentors, and optimize your career.
            </p>
          </div>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                tab === id
                  ? 'bg-gradient-to-r from-sky-400 to-purple-400 text-white shadow-lg shadow-purple-500/20'
                  : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {ActivePanel && <ActivePanel />}
      </div>
    </div>
  );
}
