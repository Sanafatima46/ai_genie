const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Resume = require('../models/Resume');
const LearningRoadmap = require('../models/LearningRoadmap');
const SkillAssessment = require('../models/SkillAssessment');
const Certification = require('../models/Certification');
const LearningReminder = require('../models/LearningReminder');
const SuccessStory = require('../models/SuccessStory');
const Mentor = require('../models/Mentor');
const MentorRequest = require('../models/MentorRequest');
const SalaryPrediction = require('../models/SalaryPrediction');
const AtsScore = require('../models/AtsScore');
const { chatCompletion } = require('../services/groqService');
const { sendLearningReminder } = require('../services/emailService');
const {
  buildResumeContext,
  detectMissingSkills,
  calculateAtsScore,
  generateAtsTips,
  predictSalary,
  getCoursesForSkills,
  parseJsonFromAi,
  generateFallbackRoadmap,
  normalizeReminderTime,
} = require('../utils/growthHelpers');

async function getLatestResume(userId) {
  return Resume.findOne({ user: userId }).sort({ updatedAt: -1 });
}

// ─── 1. Learning Roadmap ───

router.post('/roadmap', protect, async (req, res, next) => {
  try {
    const { topic, durationMonths = 3 } = req.body;
    if (!topic?.trim()) {
      res.status(400);
      return next(new Error('Topic is required (e.g. React, Python, DevOps)'));
    }

    const weeksCount = Math.max(4, durationMonths * 4);
    const prompt = `Create a "${topic.trim()}" learning roadmap for ${durationMonths} months (${weeksCount} weeks).
Return JSON object with keys "summary" (string) and "weeks" (array).
Each week: weekNumber, title, topics (max 3 strings), tasks (max 2 strings), resources (max 2 strings).
Keep entries short. Valid JSON only.`;

    let parsed;
    try {
      const aiText = await chatCompletion({
        messages: [
          { role: 'system', content: 'You are a career learning planner. Respond with valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        maxTokens: 4096,
        temperature: 0.4,
        jsonMode: true,
      });
      parsed = parseJsonFromAi(aiText);
      if (!parsed.weeks?.length) throw new Error('Empty weeks in AI response');
    } catch {
      parsed = generateFallbackRoadmap(topic.trim(), durationMonths);
    }
    const roadmap = await LearningRoadmap.create({
      user: req.user._id,
      topic: topic.trim(),
      durationMonths,
      summary: parsed.summary || '',
      weeks: parsed.weeks || [],
    });

    res.status(201).json(roadmap);
  } catch (error) {
    next(error);
  }
});

router.get('/roadmap', protect, async (req, res, next) => {
  try {
    const roadmaps = await LearningRoadmap.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(roadmaps);
  } catch (error) {
    next(error);
  }
});

router.get('/roadmap/:id', protect, async (req, res, next) => {
  try {
    const roadmap = await LearningRoadmap.findOne({ _id: req.params.id, user: req.user._id });
    if (!roadmap) {
      res.status(404);
      return next(new Error('Roadmap not found'));
    }
    res.json(roadmap);
  } catch (error) {
    next(error);
  }
});

// ─── 2. Free Course Suggestions ───

router.get('/courses', protect, async (req, res, next) => {
  try {
    const role = req.query.role || 'Full Stack';
    const resume = await getLatestResume(req.user._id);
    const cvText = buildResumeContext(resume);
    const missingSkills = detectMissingSkills(cvText, role);
    const courses = getCoursesForSkills(missingSkills);

    res.json({ role, missingSkills, courses, hasResume: Boolean(cvText.trim()) });
  } catch (error) {
    next(error);
  }
});

// ─── 3. Skill Assessment Quiz ───

router.post('/quiz/generate', protect, async (req, res, next) => {
  try {
    const { skill } = req.body;
    if (!skill?.trim()) {
      res.status(400);
      return next(new Error('Skill is required'));
    }

    const prompt = `Generate 5 multiple-choice quiz questions to test "${skill.trim()}" skills.
Return JSON object: { "questions": [{ "question": "...", "options": ["A","B","C","D"], "correctIndex": 0 }] }`;

    const aiText = await chatCompletion({
      messages: [
        { role: 'system', content: 'Return only valid JSON for a skill quiz.' },
        { role: 'user', content: prompt },
      ],
      maxTokens: 2000,
      jsonMode: true,
    });

    const parsed = parseJsonFromAi(aiText);
    const questions = Array.isArray(parsed) ? parsed : parsed.questions;
    if (!questions?.length) {
      res.status(502);
      return next(new Error('Could not generate quiz questions'));
    }
    const assessment = await SkillAssessment.create({
      user: req.user._id,
      skill: skill.trim(),
      questions,
      totalQuestions: questions.length,
    });

    res.status(201).json({
      _id: assessment._id,
      skill: assessment.skill,
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/quiz/:id/submit', protect, async (req, res, next) => {
  try {
    const { answers } = req.body;
    const assessment = await SkillAssessment.findOne({ _id: req.params.id, user: req.user._id });
    if (!assessment) {
      res.status(404);
      return next(new Error('Quiz not found'));
    }

    let correct = 0;
    assessment.questions.forEach((q, i) => {
      if (Number(answers?.[i]) === q.correctIndex) correct += 1;
    });

    const percentage = assessment.totalQuestions
      ? Math.round((correct / assessment.totalQuestions) * 100)
      : 0;

    const recommendations = [];
    if (percentage < 60) {
      recommendations.push(`Review ${assessment.skill} fundamentals with free YouTube tutorials`);
      recommendations.push(`Practice ${assessment.skill} with small projects daily`);
    } else if (percentage < 80) {
      recommendations.push(`Good progress — try intermediate ${assessment.skill} challenges`);
    } else {
      recommendations.push(`Excellent! Consider advanced ${assessment.skill} certifications`);
    }

    assessment.score = correct;
    assessment.percentage = percentage;
    assessment.recommendations = recommendations;
    assessment.completed = true;
    await assessment.save();

    res.json({
      score: correct,
      totalQuestions: assessment.totalQuestions,
      percentage,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/quiz/history', protect, async (req, res, next) => {
  try {
    const history = await SkillAssessment.find({
      user: req.user._id,
      completed: true,
    }).sort({ createdAt: -1 }).limit(20);
    res.json(history);
  } catch (error) {
    next(error);
  }
});

// ─── 4. Certification Tracker ───

router.get('/certifications', protect, async (req, res, next) => {
  try {
    const certs = await Certification.find({ user: req.user._id }).sort({ expiryDate: 1 });
    res.json(certs);
  } catch (error) {
    next(error);
  }
});

router.post('/certifications', protect, async (req, res, next) => {
  try {
    const { name, issuer, credentialId, issueDate, expiryDate, reminderDays, notes } = req.body;
    if (!name?.trim() || !issuer?.trim() || !issueDate) {
      res.status(400);
      return next(new Error('Name, issuer, and issue date are required'));
    }

    const cert = await Certification.create({
      user: req.user._id,
      name: name.trim(),
      issuer: issuer.trim(),
      credentialId,
      issueDate,
      expiryDate: expiryDate || null,
      reminderDays: reminderDays ?? 30,
      notes,
    });

    res.status(201).json(cert);
  } catch (error) {
    next(error);
  }
});

router.put('/certifications/:id', protect, async (req, res, next) => {
  try {
    const cert = await Certification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!cert) {
      res.status(404);
      return next(new Error('Certification not found'));
    }
    res.json(cert);
  } catch (error) {
    next(error);
  }
});

router.delete('/certifications/:id', protect, async (req, res, next) => {
  try {
    const cert = await Certification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!cert) {
      res.status(404);
      return next(new Error('Certification not found'));
    }
    res.json({ message: 'Certification deleted' });
  } catch (error) {
    next(error);
  }
});

// ─── 5. Daily Learning Reminder ───

router.get('/reminders', protect, async (req, res, next) => {
  try {
    let reminder = await LearningReminder.findOne({ user: req.user._id });
    if (!reminder) {
      reminder = await LearningReminder.create({ user: req.user._id });
    }
    const data = reminder.toObject();
    data.reminderTime = normalizeReminderTime(data.reminderTime);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.put('/reminders', protect, async (req, res, next) => {
  try {
    const { enabled, reminderTime, timezone, message } = req.body;
    const reminder = await LearningReminder.findOneAndUpdate(
      { user: req.user._id },
      {
        enabled: Boolean(enabled),
        reminderTime: normalizeReminderTime(reminderTime),
        timezone: timezone || 'UTC',
        message: message || 'Time for your daily learning session! Keep building your skills.',
      },
      { new: true, upsert: true, runValidators: true }
    );
    const data = reminder.toObject();
    data.reminderTime = normalizeReminderTime(data.reminderTime);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/reminders/test', protect, async (req, res, next) => {
  try {
    await sendLearningReminder({
      to: req.user.email,
      name: req.user.name,
      message: req.body.message || 'This is a test daily learning reminder from HireGenie AI!',
    });
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    next(error);
  }
});

// ─── 6. Success Stories ───

router.get('/stories', protect, async (req, res, next) => {
  try {
    const stories = await SuccessStory.find({ approved: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(stories);
  } catch (error) {
    next(error);
  }
});

router.get('/stories/mine', protect, async (req, res, next) => {
  try {
    const stories = await SuccessStory.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    next(error);
  }
});

router.post('/stories', protect, async (req, res, next) => {
  try {
    const { title, story, role, company } = req.body;
    if (!title?.trim() || !story?.trim()) {
      res.status(400);
      return next(new Error('Title and story are required'));
    }

    const entry = await SuccessStory.create({
      user: req.user._id,
      authorName: req.user.name,
      title: title.trim(),
      story: story.trim(),
      role,
      company,
    });

    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

// ─── 7. Mentor Connect ───

router.get('/mentors', protect, async (req, res, next) => {
  try {
    const mentors = await Mentor.find({ available: true }).sort({ name: 1 });
    res.json(mentors);
  } catch (error) {
    next(error);
  }
});

router.post('/mentors/connect', protect, async (req, res, next) => {
  try {
    const { mentorId, message } = req.body;
    if (!mentorId || !message?.trim()) {
      res.status(400);
      return next(new Error('Mentor ID and message are required'));
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      res.status(404);
      return next(new Error('Mentor not found'));
    }

    const existing = await MentorRequest.findOne({
      user: req.user._id,
      mentor: mentorId,
      status: 'pending',
    });
    if (existing) {
      res.status(400);
      return next(new Error('You already have a pending request with this mentor'));
    }

    const request = await MentorRequest.create({
      user: req.user._id,
      mentor: mentorId,
      message: message.trim(),
    });

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
});

router.get('/mentors/requests', protect, async (req, res, next) => {
  try {
    const requests = await MentorRequest.find({ user: req.user._id })
      .populate('mentor', 'name title company')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    next(error);
  }
});

// ─── 8. Salary Predictor ───

router.post('/salary/predict', protect, async (req, res, next) => {
  try {
    const { skills = [], experienceYears = 0, location = 'Remote', role = 'Software Engineer' } = req.body;
    const result = predictSalary({ skills, experienceYears, location, role });

    const prediction = await SalaryPrediction.create({
      user: req.user._id,
      skills,
      experienceYears,
      location,
      role,
      ...result,
    });

    res.status(201).json(prediction);
  } catch (error) {
    next(error);
  }
});

router.get('/salary/history', protect, async (req, res, next) => {
  try {
    const history = await SalaryPrediction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    next(error);
  }
});

// ─── 9. ATS Resume Score ───

router.post('/ats/score', protect, async (req, res, next) => {
  try {
    const { resumeText, useSavedResume } = req.body;
    let text = resumeText?.trim() || '';

    if (useSavedResume || !text) {
      const resume = await getLatestResume(req.user._id);
      text = buildResumeContext(resume);
    }

    if (!text) {
      res.status(400);
      return next(new Error('Provide resume text or save a resume first'));
    }

    const score = calculateAtsScore(text);
    const { tips, strengths, weaknesses } = generateAtsTips(text, score);

    const record = await AtsScore.create({
      user: req.user._id,
      score,
      tips,
      strengths,
      weaknesses,
      source: useSavedResume || !resumeText ? 'resume' : 'upload',
    });

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
});

router.get('/ats/history', protect, async (req, res, next) => {
  try {
    const history = await AtsScore.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
