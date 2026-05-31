import { motion } from 'framer-motion';
import { Bookmark, Trash2, ExternalLink, MapPin, Building2 } from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge';

export default function SavedJobsList({ jobs, onRemove, emptyAction }) {
  if (!jobs.length) {
    return (
      <div className="text-center py-12 px-4 border border-dashed border-light-border dark:border-slate-700 rounded-2xl">
        <Bookmark className="mx-auto text-light-muted dark:text-slate-500 mb-3" size={32} />
        <p className="font-bold text-light-text dark:text-white mb-1">No saved jobs yet</p>
        <p className="text-sm text-light-muted dark:text-slate-400 mb-4">Save roles from AI Job Finder to track them here.</p>
        {emptyAction}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {jobs.map((job, i) => (
        <motion.li
          key={job.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="p-4 sm:p-5 rounded-2xl border border-light-border dark:border-slate-800 bg-white dark:bg-darktheme-card hover:border-primary-blue/30 transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-light-text dark:text-white text-base sm:text-lg leading-snug break-words">
                {job.title}
              </h3>
              <p className="flex items-center gap-2 text-sm text-light-muted dark:text-slate-400 mt-1 flex-wrap">
                <Building2 size={14} className="shrink-0" />
                <span>{job.company}</span>
                <span className="hidden sm:inline">·</span>
                <MapPin size={14} className="shrink-0 sm:hidden" />
                <span className="w-full sm:w-auto flex items-center gap-1 sm:inline-flex">
                  <MapPin size={14} className="hidden sm:block shrink-0" />
                  {job.location}
                </span>
              </p>
            </div>
            {job.skillsMatch != null && <MatchScoreBadge score={job.skillsMatch} />}
          </div>
          <p className="text-xs sm:text-sm text-light-muted dark:text-slate-500 line-clamp-2 mb-3">{job.description}</p>
          <div className="flex flex-wrap items-center gap-2">
            {(job.applyLink || job.shareLink) && (
              <a
                href={job.applyLink || job.shareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-blue/10 text-primary-blue text-xs font-bold"
              >
                Apply <ExternalLink size={12} />
              </a>
            )}
            <button
              type="button"
              onClick={() => onRemove(job.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-red-600 bg-red-50 dark:bg-red-500/10 text-xs font-bold"
            >
              <Trash2 size={12} /> Remove
            </button>
            {job.savedAt && (
              <span className="text-[10px] text-light-muted dark:text-slate-500 ml-auto">
                Saved {new Date(job.savedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
