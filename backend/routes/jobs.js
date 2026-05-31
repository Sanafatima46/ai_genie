const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Application = require('../models/Application');
const { searchGoogleJobs } = require('../services/jobSearchService');

// @route   POST /api/jobs/search
// @desc    Live job search via SerpAPI Google Jobs
router.post('/search', protect, async (req, res, next) => {
  try {
    const { keyword } = req.body;
    if (!keyword?.trim()) {
      res.status(400);
      return next(new Error('Please enter a job title or skill to search.'));
    }
    const Resume = require('../models/Resume');
    const resume = await Resume.findOne({ user: req.user._id }).sort({ updatedAt: -1 });
    const results = await searchGoogleJobs(keyword, resume);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/jobs/recommendations
// @desc    Get simulated job recommendations
router.get('/recommendations', protect, async (req, res, next) => {
  try {
    // Simulated Jobs
    const mockJobs = [
      { _id: '1', title: 'Frontend Developer', company: 'TechCorp', location: 'Remote', description: 'React and Vite experience required.', type: 'Full-time', skillsMatch: 95, tags: ['React', 'TypeScript', 'Tailwind'] },
      { _id: '2', title: 'Backend Engineer', company: 'DataSystems', location: 'New York', description: 'NodeJS and MongoDB expertise needed.', type: 'Full-time', skillsMatch: 88, tags: ['Node.js', 'PostgreSQL', 'AWS'] },
      { _id: '3', title: 'Full Stack Developer', company: 'WebSolutions', location: 'London', description: 'MERN stack developer.', type: 'Contract', skillsMatch: 92, tags: ['Next.js', 'MongoDB', 'GraphQL'] }
    ];
    
    res.json(mockJobs);
  } catch(error) {
    next(error);
  }
});

// @route   POST /api/jobs/apply
// @desc    Simulate applying to a job
router.post('/apply/:jobId', protect, async (req, res, next) => {
  const { jobId } = req.params;
  try {
    res.status(200).json({ 
      message: 'Job applied successfully (simulated auto-apply)', 
      application: { jobId, status: 'Applied', appliedAt: new Date() }
    });
  } catch (error) {
    next(error);
  }
});

function buildWeeklyAnalytics(applications, resumeScore = 0) {
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const applied = [0, 0, 0, 0, 0, 0, 0];
  const activity = [0, 0, 0, 0, 0, 0, 0];

  applications.forEach((app) => {
    const day = new Date(app.createdAt).getDay();
    applied[day] += 1;
    activity[day] += 1;
  });

  // Light activity signal from profile when DB is empty (keeps chart readable)
  if (applications.length === 0 && resumeScore > 0) {
    const seed = Math.min(5, Math.floor(resumeScore / 20));
    for (let i = 0; i < 7; i++) activity[i] = (i % 3) + seed;
  }

  const max = Math.max(...activity, 1);
  return labels.map((day, i) => ({
    day,
    applications: applied[i],
    activity: activity[i],
    heightPercent: Math.round((activity[i] / max) * 100),
  }));
}

// @route   GET /api/jobs/dashboard
// @desc    Get dashboard stats + analytics from real DB data
router.get('/dashboard', protect, async (req, res, next) => {
  try {
    const Resume = require('../models/Resume');

    const [totalApplied, interviewsScheduled, rejected, resumeCount, resumes, applications] =
      await Promise.all([
        Application.countDocuments({ user: req.user._id }),
        Application.countDocuments({ user: req.user._id, status: 'Interviewing' }),
        Application.countDocuments({ user: req.user._id, status: 'Rejected' }),
        Resume.countDocuments({ user: req.user._id }),
        Resume.find({ user: req.user._id }).sort({ updatedAt: -1 }).limit(3),
        Application.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20),
      ]);

    const latestResume = resumes[0];
    let resumeScore = 0;
    if (latestResume) {
      resumeScore = Math.min(
        70 +
          (latestResume.skills?.length || 0) * 3 +
          (latestResume.rawText?.length > 150 ? 15 : 5),
        98
      );
    }

    const profileStrength = (() => {
      let s = 15;
      if (latestResume?.personalInfo?.name) s += 15;
      if (latestResume?.personalInfo?.summary) s += 20;
      if (latestResume?.skills?.length) s += 20;
      if (latestResume?.rawText?.length > 50) s += 30;
      return Math.min(s, 100);
    })();

    const pipeline = {
      applied: totalApplied,
      interviewing: interviewsScheduled,
      rejected,
      pending: Math.max(0, totalApplied - interviewsScheduled - rejected),
    };

    const jobSearchProgress = Math.min(
      Math.round(profileStrength * 0.4 + resumeScore * 0.35 + Math.min(totalApplied * 8, 25)),
      100
    );

    res.json({
      totalApplied,
      savedJobs: 0,
      interviewsScheduled,
      rejected,
      resumeCount,
      resumeScore,
      profileStrength,
      jobSearchProgress,
      weeklyAnalytics: buildWeeklyAnalytics(applications, resumeScore),
      pipeline,
      recentApplications: applications.slice(0, 5).map((a) => ({
        id: a._id,
        status: a.status,
        matchPercentage: a.matchPercentage,
        date: a.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
