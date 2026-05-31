const SAVED_JOBS_KEY = 'hiregenie_saved_jobs';
const COVER_LETTER_COUNT_KEY = 'hiregenie_cover_letters_count';
const SEARCH_HISTORY_KEY = 'hiregenie_search_history';

function readSavedList() {
  try {
    const list = JSON.parse(localStorage.getItem(SAVED_JOBS_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeSavedList(list) {
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(list));
}

export function getSavedJobsList() {
  return readSavedList();
}

export function getSavedJobsCount() {
  return readSavedList().length;
}

export function isJobSaved(jobId) {
  return readSavedList().some((j) => j.id === jobId);
}

export function saveJobToList(job) {
  const list = readSavedList();
  const idx = list.findIndex((j) => j.id === job.id);
  const entry = { ...job, savedAt: new Date().toISOString() };
  if (idx >= 0) {
    list[idx] = entry;
  } else {
    list.unshift(entry);
  }
  writeSavedList(list);
  return list.length;
}

export function removeSavedJob(jobId) {
  const list = readSavedList().filter((j) => j.id !== jobId);
  writeSavedList(list);
  return list.length;
}

export function getCoverLetterCount() {
  return parseInt(localStorage.getItem(COVER_LETTER_COUNT_KEY) || '0', 10) || 0;
}

export function incrementCoverLetterCount() {
  const next = getCoverLetterCount() + 1;
  localStorage.setItem(COVER_LETTER_COUNT_KEY, String(next));
  return next;
}

export function recordSearchHistory(keyword, count) {
  try {
    const history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
    const entry = { keyword, count, at: new Date().toISOString() };
    const next = [entry, ...history.filter((h) => h.keyword !== keyword)].slice(0, 12);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}

export function getSearchHistory() {
  try {
    return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getMatchScoreDistribution(jobs = []) {
  const buckets = [
    { label: '90–100%', min: 90, count: 0 },
    { label: '80–89%', min: 80, count: 0 },
    { label: '70–79%', min: 70, count: 0 },
    { label: 'Below 70%', min: 0, count: 0 },
  ];
  jobs.forEach((j) => {
    const s = j.skillsMatch ?? 0;
    if (s >= 90) buckets[0].count += 1;
    else if (s >= 80) buckets[1].count += 1;
    else if (s >= 70) buckets[2].count += 1;
    else buckets[3].count += 1;
  });
  const max = Math.max(...buckets.map((b) => b.count), 1);
  return buckets.map((b) => ({ ...b, heightPercent: Math.round((b.count / max) * 100) }));
}
