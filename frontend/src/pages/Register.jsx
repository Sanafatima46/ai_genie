import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { data } = await apiClient.post('/auth/register', { name, email, password });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (msg) => setError(msg);

  return (
    <div className="flex items-center justify-center min-h-[85vh] relative overflow-hidden py-12 px-4">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary-blue/10 dark:bg-primary-blue/5 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary-purple/10 dark:bg-primary-purple/5 rounded-full blur-[80px] pointer-events-none animate-pulse animation-delay-1000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card bg-white/80 dark:bg-darktheme-card/80 p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full border border-light-border dark:border-darktheme-border transition-colors duration-300 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-primary-purple/10 dark:bg-primary-purple/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <svg className="w-8 h-8 text-primary-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-light-text dark:text-darktheme-text tracking-tight mb-2">Create Account</h2>
          <p className="text-light-muted dark:text-slate-400">Join HireGenie AI today</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-light-text dark:text-slate-300 mb-1.5">Full Name</label>
            <input 
              type="text" 
              className="block w-full rounded-xl border-light-border dark:border-slate-700 bg-light-bg/50 dark:bg-slate-800/50 text-light-text dark:text-white shadow-sm focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 dark:focus:ring-primary-blue/20 p-3.5 transition-all border outline-none"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-light-text dark:text-slate-300 mb-1.5">Email Address</label>
            <input 
              type="email" 
              className="block w-full rounded-xl border-light-border dark:border-slate-700 bg-light-bg/50 dark:bg-slate-800/50 text-light-text dark:text-white shadow-sm focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 dark:focus:ring-primary-blue/20 p-3.5 transition-all border outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-light-text dark:text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="block w-full rounded-xl border-light-border dark:border-slate-700 bg-light-bg/50 dark:bg-slate-800/50 text-light-text dark:text-white shadow-sm focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 dark:focus:ring-primary-blue/20 p-3.5 transition-all border outline-none pr-12"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-light-muted dark:text-slate-400 hover:text-primary-blue dark:hover:text-primary-blue transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary-blue to-primary-purple text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-primary-blue/25 transition-all transform hover:-translate-y-0.5 mt-6 disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="flex-1 h-px bg-light-border dark:bg-darktheme-border"></div>
          <span className="text-sm font-bold text-light-muted dark:text-slate-500 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-light-border dark:bg-darktheme-border"></div>
        </div>

        <GoogleAuthButton onError={handleGoogleError} />

        <p className="mt-8 text-center text-sm font-medium text-light-muted dark:text-slate-400">
          Already have an account? <Link to="/login" className="text-primary-blue dark:text-accent-blue font-bold hover:underline">Log in here</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
