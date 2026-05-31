import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, BarChart3, Bookmark, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import WeeklyBarChart from '../components/dashboard/WeeklyBarChart';
import DonutChart from '../components/dashboard/DonutChart';
import SavedJobsList from '../components/jobs/SavedJobsList';
import {
  getSavedJobsList,
  removeSavedJob,
  getMatchScoreDistribution,
  getSearchHistory,
} from '../utils/dashboardStorage';

export default function JobAnalytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [savedJobs, setSavedJobs] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSaved = () => setSavedJobs(getSavedJobsList());

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    refreshSaved();
    apiClient
      .get('/jobs/dashboard')
      .then((res) => setDashboardStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const matchDist = getMatchScoreDistribution(savedJobs);
  const searchHistory = getSearchHistory();

  let donutSegments = [
    { label: 'High match (80%+)', value: savedJobs.filter((j) => (j.skillsMatch ?? 0) >= 80).length, color: '#2563EB' },
    { label: 'Good (70–79%)', value: savedJobs.filter((j) => (j.skillsMatch ?? 0) >= 70 && (j.skillsMatch ?? 0) < 80).length, color: '#7C3AED' },
    { label: 'Fair (<70%)', value: savedJobs.filter((j) => (j.skillsMatch ?? 0) < 70).length, color: '#94A3B8' },
  ].filter((s) => s.value > 0);

  if (donutSegments.length === 0) {
    donutSegments = [{ label: 'No saved jobs yet', value: 1, color: '#CBD5E1' }];
  }

  const tabs = [
    { id: 'overview', label: 'Overview & graphs', icon: BarChart3 },
    { id: 'saved', label: `Saved jobs (${savedJobs.length})`, icon: Bookmark },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-primary-blue mb-6">
        <ArrowLeft size={16} /> Dashboard
      </Link>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-light-text dark:text-white">Job analytics</h1>
        <p className="text-light-muted dark:text-slate-400 mt-1 text-sm sm:text-base">
          Track search activity, match quality, and your saved opportunities.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                tab === t.id
                  ? 'bg-gradient-to-r from-primary-blue to-primary-purple text-white shadow-md'
                  : 'bg-white dark:bg-darktheme-card border border-light-border dark:border-slate-800 text-light-muted'
              }`}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-darktheme-card rounded-2xl border border-light-border dark:border-darktheme-border p-5 sm:p-6 shadow-sm"
          >
            <h2 className="font-bold text-light-text dark:text-white mb-1">Application activity</h2>
            <p className="text-xs text-light-muted dark:text-slate-500 mb-4">Weekly trend from your account</p>
            <WeeklyBarChart data={dashboardStats?.weeklyAnalytics} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-darktheme-card rounded-2xl border border-light-border dark:border-darktheme-border p-5 sm:p-6 shadow-sm"
          >
            <h2 className="font-bold text-light-text dark:text-white mb-1">Match score distribution</h2>
            <p className="text-xs text-light-muted dark:text-slate-500 mb-4">Based on saved jobs</p>
            <div className="space-y-3 mb-6">
              {matchDist.map((b, i) => (
                <div key={b.label}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>{b.label}</span>
                    <span>{b.count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${b.heightPercent}%` }}
                      transition={{ delay: i * 0.08 }}
                      className="h-full bg-gradient-to-r from-primary-blue to-primary-purple rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
            <DonutChart
              segments={donutSegments}
              centerValue={savedJobs.length}
              centerLabel="Saved"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white dark:bg-darktheme-card rounded-2xl border border-light-border dark:border-darktheme-border p-5 sm:p-6 shadow-sm"
          >
            <h2 className="font-bold text-light-text dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary-blue" /> Quick stats
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { l: 'Resume score', v: `${dashboardStats?.resumeScore ?? 0}%` },
                { l: 'Applications', v: dashboardStats?.totalApplied ?? 0 },
                { l: 'Interviews', v: dashboardStats?.interviewsScheduled ?? 0 },
                { l: 'Saved jobs', v: savedJobs.length },
              ].map((x) => (
                <div key={x.l} className="p-4 rounded-xl bg-light-bg dark:bg-slate-900/50 border border-light-border dark:border-slate-800 text-center">
                  <p className="text-xl font-extrabold text-light-text dark:text-white">{x.v}</p>
                  <p className="text-[10px] font-bold uppercase text-light-muted mt-1">{x.l}</p>
                </div>
              ))}
            </div>
            {searchHistory.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold mb-2">Recent searches</h3>
                <ul className="flex flex-wrap gap-2">
                  {searchHistory.slice(0, 8).map((h) => (
                    <li
                      key={h.at}
                      className="text-xs px-3 py-1.5 rounded-lg bg-primary-blue/10 text-primary-blue font-semibold"
                    >
                      {h.keyword} ({h.count})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {tab === 'saved' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
          <SavedJobsList
            jobs={savedJobs}
            onRemove={(id) => {
              removeSavedJob(id);
              refreshSaved();
            }}
            emptyAction={
              <Link
                to="/job-finder"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-blue text-white text-sm font-bold"
              >
                <Search size={16} /> Open Job Finder
              </Link>
            }
          />
        </motion.div>
      )}
    </div>
  );
}
