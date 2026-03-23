import React from 'react';
import { cn } from '../../utils';
import './Spinner.css';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Spinner size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Accessible label
   */
  label?: string;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', label = 'Loading', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('tv-spinner', `tv-spinner--${size}`, className)}
        role="status"
        aria-label={label}
        {...props}
      >
        <svg className="tv-spinner__svg" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="tv-spinner__circle"
          />
        </svg>
        <span className="tv-spinner__sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
