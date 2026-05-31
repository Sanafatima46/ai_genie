import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Shield, BarChart2, MessageSquare, Layout, FileText, ArrowRight, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import resumeImg from '../assets/features_resume.png';
import jobsImg from '../assets/features_jobs.png';
import chatbotImg from '../assets/features_chatbot.png';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

const FeatureCard = ({ icon: Icon, title, description, image, reversed = false, bullets }) => (
  <motion.div
    className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-16 py-16 sm:py-20`}
    initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}
  >
    <motion.div className="flex-1 space-y-6" variants={fadeUp}>
      <div className="inline-flex items-center justify-center p-3 bg-primary-blue/10 dark:bg-primary-blue/20 rounded-2xl text-primary-blue"><Icon size={32} /></div>
      <h3 className="text-3xl font-bold text-light-text dark:text-darktheme-text tracking-tight">{title}</h3>
      <p className="text-lg text-light-muted dark:text-slate-400 leading-relaxed">{description}</p>
      <ul className="space-y-3">
        {(bullets || ['AI-powered optimization', 'Professional templates', 'Instant export']).map((item, idx) => (
          <li key={idx} className="flex items-center gap-3 text-light-muted dark:text-slate-400">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-blue to-primary-purple flex items-center justify-center flex-shrink-0"><CheckCircle className="text-white" size={12} /></div>
            <span className="font-medium">{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
    <motion.div className="flex-1 relative group" variants={{ hidden: { opacity: 0, x: reversed ? -40 : 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } }}>
      <div className="absolute -inset-4 bg-gradient-to-r from-primary-blue to-primary-purple rounded-3xl blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
      <img src={image} alt={title} className="relative rounded-2xl shadow-2xl border border-light-border dark:border-darktheme-border w-full transform group-hover:scale-[1.02] group-hover:-translate-y-1 transition duration-700" />
    </motion.div>
  </motion.div>
);

const AdvancedFeature = ({ icon: Icon, title, description }) => (
  <motion.div className="p-8 bg-light-card dark:bg-darktheme-card rounded-2xl border border-light-border dark:border-darktheme-border hover:border-primary-blue/30 transition-all duration-500 group hover:shadow-xl hover:-translate-y-1" variants={fadeUp}>
    <div className="w-12 h-12 bg-primary-purple/10 dark:bg-primary-purple/20 rounded-xl flex items-center justify-center text-primary-purple mb-6 group-hover:scale-110 transition-transform"><Icon size={24} /></div>
    <h4 className="text-xl font-bold text-light-text dark:text-darktheme-text mb-3">{title}</h4>
    <p className="text-light-muted dark:text-slate-400 leading-relaxed">{description}</p>
  </motion.div>
);

const Features = () => (
  <div className="min-h-screen">
    <section className="py-16 sm:py-20">
      <div className="section-container">
        <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-light-text dark:text-white mb-4 tracking-tight">Everything You Need to Build a <span className="gradient-text">Winning Career</span></h1>
          <p className="text-light-muted dark:text-slate-400 max-w-3xl mx-auto leading-relaxed text-lg">Explore powerful AI-driven tools designed to make your job search easier, faster, and smarter.</p>
        </motion.div>
      </div>
    </section>

    <section className="pb-8">
      <div className="section-container">
        <FeatureCard icon={FileText} title="AI Resume Builder" description="Our intelligent builder analyzes your profile and helps you craft a high-impact resume in minutes." image={resumeImg} bullets={['ATS-optimized formatting', 'Industry-specific templates', 'One-click PDF export']} />
        <div className="border-t border-light-border dark:border-darktheme-border" />
        <FeatureCard icon={Zap} title="Smart Job Matcher" description="Get matched with jobs that fit your skills. Our AI calculates a match percentage for every listing." image={jobsImg} reversed bullets={['Semantic skill matching', 'Real-time job alerts', 'Match score breakdown']} />
        <div className="border-t border-light-border dark:border-darktheme-border" />
        <FeatureCard icon={MessageSquare} title="AI Career Chatbot" description="Your personal career advisor, available 24/7. Ask about career growth, interview tips, or resume improvements." image={chatbotImg} bullets={['24/7 availability', 'Interview preparation', 'Personalized career advice']} />
      </div>
    </section>

    <section className="py-20 sm:py-24 bg-gray-50/50 dark:bg-slate-900/50">
      <div className="section-container">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Advanced Capabilities</h2>
          <p className="text-light-muted dark:text-slate-400">Tools designed for the professional edge.</p>
        </motion.div>
        <motion.div className="grid md:grid-cols-3 gap-6 lg:gap-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <AdvancedFeature icon={BarChart2} title="Resume Score Analyzer" description="Get a detailed breakdown of your resume's performance against industry standards and ATS requirements." />
          <AdvancedFeature icon={Layout} title="Dashboard Analytics" description="Track your applications, matches, and career progress in one centralized dashboard." />
          <AdvancedFeature icon={Shield} title="Save & Edit Resumes" description="Create multiple versions of your resume for different roles and edit them anytime." />
        </motion.div>
      </div>
    </section>

    <section className="py-20 sm:py-24">
      <div className="section-container">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">How It Works</h2>
          <p className="text-light-muted dark:text-slate-400">Simple, fast, and incredibly effective.</p>
        </motion.div>
        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          {[{ step: "01", title: "Create Profile", desc: "Sign up and enter your basic details." }, { step: "02", title: "Generate Resume", desc: "Let our AI build a professional CV." }, { step: "03", title: "Match Jobs", desc: "See curated jobs with high match scores." }, { step: "04", title: "Land the Job", desc: "Apply with confidence and get hired." }].map((item, idx) => (
            <motion.div key={idx} variants={fadeUp} className="relative text-center group">
              <div className="text-7xl font-black text-primary-blue/10 dark:text-primary-blue/5 mb-4 group-hover:text-primary-blue/20 transition-colors">{item.step}</div>
              <h4 className="text-xl font-bold mb-2">{item.title}</h4>
              <p className="text-light-muted dark:text-slate-400">{item.desc}</p>
              {idx < 3 && <div className="hidden lg:block absolute top-12 -right-4 text-primary-blue/20"><ArrowRight size={32} /></div>}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    <section className="py-20 sm:py-24 bg-gradient-to-br from-primary-blue to-primary-purple text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">Why Choose HireGenie AI?</h2>
            <div className="space-y-6">
              {[{ title: "AI-Powered Precision", desc: "Trained on thousands of successful resumes and job descriptions." }, { title: "Blazing Fast Results", desc: "From blank page to professional resume in under 5 minutes." }, { title: "Built for Humans", desc: "An intuitive interface that makes career management a breeze." }].map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors"><UserCheck size={24} /></div>
                  <div><h4 className="text-xl font-bold mb-1">{item.title}</h4><p className="text-white/80">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div className="grid grid-cols-2 gap-4 sm:gap-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {[{ label: "Active Users", val: "10k+" }, { label: "Resumes Built", val: "25k+" }, { label: "Job Matches", val: "50k+" }, { label: "Success Rate", val: "94%" }].map((stat, idx) => (
              <motion.div key={idx} variants={fadeUp} className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center hover:bg-white/15 transition-colors">
                <div className="text-3xl font-bold mb-1">{stat.val}</div>
                <div className="text-sm text-white/70 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    <section className="py-20 sm:py-24 overflow-x-auto">
      <div className="section-container">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Compare the Difference</h2>
          <p className="text-light-muted dark:text-slate-400">See how HireGenie AI stands out.</p>
        </motion.div>
        <div className="bg-light-card dark:bg-darktheme-card rounded-3xl border border-light-border dark:border-darktheme-border overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead><tr className="bg-light-bg dark:bg-slate-800"><th className="p-6 text-lg font-bold">Feature</th><th className="p-6 text-lg font-bold text-primary-blue">HireGenie AI</th><th className="p-6 text-lg font-bold">Traditional</th></tr></thead>
            <tbody className="divide-y divide-light-border dark:divide-darktheme-border">
              {[{ f: "AI Content Generation", h: true, t: false }, { f: "Real-time Job Matching", h: true, t: "Limited" }, { f: "24/7 Career Assistant", h: true, t: false }, { f: "ATS Optimization", h: true, t: "Basic" }, { f: "Custom Dashboards", h: true, t: false }].map((row, idx) => (
                <tr key={idx} className="hover:bg-light-bg/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-6 font-medium">{row.f}</td>
                  <td className="p-6 text-primary-blue">{row.h === true ? <CheckCircle size={24} /> : row.h}</td>
                  <td className="p-6 text-light-muted dark:text-slate-400">{row.t === false ? "—" : row.t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section className="py-20 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary-blue/5 dark:bg-primary-blue/10" />
      <motion.div className="relative section-container max-w-4xl text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Start Your Career Journey Today</h2>
        <p className="text-xl text-light-muted dark:text-slate-400 mb-10">Join thousands of professionals who have accelerated their career with HireGenie AI.</p>
        <Link to="/register" className="group inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-primary-blue/40 transition-all hover:-translate-y-1">
          Get Started for Free <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  </div>
);

export default Features;
