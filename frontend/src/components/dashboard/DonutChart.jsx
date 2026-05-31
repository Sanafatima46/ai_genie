import { motion } from 'framer-motion';

export default function DonutChart({ segments, centerLabel, centerValue }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  let offset = 0;
  const r = 52;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="14" className="text-slate-200 dark:text-slate-700" />
          {segments.map((seg, i) => {
            const dash = (seg.value / total) * c;
            const el = (
              <motion.circle
                key={seg.label}
                cx="60"
                cy="60"
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="14"
                strokeDasharray={`${dash} ${c}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${c}` }}
                animate={{ strokeDasharray: `${dash} ${c}` }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-light-text dark:text-white">{centerValue}</span>
          <span className="text-[10px] font-bold text-light-muted dark:text-slate-500 uppercase">{centerLabel}</span>
        </div>
      </div>
      <ul className="space-y-2 w-full">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center justify-between text-sm gap-2">
            <span className="flex items-center gap-2 min-w-0">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: seg.color }} />
              <span className="text-light-text dark:text-slate-300 truncate">{seg.label}</span>
            </span>
            <span className="font-bold text-light-text dark:text-white shrink-0">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
