import React from 'react';
import { cn } from '../../utils';
import './Textarea.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Label text
   */
  label?: string;
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Helper text below the textarea
   */
  helperText?: string;
  /**
   * Full width
   */
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error = false,
      helperText,
      fullWidth = false,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const helperId = helperText && id ? `${id}-helper` : undefined;

    return (
      <div className={cn('tv-textarea-wrapper', fullWidth && 'tv-textarea-wrapper--full-width')}>
        {label && (
          <label htmlFor={id} className="tv-textarea__label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'tv-textarea',
            error && 'tv-textarea--error',
            disabled && 'tv-textarea--disabled',
            className
          )}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
          {...props}
        />
        {helperText && (
          <p
            id={helperId}
            className={cn('tv-textarea__helper-text', error && 'tv-textarea__helper-text--error')}
          >
            {error && (
              <span className="tv-textarea__error-inline" aria-hidden="true">
                !
              </span>
            )}
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
