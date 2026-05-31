import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Send,
  Loader2,
  ArrowLeft,
  Sparkles,
  Trash2,
  FileText,
} from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import chiraghAvatar from '../assets/chiragh.png';

const MODES = [
  'Career Coach',
  'Resume Review',
  'Interview Prep',
  'Salary Negotiation',
  'Skill Development',
];

const QUICK_CHIPS = [
  '📝 Review my resume',
  '🎯 Suggest career paths',
  '💰 Salary negotiation tips',
  '📚 Learning roadmap',
];

const WELCOME =
  "Hello! I'm Genie — your professional career coach. How can I help you today?";

function ProgressBar({ value, className = '' }) {
  return (
    <div className={`h-2 rounded-full bg-white/10 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-purple-400 transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function scoreTone(score) {
  if (score >= 70) return 'text-emerald-400';
  if (score >= 40) return 'text-sky-400';
  return 'text-amber-400';
}

export default function Chatbot() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const bottomRef = useRef(null);

  const [mode, setMode] = useState('Career Coach');
  const [targetRole, setTargetRole] = useState('Full Stack');
  const [messages, setMessages] = useState([{ role: 'assistant', content: WELCOME }]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMetrics = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await apiClient.get('/career/metrics', { params: { role: targetRole } });
      setMetrics(data);
    } catch {
      setMetrics(null);
    }
  }, [user, targetRole]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  const sendMessage = async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || sending) return;

    const userMsg = { role: 'user', content: trimmed };
    const history = [...messages, userMsg].filter(
      (m) => m.role === 'user' || m.role === 'assistant'
    );

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const { data } = await apiClient.post('/career/chat', {
        message: trimmed,
        history: history.slice(-6),
        mode,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            err.response?.data?.message ||
            'Sorry, I could not respond right now. Please try again.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: WELCOME }]);
  };

  const userQuestionCount = messages.filter((m) => m.role === 'user').length;

  return (
    <div className="min-h-full w-full overflow-x-hidden bg-gradient-to-br from-[#0f0c29] via-[#1a1a3e] to-[#0f0c29] font-sans text-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 lg:absolute lg:left-6 lg:top-6"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Sidebar — Streamlit control panel */}
        <aside className="mt-10 w-full shrink-0 rounded-2xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-md lg:mt-0 lg:w-72">
          <h2 className="mb-4 text-sm font-bold text-white">🧞 Control Panel</h2>

          <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
            AI Mode
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          >
            {MODES.map((m) => (
              <option key={m} value={m} className="bg-slate-900">
                {m}
              </option>
            ))}
          </select>

          <div className="my-4 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />

          <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
            <FileText size={16} />
            <span>
              {metrics?.hasResume
                ? `Resume: ${metrics.resumeTitle || 'Loaded'}`
                : 'Build a resume in the Builder for personalized tips.'}
            </span>
          </div>

          {metrics?.hasResume && (
            <>
              <div className="mb-4">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-400">ATS Score</span>
                  <span className={`font-bold ${scoreTone(metrics.atsScore)}`}>
                    {metrics.atsScore}/100
                  </span>
                </div>
                <ProgressBar value={metrics.atsScore} />
              </div>

              <div className="mb-4">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-400">Readiness</span>
                  <span className={`font-bold ${scoreTone(metrics.readiness)}`}>
                    {metrics.readiness}%
                  </span>
                </div>
                <ProgressBar value={metrics.readiness} />
              </div>

              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              >
                {(metrics.targetRoles || []).map((r) => (
                  <option key={r} value={r} className="bg-slate-900">
                    {r}
                  </option>
                ))}
              </select>

              {metrics.missingSkills?.length > 0 ? (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                  <p className="font-bold mb-1">Missing {metrics.missingSkills.length} skills</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {metrics.missingSkills.slice(0, 5).map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-xs text-emerald-400">Skills look good for this role.</p>
              )}

              <div className="my-4 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
            </>
          )}

          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-slate-500">Messages</p>
              <p className="text-lg font-bold text-sky-400">{messages.length}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-slate-500">Your Qs</p>
              <p className="text-lg font-bold text-purple-400">{userQuestionCount}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearChat}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2 text-sm text-slate-400 hover:border-red-500/40 hover:text-red-300"
          >
            <Trash2 size={14} /> Clear chat
          </button>
        </aside>

        {/* Main chat area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <section className="mb-6 rounded-[30px] border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-purple-500/10 px-5 py-8 text-center">
            <div className="mb-2 text-6xl animate-[float_3s_ease-in-out_infinite]">🧞</div>
            <h1 className="bg-gradient-to-r from-sky-400 via-purple-400 to-violet-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
              HireGenie AI
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Professional AI Career Coach • Resume Analyzer • Job Guide
            </p>
            <p className="mt-1 text-xs text-slate-500">Powered by Groq</p>
          </section>

          {metrics?.hasResume && (
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Words', value: metrics.wordCount },
                { label: 'ATS', value: `${metrics.atsScore}%` },
                { label: 'Ready', value: `${metrics.readiness}%` },
                { label: 'Mode', value: mode.split(' ')[0] },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-purple-500/10 p-4 text-center"
                >
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="mt-1 text-xl font-bold bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => sendMessage(chip)}
                disabled={sending}
                className="rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-xs font-semibold text-slate-300 transition hover:border-sky-400/50 disabled:opacity-50 sm:text-sm"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="flex flex-1 flex-col rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md min-h-[420px]">
            <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 max-w-[90%] ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <img src={chiraghAvatar} alt="" className="h-8 w-8 shrink-0 object-contain" />
                  )}
                  <div
                    className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user'
                        ? 'rounded-br-md bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'rounded-bl-md border border-white/10 bg-white/5 text-slate-200'
                    }`}
                  >
                    {msg.role === 'assistant' && <span className="mr-1">🧞</span>}
                    {msg.role === 'user' && <span className="mr-1">🧑</span>}
                    {msg.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" />
                  HireGenie is thinking...
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form
              className="flex gap-2 border-t border-white/10 p-4"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about careers, resume, interviews, salary, or skills..."
                disabled={sending}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
              >
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>

          <p className="mt-4 text-center text-xs text-slate-600">
            HireGenie AI • Groq llama-3.3-70b • Personalized with your saved resume
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
