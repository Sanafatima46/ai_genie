import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Calendar, Clock, ArrowRight, ChevronLeft, Share2, Bookmark, Heart, Filter
} from 'lucide-react';
import featuredImg from '../assets/blog_featured.png';

const blogPosts = [
  {
    id: 1,
    title: "How AI is Changing Modern Recruitment",
    description: "Discover how artificial intelligence is transforming the way companies hire and how you can leverage it to your advantage.",
    content: `
      <p>The recruitment landscape is undergoing a seismic shift. Gone are the days of manual resume screening and simple keyword matching. Today, AI-driven systems are analyzing everything from semantic meaning in CVs to behavioral patterns in interviews.</p>
      
      <h3>The Rise of Semantic Search</h3>
      <p>Traditional Applicant Tracking Systems (ATS) looked for exact keyword matches. Modern AI systems, however, understand context. If you're a "Cloud Architect," the system knows you likely have experience with AWS, Azure, or GCP, even if those specific words aren't repeated a dozen times.</p>
      
      <h3>Automated Interviewing</h3>
      <p>Many first-round screenings are now handled by AI avatars or asynchronous video platforms that analyze not just what you say, but how you present yourself. This allows for a more standardized—though some argue less personal—initial vetting process.</p>
      
      <h3>What This Means for You</h3>
      <p>To succeed in 2026, your resume needs to be built for both machines and humans. It needs to be clear, structured, and rich in context, not just keywords. This is exactly where platforms like HireGenie AI come in, helping you bridge the gap between your experience and the machine's understanding.</p>
    `,
    category: "Job Market Trends",
    author: "Dr. Sarah Chen",
    date: "May 02, 2026",
    readTime: "8 min",
    image: featuredImg,
    featured: true
  },
  {
    id: 2,
    title: "10 Tips to Beat the ATS (Applicant Tracking System)",
    description: "Learn the secrets of how modern tracking systems work and how to format your resume to ensure it gets seen by human recruiters.",
    content: "<p>Full content about beating the ATS...</p>",
    category: "Resume Tips",
    author: "James Wilson",
    date: "April 28, 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
    featured: false
  },
  {
    id: 3,
    title: "Remote Interview Success: A Practical Guide",
    description: "From lighting and background to technical setup and non-verbal cues, here's everything you need for a perfect video interview.",
    content: "<p>Full content about remote interviews...</p>",
    category: "Interview Preparation",
    author: "Elena Rodriguez",
    date: "April 25, 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1573497620053-ea5310f94a17?auto=format&fit=crop&q=80&w=800",
    featured: false
  },
  {
    id: 4,
    title: "The Future of Work: Why Skills Matter More Than Degrees",
    description: "The professional world is shifting towards a skill-first approach. Learn how to highlight your competencies effectively.",
    content: "<p>Full content about skills-based hiring...</p>",
    category: "Career Advice",
    author: "Michael Kaine",
    date: "April 20, 2026",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800",
    featured: false
  }
];

