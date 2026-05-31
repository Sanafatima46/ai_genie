import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Copy, Check, Mail } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { incrementCoverLetterCount } from '../../utils/dashboardStorage';

export default function CoverLetterModal({ open, onClose, onGenerated }) {
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [tone, setTone] = useState('professional');
  const [highlights, setHighlights] = useState('');
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setLetter('');
    try {
      const { data } = await apiClient.post('/career/cover-letter', {
        company,
        jobTitle,
        tone,
        highlights,
      });
      setLetter(data.letter);
      const count = incrementCoverLetterCount();
      onGenerated?.(count);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate cover letter.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setLetter('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-light-border dark:border-slate-700 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-light-border dark:border-slate-800 bg-gradient-to-r from-primary-blue/10 to-primary-purple/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-blue to-primary-purple flex items-center justify-center text-white">
                  <Mail size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-light-text dark:text-white">AI Cover Letter</h2>
                  <p className="text-xs text-light-muted dark:text-slate-400">Tailored from your resume profile</p>
                </div>
              </div>
              <button type="button" onClick={handleClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar p-5 space-y-4 flex-1">
              {!letter ? (
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-light-muted dark:text-slate-500">Company</label>
                      <input
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="mt-1 w-full px-3 py-2.5 rounded-xl border border-light-border dark:border-slate-700 bg-light-bg dark:bg-slate-950 text-sm"
                        placeholder="e.g. Arc Company"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-light-muted dark:text-slate-500">Job title</label>
                      <input
                        required
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="mt-1 w-full px-3 py-2.5 rounded-xl border border-light-border dark:border-slate-700 bg-light-bg dark:bg-slate-950 text-sm"
                        placeholder="e.g. Frontend Developer"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-light-muted dark:text-slate-500">Tone</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="mt-1 w-full px-3 py-2.5 rounded-xl border border-light-border dark:border-slate-700 bg-light-bg dark:bg-slate-950 text-sm"
                    >
                      <option value="professional">Professional</option>
                      <option value="confident">Confident</option>
                      <option value="friendly">Friendly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-light-muted dark:text-slate-500">Key highlights (optional)</label>
                    <textarea
                      value={highlights}
                      onChange={(e) => setHighlights(e.target.value)}
                      rows={2}
                      className="mt-1 w-full px-3 py-2.5 rounded-xl border border-light-border dark:border-slate-700 bg-light-bg dark:bg-slate-950 text-sm resize-none"
                      placeholder="Years of experience, top skills, achievement..."
                    />
                  </div>
                  {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-blue to-primary-purple text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                    {loading ? 'Writing your letter...' : 'Generate cover letter'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-light-bg dark:bg-slate-950 border border-light-border dark:border-slate-800 text-sm leading-relaxed whitespace-pre-wrap text-light-text dark:text-slate-200 max-h-64 overflow-y-auto custom-scrollbar">
                    {letter}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-blue text-white text-sm font-bold"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied' : 'Copy to clipboard'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLetter(''); setError(''); }}
                      className="px-4 py-2 rounded-xl border border-light-border dark:border-slate-700 text-sm font-bold"
                    >
                      Create another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
