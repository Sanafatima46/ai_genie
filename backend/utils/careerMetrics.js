/**
 * Career coach metrics (ported from Career-Guidance-ChatBot careerBot.py)
 */

const SKILLS_MAP = {
  Frontend: ['React', 'JavaScript', 'CSS3', 'HTML5', 'TypeScript', 'Next.js', 'Tailwind'],
  Backend: ['Python', 'Node.js', 'SQL', 'MongoDB', 'Django', 'FastAPI', 'REST API'],
  'Full Stack': ['React', 'Node.js', 'MongoDB', 'Express', 'Python', 'JavaScript', 'Git'],
  'Data Science': ['Python', 'Pandas', 'NumPy', 'SQL', 'Matplotlib', 'Scikit-learn', 'TensorFlow'],
  DevOps: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Linux', 'Terraform', 'CI/CD'],
};

function calculateAtsScore(text) {
  if (!text || !text.trim()) return 0;

  let score = 0;
  const textLower = text.toLowerCase();

  const techKeywords = ['python', 'javascript', 'react', 'sql', 'java', 'aws', 'docker', 'git', 'api', 'node'];
  const softKeywords = ['leadership', 'communication', 'team', 'problem solving', 'analytical', 'management'];
  const achievementWords = ['achieved', 'improved', 'increased', 'reduced', 'developed', 'led', 'created'];

  for (const k of techKeywords) {
    if (textLower.includes(k)) score += 3;
  }
  for (const k of softKeywords) {
    if (textLower.includes(k)) score += 2;
  }
  for (const k of achievementWords) {
    if (textLower.includes(k)) score += 2;
  }

  const words = text.split(/\s+/).filter(Boolean).length;
  if (words > 400) score += 10;
  else if (words > 200) score += 5;

  if (/\d+%/.test(text)) score += 5;
  if (/\d+\s*years?/i.test(text)) score += 3;

  return Math.min(score, 100);
}

function detectMissingSkills(cvText, role) {
  const cvLower = (cvText || '').toLowerCase();
  const skills = SKILLS_MAP[role] || SKILLS_MAP['Full Stack'];
  return skills.filter((skill) => !cvLower.includes(skill.toLowerCase()));
}

function calculateReadiness(cvText, atsScore) {
  let readiness = atsScore * 0.6;
  const words = (cvText || '').split(/\s+/).filter(Boolean).length;

  if (words > 300) readiness += 15;
  else if (words > 150) readiness += 8;

  if (/\d+%/.test(cvText || '')) readiness += 10;
  if (/\d+\s*years?/i.test(cvText || '')) readiness += 10;

  return Math.min(Math.round(readiness), 100);
}

function buildResumeContext(resume) {
  if (!resume) return '';
  const parts = [
    resume.personalInfo?.summary,
    resume.rawText,
    resume.skills?.length ? `Skills: ${resume.skills.join(', ')}` : '',
    resume.personalInfo?.name ? `Name: ${resume.personalInfo.name}` : '',
  ].filter(Boolean);
  return parts.join('\n\n');
}

module.exports = {
  SKILLS_MAP,
  calculateAtsScore,
  detectMissingSkills,
  calculateReadiness,
  buildResumeContext,
};
