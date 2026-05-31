const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Resume = require('../models/Resume');
const { chatCompletion } = require('../services/groqService');
const { parseJsonFromAi } = require('../utils/growthHelpers');

// @route   POST /api/resume
// @desc    Create or update a resume from the Builder
router.post('/', protect, async (req, res, next) => {
  try {
    const { name, email, phone, address, summary, experience, education, skills, interests, picUrl, title } = req.body;

    const resumeData = {
      user: req.user._id,
      title: title || (name ? `${name}'s Resume` : 'My Resume'),
      personalInfo: { name, email, phone, address, summary },
      skills: skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      rawText: [summary, experience, education].filter(Boolean).join('\n\n'),
      builderData: req.body,
    };

    const existing = await Resume.findOne({ user: req.user._id }).sort({ updatedAt: -1 });

    let resume;
    if (existing) {
      resume = await Resume.findByIdAndUpdate(existing._id, resumeData, { new: true });
    } else {
      resume = await Resume.create(resumeData);
    }

    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/resume
router.get('/', protect, async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id });
    res.json(resumes);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/resume/parse
// @desc    Auto-enhance full resume data using Groq AI
router.post('/parse', protect, async (req, res, next) => {
  try {
    const formData = req.body;

    const prompt = `You are an expert ATS-friendly resume writer. I will provide JSON resume data.
Enhance summary, experience, education, skills, and interests to be professional and impactful.
Use strong action verbs. Remove first-person pronouns.
Do not change name, email, phone, address, or picUrl.
Return ONLY valid JSON matching the input structure.`;

    const aiText = await chatCompletion({
      messages: [
        { role: 'system', content: 'Return only valid JSON. No markdown.' },
        { role: 'user', content: `${prompt}\n\nInput:\n${JSON.stringify(formData, null, 2)}` },
      ],
      maxTokens: 2000,
      temperature: 0.5,
      jsonMode: true,
    });

    const enhancedData = parseJsonFromAi(aiText);

    res.json({ message: 'Resume enhanced successfully', data: enhancedData });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/resume/enhance
// @desc    Enhance resume section text using Groq AI
router.post('/enhance', protect, async (req, res, next) => {
  try {
    const { section, text } = req.body;

    if (!text) {
      res.status(400);
      return next(new Error('Please provide text to enhance'));
    }

    const enhancedText = await chatCompletion({
      messages: [
        {
          role: 'system',
          content:
            'You are an expert ATS-friendly resume writer. Return only the enhanced text with no quotes or filler.',
        },
        {
          role: 'user',
          content: `Rewrite this resume "${section}" section professionally. Use strong action verbs. No first-person pronouns.\n\n${text}`,
        },
      ],
      maxTokens: 800,
      temperature: 0.5,
    });

    res.json({ enhancedText: enhancedText.trim() });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
