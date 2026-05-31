import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FileText, Search, Zap, Cpu, ArrowRight, CheckCircle, Sparkles, Star, Users, BarChart3 } from 'lucide-react';
import heroImage from '../assets/hero image.png';
import aiCareerImage from '../assets/ai career.jpg';

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = numericTarget / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, numericTarget]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/* ─── Section Reveal Wrapper ─── */
const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function Home() {
  return (
    <div className="flex flex-col w-full">

      {/* ════════════ HERO SECTION ════════════ */}
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-primary-blue rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.07] animate-pulse"></div>
        <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-primary-purple rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.07] animate-pulse animation-delay-600"></div>
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-accent-blue rounded-full mix-blend-multiply filter blur-[100px] opacity-[0.05] animate-pulse animation-delay-1000"></div>

        <div className="section-container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 text-center lg:text-left">
            {/* Left Content */}
            <motion.div
              className="flex-1 max-w-2xl"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-blue text-xs font-bold uppercase tracking-wider mb-6 border border-primary-blue/20">
                <Sparkles size={14} className="animate-pulse" /> AI-Powered Career Platform
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-light-text dark:text-white leading-[1.1] mb-6 tracking-tight">
                Get Hired Smarter with{' '}
                <span className="gradient-text">HireGenie AI</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg sm:text-xl text-light-muted dark:text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Build a professional resume in minutes, get matched with the right jobs, and receive AI career guidance — all in one platform.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/register" className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-2xl shadow-lg shadow-primary-blue/25 hover:shadow-xl hover:shadow-primary-blue/30 transition-all duration-300 transform hover:-translate-y-1 font-bold text-center flex items-center justify-center gap-2">
                  Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/features" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-darktheme-card border border-light-border dark:border-darktheme-border text-light-text dark:text-white rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300 font-bold text-center hover:border-primary-blue/30 dark:hover:border-primary-blue/30">
                  See How it Works
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-light-muted dark:text-slate-500 font-medium">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <img key={i} className="w-9 h-9 rounded-full border-[2.5px] border-white dark:border-slate-900 shadow-sm object-cover" src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" />
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <span className="text-xs">Joined by <strong className="text-light-text dark:text-slate-300">10,000+</strong> professionals</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              className="flex-1 relative group max-w-lg lg:max-w-none"
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            >
              <div className="absolute -inset-6 bg-gradient-to-r from-primary-blue via-primary-purple to-accent-blue rounded-[2rem] blur-3xl opacity-15 group-hover:opacity-25 transition-opacity duration-1000 animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-br from-primary-blue/10 to-primary-purple/10 rounded-[2rem] blur-xl opacity-60"></div>
              <img
                src={heroImage}
                alt="Dashboard Preview"
                className="relative z-10 rounded-2xl object-cover w-full h-auto transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2 filter drop-shadow-2xl"
              />
              {/* Floating badges */}
              <motion.div
                className="absolute -left-4 top-1/4 z-20 bg-white dark:bg-darktheme-card p-3 rounded-xl shadow-xl border border-light-border dark:border-darktheme-border hidden sm:flex items-center gap-2"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center"><CheckCircle size={16} className="text-green-500" /></div>
                <span className="text-xs font-bold text-light-text dark:text-white whitespace-nowrap">ATS Optimized</span>
              </motion.div>
              <motion.div
                className="absolute -right-4 bottom-1/4 z-20 bg-white dark:bg-darktheme-card p-3 rounded-xl shadow-xl border border-light-border dark:border-darktheme-border hidden sm:flex items-center gap-2"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="w-8 h-8 rounded-lg bg-primary-purple/10 flex items-center justify-center"><Zap size={16} className="text-primary-purple" /></div>
                <span className="text-xs font-bold text-light-text dark:text-white whitespace-nowrap">92% Match Rate</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════ TRUSTED BY STRIP ════════════ */}
      <section className="py-10 border-y border-light-border dark:border-darktheme-border bg-white/50 dark:bg-slate-900/30">
        <div className="section-container">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs font-bold uppercase tracking-widest text-light-muted dark:text-slate-500 mb-6"
          >
            Trusted by teams at top companies
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-40 dark:opacity-30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'].map((name) => (
              <span key={name} className="text-lg sm:text-xl font-black text-light-text dark:text-darktheme-text tracking-tight">{name}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════ FEATURES SECTION ════════════ */}
      <section className="py-20 sm:py-28 bg-gray-50 dark:bg-slate-900/30">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={reveal}
          >
            <h2 className="text-3xl lg:text-4xl font-extrabold text-light-text dark:text-white mb-4 tracking-tight">Elevate Your Career Search</h2>
            <p className="text-light-muted dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Design professional resumes, find jobs that fit your skills, and practice interviews — all with AI support. Take the next step in your career with confidence.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
          >
            {[
              { icon: <FileText size={28} />, title: 'AI Resume Builder', desc: 'Build ATS-friendly resumes in minutes that get noticed by recruiters. Craft industry-specific resumes that pass through Applicant Tracking Systems with ease.', gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10 dark:bg-blue-500/20', text: 'text-blue-500' },
              { icon: <Search size={28} />, title: 'AI Job Matching', desc: 'Discover jobs that match your skills and experience. Increase your chances of getting hired faster with AI-powered recommendations.', gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-500' },
              { icon: <Cpu size={28} />, title: 'AI Career Counselor', desc: 'Chat with an AI career counselor to get instant answers and job guidance. Discover the best career path based on your skills and goals.', gradient: 'from-teal-400 to-teal-500', bg: 'bg-teal-500/10 dark:bg-teal-500/20', text: 'text-teal-500' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group p-8 bg-white dark:bg-darktheme-card rounded-2xl shadow-sm border border-light-border dark:border-darktheme-border hover:shadow-xl hover:shadow-primary-blue/5 transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Hover gradient border effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-2xl`}></div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.bg} ${feature.text} mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-light-text dark:text-white mb-3">{feature.title}</h3>
                <p className="text-light-muted dark:text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════ STATS SECTION ════════════ */}
      <section className="py-20 sm:py-24 border-y border-light-border dark:border-darktheme-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/[0.02] to-primary-purple/[0.02]"></div>
        <div className="section-container relative z-10">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              { label: 'Placements', val: '5000', suffix: '+', icon: <Users size={20} /> },
              { label: 'Resumes Built', val: '25000', suffix: '+', icon: <FileText size={20} /> },
              { label: 'Partners', val: '150', suffix: '+', icon: <BarChart3 size={20} /> },
              { label: 'Match Rate', val: '92', suffix: '%', icon: <Zap size={20} /> },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center group">
                <div className="w-12 h-12 rounded-xl bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-blue flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold gradient-text mb-2">
                  <AnimatedCounter target={stat.val} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-bold text-light-muted dark:text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════ CAREER GUIDANCE SECTION ════════════ */}
      <section className="relative py-20 sm:py-28 bg-gray-50 dark:bg-slate-900/50 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-blue/5 dark:bg-primary-blue/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-purple/5 dark:bg-primary-purple/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Image */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute -inset-3 bg-gradient-to-r from-primary-blue/30 via-primary-purple/30 to-accent-blue/30 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <img
                src={aiCareerImage}
                alt="Career Guidance"
                className="relative z-10 rounded-3xl shadow-2xl w-full object-cover transition-all duration-700 group-hover:scale-[1.02] group-hover:-translate-y-2"
              />
              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-5 -right-5 z-20 bg-white dark:bg-darktheme-card border border-light-border dark:border-darktheme-border p-4 rounded-2xl shadow-xl"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue to-primary-purple flex items-center justify-center text-white font-extrabold text-sm shadow-lg">
                    10K+
                  </div>
                  <p className="text-sm font-bold text-light-text dark:text-white leading-tight">
                    Job Seekers<br />
                    <span className="text-xs font-medium text-light-muted dark:text-slate-400">Trust HireGenie AI</span>
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              className="flex flex-col gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-extrabold text-light-text dark:text-white leading-tight tracking-tight">
                Get Expert Career Guidance{' '}
                <span className="gradient-text">Anytime</span>
              </motion.h2>

              <motion.p variants={fadeUp} className="text-light-muted dark:text-slate-400 text-lg leading-relaxed">
                From building a professional resume to finding the right job and preparing for interviews, HireGenie helps you at every step of your journey with AI-powered tools.
              </motion.p>

              <motion.p variants={fadeUp} className="text-light-muted dark:text-slate-400 text-lg leading-relaxed">
                Whether you're a student or a professional, get personalized guidance, instant answers, and smarter career decisions — all in one place.
              </motion.p>

              <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['AI Resume Builder', 'Smart Job Matching', 'Interview Practice', 'Career Roadmap'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-semibold text-light-text dark:text-slate-300 p-3 rounded-xl bg-white dark:bg-darktheme-card border border-light-border dark:border-darktheme-border">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-blue to-primary-purple flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={13} className="text-white" />
                    </div>
                    {item}
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/register"
                  className="group px-8 py-4 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-primary-blue/25 transition-all duration-300 transform hover:-translate-y-1 text-center shadow-lg flex items-center justify-center gap-2"
                >
                  Start Your Journey <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 border border-light-border dark:border-darktheme-border text-light-text dark:text-white rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-slate-800 hover:border-primary-blue/30 transition-all duration-300 text-center"
                >
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
