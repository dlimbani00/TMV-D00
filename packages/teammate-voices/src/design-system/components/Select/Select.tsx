import React from 'react';
import { cn } from '../../utils';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * Label text
   */
  label?: string;
  /**
   * Options to display
   */
  options: SelectOption[];
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Helper text below the select
   */
  helperText?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Full width
   */
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      options,
      error = false,
      helperText,
      placeholder,
      fullWidth = false,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const helperId = helperText && id ? `${id}-helper` : undefined;

    return (
      <div className={cn('tv-select-wrapper', fullWidth && 'tv-select-wrapper--full-width')}>
        {label && (
          <label htmlFor={id} className="tv-select__label">
            {label}
          </label>
        )}
        <div
          className={cn(
            'tv-select-container',
            error && 'tv-select-container--error',
            disabled && 'tv-select-container--disabled'
          )}
        >
          <select
            ref={ref}
            id={id}
            className={cn('tv-select', className)}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={helperId}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="tv-select__chevron" aria-hidden="true">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        {helperText && (
          <p
            id={helperId}
            className={cn('tv-select__helper-text', error && 'tv-select__helper-text--error')}
          >
            {error && (
              <span className="tv-select__error-inline" aria-hidden="true">
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

Select.displayName = 'Select';
