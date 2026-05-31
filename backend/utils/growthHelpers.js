const { detectMissingSkills, buildResumeContext, calculateAtsScore } = require('./careerMetrics');

const COURSE_CATALOG = {
  React: [
    { title: 'React Full Course', platform: 'YouTube', url: 'https://www.youtube.com/results?search_query=react+full+course+free', free: true },
    { title: 'React - The Complete Guide', platform: 'Udemy', url: 'https://www.udemy.com/topic/react/', free: false },
  ],
  JavaScript: [
    { title: 'JavaScript Algorithms', platform: 'YouTube', url: 'https://www.youtube.com/results?search_query=javascript+full+course', free: true },
    { title: 'Programming with JavaScript', platform: 'Coursera', url: 'https://www.coursera.org/specializations/javascript', free: true },
  ],
  Python: [
    { title: 'Python for Everybody', platform: 'Coursera', url: 'https://www.coursera.org/specializations/python', free: true },
    { title: 'Python Full Course', platform: 'YouTube', url: 'https://www.youtube.com/results?search_query=python+full+course+free', free: true },
  ],
  'Node.js': [
    { title: 'Node.js Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/results?search_query=nodejs+tutorial+full+course', free: true },
  ],
  MongoDB: [
    { title: 'MongoDB University', platform: 'Coursera', url: 'https://www.mongodb.com/docs/university/', free: true },
  ],
  SQL: [
    { title: 'SQL for Data Science', platform: 'Coursera', url: 'https://www.coursera.org/learn/sql-for-data-science', free: true },
  ],
  Docker: [
    { title: 'Docker Tutorial', platform: 'YouTube', url: 'https://www.youtube.com/results?search_query=docker+tutorial+full+course', free: true },
  ],
  AWS: [
    { title: 'AWS Cloud Practitioner', platform: 'Coursera', url: 'https://www.coursera.org/specializations/aws-cloud-practitioner', free: true },
  ],
  TypeScript: [
    { title: 'TypeScript Course', platform: 'YouTube', url: 'https://www.youtube.com/results?search_query=typescript+full+course', free: true },
  ],
  Git: [
    { title: 'Git & GitHub Crash Course', platform: 'YouTube', url: 'https://www.youtube.com/results?search_query=git+github+tutorial', free: true },
  ],
};

function getCoursesForSkills(missingSkills) {
  const courses = [];
  const seen = new Set();

  for (const skill of missingSkills) {
    const matches = COURSE_CATALOG[skill] || [
      {
        title: `Learn ${skill}`,
        platform: 'YouTube',
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial free')}`,
        free: true,
      },
    ];

    for (const course of matches) {
      const key = course.url;
      if (!seen.has(key)) {
        seen.add(key);
        courses.push({ ...course, skill });
      }
    }
  }

  return courses;
}

function generateAtsTips(text, score) {
  const tips = [];
  const textLower = (text || '').toLowerCase();
  const words = (text || '').split(/\s+/).filter(Boolean).length;

  if (words < 200) tips.push('Expand your resume to at least 200–400 words with measurable achievements.');
  if (!/\d+%/.test(text || '')) tips.push('Add quantifiable results (percentages, revenue, users) to bullet points.');
  if (!/\d+\s*years?/i.test(text || '')) tips.push('Include years of experience clearly in your summary or experience section.');
  if (!textLower.includes('skills')) tips.push('Add a dedicated Skills section with keywords matching job descriptions.');
  if (score < 50) tips.push('Use action verbs: developed, led, improved, reduced, implemented.');
  if (score < 70) tips.push('Tailor keywords to your target role (React, Python, AWS, etc.).');
  if (tips.length === 0) tips.push('Strong ATS profile — keep updating for each job application.');

  const strengths = [];
  const weaknesses = [];

  if (words > 300) strengths.push('Good resume length for ATS parsing');
  else weaknesses.push('Resume may be too short for ATS');

  if (/\d+%/.test(text || '')) strengths.push('Contains measurable metrics');
  else weaknesses.push('Missing quantifiable achievements');

  const techCount = ['python', 'javascript', 'react', 'sql', 'aws'].filter((k) => textLower.includes(k)).length;
  if (techCount >= 3) strengths.push('Strong technical keyword coverage');
  else weaknesses.push('Add more role-relevant technical keywords');

  return { tips, strengths, weaknesses };
}

