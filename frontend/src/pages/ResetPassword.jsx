import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await apiClient.post(`/auth/reset-password/${token}`, { password });
      if (data.token) login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] relative overflow-hidden py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card bg-white/80 dark:bg-darktheme-card/80 p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full border border-light-border dark:border-darktheme-border relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-primary-purple/10 rounded-2xl flex items-center justify-center mb-6">
            <KeyRound className="text-primary-purple" size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-light-text dark:text-white mb-2">Reset Password</h2>
          <p className="text-light-muted dark:text-slate-400 text-sm">Enter your new password below.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-light-text dark:text-slate-300 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-light-border dark:border-slate-700 bg-light-bg/50 dark:bg-slate-800/50 text-light-text dark:text-white p-3.5 pr-12 outline-none focus:ring-2 focus:ring-primary-blue/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-light-muted"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-light-text dark:text-slate-300 mb-1.5">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="block w-full rounded-xl border border-light-border dark:border-slate-700 bg-light-bg/50 dark:bg-slate-800/50 text-light-text dark:text-white p-3.5 outline-none focus:ring-2 focus:ring-primary-blue/20"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-blue to-primary-purple text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-70 flex justify-center mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Update Password'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-light-muted">
          <Link to="/login" className="text-primary-blue font-bold hover:underline">
            Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
