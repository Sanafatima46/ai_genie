import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ChevronDown, FileText, MessageSquare, Target, ShieldCheck, HelpCircle, Mail, MessageCircle, ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const faqData = [
  {
    category: "General Usage",
    icon: HelpCircle,
    questions: [
      {
        q: "What is HireGenie AI?",
        a: "HireGenie AI is an all-in-one career platform that uses advanced artificial intelligence to help you build professional resumes, prepare for interviews, and find job matches that perfectly fit your skills and experience."
      },
      {
        q: "Is HireGenie AI free to use?",
        a: "We offer a generous free tier that includes basic resume building and a limited number of job matches. For advanced AI features like full CV optimization and unlimited career coaching, we have premium plans."
      }
    ]
  },
  {
    category: "Resume Builder",
    icon: FileText,
    questions: [
      {
        q: "How does the AI Resume Builder work?",
        a: "Our AI analyzes your work history and the specific industry you're targeting. It then suggests high-impact bullet points, optimizes your layout for ATS (Applicant Tracking Systems), and ensures your CV stands out to recruiters."
      },
      {
        q: "Can I download my resume in PDF format?",
        a: "Yes! All resumes built on HireGenie AI can be downloaded as professional, high-quality PDF files that are ready to be sent to employers."
      }
    ]
  },
  {
    category: "AI Chatbot",
    icon: MessageSquare,
    questions: [
      {
        q: "What can I ask the AI Career Genie?",
        a: "You can ask anything from 'How do I explain a gap in my resume?' to 'What are common interview questions for a Senior Developer role?'. The Genie is trained on thousands of career coaching scenarios."
      },
      {
        q: "Is the career chatbot available 24/7?",
        a: "Absolutely. Our AI Genie is always online to help you with your career queries, no matter what time zone you're in."
      }
    ]
  },
  {
    category: "Job Matcher",
    icon: Target,
    questions: [
      {
        q: "How is the Match Percentage calculated?",
        a: "Our algorithm compares your resume's skills, experience levels, and keywords against the job description requirements. A higher percentage indicates a stronger fit for that specific role."
      },
      {
        q: "Does HireGenie AI apply to jobs for me?",
        a: "While we don't automatically submit applications, we provide direct links to apply and offer tailored advice on how to customize your resume for each specific job match."
      }
    ]
  },
  {
    category: "Account & Security",
    icon: ShieldCheck,
    questions: [
      {
        q: "Is my personal data safe with HireGenie AI?",
        a: "We take security seriously. Your data is encrypted both at rest and in transit. We never sell your personal information to third parties."
      },
      {
        q: "How can I delete my account?",
        a: "You can delete your account and all associated data at any time from the 'Settings' section of your dashboard. This action is permanent and cannot be undone."
      }
    ]
  }
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-light-border dark:border-darktheme-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group transition-all"
        aria-expanded={isOpen}
      >
        <span className={`text-lg font-bold pr-8 transition-colors ${isOpen ? 'text-primary-blue' : 'text-light-text dark:text-darktheme-text group-hover:text-primary-blue'}`}>
          {question}
        </span>
        <div className={`p-1.5 rounded-full transition-all duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 bg-primary-blue text-white shadow-md' : 'bg-light-bg dark:bg-slate-800 text-light-muted dark:text-slate-400 group-hover:bg-primary-blue/10 group-hover:text-primary-blue'}`}>
          <ChevronDown size={20} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-8 pt-2 text-light-muted dark:text-slate-400 leading-relaxed text-base">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...faqData.map(d => d.category)];

  const filteredData = faqData.filter(cat => 
    activeCategory === "All" || cat.category === activeCategory
  ).map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };
  
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative pt-24 pb-36 overflow-hidden bg-gradient-to-b from-primary-blue/[0.02] to-transparent dark:from-primary-blue/[0.05]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-purple/5 dark:bg-primary-purple/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-blue/5 dark:bg-primary-blue/10 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none"></div>
        
        <div className="relative section-container max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-light-text dark:text-white tracking-tight">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-xl text-light-muted dark:text-slate-400 mb-12 max-w-2xl mx-auto">
              Everything you need to know about HireGenie AI and how it helps your career.
            </p>
            
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-light-muted group-focus-within:text-primary-blue transition-colors">
                <Search size={24} />
              </div>
              <input
                type="text"
                placeholder="Search for questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white dark:bg-darktheme-card border-2 border-light-border dark:border-darktheme-border rounded-2xl focus:border-primary-blue dark:focus:border-primary-blue text-light-text dark:text-white text-lg shadow-lg focus:shadow-xl focus:shadow-primary-blue/10 transition-all outline-none"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories & Questions */}
      <section className="section-container max-w-5xl -mt-16 relative z-10">
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeCategory === cat 
                ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/30 scale-105' 
                : 'bg-white dark:bg-darktheme-card text-light-muted dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 border border-light-border dark:border-darktheme-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div 
          className="grid grid-cols-1 gap-10"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {filteredData.length > 0 ? (
            filteredData.map((cat, idx) => (
              <motion.div 
                key={cat.category}
                variants={fadeUp}
                className="bg-white dark:bg-darktheme-card rounded-3xl border border-light-border dark:border-darktheme-border shadow-sm overflow-hidden"
              >
                <div className="p-8 border-b border-light-border dark:border-darktheme-border bg-light-bg/50 dark:bg-slate-800/30 flex items-center gap-4">
                  <div className="p-3.5 bg-primary-blue/10 dark:bg-primary-blue/20 rounded-2xl text-primary-blue shadow-inner">
                    <cat.icon size={28} />
                  </div>
                  <h2 className="text-2xl font-bold text-light-text dark:text-white tracking-tight">{cat.category}</h2>
                </div>
                <div className="px-8 py-2">
                  {cat.questions.map((item, qIdx) => (
                    <FAQItem key={qIdx} question={item.q} answer={item.a} />
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-24 bg-white dark:bg-darktheme-card rounded-3xl border border-dashed border-light-border dark:border-darktheme-border"
            >
              <div className="p-5 bg-light-bg dark:bg-slate-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 text-light-muted">
                <Search size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-light-text dark:text-white">No questions found</h3>
              <p className="text-light-muted dark:text-slate-400">Try searching with different keywords or categories.</p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Still Have Questions Section */}
      <section className="section-container max-w-4xl mt-32 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 md:p-16 bg-gradient-to-br from-primary-blue to-primary-purple rounded-[3rem] text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10 tracking-tight">Still have questions?</h2>
          <p className="text-xl text-white/80 mb-10 relative z-10 max-w-2xl mx-auto">
            Can't find what you're looking for? Our team and AI assistant are ready to help.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link to="/contact" className="flex items-center gap-2 px-8 py-4 bg-white text-primary-blue rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-xl hover:-translate-y-1 group">
              <Mail size={20} /> Contact Support <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform ml-1" />
            </Link>
            <button className="flex items-center gap-2 px-8 py-4 bg-primary-blue/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-bold hover:bg-white/20 transition-all hover:-translate-y-1">
              <MessageCircle size={20} /> Ask AI Chatbot
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default FAQ;