function predictSalary({ skills = [], experienceYears = 0, location = 'Remote', role = 'Software Engineer' }) {
  const baseByRole = {
    'Software Engineer': 75000,
    'Full Stack Developer': 85000,
    'Frontend Developer': 78000,
    'Backend Developer': 82000,
    'Data Scientist': 95000,
    'DevOps Engineer': 90000,
    'Product Manager': 100000,
  };

  const locationMultiplier = {
    'San Francisco': 1.35,
    'New York': 1.3,
    'London': 1.15,
    'Remote': 1.0,
    'Pakistan': 0.45,
    'India': 0.5,
    'UAE': 0.85,
  };

  let base = baseByRole[role] || 70000;
  const locKey = Object.keys(locationMultiplier).find((k) =>
    location.toLowerCase().includes(k.toLowerCase())
  );
  const locMult = locKey ? locationMultiplier[locKey] : 1.0;

  const skillBonus = Math.min(skills.length * 2500, 15000);
  const expBonus = Math.min(Number(experienceYears) || 0, 15) * 4000;

  const mid = Math.round((base + skillBonus + expBonus) * locMult);
  const minSalary = Math.round(mid * 0.85);
  const maxSalary = Math.round(mid * 1.2);

  const explanation = `Estimated for ${role} in ${location} with ${skills.length} listed skills and ${experienceYears || 0} years experience. Adjust for company size and negotiation.`;

  return { minSalary, maxSalary, currency: 'USD', explanation };
}

function parseJsonFromAi(text) {
  if (!text?.trim()) throw new Error('Empty AI response');

  let cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!match) throw new Error('AI did not return valid JSON');

  try {
    return JSON.parse(match[0]);
  } catch {
    throw new Error('AI returned malformed JSON — using fallback plan');
  }
}

function generateFallbackRoadmap(topic, durationMonths = 3) {
  const totalWeeks = Math.max(4, durationMonths * 4);
  const phases = ['Fundamentals', 'Core concepts', 'Hands-on practice', 'Advanced topics', 'Projects', 'Portfolio'];
  const weeks = [];

  for (let i = 1; i <= totalWeeks; i += 1) {
    const phase = phases[Math.min(Math.floor((i - 1) / 2), phases.length - 1)];
    weeks.push({
      weekNumber: i,
      title: `${phase} — Part ${Math.ceil(i / 2)}`,
      topics: [`${topic} ${phase.toLowerCase()}`, 'Best practices'],
      tasks: [`Study ${topic} for 5–8 hours`, `Complete 1 ${topic} exercise or mini project`],
      resources: ['YouTube free tutorials', 'Official docs', 'freeCodeCamp'],
    });
  }

  return {
    summary: `A ${durationMonths}-month structured plan to learn ${topic}. Each week builds on the previous one with theory, practice, and projects.`,
    weeks,
  };
}

function normalizeReminderTime(timeStr) {
  if (!timeStr) return '09:00';
  const parts = String(timeStr).split(':');
  const h = String(Number(parts[0]) || 9).padStart(2, '0');
  const m = String(Number(parts[1]) || 0).padStart(2, '0');
  return `${h}:${m}`;
}

module.exports = {
  COURSE_CATALOG,
  getCoursesForSkills,
  detectMissingSkills,
  buildResumeContext,
  calculateAtsScore,
  generateAtsTips,
  predictSalary,
  parseJsonFromAi,
  generateFallbackRoadmap,
  normalizeReminderTime,
};