const BlogCard = ({ post, onClick, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    layoutId={`post-${post.id}`}
    onClick={() => onClick(post)}
    className="bg-light-card dark:bg-darktheme-card rounded-2xl border border-light-border dark:border-darktheme-border overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
  >
    <div className="relative h-56 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <img 
        src={post.image} 
        alt={post.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute top-4 left-4 z-20">
        <span className="px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 text-light-text dark:text-white text-xs font-bold rounded-full backdrop-blur-sm shadow-sm">
          {post.category}
        </span>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex items-center gap-4 text-xs text-light-muted dark:text-slate-400 mb-3 font-medium">
        <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
        <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
      </div>
      <h3 className="text-xl font-bold text-light-text dark:text-white mb-3 group-hover:text-primary-blue transition-colors leading-tight">
        {post.title}
      </h3>
      <p className="text-light-muted dark:text-slate-400 text-sm line-clamp-2 mb-6">
        {post.description}
      </p>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-light-border dark:border-darktheme-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue text-xs font-bold border border-primary-blue/20">
            {post.author.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-sm font-semibold text-light-text dark:text-slate-300">{post.author}</span>
        </div>
        <div className="text-primary-blue flex items-center gap-1 text-sm font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Read <ArrowRight size={16} />
        </div>
      </div>
    </div>
  </motion.div>
);

const SinglePost = ({ post, onBack, onNavigate }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="max-w-4xl mx-auto py-12"
  >
    <button 
      onClick={onBack}
      className="mb-8 flex items-center gap-2 text-light-muted dark:text-slate-400 hover:text-primary-blue dark:hover:text-accent-blue transition-colors font-bold group"
    >
      <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
    </button>
    
    <div className="mb-10">
      <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold text-primary-purple bg-primary-purple/10 rounded-full border border-primary-purple/20">
        {post.category}
      </span>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-light-text dark:text-white mb-8 leading-[1.1] tracking-tight">
        {post.title}
      </h1>
      <div className="flex flex-wrap items-center gap-6 text-light-muted dark:text-slate-400 border-b border-light-border dark:border-darktheme-border pb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue font-bold border border-primary-blue/20 text-lg">
            {post.author.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="text-base font-bold text-light-text dark:text-white">{post.author}</div>
            <div className="text-xs uppercase tracking-wider font-semibold">Author</div>
          </div>
        </div>
        <div className="w-px h-8 bg-light-border dark:bg-darktheme-border hidden sm:block"></div>
        <div className="flex items-center gap-2 font-medium"><Calendar size={18} /> {post.date}</div>
        <div className="flex items-center gap-2 font-medium"><Clock size={18} /> {post.readTime} Read</div>
        <div className="flex-grow flex justify-end gap-3">
          <button className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-light-muted hover:text-red-500 rounded-full transition-colors"><Heart size={20} /></button>
          <button className="p-2.5 hover:bg-primary-blue/10 dark:hover:bg-primary-blue/20 text-light-muted hover:text-primary-blue rounded-full transition-colors"><Bookmark size={20} /></button>
          <button className="p-2.5 hover:bg-primary-purple/10 dark:hover:bg-primary-purple/20 text-light-muted hover:text-primary-purple rounded-full transition-colors"><Share2 size={20} /></button>
        </div>
      </div>
    </div>
    
    <div className="rounded-3xl overflow-hidden mb-16 shadow-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      <img src={post.image} alt={post.title} className="w-full h-[400px] md:h-[500px] object-cover" />
    </div>
    
    <div className="prose prose-lg dark:prose-invert max-w-none mb-24 text-light-text/80 dark:text-slate-300 leading-relaxed font-serif text-lg">
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
    
    {/* Related Posts Simple */}
    <div className="border-t border-light-border dark:border-darktheme-border pt-16">
      <h2 className="text-2xl font-bold mb-8 text-light-text dark:text-white tracking-tight">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.filter(p => p.id !== post.id).slice(0, 2).map(p => (
          <div 
            key={p.id} 
            onClick={() => onNavigate(p)}
            className="p-4 bg-light-card dark:bg-darktheme-card rounded-2xl border border-light-border dark:border-darktheme-border flex gap-5 items-center cursor-pointer hover:border-primary-blue/30 hover:shadow-lg transition-all group"
          >
            <img src={p.image} className="w-24 h-24 rounded-xl object-cover group-hover:scale-105 transition-transform" alt="" />
            <div>
              <h4 className="font-bold text-light-text dark:text-white text-base mb-2 line-clamp-2 leading-tight group-hover:text-primary-blue transition-colors">{p.title}</h4>
              <span className="text-primary-blue dark:text-accent-blue text-sm font-bold flex items-center gap-1">Read More <ArrowRight size={14} /></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", "Resume Tips", "Career Advice", "Interview Preparation", "Job Market Trends"];
  const featuredPost = blogPosts.find(p => p.featured);
  
  const filteredPosts = blogPosts.filter(p => {
    const matchesCat = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <AnimatePresence mode='wait'>
        {!selectedPost ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Hero Section */}
            <section className="relative pt-20 pb-24 overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-blue/5 dark:bg-primary-blue/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
              <div className="section-container text-center relative z-10">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-light-text dark:text-white tracking-tight"
                >
                  Career Tips & <span className="gradient-text">Insights</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="text-xl text-light-muted dark:text-slate-400 max-w-2xl mx-auto mb-12"
                >
                  Expert guidance on resumes, interviews, and modern job market trends to help you land your dream role.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-3xl mx-auto"
                >
                  <div className="relative flex-grow w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-light-muted group-focus-within:text-primary-blue transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="Search articles..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-light-card dark:bg-darktheme-card border border-light-border dark:border-darktheme-border rounded-2xl focus:border-primary-blue dark:focus:border-primary-blue outline-none transition-all shadow-sm focus:ring-4 focus:ring-primary-blue/10 text-light-text dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2 px-6 py-4 bg-light-card dark:bg-darktheme-card border border-light-border dark:border-darktheme-border rounded-2xl w-full md:w-auto shadow-sm">
                    <Filter size={20} className="text-light-muted" />
                    <select 
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                      className="bg-transparent font-bold text-sm outline-none cursor-pointer text-light-text dark:text-white"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </motion.div>
              </div>
            </section>

            <div className="section-container pb-20">
              {/* Featured Section */}
              {activeCategory === "All" && !searchTerm && featuredPost && (
                <motion.section 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="mb-20"
                >
                  <div 
                    onClick={() => setSelectedPost(featuredPost)}
                    className="relative rounded-[2.5rem] overflow-hidden bg-light-card dark:bg-darktheme-card border border-light-border dark:border-darktheme-border shadow-xl hover:shadow-2xl group cursor-pointer transition-all duration-500"
                  >
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-[55%] h-80 lg:h-[450px] overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img 
                          src={featuredPost.image} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                        />
                      </div>
                      <div className="lg:w-[45%] p-8 lg:p-12 flex flex-col justify-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-black uppercase tracking-widest text-primary-purple bg-primary-purple/10 rounded-full w-fit border border-primary-purple/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-purple animate-pulse"></span> Featured
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-light-text dark:text-white mb-6 group-hover:text-primary-blue transition-colors leading-[1.2] tracking-tight">
                          {featuredPost.title}
                        </h2>
                        <p className="text-light-muted dark:text-slate-400 text-lg mb-8 line-clamp-3 leading-relaxed">
                          {featuredPost.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue font-bold border border-primary-blue/20">
                              {featuredPost.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-bold text-light-text dark:text-white">{featuredPost.author}</div>
                              <div className="text-xs text-light-muted font-medium">{featuredPost.date}</div>
                            </div>
                          </div>
                          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-blue/20 group-hover:shadow-primary-blue/40 group-hover:-translate-y-0.5">
                            Read <ArrowRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}

              {/* Grid Section */}
              <section>
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-bold text-light-text dark:text-white tracking-tight">
                    {activeCategory === "All" ? "Latest Articles" : activeCategory}
                  </h2>
                  <div className="text-sm font-bold text-light-muted bg-light-border dark:bg-slate-800 px-3 py-1 rounded-lg">
                    {filteredPosts.length} Articles
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post, i) => (
                    <BlogCard key={post.id} post={post} index={i} onClick={setSelectedPost} />
                  ))}
                </div>
                
                {filteredPosts.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center py-24 bg-light-card dark:bg-darktheme-card rounded-3xl border border-dashed border-light-border dark:border-darktheme-border"
                  >
                    <div className="w-20 h-20 bg-light-bg dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-light-muted">
                      <Search size={40} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-light-text dark:text-white">No articles found</h3>
                    <p className="text-light-muted dark:text-slate-400">Try adjusting your search or filters.</p>
                  </motion.div>
                )}
              </section>
            </div>
          </motion.div>
        ) : (
          <SinglePost key="detail" post={selectedPost} onBack={() => setSelectedPost(null)} onNavigate={setSelectedPost} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
