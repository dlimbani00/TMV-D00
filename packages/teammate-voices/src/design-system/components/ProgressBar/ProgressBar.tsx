import React from 'react';
import { cn } from '../../utils';
import './ProgressBar.css';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Progress value (0-100)
   */
  value: number;
  /**
   * Optional label displayed above the bar
   */
  label?: string;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, label, ...props }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
      <div ref={ref} className={cn('tv-progress-bar', className)} {...props}>
        {label && (
          <div className="tv-progress-bar__header">
            <span className="tv-progress-bar__label">{label}</span>
            <span className="tv-progress-bar__value">{Math.round(clampedValue)}%</span>
          </div>
        )}
        <div
          className="tv-progress-bar__track"
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          <div
            className="tv-progress-bar__fill"
            style={{ width: `${clampedValue}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
