import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  Link2,
  Download,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import {
  saveJobToList,
  getSavedJobsList,
  removeSavedJob,
  recordSearchHistory,
} from '../utils/dashboardStorage';
import SavedJobsList from '../components/jobs/SavedJobsList';

const POPULAR_KEYWORDS = [
  'Machine Learning Engineer',
  'Full Stack Developer',
  'Data Analyst',
  'DevOps Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Cloud Architect',
];

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function truncate(text, max = 400) {
  if (!text) return 'No description available';
  return text.length <= max ? text : `${text.slice(0, max)}...`;
}

function JobFinder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [view, setView] = useState('search');
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [savedToast, setSavedToast] = useState('');

  const refreshSaved = useCallback(() => {
    const list = getSavedJobsList();
    setSavedJobs(list);
    setSavedIds(new Set(list.map((j) => j.id)));
  }, []);

  useEffect(() => {
    if (!user) navigate('/login');
    else refreshSaved();
  }, [user, navigate, refreshSaved]);

  const runSearch = async (searchTerm) => {
    const q = (searchTerm ?? keyword).trim();
    if (!q) {
      setError('Please enter a job title or skill to search.');
      setResults(null);
      return;
    }
    if (!user) {
      navigate('/login');
      return;
    }

    setKeyword(q);
    setLoading(true);
    setError('');
    setResults(null);
    setView('search');

    try {
      const { data } = await apiClient.post('/jobs/search', { keyword: q });
      setResults(data);
      recordSearchHistory(q, data.count);
      if (!data.jobs?.length) {
        setError('No jobs found. Try a different keyword or check your API key.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Search failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (job) => {
    saveJobToList(job);
    refreshSaved();
    setSavedToast('Job saved! View in Saved Jobs tab.');
    setTimeout(() => setSavedToast(''), 3000);
  };

  const downloadCsv = () => {
    if (!results?.jobs?.length) return;
    const fetchedDate = new Date().toLocaleDateString('en-US');
    const headers = [
      'Company Name',
      'Job Title',
      'Job Description',
      'Location',
      'Posted Date',
      'Via',
      'Fetched Date',
    ];
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = results.jobs.map((j) =>
      [j.company, j.title, j.description, j.location, j.postedAt, j.via, fetchedDate]
        .map(escape)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hiregenie_jobs_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const jobs = results?.jobs ?? [];

  return (
    <div className="min-h-full w-full overflow-x-hidden bg-gradient-to-br from-[#0f0c29] via-[#1a1a3e] to-[#0f0c29] font-sans text-slate-200">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <section className="mb-8 animate-fade-in-up rounded-[30px] border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-purple-500/10 px-5 py-10 text-center">
          <div className="mb-2 text-5xl sm:text-6xl animate-bounce">🧞</div>
          <h1 className="bg-gradient-to-r from-sky-400 via-purple-400 to-violet-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            HireGenie Job Finder
          </h1>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            Discover your dream job with AI-powered search
          </p>
        </section>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setView('search')}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              view === 'search'
                ? 'bg-gradient-to-r from-sky-400 to-purple-400 text-white'
                : 'border border-white/10 bg-white/5 text-slate-300'
            }`}
          >
            Search Jobs
          </button>
          <button
            type="button"
            onClick={() => setView('saved')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
              view === 'saved'
                ? 'bg-gradient-to-r from-sky-400 to-purple-400 text-white'
                : 'border border-white/10 bg-white/5 text-slate-300'
            }`}
          >
            <Bookmark size={16} /> Saved ({savedJobs.length})
          </button>
        </div>

        {view === 'saved' ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <SavedJobsList
              jobs={savedJobs}
              onRemove={(id) => {
                removeSavedJob(id);
                refreshSaved();
              }}
              emptyAction={
                <button
                  type="button"
                  onClick={() => setView('search')}
                  className="text-sm font-bold text-sky-400 hover:text-sky-300"
                >
                  Start searching
                </button>
              }
            />
          </div>
        ) : (
          <>
            <section className="mb-6 rounded-[20px] border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-[3]">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={20}
                  />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                    placeholder="e.g., Python Developer, Data Scientist, Frontend Engineer..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-base text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => runSearch()}
                  disabled={loading}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-purple-400 px-8 py-3.5 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60 sm:min-w-[160px]"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Search size={20} />
                  )}
                  {loading ? 'Searching...' : 'Search Jobs'}
                </button>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-lg font-bold text-white">🔥 Popular Searches</h2>
              <div className="flex flex-wrap gap-2">
                {POPULAR_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => runSearch(kw)}
                    disabled={loading}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-sky-400/50 hover:text-sky-300 disabled:opacity-50 sm:text-sm"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </section>

            {savedToast && (
              <p className="mb-4 text-center text-sm font-semibold text-emerald-400">{savedToast}</p>
            )}

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                <AlertCircle size={20} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center py-16">
                <div className="mb-5 h-12 w-12 animate-spin rounded-full border-[3px] border-sky-400/30 border-t-sky-400" />
                <p className="text-slate-400">
                  Fetching latest job listings
                  {keyword ? ` for "${keyword}"` : ''}...
                </p>
              </div>
            )}

            {!loading && results && jobs.length > 0 && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
                  {[
                    { label: 'Jobs Found', value: results.count },
                    { label: 'Search Term', value: results.keyword },
                    { label: 'Date', value: formatDate() },
                    { label: 'Saved', value: savedJobs.length },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="min-w-[100px] rounded-[15px] border border-white/10 bg-white/5 px-5 py-4 text-center"
                    >
                      <p className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent sm:text-xl">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">📋 Job Listings</h2>
                  <p className="mb-6 text-sm text-slate-400">
                    Found <strong className="text-sky-400">{results.count}</strong> job opportunities
                    matching your criteria
                  </p>

                  <div className="space-y-5">
                    {jobs.map((job, idx) => {
                      const saved = savedIds.has(job.id);
                      return (
                        <article
                          key={job.id || idx}
                          className="rounded-[20px] border border-sky-500/15 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 transition hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/20"
                        >
                          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                            <h3 className="text-lg font-bold text-sky-400 sm:text-xl">{job.title}</h3>
                            <span className="rounded-full bg-gradient-to-r from-sky-400 to-purple-400 px-4 py-1 text-xs font-semibold text-white">
                              Match #{job.matchRank ?? idx + 1}
                            </span>
                          </div>

                          <p className="mb-3 flex items-center gap-2 text-sm text-slate-300">
                            <Building2 size={16} className="text-slate-400" />
                            <strong>{job.company}</strong>
                          </p>

                          <p className="mb-4 max-h-[100px] overflow-y-auto text-sm leading-relaxed text-slate-400">
                            {truncate(job.description)}
                          </p>

                          <div className="mb-4 flex flex-wrap gap-4 border-t border-white/10 pt-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} /> {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} /> Posted: {job.postedAt}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign size={12} /> {job.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <Link2 size={12} /> Via: {job.via}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleSave(job)}
                              disabled={saved}
                              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                                saved
                                  ? 'cursor-default bg-emerald-500/20 text-emerald-300'
                                  : 'bg-gradient-to-r from-sky-400 to-purple-400 text-white hover:opacity-90'
                              }`}
                            >
                              {saved ? (
                                <BookmarkCheck size={16} />
                              ) : (
                                <Bookmark size={16} />
                              )}
                              {saved ? 'Saved' : 'Save job'}
                            </button>
                            {(job.applyLink || job.shareLink) && (
                              <a
                                href={job.applyLink || job.shareLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-xl border border-sky-400/30 px-4 py-2 text-sm font-semibold text-sky-400 hover:bg-sky-400/10"
                              >
                                Apply →
                              </a>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                  <p className="font-semibold text-emerald-300">
                    Successfully fetched {results.count} jobs!
                  </p>
                  <button
                    type="button"
                    onClick={downloadCsv}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-emerald-500/30"
                  >
                    <Download size={18} /> Download Jobs as CSV
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <footer className="mt-16 border-t border-white/5 py-6 text-center">
          <p className="text-xs text-slate-500">
            HireGenie Job Finder • Powered by SerpAPI Google Jobs • Real-time job listings
          </p>
        </footer>
      </div>
    </div>
  );
}

export default JobFinder;
