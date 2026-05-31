const Mentor = require('../models/Mentor');

const DEFAULT_MENTORS = [
  {
    name: 'Sarah Ahmed',
    title: 'Senior Full Stack Engineer',
    company: 'TechCorp',
    expertise: ['React', 'Node.js', 'System Design'],
    bio: '10+ years building scalable web apps. Passionate about mentoring junior developers.',
    yearsExperience: 12,
    available: true,
  },
  {
    name: 'James Wilson',
    title: 'Data Science Lead',
    company: 'DataFlow Inc',
    expertise: ['Python', 'Machine Learning', 'SQL'],
    bio: 'PhD in ML. Helps career switchers break into data science roles.',
    yearsExperience: 8,
    available: true,
  },
  {
    name: 'Priya Sharma',
    title: 'DevOps Architect',
    company: 'CloudScale',
    expertise: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    bio: 'Cloud infrastructure expert. Open to guiding DevOps career paths.',
    yearsExperience: 10,
    available: true,
  },
  {
    name: 'Michael Chen',
    title: 'Product Manager',
    company: 'StartupHub',
    expertise: ['Product Strategy', 'Agile', 'User Research'],
    bio: 'Former engineer turned PM. Mentors on product and tech leadership.',
    yearsExperience: 7,
    available: true,
  },
];

async function seedMentors() {
  const count = await Mentor.countDocuments();
  if (count === 0) {
    await Mentor.insertMany(DEFAULT_MENTORS);
    console.log('Default mentors seeded');
  }
}

module.exports = { seedMentors, DEFAULT_MENTORS };
