import { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Loader2 } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { btnPrimary, cardClass } from './growthUtils';

const ROLES = ['Full Stack', 'Frontend', 'Backend', 'Data Science', 'DevOps'];

export default function CourseSuggestionsPanel() {
  const [role, setRole] = useState('Full Stack');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const load = async (r = role) => {
    setLoading(true);
    try {
      const { data: res } = await apiClient.get('/growth/courses', { params: { role: r } });
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className={cardClass()}>
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="text-purple-400" size={22} />
          <h2 className="text-lg font-bold text-white">Free course suggestions</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r} className="bg-slate-900">
                {r}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => load(role)} disabled={loading} className={btnPrimary()}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : null}
            Refresh
          </button>
        </div>
        {data && !data.hasResume && (
          <p className="mt-3 text-sm text-amber-400">Build a resume first for personalized skill gaps.</p>
        )}
        {data?.missingSkills?.length > 0 && (
          <p className="mt-3 text-sm text-slate-400">
            Missing skills: <span className="text-sky-300">{data.missingSkills.join(', ')}</span>
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {(data?.courses || []).map((course, i) => (
          <a
            key={i}
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cardClass()} group block transition hover:border-sky-400/30 hover:bg-white/10`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-white group-hover:text-sky-300">{course.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {course.platform} · {course.skill}
                  {course.free && ' · Free'}
                </p>
              </div>
              <ExternalLink size={16} className="shrink-0 text-slate-500 group-hover:text-sky-400" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
