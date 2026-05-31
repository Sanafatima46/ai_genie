import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, LogOut, LayoutDashboard, FileEdit, Search, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/genie.png';

const APP_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/builder', label: 'Resume', icon: FileEdit },
  { to: '/job-finder', label: 'Jobs', icon: Search },
  { to: '/growth', label: 'Growth', icon: Sparkles },
];

export default function AuthenticatedHeader({ darkMode, setDarkMode, onCoverLetter }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="sticky top-0 z-50 w-full border-b border-light-border/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/dashboard" className="flex items-center gap-3 group shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-blue/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
              src={logo}
              alt="HireGenie AI"
              className="relative h-10 w-10 sm:h-11 sm:w-11 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-extrabold gradient-text leading-tight">HireGenie</p>
            <p className="text-[10px] text-light-muted dark:text-slate-500 truncate max-w-[140px]">
              Hi, {user?.name?.split(' ')[0] || 'there'}
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {APP_LINKS.map((link) => {
            const active = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  active
                    ? 'text-primary-blue dark:text-accent-blue bg-primary-blue/10 dark:bg-primary-blue/15'
                    : 'text-light-muted dark:text-slate-400 hover:text-primary-blue hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={16} />
                <span className="hidden md:inline">{link.label}</span>
                {active && (
                  <motion.div
                    layoutId="app-nav-pill"
                    className="absolute inset-0 rounded-xl border border-primary-blue/20 dark:border-primary-blue/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {onCoverLetter && (
            <button
              type="button"
              onClick={onCoverLetter}
              className="p-2 rounded-xl bg-primary-blue/10 text-primary-blue"
              aria-label="Cover letter"
            >
              <Mail size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-light-bg dark:bg-slate-800 text-light-muted dark:text-slate-300 hover:ring-2 hover:ring-primary-blue/30 transition-all"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={darkMode ? 'sun' : 'moon'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={logout}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={16} /> Log out
          </motion.button>
          <button
            type="button"
            onClick={logout}
            className="sm:hidden p-2 rounded-xl text-red-500 bg-red-50 dark:bg-red-500/10"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
