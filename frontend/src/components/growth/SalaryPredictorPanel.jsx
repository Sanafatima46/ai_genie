import { useState } from 'react';
import { DollarSign, Loader2, TrendingUp } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { btnPrimary, cardClass, inputClass } from './growthUtils';

const ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Product Manager',
];

export default function SalaryPredictorPanel() {
  const [form, setForm] = useState({
    role: 'Full Stack Developer',
    location: 'Remote',
    experienceYears: 2,
    skills: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skills = form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const { data } = await apiClient.post('/growth/salary/predict', {
        ...form,
        skills,
        experienceYears: Number(form.experienceYears),
      });
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={cardClass()}>
        <div className="mb-4 flex items-center gap-2">
          <DollarSign className="text-emerald-400" size={22} />
          <h2 className="text-lg font-bold text-white">Salary predictor</h2>
        </div>
        <form onSubmit={predict} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-slate-400">Role</label>
            <select
              className={inputClass()}
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            >
              {ROLES.map((r) => (
                <option key={r} value={r} className="bg-slate-900">{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Location</label>
            <input
              className={inputClass()}
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="Remote, San Francisco, Pakistan..."
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Years of experience</label>
            <input
              type="number"
              min="0"
              max="30"
              className={inputClass()}
              value={form.experienceYears}
              onChange={(e) => setForm((f) => ({ ...f, experienceYears: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Skills (comma-separated)</label>
            <input
              className={inputClass()}
              value={form.skills}
              onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
              placeholder="React, Node.js, MongoDB"
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={loading} className={btnPrimary()}>
              {loading ? <Loader2 className="animate-spin" size={16} /> : <TrendingUp size={16} />}
              Predict salary
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className={`${cardClass()} text-center`}>
          <p className="text-sm text-slate-400">Estimated annual range ({result.currency})</p>
          <p className="mt-2 text-4xl font-bold bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
            ${result.minSalary?.toLocaleString()} – ${result.maxSalary?.toLocaleString()}
          </p>
          <p className="mt-4 text-sm text-slate-400">{result.explanation}</p>
        </div>
      )}
    </div>
  );
}
