import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import apiClient from '../api/apiClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setResetUrl('');

    try {
      const { data } = await apiClient.post('/auth/forgot-password', { email });
      setMessage(data.message);
      if (data.resetUrl) setResetUrl(data.resetUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] relative overflow-hidden py-12 px-4">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-blue/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card bg-white/80 dark:bg-darktheme-card/80 p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full border border-light-border dark:border-darktheme-border relative z-10"
      >
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-light-muted dark:text-slate-400 hover:text-primary-blue mb-6"
        >
          <ArrowLeft size={16} /> Back to login
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-primary-blue/10 rounded-2xl flex items-center justify-center mb-6">
            <Mail className="text-primary-blue" size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-light-text dark:text-white mb-2">Forgot Password?</h2>
          <p className="text-light-muted dark:text-slate-400 text-sm">
            Enter your email and we will send you a reset link.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-400 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm">
            {message}
            {resetUrl && (
              <p className="mt-3 break-all text-xs">
                Dev mode (no SMTP):{' '}
                <a href={resetUrl} className="underline font-bold">
                  Open reset link
                </a>
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-light-text dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="block w-full rounded-xl border border-light-border dark:border-slate-700 bg-light-bg/50 dark:bg-slate-800/50 text-light-text dark:text-white p-3.5 outline-none focus:ring-2 focus:ring-primary-blue/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-blue to-primary-purple text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-70 flex justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
