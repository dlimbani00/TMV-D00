import React from 'react';
import { cn } from '../../utils';
import './MetricCard.css';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Metric label (small uppercase)
   */
  label: string;
  /**
   * Metric value (displayed large)
   */
  value: string | number;
  /**
   * Trend text (e.g., "+12%")
   */
  trend?: string;
  /**
   * Trend direction
   */
  trendDirection?: 'up' | 'down';
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ className, label, value, trend, trendDirection, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('tv-metric-card', className)} {...props}>
        <span className="tv-metric-card__label">{label}</span>
        <span className="tv-metric-card__value">{value}</span>
        {trend && (
          <span
            className={cn(
              'tv-metric-card__trend',
              trendDirection && `tv-metric-card__trend--${trendDirection}`
            )}
          >
            {trendDirection === 'up' && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 2.5L10 7.5H2L6 2.5Z" fill="currentColor" />
              </svg>
            )}
            {trendDirection === 'down' && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 9.5L2 4.5H10L6 9.5Z" fill="currentColor" />
              </svg>
            )}
            {trend}
          </span>
        )}
      </div>
    );
  }
);

MetricCard.displayName = 'MetricCard';
