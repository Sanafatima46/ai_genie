import { useState, useEffect } from 'react';
import { Loader2, Map, Sparkles } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { btnPrimary, cardClass, inputClass } from './growthUtils';

export default function LearningRoadmapPanel() {
  const [topic, setTopic] = useState('');
  const [months, setMonths] = useState(3);
  const [loading, setLoading] = useState(false);
  const [roadmaps, setRoadmaps] = useState([]);
  const [active, setActive] = useState(null);
  const [error, setError] = useState('');

  const loadRoadmaps = async () => {
    const { data } = await apiClient.get('/growth/roadmap');
    setRoadmaps(data);
    if (data.length && !active) setActive(data[0]);
  };

  useEffect(() => {
    loadRoadmaps().catch(() => {});
  }, []);

  const generate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await apiClient.post('/growth/roadmap', {
        topic: topic.trim(),
        durationMonths: months,
      });
      setRoadmaps((prev) => [data, ...prev]);
      setActive(data);
      setTopic('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to generate roadmap';
      setError(msg.includes('GROQ') ? 'Groq API error — check GROQ_API_KEY in backend/.env' : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={cardClass()}>
        <div className="mb-4 flex items-center gap-2">
          <Map className="text-sky-400" size={22} />
          <h2 className="text-lg font-bold text-white">Learn in 3 months — week-by-week plan</h2>
        </div>
        <form onSubmit={generate} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-slate-400">What do you want to learn?</label>
            <input
              className={inputClass()}
              placeholder="e.g. React, Python, DevOps"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-32">
            <label className="mb-1 block text-xs text-slate-400">Months</label>
            <select
              className={inputClass()}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
            >
              {[1, 2, 3, 6].map((m) => (
                <option key={m} value={m} className="bg-slate-900">
                  {m}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading} className={btnPrimary()}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Generate
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      {roadmaps.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {roadmaps.map((r) => (
            <button
              key={r._id}
              type="button"
              onClick={() => setActive(r)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                active?._id === r._id
                  ? 'bg-sky-400/20 text-sky-300'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {r.topic}
            </button>
          ))}
        </div>
      )}

      {active && (
        <div className={cardClass()}>
          <h3 className="text-xl font-bold text-white">
            {active.topic} — {active.durationMonths} month plan
          </h3>
          {active.summary && <p className="mt-2 text-sm text-slate-400">{active.summary}</p>}
          {(active.weeks || []).length === 0 ? (
            <p className="mt-4 text-sm text-amber-400">No weeks in this plan — try generating again.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {(active.weeks || []).map((week) => (
                <div
                  key={week.weekNumber}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="font-bold text-sky-300">
                    Week {week.weekNumber}: {week.title}
                  </p>
                  {week.topics?.length > 0 && (
                    <p className="mt-2 text-xs text-slate-500">Topics: {week.topics.join(', ')}</p>
                  )}
                  {week.tasks?.length > 0 && (
                    <ul className="mt-2 list-inside list-disc text-sm text-slate-300">
                      {week.tasks.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  )}
                  {week.resources?.length > 0 && (
                    <p className="mt-2 text-xs text-purple-300">Resources: {week.resources.join(' · ')}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
