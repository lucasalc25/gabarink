import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-12 w-full rounded-xl border border-border bg-surface-darker px-4 py-2 text-sm text-text-white transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-error/50 focus-visible:ring-error',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
