export default function ProgressGauge({ percent = 0, label = 'Job search progress' }) {
  const p = Math.min(100, Math.max(0, percent));
  const radius = 70;
  const circumference = Math.PI * radius;
  const offset = circumference - (p / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-28">
        <svg viewBox="0 0 180 100" className="w-full h-full overflow-visible">
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            className="text-slate-200 dark:text-slate-700"
            strokeLinecap="round"
          />
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-light-text dark:text-white">
            {p}%
          </span>
        </div>
      </div>
      <p className="text-sm font-semibold text-light-muted dark:text-slate-400 mt-2 text-center">{label}</p>
      <div className="flex flex-wrap justify-center gap-3 mt-4 text-[10px] font-bold uppercase tracking-wide">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-primary-blue" /> Active
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-primary-purple/70" /> In progress
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-600" /> Pending
        </span>
      </div>
    </div>
  );
}
