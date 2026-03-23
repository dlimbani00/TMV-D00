import React from 'react';
import { cn } from '../../utils';
import './EmptyState.css';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Icon element displayed at the top
   */
  icon?: React.ReactNode;
  /**
   * Title text
   */
  title: string;
  /**
   * Description message
   */
  message?: string;
  /**
   * Call-to-action button
   */
  action?: EmptyStateAction;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, message, action, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('tv-empty-state', className)} {...props}>
        {icon && <div className="tv-empty-state__icon">{icon}</div>}
        <h3 className="tv-empty-state__title">{title}</h3>
        {message && <p className="tv-empty-state__message">{message}</p>}
        {action && (
          <button
            type="button"
            className="tv-empty-state__action"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
