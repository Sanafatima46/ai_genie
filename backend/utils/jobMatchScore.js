/**
 * Resume-to-job match score (skill overlap heuristic)
 */

function collectSkillsFromResume(resume) {
  if (!resume) return [];

  const fromArray = (resume.skills || []).map((s) => String(s).trim().toLowerCase());
  const fromBuilder =
    resume.builderData?.skills
      ?.split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean) || [];

  const text = [
    resume.rawText,
    resume.personalInfo?.summary,
    resume.builderData?.experience,
    resume.builderData?.skills,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const common = [
    'javascript', 'typescript', 'react', 'node', 'python', 'java', 'sql', 'mongodb',
    'aws', 'docker', 'kubernetes', 'git', 'api', 'rest', 'graphql', 'css', 'html',
    'machine learning', 'data', 'devops', 'agile', 'scrum', 'leadership', 'communication',
    'express', 'vue', 'angular', 'next.js', 'tailwind', 'figma', 'ui', 'ux',
  ];

  const detected = common.filter((kw) => text.includes(kw));
  return [...new Set([...fromArray, ...fromBuilder, ...detected])];
}

function calculateJobMatchScore(job, resume) {
  const skills = collectSkillsFromResume(resume);
  const blob = `${job.title || ''} ${job.description || ''} ${job.company || ''}`.toLowerCase();

  if (!skills.length) {
    return 62 + (job.matchRank ? Math.max(0, 8 - job.matchRank) : 0);
  }

  let matched = 0;
  for (const skill of skills) {
    if (skill.length >= 2 && blob.includes(skill)) matched += 1;
  }

  const ratio = matched / Math.max(skills.length, 1);
  let score = Math.round(48 + ratio * 48);

  const titleWords = (job.title || '').toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  const titleHits = titleWords.filter((w) => skills.some((s) => s.includes(w) || w.includes(s))).length;
  score += Math.min(titleHits * 4, 12);

  if (blob.includes('senior') && skills.some((s) => s.includes('lead') || s.includes('senior'))) score += 3;
  if (blob.includes('remote')) score += 2;

  return Math.min(98, Math.max(45, score));
}

function scoreJobsForResume(jobs, resume) {
  const scored = jobs.map((job) => ({
    ...job,
    skillsMatch: calculateJobMatchScore(job, resume),
  }));
  scored.sort((a, b) => b.skillsMatch - a.skillsMatch);
  return scored.map((job, i) => ({ ...job, matchRank: i + 1 }));
}

module.exports = {
  collectSkillsFromResume,
  calculateJobMatchScore,
  scoreJobsForResume,
};
