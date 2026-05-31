import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import apiClient from '../api/apiClient';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  message: '',
};

function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');

    try {
      await apiClient.post('/contact', form);
      setForm(EMPTY_FORM);
      setStatus('sent');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('');
      setError(err.response?.data?.message || 'Failed to send message. Is backend running?');
    }
  };

  return (
    <div className="section-container py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-light-text dark:text-white tracking-tight mb-4">
          Let's <span className="gradient-text">Connect</span>
        </h1>
        <p className="text-lg text-light-muted dark:text-slate-400 max-w-2xl mx-auto">
          Have questions about our AI tools? Want to explore enterprise solutions? Our team is ready to help you succeed.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {/* Contact Info Cards */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-light-card dark:bg-darktheme-card p-6 rounded-2xl border border-light-border dark:border-darktheme-border flex items-start gap-4 group hover:border-primary-blue/30 transition-colors">
            <div className="w-12 h-12 bg-primary-blue/10 rounded-xl flex items-center justify-center text-primary-blue flex-shrink-0 group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-light-text dark:text-white mb-1">Email Us</h3>
              <p className="text-sm text-light-muted dark:text-slate-400 mb-2">Our friendly team is here to help.</p>
              <a href="mailto:hello@hiregenie.ai" className="text-sm font-bold text-primary-blue hover:underline">hello@hiregenie.ai</a>
            </div>
          </div>

          <div className="bg-light-card dark:bg-darktheme-card p-6 rounded-2xl border border-light-border dark:border-darktheme-border flex items-start gap-4 group hover:border-primary-purple/30 transition-colors">
            <div className="w-12 h-12 bg-primary-purple/10 rounded-xl flex items-center justify-center text-primary-purple flex-shrink-0 group-hover:scale-110 transition-transform">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-light-text dark:text-white mb-1">Visit Us</h3>
              <p className="text-sm text-light-muted dark:text-slate-400 mb-2">Come say hello at our office HQ.</p>
              <span className="text-sm font-bold text-light-text dark:text-slate-300">100 Market St, San Francisco, CA</span>
            </div>
          </div>

          <div className="bg-light-card dark:bg-darktheme-card p-6 rounded-2xl border border-light-border dark:border-darktheme-border flex items-start gap-4 group hover:border-accent-blue/30 transition-colors">
            <div className="w-12 h-12 bg-accent-blue/10 rounded-xl flex items-center justify-center text-accent-blue flex-shrink-0 group-hover:scale-110 transition-transform">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-light-text dark:text-white mb-1">Call Us</h3>
              <p className="text-sm text-light-muted dark:text-slate-400 mb-2">Mon-Fri from 8am to 5pm.</p>
              <a href="tel:+1234567890" className="text-sm font-bold text-light-text dark:text-slate-300 hover:text-primary-blue">+1 (234) 567-8900</a>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-light-card dark:bg-darktheme-card p-8 sm:p-10 rounded-3xl border border-light-border dark:border-darktheme-border shadow-lg"
        >
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="text-primary-blue" size={24} />
            <h2 className="text-2xl font-bold text-light-text dark:text-white">Send a Message</h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-slate-300 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full bg-light-bg dark:bg-slate-800 border-light-border dark:border-slate-700 text-light-text dark:text-white rounded-xl border p-3.5 outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-slate-300 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full bg-light-bg dark:bg-slate-800 border-light-border dark:border-slate-700 text-light-text dark:text-white rounded-xl border p-3.5 outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-light-text dark:text-slate-300 mb-2">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-light-bg dark:bg-slate-800 border-light-border dark:border-slate-700 text-light-text dark:text-white rounded-xl border p-3.5 outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all"
                placeholder="you@company.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-light-text dark:text-slate-300 mb-2">Message</label>
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full bg-light-bg dark:bg-slate-800 border-light-border dark:border-slate-700 text-light-text dark:text-white rounded-xl border p-3.5 outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all resize-none"
                placeholder="How can we help you?"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}
            
            <button 
              type="submit" 
              disabled={status !== ''}
              className={`w-full text-white font-bold py-4 px-6 rounded-xl transition-all transform flex items-center justify-center gap-2 ${
                status === 'sent' 
                  ? 'bg-green-500 shadow-lg shadow-green-500/20' 
                  : 'bg-gradient-to-r from-primary-blue to-primary-purple shadow-lg hover:shadow-primary-blue/25 hover:-translate-y-0.5'
              }`}
            >
              {status === 'sending' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : status === 'sent' ? (
                <>
                  <span>Message Sent Successfully!</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Contact;
