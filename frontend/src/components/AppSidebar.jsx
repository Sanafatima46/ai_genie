import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileEdit,
  Search,
  LogOut,
  Moon,
  Sun,
  Mail,
  BarChart3,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/genie.png';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/builder', label: 'Resume Builder', icon: FileEdit },
  { to: '/job-finder', label: 'Job Finder', icon: Search },
  { to: '/chatbot', label: 'Career Chatbot', icon: MessageSquare },
];

export default function AppSidebar({ darkMode, setDarkMode, onCoverLetter }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-light-border dark:border-slate-800 bg-white dark:bg-slate-950 min-h-[calc(100vh-0px)]">
      <div className="p-6 border-b border-light-border dark:border-slate-800">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <img src={logo} alt="HireGenie AI" className="h-11 w-11 object-contain drop-shadow-md" />
          <div>
            <p className="font-extrabold text-sm gradient-text leading-tight">HireGenie AI</p>
            <p className="text-[10px] text-light-muted dark:text-slate-500">Career workspace</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-light-muted dark:text-slate-500 px-3 mb-2">
          Menu
        </p>
        {NAV.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                active
                  ? 'text-primary-blue dark:text-accent-blue bg-primary-blue/10'
                  : 'text-light-muted dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-gradient-to-b from-primary-blue to-primary-purple"
                />
              )}
              <Icon size={18} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <p className="text-[10px] font-bold uppercase tracking-widest text-light-muted dark:text-slate-500 px-3 mt-6 mb-2">
          Tools
        </p>
        <button
          type="button"
          onClick={onCoverLetter}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-light-muted dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-left"
        >
          <Mail size={18} />
          Cover Letter
        </button>
        <Link
          to="/growth"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            location.pathname === '/growth'
              ? 'text-primary-blue bg-primary-blue/10'
              : 'text-light-muted dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          <Sparkles size={18} />
          Growth Hub
        </Link>
        <Link
          to="/job-analytics"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            location.pathname === '/job-analytics'
              ? 'text-primary-blue bg-primary-blue/10'
              : 'text-light-muted dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          <BarChart3 size={18} />
          Job analytics
        </Link>
      </nav>

      <div className="p-4 border-t border-light-border dark:border-slate-800 space-y-3">
        <div className="rounded-2xl bg-gradient-to-br from-primary-blue to-primary-purple p-4 text-white">
          <p className="text-xs font-bold opacity-90">Tip</p>
          <p className="text-[11px] mt-1 opacity-80 leading-snug">
            Hi {user?.name?.split(' ')[0] || 'there'} — update your resume to boost match scores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="flex-1 p-2 rounded-xl bg-light-bg dark:bg-slate-900 border border-light-border dark:border-slate-800 flex justify-center"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            onClick={logout}
            className="flex-1 p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 text-sm font-bold flex items-center justify-center gap-1"
          >
            <LogOut size={16} /> Out
          </button>
        </div>
      </div>
    </aside>
  );
}
