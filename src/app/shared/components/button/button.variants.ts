import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center font-bold transition-[color,background-color,box-shadow,translate] focus-visible:outline-2 focus-visible:outline-lime-500 disabled:cursor-not-allowed disabled:opacity-50 active:not-disabled:translate-y-px',
  {
    variants: {
      variant: {
        primary: 'bg-lime-500 text-slate-950 shadow-md hover:bg-lime-400',
        secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
        danger: 'bg-rose-500 text-white hover:bg-rose-600',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
      },
      size: {
        sm: 'rounded-lg px-3 py-2 text-xs',
        md: 'rounded-xl px-4 py-2.5 text-sm',
        icon: 'flex h-8 w-8 items-center justify-center rounded-full p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;
