import { cva } from 'class-variance-authority';

export const coinVariants = cva(
  'relative inline-flex items-center justify-center rounded-xl border font-extrabold transition-[color,background-color,border-color,scale] select-none',
  {
    variants: {
      size: {
        sm: 'h-12 w-12 text-xs',
        md: 'h-14 w-14 text-sm',
      },
      tier: {
        high: 'border-amber-300 bg-amber-100 text-amber-900',
        low: 'border-slate-200 bg-slate-100 text-slate-800',
      },
      state: {
        interactive:
          'cursor-pointer hover:border-slate-300 hover:bg-slate-200 active:scale-95',
        static: 'pointer-events-none cursor-default',
        disabled: 'pointer-events-none cursor-not-allowed opacity-40',
      },
    },
    defaultVariants: {
      size: 'md',
      tier: 'low',
      state: 'interactive',
    },
  },
);
