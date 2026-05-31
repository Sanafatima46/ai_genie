/**
 * Google Jobs search via SerpAPI (ported from AI-Job-Finder-master/app.py)
 */

function normalizeJob(job, index) {
  const extensions = job.detected_extensions || {};
  const salary = job.salary?.formatted || job.extensions?.find?.((e) => e?.includes?.('$')) || 'Not specified';

  return {
    id: job.job_id || `job-${index}`,
    title: job.title || 'Position not specified',
    company: job.company_name || 'Not specified',
    description: job.description || 'No description available',
    location: job.location || 'Location not specified',
    postedAt: extensions.posted_at || 'Recently',
    salary,
    via: job.via || 'Unknown',
    applyLink: job.apply_link || job.share_link || null,
    shareLink: job.share_link || null,
    thumbnail: job.thumbnail || null,
    matchRank: index + 1,
  };
}

async function searchGoogleJobs(keyword, resume = null) {
  const apiKey = (process.env.SERPAPI_API_KEY || '').trim();
  if (!apiKey) {
    const err = new Error(
      'SerpAPI key is not configured. Set SERPAPI_API_KEY in backend/.env, then restart the backend.'
    );
    err.statusCode = 503;
    throw err;
  }

  const params = new URLSearchParams({
    engine: 'google_jobs',
    q: keyword.trim(),
    hl: 'en',
    api_key: apiKey,
  });

  const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    const err = new Error(data.error || 'Job search failed');
    err.statusCode = response.status;
    throw err;
  }

  if (data.error) {
    const err = new Error(data.error);
    err.statusCode = 400;
    throw err;
  }

  let jobs = (data.jobs_results || []).slice(0, 10).map(normalizeJob);

  if (resume) {
    const { scoreJobsForResume } = require('../utils/jobMatchScore');
    jobs = scoreJobsForResume(jobs, resume);
  }

  return {
    keyword: keyword.trim(),
    count: jobs.length,
    searchedAt: new Date().toISOString(),
    jobs,
    hasResumeProfile: Boolean(resume),
  };
}

module.exports = { searchGoogleJobs, normalizeJob };
