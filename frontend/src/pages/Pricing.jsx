import React, { useState } from 'react';
import { Check, HelpCircle, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for exploring our AI features.",
      features: [
        "1 AI Resume Generation",
        "Basic Templates",
        "Standard Job Search",
        "Public Profile",
        "Email Support"
      ],
      cta: "Get Started",
      highlight: false
    },
    {
      name: "Pro",
      price: isYearly ? "19" : "29",
      description: "Everything you need for a winning career.",
      features: [
        "Unlimited AI Resumes",
        "Premium Templates",
        "Advanced AI Job Matching",
        "Cover Letter Generator",
        "Priority Support",
        "No Watermarks"
      ],
      cta: "Go Pro Now",
      highlight: true
    },
    {
      name: "Premium",
      price: isYearly ? "49" : "69",
      description: "Personalized coaching and expert tools.",
      features: [
        "All Pro Features",
        "1-on-1 AI Interview Prep",
        "Expert Resume Review",
        "LinkedIn Profile Audit",
        "Salary Negotiation Tool",
        "Dedicated Account Manager"
      ],
      cta: "Start Premium",
      highlight: false
    }
  ];

  const comparisons = [
    { feature: "AI Resume Builder", free: true, pro: true, premium: true },
    { feature: "Templates", free: "Basic", pro: "Premium", premium: "All Access" },
    { feature: "Job Matching", free: "Standard", pro: "Advanced", premium: "Elite" },
    { feature: "Cover Letter AI", free: false, pro: true, premium: true },
    { feature: "Interview Coaching", free: false, pro: false, premium: true },
    { feature: "Support", free: "Email", pro: "Priority", premium: "24/7 Dedicated" },
  ];

  const faqs = [
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes, you can cancel your subscription at any time from your dashboard. You will continue to have access until the end of your billing period."
    },
    {
      q: "Is there a discount for yearly billing?",
      a: "Yes! By choosing yearly billing, you save over 30% compared to monthly payments."
    },
    {
      q: "Do you offer a student discount?",
      a: "Absolutely. Contact our support team with your student ID to receive a special 50% discount on the Pro plan."
    },
    {
      q: "How does the AI Resume Builder work?",
      a: "Our AI analyzes your experience and the job description to suggest optimized bullet points, keywords, and formatting that pass ATS systems."
    }
  ];

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };
  
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen pt-16 pb-24">
      {/* Hero Section */}
      <section className="text-center section-container max-w-4xl mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-light-text dark:text-white tracking-tight mb-6"
        >
          Simple & Transparent <span className="gradient-text">Pricing</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-light-muted dark:text-slate-400 mb-10 max-w-2xl mx-auto"
        >
          Choose the right plan to accelerate your career. No hidden fees, cancel anytime.
        </motion.p>

        {/* Toggle Switch */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <span className={`text-sm font-bold transition-colors ${!isYearly ? 'text-primary-blue dark:text-white' : 'text-light-muted dark:text-slate-500'}`}>Monthly</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-16 h-8 bg-light-border dark:bg-slate-700 rounded-full p-1 transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary-blue/50"
            aria-label="Toggle billing period"
          >
            <div className={`w-6 h-6 bg-primary-blue rounded-full transition-transform transform shadow-md ${isYearly ? 'translate-x-8' : 'translate-x-0'}`}></div>
          </button>
          <span className={`text-sm font-bold flex items-center gap-2 transition-colors ${isYearly ? 'text-primary-purple dark:text-white' : 'text-light-muted dark:text-slate-500'}`}>
            Yearly 
            <span className="text-[10px] bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full uppercase tracking-tighter font-black shadow-sm">Save 30%</span>
          </span>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="section-container mb-32">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
                plan.highlight 
                  ? 'bg-light-card dark:bg-darktheme-card border-2 border-primary-blue dark:border-primary-purple shadow-xl md:scale-105 z-10' 
                  : 'bg-light-card dark:bg-darktheme-card border border-light-border dark:border-darktheme-border hover:shadow-lg hover:border-light-muted/30'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-blue to-primary-purple text-white text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-primary-blue/30 uppercase tracking-widest">
                  <Star size={12} className="fill-white" /> MOST POPULAR
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-light-text dark:text-white tracking-tight">{plan.name}</h3>
                <p className="text-sm text-light-muted dark:text-slate-400 font-medium">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-light-text dark:text-white tracking-tighter">${plan.price}</span>
                <span className="text-light-muted dark:text-slate-500 font-medium">/mo</span>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-sm text-light-text dark:text-slate-300 font-medium">
                    <div className="mt-0.5 p-1 bg-primary-blue/10 dark:bg-primary-blue/20 rounded-full text-primary-blue shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 tracking-wide ${
                plan.highlight
                  ? 'bg-gradient-to-r from-primary-blue to-primary-purple text-white shadow-lg shadow-primary-blue/25 hover:shadow-primary-blue/40'
                  : 'bg-light-bg dark:bg-slate-800 text-light-text dark:text-white border border-light-border dark:border-slate-700 hover:bg-light-border dark:hover:bg-slate-700'
              }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Comparison Table */}
      <section className="section-container max-w-5xl mb-32">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-light-text dark:text-white tracking-tight">Feature Comparison</h2>
          <p className="text-light-muted dark:text-slate-400">Detailed look at what each plan offers.</p>
        </motion.div>

        <motion.div 
          className="overflow-x-auto rounded-3xl border border-light-border dark:border-darktheme-border bg-light-card dark:bg-darktheme-card shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-light-border dark:border-darktheme-border bg-light-bg dark:bg-slate-800/50">
                <th className="p-6 text-sm font-bold text-light-text dark:text-white uppercase tracking-wider">Features</th>
                <th className="p-6 text-sm font-bold text-light-text dark:text-white uppercase tracking-wider">Free</th>
                <th className="p-6 text-sm font-bold text-primary-blue dark:text-accent-blue uppercase tracking-wider">Pro</th>
                <th className="p-6 text-sm font-bold text-light-text dark:text-white uppercase tracking-wider">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border dark:divide-darktheme-border">
              {comparisons.map((row, idx) => (
                <tr key={idx} className="hover:bg-light-bg/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-6 text-sm font-bold text-light-text dark:text-slate-300">{row.feature}</td>
                  <td className="p-6 text-sm text-light-muted dark:text-slate-400 font-medium">
                    {typeof row.free === 'boolean' ? (row.free ? <Check size={20} className="text-green-500" strokeWidth={3} /> : '—') : row.free}
                  </td>
                  <td className="p-6 text-sm font-bold text-primary-blue">
                    {typeof row.pro === 'boolean' ? (row.pro ? <Check size={20} className="text-green-500" strokeWidth={3} /> : '—') : row.pro}
                  </td>
                  <td className="p-6 text-sm text-light-muted dark:text-slate-400 font-medium">
                    {typeof row.premium === 'boolean' ? (row.premium ? <Check size={20} className="text-green-500" strokeWidth={3} /> : '—') : row.premium}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="section-container max-w-4xl mb-32">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-light-text dark:text-white tracking-tight">Frequently Asked Questions</h2>
        </motion.div>
        
        <motion.div 
          className="grid gap-6 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {faqs.map((faq, idx) => (
            <motion.div key={idx} variants={fadeUp} className="p-8 rounded-2xl bg-light-card dark:bg-darktheme-card border border-light-border dark:border-darktheme-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-primary-blue/10 dark:bg-primary-blue/20 p-2 rounded-lg text-primary-blue shrink-0">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-light-text dark:text-white mb-2 leading-tight">{faq.q}</h4>
                  <p className="text-light-muted dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="section-container">
        <motion.div 
          className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary-blue to-primary-purple p-12 md:p-24 text-center text-white shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-8 tracking-tight">Start Your Career Journey Today</h2>
            <p className="text-xl text-white/80 mb-12 leading-relaxed">
              Join 10,000+ professionals who have landed their dream jobs using HireGenie AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="px-8 py-5 bg-white text-primary-blue rounded-2xl font-bold hover:bg-slate-50 transition flex items-center justify-center gap-2 group shadow-xl hover:-translate-y-1">
                Get Started for Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Pricing;
