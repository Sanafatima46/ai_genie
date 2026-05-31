import { Zap } from 'lucide-react';

export default function MatchScoreBadge({ score, size = 'md' }) {
  const s = score ?? 0;
  const variant =
    s >= 90
      ? 'from-emerald-500 to-green-600'
      : s >= 80
        ? 'from-primary-blue to-primary-purple'
        : s >= 70
          ? 'from-amber-500 to-orange-500'
          : 'from-slate-500 to-slate-600';

  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold text-white bg-gradient-to-r shadow-sm ${variant} ${sizeClass}`}
    >
      <Zap size={size === 'sm' ? 10 : 12} className={s >= 90 ? 'animate-pulse' : ''} />
      {s}% Match
    </span>
  );
}
