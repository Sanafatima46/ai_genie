const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Resume = require('../models/Resume');
const { chatCompletion } = require('../services/groqService');
const {
  calculateAtsScore,
  detectMissingSkills,
  calculateReadiness,
  buildResumeContext,
  SKILLS_MAP,
} = require('../utils/careerMetrics');

const MODE_PROMPTS = {
  'Career Coach': 'Focus on career guidance and path planning.',
  'Resume Review': 'Focus on resume optimization and ATS improvements.',
  'Interview Prep': 'Focus on interview questions, STAR method, and preparation.',
  'Salary Negotiation': 'Focus on salary research and negotiation tactics.',
  'Skill Development': 'Focus on learning roadmaps and skill building.',
};

const SYSTEM_BASE = `You are HireGenie AI — a professional career coach.

Your expertise:
- Career guidance and path planning
- Resume optimization and ATS tips
- Interview preparation
- Salary negotiation
- Skill development

Response style:
- Professional but friendly
- Use emojis occasionally
- Provide actionable advice
- Include specific examples when helpful

Always be encouraging and practical.`;

async function getLatestResume(userId) {
  return Resume.findOne({ user: userId }).sort({ updatedAt: -1 });
}

// @route   GET /api/career/metrics
router.get('/metrics', protect, async (req, res, next) => {
  try {
    const role = req.query.role || 'Full Stack';
    const resume = await getLatestResume(req.user._id);
    const cvText = buildResumeContext(resume);

    const atsScore = calculateAtsScore(cvText);
    const readiness = calculateReadiness(cvText, atsScore);
    const missingSkills = detectMissingSkills(cvText, role);
    const wordCount = cvText.split(/\s+/).filter(Boolean).length;

    res.json({
      hasResume: Boolean(cvText.trim()),
      resumeTitle: resume?.title || null,
      wordCount,
      atsScore,
      readiness,
      missingSkills,
      targetRoles: Object.keys(SKILLS_MAP),
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/career/chat
router.post('/chat', protect, async (req, res, next) => {
  try {
    const { message, history = [], mode = 'Career Coach' } = req.body;

    if (!message?.trim()) {
      res.status(400);
      return next(new Error('Message is required'));
    }

    const resume = await getLatestResume(req.user._id);
    const cvContext = buildResumeContext(resume);

    const modeHint = MODE_PROMPTS[mode] || MODE_PROMPTS['Career Coach'];
    const systemInstruction = `${SYSTEM_BASE}\n\nCurrent mode: ${mode}. ${modeHint}`;

    let userPrompt = message.trim();
    if (cvContext) {
      userPrompt = `[RESUME CONTEXT]\n${cvContext.slice(0, 1500)}\n\n[QUESTION]\n${message.trim()}\n\nProvide personalized advice based on the resume above.`;
    }

    const recentHistory = history
      .filter((m) => m.role && m.content && (m.role === 'user' || m.role === 'assistant'))
      .slice(-6);

    const messages = [
      { role: 'system', content: systemInstruction },
      ...recentHistory.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userPrompt },
    ];

    const reply = await chatCompletion({ messages });

    res.json({ reply, mode });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/career/cover-letter
router.post('/cover-letter', protect, async (req, res, next) => {
  try {
    const { company, jobTitle, tone = 'professional', highlights = '' } = req.body;

    if (!company?.trim() || !jobTitle?.trim()) {
      res.status(400);
      return next(new Error('Company name and job title are required.'));
    }

    const resume = await getLatestResume(req.user._id);
    const cvContext = buildResumeContext(resume);

    const letter = await chatCompletion({
      messages: [
        {
          role: 'system',
          content:
            'You are an expert career writer. Write polished cover letters. Return only the letter text, no placeholders like [Your Name].',
        },
        {
          role: 'user',
          content: `Write a ${tone} cover letter for "${jobTitle.trim()}" at "${company.trim()}".
${highlights ? `Candidate highlights: ${highlights}` : ''}
${cvContext ? `\nResume context:\n${cvContext.slice(0, 2000)}` : ''}

Rules:
- 3-4 short paragraphs, ready to send
- Strong opening, measurable achievements if context allows
- Professional closing`,
        },
      ],
      maxTokens: 1200,
      temperature: 0.6,
    });

    res.json({ letter: letter.trim(), company: company.trim(), jobTitle: jobTitle.trim() });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
