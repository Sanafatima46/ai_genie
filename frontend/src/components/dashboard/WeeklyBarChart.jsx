import { motion } from 'framer-motion';

export default function WeeklyBarChart({ data = [] }) {
  const bars = data.length
    ? data
    : ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => ({ day, heightPercent: 20, activity: 0 }));

  return (
    <div className="flex items-end justify-between gap-2 sm:gap-3 h-44 pt-4">
      {bars.map((bar, i) => (
        <div key={`${bar.day}-${i}`} className="flex-1 flex flex-col items-center gap-2 min-w-0">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(bar.heightPercent || 12, 12)}%` }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full max-w-[2.5rem] mx-auto rounded-t-lg min-h-[1.5rem] ${
              i % 3 === 0
                ? 'bg-gradient-to-t from-primary-blue to-primary-purple'
                : i % 3 === 1
                  ? 'bg-gradient-to-t from-primary-purple/80 to-accent-purple'
                  : 'bg-slate-200 dark:bg-slate-700 bg-[repeating-linear-gradient(135deg,transparent,transparent_4px,rgba(148,163,184,0.35)_4px,rgba(148,163,184,0.35)_8px)]'
            }`}
            title={`${bar.activity ?? 0} activities`}
          />
          <span className="text-[10px] sm:text-xs font-bold text-light-muted dark:text-slate-500">
            {bar.day}
          </span>
        </div>
      ))}
    </div>
  );
}
