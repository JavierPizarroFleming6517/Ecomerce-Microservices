export const statusCardStyles = {
  root: 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950',
  header: 'flex items-start justify-between gap-4',
  heading: 'text-sm font-medium text-slate-600 dark:text-slate-300',
  value: 'mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white',
  description: 'mt-1 text-sm text-slate-500 dark:text-slate-400',
  badge: 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
  dot: 'h-2 w-2 rounded-full',
  variants: {
    operational: {
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      dot: 'bg-emerald-500',
    },
    degraded: {
      badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      dot: 'bg-amber-500',
    },
    down: {
      badge: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
      dot: 'bg-red-500',
    },
    unknown: {
      badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
      dot: 'bg-slate-400',
    },
  },
} as const;
