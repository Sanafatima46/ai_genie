import { useState } from 'react';
import { FileCheck, Loader2, Upload } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { btnPrimary, btnSecondary, cardClass, inputClass } from './growthUtils';

function ScoreRing({ score }) {
  const color = score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-sky-400' : 'text-amber-400';
  return (
    <div className={`text-center ${color}`}>
      <p className="text-6xl font-black">{score}</p>
      <p className="text-sm text-slate-400">/ 100 ATS score</p>
    </div>
  );
}

export default function AtsScorePanel() {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const score = async (useSavedResume = false) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await apiClient.post('/growth/ats/score', {
        resumeText: useSavedResume ? undefined : resumeText,
        useSavedResume,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Scoring failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={cardClass()}>
        <div className="mb-4 flex items-center gap-2">
          <FileCheck className="text-purple-400" size={22} />
          <h2 className="text-lg font-bold text-white">ATS resume score</h2>
        </div>

        <textarea
          className={`${inputClass()} min-h-[160px] font-mono text-sm`}
          placeholder="Paste your resume text here, or use your saved resume..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => score(false)}
            disabled={loading || !resumeText.trim()}
            className={btnPrimary()}
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
            Score pasted resume
          </button>
          <button
            type="button"
            onClick={() => score(true)}
            disabled={loading}
            className={btnSecondary()}
          >
            Use saved resume
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      {result && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className={`${cardClass()} flex items-center justify-center lg:col-span-1`}>
            <ScoreRing score={result.score} />
          </div>
          <div className={`${cardClass()} lg:col-span-2`}>
            <h3 className="mb-3 font-bold text-white">Improvement tips</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {(result.tips || []).map((t, i) => (
                <li key={i}>• {t}</li>
              ))}
            </ul>
            {result.strengths?.length > 0 && (
              <>
                <h4 className="mb-2 mt-4 text-sm font-bold text-emerald-400">Strengths</h4>
                <ul className="space-y-1 text-sm text-slate-400">
                  {result.strengths.map((s, i) => (
                    <li key={i}>✓ {s}</li>
                  ))}
                </ul>
              </>
            )}
            {result.weaknesses?.length > 0 && (
              <>
                <h4 className="mb-2 mt-4 text-sm font-bold text-amber-400">Weaknesses</h4>
                <ul className="space-y-1 text-sm text-slate-400">
                  {result.weaknesses.map((w, i) => (
                    <li key={i}>! {w}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
