import React from 'react';
import { cn } from '../../utils';
import './StatusBadge.css';

export type StatusBadgeStatus =
  | 'draft'
  | 'active'
  | 'published'
  | 'scheduled'
  | 'closed'
  | 'paused'
  | 'error';

const STATUS_LABEL_MAP: Record<StatusBadgeStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  published: 'Published',
  scheduled: 'Scheduled',
  closed: 'Closed',
  paused: 'Paused',
  error: 'Error',
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Status type
   */
  status: StatusBadgeStatus;
  /**
   * Optional label override
   */
  label?: string;
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, label, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('tv-status-badge', `tv-status-badge--${status}`, className)}
        {...props}
      >
        <span className="tv-status-badge__dot" />
        {label ?? STATUS_LABEL_MAP[status]}
      </span>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';
