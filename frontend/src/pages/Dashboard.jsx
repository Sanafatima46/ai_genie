import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Eye,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Edit3,
  Search,
  Sparkles,
  Mail,
  Bookmark,
  Target,
  Plus,
  Calendar,
  Video,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import WeeklyBarChart from '../components/dashboard/WeeklyBarChart';
import ProgressGauge from '../components/dashboard/ProgressGauge';
import { getSavedJobsCount, getCoverLetterCount } from '../utils/dashboardStorage';

function Dashboard({ onOpenCoverLetter }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dashboardStats, setDashboardStats] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState(0);
  const [coverLetters, setCoverLetters] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSavedJobs(getSavedJobsCount());
    setCoverLetters(getCoverLetterCount());

    const fetchAllData = async () => {
      try {
        const [statsRes, resumesRes] = await Promise.all([
          apiClient.get('/jobs/dashboard'),
          apiClient.get('/resume'),
        ]);
        setDashboardStats(statsRes.data);
        setResumes(resumesRes.data || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user, navigate]);

  const resumeScore = dashboardStats?.resumeScore ?? 0;
  const profileStrength = dashboardStats?.profileStrength ?? 0;
  const jobSearchProgress = dashboardStats?.jobSearchProgress ?? profileStrength;

  const stats = [
    {
      label: 'Resume Score',
      value: resumeScore,
      suffix: '%',
      icon: TrendingUp,
      highlight: true,
      trend: resumeScore >= 80 ? 'Strong ATS fit' : 'Improve with skills',
    },
    {
      label: 'Saved Jobs',
      value: savedJobs || dashboardStats?.savedJobs || 0,
      icon: Bookmark,
      sub: 'Bookmarked from search',
    },
    {
      label: 'Applications',
      value: dashboardStats?.totalApplied || 0,
      icon: FileText,
      sub: 'Submitted this month',
    },
    {
      label: 'Interviews',
      value: dashboardStats?.interviewsScheduled || 0,
      icon: Eye,
      sub: 'Scheduled',
    },
    {
      label: 'Cover Letters',
      value: coverLetters,
      icon: Mail,
      sub: 'AI-generated',
    },
  ];

  const pipelineTasks = [
    { title: 'Polish resume summary', status: 'In Progress', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' },
    { title: 'Search matching roles', status: 'Active', color: 'bg-primary-blue/15 text-primary-blue' },
    { title: 'Prepare interview answers', status: 'Pending', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  ];

  if (!user || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full"
        />
        <p className="text-sm text-light-muted dark:text-slate-400">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-[1600px] mx-auto p-3 sm:p-6 lg:p-8 overflow-x-hidden box-border">
      <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-light-text dark:text-white tracking-tight break-words">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-light-muted dark:text-slate-400 mt-1 break-words">
            Plan, prioritize, and accomplish your job search with ease — welcome back,{' '}
            <span className="text-primary-blue font-semibold">{user.name?.split(' ')[0] || 'User'}</span>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 w-full">
          <button
            type="button"
            onClick={onOpenCoverLetter}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-blue to-primary-purple text-white text-sm font-bold shadow-md"
          >
            <Mail size={18} /> Create cover letter
          </button>
          <Link
            to="/job-finder"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-light-border dark:border-slate-700 text-sm font-bold hover:border-primary-blue/40"
          >
            <Plus size={18} /> Find jobs
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl p-4 sm:p-5 border shadow-sm min-w-0 w-full ${
              stat.highlight
                ? 'sm:col-span-2 xl:col-span-1 bg-gradient-to-br from-primary-blue to-primary-purple text-white border-transparent'
                : 'bg-white dark:bg-darktheme-card border-light-border dark:border-darktheme-border'
            }`}
          >
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <stat.icon size={22} className={`shrink-0 ${stat.highlight ? 'text-white/90' : 'text-primary-blue'}`} />
              {stat.highlight && (
                <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {stat.trend}
                </span>
              )}
            </div>
            <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wide mt-3 break-words ${stat.highlight ? 'text-white/80' : 'text-light-muted dark:text-slate-500'}`}>
              {stat.label}
            </p>
            <p className={`text-2xl sm:text-3xl font-extrabold mt-1 ${stat.highlight ? 'text-white' : 'text-light-text dark:text-white'}`}>
              {stat.value}
              {stat.suffix || ''}
            </p>
            {stat.sub && !stat.highlight && (
              <p className="text-[10px] text-light-muted dark:text-slate-500 mt-1 break-words">{stat.sub}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-6">
        <div className="lg:col-span-12 xl:col-span-5 bg-white dark:bg-darktheme-card rounded-2xl border border-light-border dark:border-darktheme-border p-4 sm:p-6 shadow-sm min-w-0 w-full overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-light-text dark:text-white">Application analytics</h2>
            <span className="text-xs font-bold text-primary-blue">Last 7 days</span>
          </div>
          <p className="text-xs text-light-muted dark:text-slate-500 mb-4">Weekly job search activity</p>
          <WeeklyBarChart data={dashboardStats?.weeklyAnalytics} />
        </div>

        <div className="lg:col-span-12 xl:col-span-3 bg-white dark:bg-darktheme-card rounded-2xl border border-light-border dark:border-darktheme-border p-4 sm:p-6 shadow-sm flex flex-col min-w-0 w-full">
          <h2 className="font-bold text-light-text dark:text-white mb-4">Reminders</h2>
          <div className="flex-1 rounded-xl bg-light-bg dark:bg-slate-900/50 border border-light-border dark:border-slate-800 p-4">
            <p className="text-xs font-bold text-primary-purple uppercase tracking-wide">Up next</p>
            <p className="font-bold text-light-text dark:text-white mt-2">Review top job matches</p>
            <p className="text-sm text-light-muted dark:text-slate-400 flex items-center gap-2 mt-1">
              <Calendar size={14} /> Today · Job Finder
            </p>
            <Link
              to="/job-finder"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-primary-blue to-primary-purple text-white text-sm font-bold"
            >
              <Video size={16} /> Open Job Finder
            </Link>
          </div>
        </div>

        <div className="lg:col-span-12 xl:col-span-4 bg-white dark:bg-darktheme-card rounded-2xl border border-light-border dark:border-darktheme-border p-4 sm:p-6 shadow-sm min-w-0 w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-light-text dark:text-white">Job search tasks</h2>
            <Link to="/job-finder" className="text-xs font-bold text-primary-blue hover:underline">
              + New
            </Link>
          </div>
          <ul className="space-y-3">
            {pipelineTasks.map((task) => (
              <li
                key={task.title}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 rounded-xl border border-light-border dark:border-slate-800 hover:border-primary-blue/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-primary-blue/10 flex items-center justify-center shrink-0">
                    <Target size={16} className="text-primary-blue" />
                  </div>
                  <span className="text-sm font-semibold text-light-text dark:text-white truncate">{task.title}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md shrink-0 ${task.color}`}>{task.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-12 xl:col-span-5 bg-white dark:bg-darktheme-card rounded-2xl border border-light-border dark:border-darktheme-border p-4 sm:p-6 shadow-sm min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h2 className="font-bold text-light-text dark:text-white">Your resumes</h2>
            <Link to="/builder" className="text-xs font-bold text-primary-blue hover:underline">
              View all
            </Link>
          </div>
          {resumes.length > 0 ? (
            <div className="space-y-3">
              {resumes.slice(0, 3).map((resume) => (
                <Link
                  key={resume._id}
                  to="/builder"
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-xl border border-light-border dark:border-slate-800 hover:border-primary-blue/40 transition-colors group w-full min-w-0"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center text-primary-blue shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-light-text dark:text-white break-words group-hover:text-primary-blue">
                        {resume.title || 'My Resume'}
                      </p>
                      <p className="text-xs text-light-muted dark:text-slate-500">
                        Updated {new Date(resume.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary-blue flex items-center gap-1 shrink-0 self-end sm:self-center">
                    Edit <ChevronRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-xl">
              <AlertCircle className="mx-auto text-light-muted mb-2" size={24} />
              <p className="text-sm font-bold mb-2">No resume yet</p>
              <Link to="/builder" className="text-xs font-bold text-primary-blue hover:underline">
                Create your first resume
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-12 xl:col-span-3 bg-white dark:bg-darktheme-card rounded-2xl border border-light-border dark:border-darktheme-border p-4 sm:p-6 shadow-sm min-w-0 w-full overflow-hidden">
          <h2 className="font-bold text-light-text dark:text-white mb-2 text-center">Search progress</h2>
          <ProgressGauge percent={jobSearchProgress} label="Overall job search readiness" />
        </div>

        <div className="lg:col-span-12 xl:col-span-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-primary-purple/30 p-4 sm:p-6 text-white border border-slate-700 min-w-0 w-full">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_80%,#2563EB,transparent_50%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-accent-blue" />
              <h2 className="font-bold">AI Job Finder</h2>
            </div>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Search live Google Jobs listings, export CSV, and match roles to your resume score of{' '}
              <strong className="text-white">{resumeScore}%</strong>.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-6 text-center">
              {[
                { n: dashboardStats?.pipeline?.applied ?? 0, l: 'Applied' },
                { n: dashboardStats?.pipeline?.interviewing ?? 0, l: 'Interview' },
                { n: profileStrength, l: 'Profile %' },
              ].map((x) => (
                <div key={x.l} className="rounded-xl bg-white/10 py-2">
                  <p className="text-lg font-extrabold">{x.n}</p>
                  <p className="text-[10px] text-slate-400">{x.l}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <Link
                to="/job-finder"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-bold hover:bg-slate-100 transition-colors"
              >
                <Search size={16} /> Launch Job Finder
              </Link>
              <Link
                to="/job-analytics"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/30 text-white text-sm font-bold hover:bg-white/10 transition-colors"
              >
                View analytics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
