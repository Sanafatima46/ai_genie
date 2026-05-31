import { useState } from 'react';
import { Brain, CheckCircle, Loader2 } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { btnPrimary, cardClass, inputClass } from './growthUtils';

export default function SkillQuizPanel() {
  const [skill, setSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const startQuiz = async (e) => {
    e.preventDefault();
    if (!skill.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setAnswers({});
    try {
      const { data } = await apiClient.post('/growth/quiz/generate', { skill: skill.trim() });
      setQuiz(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (!quiz) return;
    setLoading(true);
    try {
      const answerArr = quiz.questions.map((_, i) => answers[i] ?? -1);
      const { data } = await apiClient.post(`/growth/quiz/${quiz._id}/submit`, {
        answers: answerArr,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Submit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!quiz && (
        <div className={cardClass()}>
          <div className="mb-4 flex items-center gap-2">
            <Brain className="text-emerald-400" size={22} />
            <h2 className="text-lg font-bold text-white">Skill assessment quiz</h2>
          </div>
          <form onSubmit={startQuiz} className="flex flex-col gap-3 sm:flex-row">
            <input
              className={inputClass('flex-1')}
              placeholder="Skill to test (e.g. JavaScript, SQL)"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
            <button type="submit" disabled={loading} className={btnPrimary()}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Start quiz'}
            </button>
          </form>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
      )}

      {quiz && !result && (
        <div className={cardClass()}>
          <h3 className="mb-4 font-bold text-white">{quiz.skill} — {quiz.questions.length} questions</h3>
          <div className="space-y-6">
            {quiz.questions.map((q, qi) => (
              <div key={qi}>
                <p className="font-semibold text-slate-200">
                  {qi + 1}. {q.question}
                </p>
                <div className="mt-2 space-y-2">
                  {q.options.map((opt, oi) => (
                    <label
                      key={oi}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2 transition ${
                        answers[qi] === oi
                          ? 'border-sky-400/50 bg-sky-400/10'
                          : 'border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${qi}`}
                        checked={answers[qi] === oi}
                        onChange={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
                        className="accent-sky-400"
                      />
                      <span className="text-sm text-slate-300">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={submitQuiz}
            disabled={loading || Object.keys(answers).length < quiz.questions.length}
            className={`${btnPrimary()} mt-6`}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Submit answers'}
          </button>
        </div>
      )}

      {result && (
        <div className={cardClass('text-center')}>
          <CheckCircle className="mx-auto text-emerald-400" size={48} />
          <p className="mt-4 text-3xl font-bold text-white">{result.percentage}%</p>
          <p className="text-slate-400">
            {result.score} / {result.totalQuestions} correct
          </p>
          <ul className="mt-4 space-y-2 text-left text-sm text-slate-300">
            {result.recommendations?.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setQuiz(null);
              setResult(null);
              setSkill('');
            }}
            className={`${btnPrimary()} mt-6`}
          >
            Take another quiz
          </button>
        </div>
      )}
    </div>
  );
}
