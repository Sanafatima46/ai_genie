import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import { Camera, Sparkles, Download, LayoutTemplate, ArrowLeft, Save, Check, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import apiClient from "../api/apiClient";

const A4_WIDTH_PX = 794;
const A4_MIN_HEIGHT_PX = 1123;

function Builder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Your_name",
    email: "xyz@example.com",
    phone: "+92 34 567 8900",
    address: "Punjab, Pakistan",
    summary:
      "A highly motivated developer with a passion for building scalable web applications. Adept at leveraging modern frameworks to deliver high-quality software.",
    experience:
      "Software Engineer at TechCorp (2022-Present)\n- Developed modern React applications\n- Improved performance by 30%\n\nJunior Developer at StartupInc (2020-2022)\n- Handled core backend routines APIs",
    education: "BSc Computer Science, XYZ University, 2021",
    skills: "React, Node.js, Express, MongoDB, Tailwind CSS",
    interests: "Open Source, Tech Blogging, Reading",
    picUrl: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [enhancing, setEnhancing] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState("form");
  const [previewScale, setPreviewScale] = useState(1);
  const [resumeHeight, setResumeHeight] = useState(A4_MIN_HEIGHT_PX);
  const resumeRef = useRef();
  const previewContainerRef = useRef();

  const updatePreviewScale = useCallback(() => {
    const container = previewContainerRef.current;
    if (!container) return;
    const padding = 24;
    const availableWidth = container.clientWidth - padding;
    if (availableWidth <= 0) return;
    const scale = Math.min(1, availableWidth / A4_WIDTH_PX);
    setPreviewScale(scale);
  }, []);

  const updateResumeHeight = useCallback(() => {
    const el = resumeRef.current;
    if (!el) return;
    setResumeHeight(Math.max(A4_MIN_HEIGHT_PX, el.scrollHeight));
  }, []);

  useLayoutEffect(() => {
    updatePreviewScale();
    updateResumeHeight();
    const container = previewContainerRef.current;
    if (!container) return undefined;
    const observer = new ResizeObserver(() => {
      updatePreviewScale();
      updateResumeHeight();
    });
    observer.observe(container);
    if (resumeRef.current) observer.observe(resumeRef.current);
    window.addEventListener("resize", updatePreviewScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePreviewScale);
    };
  }, [updatePreviewScale, updateResumeHeight, mobileTab, selectedTemplate, formData]);

  React.useEffect(() => {
    const fetchLatestResume = async () => {
      try {
        const { data } = await apiClient.get("/resume");
        if (data && data.length > 0) {
          // Get the latest updated resume
          const latest = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
          if (latest.builderData) {
            setFormData(latest.builderData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch latest resume:", error);
      }
    };
    fetchLatestResume();
  }, []);

  const handleSave = async (andNavigate = false) => {
    setIsSaving(true);
    try {
      await apiClient.post('/resume', formData);
      if (andNavigate) navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save resume:', error);
      alert(error.response?.data?.message || 'Failed to save resume.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = resumeRef.current;
    if (!element) return;
    const prevTransform = element.style.transform;
    const prevPosition = element.style.position;
    const prevWidth = element.style.width;
    element.style.transform = "none";
    element.style.position = "relative";
    element.style.width = "210mm";
    const opt = {
      margin: [0, 0, 0, 0],
      filename: `${formData.name.replace(/\s+/g, "_") || "Resume"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .finally(() => {
        element.style.transform = prevTransform;
        element.style.position = prevPosition;
        element.style.width = prevWidth;
      });
  };

  const handleEnhanceSection = async (section) => {
    const text = formData[section];
    if (!text) return;

    setEnhancing((prev) => ({ ...prev, [section]: true }));
    try {
      const { data } = await apiClient.post("/resume/enhance", {
        section,
        text,
      });
      setFormData((prev) => ({ ...prev, [section]: data.enhancedText }));
    } catch (error) {
      console.error(`Failed to enhance ${section}:`, error);
      alert(
        error.response?.data?.message ||
          "Failed to enhance section. Is GROQ_API_KEY configured in backend/.env?",
      );
    } finally {
      setEnhancing((prev) => ({ ...prev, [section]: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, picUrl: URL.createObjectURL(file) }));
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const { data } = await apiClient.post("/resume/parse", formData);

      if (data && data.data) {
        setFormData(data.data);
      }
    } catch (error) {
      console.error("Auto-enhance failed", error);
      alert(
        error.response?.data?.message ||
          "Failed to enhance full CV. Is GROQ_API_KEY configured in backend/.env?",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full min-w-0 min-h-screen overflow-x-hidden box-border flex flex-col">
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-6 py-3 border-b border-light-border dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-light-muted dark:text-slate-400 hover:text-primary-blue rounded-lg hover:bg-light-bg dark:hover:bg-slate-800"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <h1 className="text-sm sm:text-base font-extrabold text-light-text dark:text-white order-first w-full sm:order-none sm:w-auto sm:flex-1 sm:text-center">
          Resume Builder
        </h1>
        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={isSaving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow-md disabled:opacity-60"
        >
          <Save size={16} /> {isSaving ? 'Saving...' : 'Save'}
        </button>
      </header>

      <div className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full">

      {/* Mobile / tablet: switch form vs preview */}
      <div className="flex lg:hidden gap-2 mb-4 max-w-7xl mx-auto w-full">
        <button
          type="button"
          onClick={() => setMobileTab('form')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold ${
            mobileTab === 'form'
              ? 'bg-primary-blue text-white'
              : 'bg-light-card dark:bg-darktheme-card border border-light-border dark:border-slate-700'
          }`}
        >
          Edit resume
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold ${
            mobileTab === 'preview'
              ? 'bg-primary-blue text-white'
              : 'bg-light-card dark:bg-darktheme-card border border-light-border dark:border-slate-700'
          }`}
        >
          Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto w-full min-w-0">
        {/* Form Pane */}
        <div
          className={`bg-light-card dark:bg-darktheme-card p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-light-border dark:border-darktheme-border min-w-0 w-full overflow-y-auto lg:max-h-[calc(100vh-8rem)] custom-scrollbar ${
            mobileTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary-blue/10 dark:bg-primary-blue/20 rounded-xl text-primary-blue">
              <FileTextIcon />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-light-text dark:text-white break-words">
              Resume Details
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleGenerate}>
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-light-text dark:text-slate-300 mb-2">
                Profile Picture (Optional)
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {formData.picUrl ? (
                  <img
                    src={formData.picUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-blue/20 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-light-bg dark:bg-slate-800 flex items-center justify-center border border-light-border dark:border-slate-700">
                    <Camera className="w-6 h-6 text-light-muted dark:text-slate-400" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePicUpload}
                  className="w-full sm:w-auto text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-blue/10 file:text-primary-blue hover:file:bg-primary-blue/20 transition cursor-pointer dark:text-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-light-bg dark:bg-slate-800 border-light-border dark:border-slate-700 text-light-text dark:text-white rounded-xl shadow-sm border p-3 outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-light-bg dark:bg-slate-800 border-light-border dark:border-slate-700 text-light-text dark:text-white rounded-xl shadow-sm border p-3 outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-slate-300 mb-1.5">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-light-bg dark:bg-slate-800 border-light-border dark:border-slate-700 text-light-text dark:text-white rounded-xl shadow-sm border p-3 outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-slate-300 mb-1.5">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-light-bg dark:bg-slate-800 border-light-border dark:border-slate-700 text-light-text dark:text-white rounded-xl shadow-sm border p-3 outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-light-text dark:text-slate-300">
                  Professional Summary
                </label>
                <button
                  type="button"
                  onClick={() => handleEnhanceSection("summary")}
                  disabled={enhancing.summary}
                  className="text-xs font-bold flex items-center gap-1 text-primary-purple hover:text-primary-blue disabled:opacity-50 transition-colors bg-primary-purple/10 px-2 py-1 rounded-md"
                >
                  <Sparkles
                    size={12}
                    className={enhancing.summary ? "animate-spin" : ""}
                  />{" "}
                  {enhancing.summary ? "Enhancing..." : "AI Enhance"}
                </button>
              </div>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                className={`w-full bg-light-bg dark:bg-slate-800 border-light-border dark:border-slate-700 text-light-text dark:text-white rounded-xl shadow-sm border p-3 outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition ${enhancing.summary ? "animate-pulse bg-primary-purple/5" : ""}`}
                rows="3"
              ></textarea>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-light-text dark:text-slate-300">
                  Past Work / Experience
                </label>
                <button
                  type="button"
                  onClick={() => handleEnhanceSection("experience")}
                  disabled={enhancing.experience}
                  className="text-xs font-bold flex items-center gap-1 text-primary-purple hover:text-primary-blue disabled:opacity-50 transition-colors bg-primary-purple/10 px-2 py-1 rounded-md"
                >
                  <Sparkles
                    size={12}
                    className={enhancing.experience ? "animate-spin" : ""}
                  />{" "}
                  {enhancing.experience ? "Enhancing..." : "AI Enhance"}
                </button>
              </div>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full bg-light-bg dark:bg-slate-800 border-light-border dark:border-slate-700 text-light-text dark:text-white rounded-xl shadow-sm border p-3 outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition ${enhancing.experience ? "animate-pulse bg-primary-purple/5" : ""}`}
                rows="4"
                placeholder="Company Name - Role - Years..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text dark:text-slate-300 mb-1.5">
                Education
              </label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full bg-light-bg dark:bg-slate-800 border-light-border dark:border-slate-700 text-light-text dark:text-white rounded-xl shadow-sm border p-3 outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition"
                rows="2"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text dark:text-slate-300 mb-1.5">
                Skills (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full bg-light-bg dark:bg-slate-800 border-light-border dark:border-slate-700 text-light-text dark:text-white rounded-xl shadow-sm border p-3 outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text dark:text-slate-300 mb-1.5">
                Interests / Hobbies
              </label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                className="w-full bg-light-bg dark:bg-slate-800 border-light-border dark:border-slate-700 text-light-text dark:text-white rounded-xl shadow-sm border p-3 outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="group w-full bg-gradient-to-r from-primary-blue to-primary-purple text-white font-semibold py-4 px-4 rounded-xl shadow-lg hover:shadow-primary-blue/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:hover:transform-none"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Applying AI Polish...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} className="group-hover:animate-pulse" />
                  <span>Auto-Enhance CV</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Preview Pane */}
        <div
          className={`flex flex-col gap-3 sm:gap-4 min-w-0 w-full ${
            mobileTab === 'form' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Top Controls: Template Selector & Download */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-light-card dark:bg-darktheme-card p-4 rounded-2xl shadow-sm border border-light-border dark:border-darktheme-border z-20">
            <div className="flex items-center gap-3 w-full sm:w-auto relative">
              <LayoutTemplate
                size={20}
                className="text-primary-blue hidden sm:block shrink-0"
              />
              <div className="relative w-full sm:w-64">
                <button 
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-light-bg dark:bg-slate-800 text-light-text dark:text-white rounded-xl font-bold border border-light-border dark:border-slate-700 shadow-sm hover:bg-light-bg/80 dark:hover:bg-slate-800/80 transition-all text-sm"
                >
                  <span className="flex items-center gap-2 capitalize text-left truncate">
                    <span className="hidden sm:inline">Theme:</span>{' '}
                    <span className="text-primary-blue dark:text-accent-blue font-extrabold">{selectedTemplate}</span>
                  </span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                    <div className="absolute left-0 mt-2 w-full bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-light-border dark:border-slate-700 z-20 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      {["modern", "classic", "minimal", "professional", "creative"].map((tpl) => (
                        <button
                          key={tpl}
                          type="button"
                          onClick={() => {
                            setSelectedTemplate(tpl);
                            setDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-sm font-semibold capitalize text-left transition-colors flex items-center justify-between ${
                            selectedTemplate === tpl 
                              ? "bg-primary-blue/10 text-primary-blue dark:bg-primary-blue/20 dark:text-white" 
                              : "text-light-text dark:text-slate-300 hover:bg-light-bg dark:hover:bg-slate-800"
                          }`}
                        >
                          {tpl}
                          {selectedTemplate === tpl && <Check size={14} className="text-primary-blue" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-blue to-accent-blue text-white rounded-xl font-bold shadow-md shrink-0"
            >
              <Download size={18} /> Export PDF
            </button>
          </div>

          <div
            ref={previewContainerRef}
            className="bg-light-bg/50 dark:bg-slate-900 p-2 sm:p-4 rounded-2xl border border-light-border dark:border-darktheme-border w-full min-w-0 overflow-x-hidden overflow-y-auto max-h-[65vh] sm:max-h-[70vh] lg:max-h-[calc(100vh-10rem)] relative custom-scrollbar"
          >
            <div className="flex justify-center py-2">
              <div
                className="relative overflow-hidden"
                style={{
                  width: A4_WIDTH_PX * previewScale,
                  height: resumeHeight * previewScale,
                }}
              >
            {isGenerating ? (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl transition-all">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-primary-blue/20 rounded-full"></div>
                  <div className="w-20 h-20 border-4 border-primary-blue border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                  <Sparkles
                    size={24}
                    className="text-primary-purple absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
                  />
                </div>
                <p className="mt-6 gradient-text font-bold text-xl drop-shadow-md tracking-tight">
                  AI is formatting your data...
                </p>
              </div>
            ) : null}

            <div
              ref={resumeRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `scale(${previewScale})`,
                transformOrigin: "top left",
                width: `${A4_WIDTH_PX}px`,
                minHeight: `${A4_MIN_HEIGHT_PX}px`,
              }}
              className={`bg-white shadow-xl text-gray-800 break-words overflow-hidden box-border relative ${
                selectedTemplate === 'classic' ? 'font-serif p-8 sm:p-12' :
                selectedTemplate === 'minimal' ? 'font-sans font-light p-8 sm:p-12' :
                selectedTemplate === 'professional' ? 'font-sans p-0' :
                selectedTemplate === 'creative' ? 'font-sans p-8 sm:p-12' :
                'font-sans p-8 sm:p-12'
              }`}
            >
              {/* Professional template: sidebar layout */}
              {selectedTemplate === 'professional' ? (
                <div className="flex flex-col md:flex-row min-h-[297mm]">
                  <div className="w-full md:w-[35%] bg-slate-800 text-white p-6 sm:p-8 flex flex-col">
                    {formData.picUrl && (
                      <img src={formData.picUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-teal-400 mx-auto mb-6" />
                    )}
                    <h1 className="text-2xl font-bold text-teal-400 uppercase tracking-wide text-center mb-2">{formData.name || 'Your Name'}</h1>
                    <div className="text-xs text-slate-300 space-y-1.5 mt-4 border-t border-slate-600 pt-4">
                      {formData.email && <p>✉ {formData.email}</p>}
                      {formData.phone && <p>☎ {formData.phone}</p>}
                      {formData.address && <p>📍 {formData.address}</p>}
                    </div>
                    {formData.skills && (
                      <div className="mt-6 border-t border-slate-600 pt-4">
                        <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-3">Skills</h2>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.skills.split(',').map((skill, i) => (
                            <span key={i} className="text-xs bg-slate-700 text-teal-300 px-2 py-1 rounded">{skill.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {formData.interests && (
                      <div className="mt-6 border-t border-slate-600 pt-4">
                        <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-3">Interests</h2>
                        <p className="text-xs text-slate-300 leading-relaxed">{formData.interests}</p>
                      </div>
                    )}
                  </div>
                  <div className="w-full md:w-[65%] p-6 sm:p-8">
                    {formData.summary && (
                      <div className="mb-6">
                        <h2 className="text-base font-bold text-teal-700 uppercase tracking-wider border-b-2 border-teal-500 pb-1 mb-3">Profile</h2>
                        <p className="text-sm leading-relaxed text-gray-700">{formData.summary}</p>
                      </div>
                    )}
                    {formData.experience && (
                      <div className="mb-6">
                        <h2 className="text-base font-bold text-teal-700 uppercase tracking-wider border-b-2 border-teal-500 pb-1 mb-3">Experience</h2>
                        <div className="text-sm whitespace-pre-wrap leading-relaxed text-gray-700">{formData.experience}</div>
                      </div>
                    )}
                    {formData.education && (
                      <div className="mb-6">
                        <h2 className="text-base font-bold text-teal-700 uppercase tracking-wider border-b-2 border-teal-500 pb-1 mb-3">Education</h2>
                        <div className="text-sm whitespace-pre-wrap leading-relaxed text-gray-700">{formData.education}</div>
                      </div>
                    )}
                    <div className="absolute bottom-4 right-8 text-[10px] text-gray-300 font-medium tracking-widest uppercase">Created with HireGenie AI</div>
                  </div>
                </div>
              ) : selectedTemplate === 'creative' ? (
                /* Creative template */
                <>
                  <div className="bg-gradient-to-r from-purple-600 to-pink-500 -mx-8 sm:-mx-12 -mt-8 sm:-mt-12 px-8 sm:px-12 py-10 mb-8 text-white">
                    <div className="flex items-center space-x-6">
                      {formData.picUrl && (
                        <img src={formData.picUrl} alt="Profile" className="w-[100px] h-[100px] rounded-2xl object-cover shadow-lg border-4 border-white/30" />
                      )}
                      <div className="flex-1">
                        <h1 className="text-4xl font-black tracking-tight leading-tight">{formData.name || 'Your Name'}</h1>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm font-medium text-white/80">
                          {formData.email && <span>✉ {formData.email}</span>}
                          {formData.phone && <span>☎ {formData.phone}</span>}
                          {formData.address && <span>📍 {formData.address}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  {formData.summary && (
                    <div className="mb-6">
                      <p className="text-sm leading-relaxed text-gray-700 bg-purple-50 p-4 rounded-xl border-l-4 border-purple-500">{formData.summary}</p>
                    </div>
                  )}
                  {formData.experience && (
                    <div className="mb-6">
                      <h2 className="text-lg font-extrabold text-purple-700 uppercase tracking-wider border-b-2 border-pink-200 pb-1 mb-3">Experience</h2>
                      <div className="text-sm whitespace-pre-wrap leading-relaxed text-gray-700">{formData.experience}</div>
                    </div>
                  )}
                  {formData.education && (
                    <div className="mb-6">
                      <h2 className="text-lg font-extrabold text-purple-700 uppercase tracking-wider border-b-2 border-pink-200 pb-1 mb-3">Education</h2>
                      <div className="text-sm whitespace-pre-wrap leading-relaxed text-gray-700">{formData.education}</div>
                    </div>
                  )}
                  {formData.skills && (
                    <div className="mb-6">
                      <h2 className="text-lg font-extrabold text-purple-700 uppercase tracking-wider border-b-2 border-pink-200 pb-1 mb-3">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.split(',').map((skill, i) => (
                          <span key={i} className="text-xs font-bold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1.5 rounded-full">{skill.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {formData.interests && (
                    <div className="mb-6">
                      <h2 className="text-lg font-extrabold text-purple-700 uppercase tracking-wider border-b-2 border-pink-200 pb-1 mb-3">Interests</h2>
                      <p className="text-sm leading-relaxed text-gray-700">{formData.interests}</p>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-8 text-[10px] text-gray-300 font-medium tracking-widest uppercase">Created with HireGenie AI</div>
                </>
              ) : (
                /* Modern / Classic / Minimal templates */
                <>
                  {/* Header */}
                  <div className={`flex items-center space-x-6 pb-6 mb-6 ${
                    selectedTemplate === 'modern' ? 'border-b-4 border-blue-600' :
                    selectedTemplate === 'classic' ? 'border-b-2 border-gray-800' :
                    'border-b border-gray-200'
                  }`}>
                    {formData.picUrl && (
                      <img src={formData.picUrl} alt="Profile" className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full object-cover shadow-sm border-2 border-gray-100" />
                    )}
                    <div className="flex-1">
                      <h1 className={`text-3xl sm:text-4xl uppercase tracking-tight leading-tight ${
                        selectedTemplate === 'modern' ? 'font-black text-blue-900' :
                        selectedTemplate === 'classic' ? 'font-bold text-gray-900' :
                        'font-medium text-gray-800 tracking-widest'
                      }`}>{formData.name || 'Your Name'}</h1>
                      <div className={`flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm font-medium ${
                        selectedTemplate === 'minimal' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {formData.email && <span className="flex items-center">✉ {formData.email}</span>}
                        {formData.phone && <span className="flex items-center">☎ {formData.phone}</span>}
                        {formData.address && <span className="flex items-center">📍 {formData.address}</span>}
                      </div>
                    </div>
                  </div>
                  {formData.summary && (
                    <div className="mb-6">
                      <p className={`text-sm leading-relaxed ${
                        selectedTemplate === 'modern' ? 'text-gray-700 bg-blue-50/50 p-4 rounded-lg border-l-4 border-blue-600' :
                        selectedTemplate === 'classic' ? 'text-gray-800 italic border-l-4 border-gray-800 pl-4' :
                        'text-gray-600'
                      }`}>{formData.summary}</p>
                    </div>
                  )}
                  {[{key: 'experience', label: 'Experience / Past Work', pre: true}, {key: 'education', label: 'Education', pre: true}, {key: 'skills', label: 'Skills', pre: false}, {key: 'interests', label: 'Interests', pre: false}].map(sec => formData[sec.key] && (
                    <div key={sec.key} className="mb-6">
                      <h2 className={`text-lg uppercase pb-1 mb-3 ${
                        selectedTemplate === 'modern' ? 'font-extrabold text-blue-900 tracking-wider border-b-2 border-blue-100' :
                        selectedTemplate === 'classic' ? 'font-bold text-gray-900 tracking-widest border-b border-gray-300' :
                        'font-medium text-gray-400 tracking-widest border-b border-gray-100'
                      }`}>{sec.label}</h2>
                      {sec.pre ? (
                        <div className={`text-sm whitespace-pre-wrap leading-relaxed ${selectedTemplate === 'classic' ? 'text-gray-900' : 'text-gray-700'}`}>{formData[sec.key]}</div>
                      ) : (
                        <p className={`text-sm leading-relaxed ${selectedTemplate === 'classic' ? 'text-gray-900' : 'text-gray-700'}`}>{formData[sec.key]}</p>
                      )}
                    </div>
                  ))}
                  <div className="absolute bottom-4 right-8 text-[10px] text-gray-300 font-medium tracking-widest uppercase">Created with HireGenie AI</div>
                </>
              )}
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// Helper icon component
const FileTextIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export default Builder;
