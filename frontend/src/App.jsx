import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  Moon,
  Sun,
  Mail,
  Phone,
  MapPin,
  Share2,
  Rss,
  MessageSquareShare,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import logo from "./assets/genie.png";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPage from "./pages/Dashboard";
import Builder from "./pages/Builder";
import Jobs from "./pages/Jobs";
import JobFinder from "./pages/JobFinder";
import JobAnalytics from "./pages/JobAnalytics";
import GrowthHub from "./pages/GrowthHub";
import Chatbot from "./pages/Chatbot";
import AuthenticatedHeader from "./components/AuthenticatedHeader";
import AppSidebar from "./components/AppSidebar";
import CoverLetterModal from "./components/dashboard/CoverLetterModal";
import AuthRedirect, { APP_ROUTES } from "./components/AuthRedirect";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Features from "./pages/Features";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";

/* ─── Scroll To Top on Route Change ─── */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

/* ─── Scroll Progress Bar ─── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setProgress((window.scrollY / total) * 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[60]">
      <div
        className="h-full bg-gradient-to-r from-primary-blue via-primary-purple to-accent-blue transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* ─── Shared Footer ─── */
function SharedFooter() {
  return (
    <footer className="relative bg-gray-950 dark:bg-gray-950 border-t border-white/5 text-white overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              HireGenie AI
            </span>
            <p className="text-slate-400 text-sm leading-relaxed my-5">
              Your AI-powered career companion. From resume to recruitment — we
              help you every step of the way.
            </p>
            <div className="flex items-center gap-3">
              {[
                <Share2 size={16} />,
                <MessageSquareShare size={16} />,
                <Rss size={16} />,
                <ExternalLink size={16} />,
              ].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">
              Product
            </h4>
            <ul className="space-y-3">
              {[
                { label: "AI Resume Builder", to: "/builder" },
                { label: "AI Job Finder", to: "/job-finder" },
                { label: "Career Counselor", to: "#" },
                { label: "Interview Prep", to: "#" },
                { label: "Pricing", to: "/pricing" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    <ChevronRight
                      size={13}
                      className="opacity-0 group-hover:opacity-100 -ml-1 transition-all duration-200"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Features", to: "/features" },
                { label: "Blog", to: "/blog" },
                { label: "FAQ", to: "/faq" },
                { label: "Contact Us", to: "/contact" },
                { label: "Privacy Policy", to: "/privacy" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    <ChevronRight
                      size={13}
                      className="opacity-0 group-hover:opacity-100 -ml-1 transition-all duration-200"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">
              Get In Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={15} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Email</p>
                  <a
                    href="mailto:support@hiregenie.ai"
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    support@hiregenie.ai
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={15} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                  <a
                    href="tel:+1234567890"
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={15} className="text-sky-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Location</p>
                  <p className="text-sm text-slate-300">
                    San Francisco, CA, USA
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} HireGenie AI. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-600">
            <Link
              to="/privacy"
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/sitemap"
              className="hover:text-slate-300 transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Navigation ─── */
function LayoutNavigation({ darkMode, setDarkMode }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  // Close mobile menu on route change
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setMobileOpen(false);
  }

  // Detect scroll for navbar style change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/blog", label: "Blog" },
    { to: "/faq", label: "FAQ" },
    { to: "/pricing", label: "Pricing" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20 border-b border-white/20 dark:border-slate-700/50"
          : "bg-light-card dark:bg-darktheme-card border-b border-light-border dark:border-darktheme-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="group relative flex items-center gap-3 p-1">
            <div className="absolute inset-0 bg-primary-blue/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="relative flex items-center justify-center -ml-1">
              <img
                src={logo}
                alt="HireGenie AI Avatar"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3"
              />
            </div>
            <div className="hidden sm:flex flex-col justify-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary-blue to-primary-purple leading-tight tracking-tight">
                HireGenie AI
              </span>
              <span className="text-[10px] font-medium text-light-muted dark:text-slate-400 tracking-widest uppercase mt-0.5">
                From Resume to Recruitment
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive(link.to)
                    ? "text-primary-blue dark:text-accent-blue bg-primary-blue/5 dark:bg-accent-blue/10"
                    : "text-light-muted dark:text-slate-400 hover:text-primary-blue dark:hover:text-accent-blue hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-gradient-to-r from-primary-blue to-primary-purple rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-light-border dark:border-darktheme-border">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl bg-light-bg dark:bg-slate-800 text-light-muted dark:text-accent-blue hover:text-primary-blue hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-blue/50"
                aria-label="Toggle Dark Mode"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={darkMode ? "sun" : "moon"}
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                  </motion.div>
                </AnimatePresence>
              </button>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-sm font-medium text-light-text dark:text-white hover:text-primary-blue transition-colors rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="px-5 py-2.5 bg-light-bg dark:bg-slate-800 border border-light-border dark:border-slate-700 text-light-text dark:text-slate-300 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm font-semibold"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-light-text dark:text-slate-300 hover:text-primary-blue transition-colors rounded-lg"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 bg-gradient-to-br from-primary-blue to-primary-purple text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-semibold"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-light-bg dark:bg-slate-800 text-light-muted dark:text-accent-blue transition-all"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl bg-light-bg dark:bg-slate-800 text-light-text dark:text-darktheme-text transition-all"
              aria-label="Toggle Menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? "close" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-light-border dark:border-darktheme-border bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.to}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(link.to)
                        ? "text-primary-blue bg-primary-blue/10 font-semibold"
                        : "text-light-muted dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {user ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-3 space-y-2 border-t border-light-border dark:border-slate-700 mt-2"
                >
                  <Link
                    to="/dashboard"
                    className="block text-center px-5 py-3 rounded-xl font-bold border border-light-border dark:border-slate-700 bg-white dark:bg-slate-800 text-light-text dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full px-5 py-3 text-center font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                  >
                    Log Out
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-3 space-y-2 border-t border-light-border dark:border-slate-700 mt-2"
                >
                  <Link
                    to="/login"
                    className="block text-center px-5 py-3 rounded-xl font-bold border border-light-border dark:border-slate-700 bg-white dark:bg-slate-800 text-light-text dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center px-5 py-3 bg-gradient-to-br from-primary-blue to-primary-purple text-white rounded-xl shadow-md text-sm font-semibold"
                  >
                    Get Started Free
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ─── Page Transition Wrapper ─── */
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

function Dashboard({ onOpenCoverLetter }) {
  return <DashboardPage onOpenCoverLetter={onOpenCoverLetter} />;
}

function AnimatedRoutes({ isAppShell, isBuilderFocus, onOpenCoverLetter }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={isBuilderFocus ? undefined : pageVariants}
        initial={isBuilderFocus ? false : "initial"}
        animate={isBuilderFocus ? undefined : "animate"}
        exit={isBuilderFocus ? undefined : "exit"}
        transition={{ duration: isAppShell && !isBuilderFocus ? 0.35 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job-finder" element={<JobFinder />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/job-analytics" element={<JobAnalytics />} />
          <Route path="/growth" element={<GrowthHub />} />
          <Route path="/dashboard" element={<Dashboard onOpenCoverLetter={onOpenCoverLetter} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── App shell: marketing vs logged-in dashboard ─── */
function AppShell() {
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const { user } = useAuth();
  const location = useLocation();
  const isAppShell = user && APP_ROUTES.includes(location.pathname);
  const isBuilderFocus = location.pathname === "/builder";

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-light-bg dark:bg-darktheme-bg text-light-text dark:text-darktheme-text flex flex-col font-sans overflow-x-hidden">
      <AuthRedirect />
      {!isAppShell && <ScrollProgress />}
      {isAppShell ? (
        <div className="flex flex-1 w-full min-h-screen">
          {!isBuilderFocus && (
            <AppSidebar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onCoverLetter={() => setCoverLetterOpen(true)}
            />
          )}
          <div className="flex-1 flex flex-col min-w-0 w-full">
            {!isBuilderFocus && (
              <div className="lg:hidden">
                <AuthenticatedHeader
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  onCoverLetter={() => setCoverLetterOpen(true)}
                />
              </div>
            )}
            <ScrollToTop />
            <main
              className={`flex-grow w-full min-w-0 overflow-x-hidden relative bg-light-bg dark:bg-darktheme-bg ${
                isBuilderFocus ? "min-h-screen" : ""
              }`}
            >
              <AnimatedRoutes
                isAppShell={isAppShell}
                isBuilderFocus={isBuilderFocus}
                onOpenCoverLetter={() => setCoverLetterOpen(true)}
              />
            </main>
          </div>
          {!isBuilderFocus && (
            <CoverLetterModal
              open={coverLetterOpen}
              onClose={() => setCoverLetterOpen(false)}
              onGenerated={() => {}}
            />
          )}
        </div>
      ) : (
        <>
          <LayoutNavigation darkMode={darkMode} setDarkMode={setDarkMode} />
          <ScrollToTop />
          <main className="flex-grow w-full relative">
            <AnimatedRoutes isAppShell={false} onOpenCoverLetter={() => {}} />
          </main>
          <SharedFooter />
        </>
      )}
    </div>
  );
}

/* ─── App ─── */
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </Router>
  );
}

export default App;
