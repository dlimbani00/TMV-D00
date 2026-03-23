import React from 'react';
import { cn } from '../../utils';
import './Input.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Helper text
   */
  helperText?: string;
  /**
   * Label
   */
  label?: string;
  /**
   * Icon before input
   */
  iconBefore?: React.ReactNode;
  /**
   * Icon after input
   */
  iconAfter?: React.ReactNode;
  /**
   * Full width
   */
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = 'md',
      error = false,
      helperText,
      label,
      iconBefore,
      iconAfter,
      fullWidth = false,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);
    const helperId = helperText && id ? `${id}-helper` : undefined;

    React.useEffect(() => {
      setHasValue(!!props.value || !!props.defaultValue);
    }, [props.value, props.defaultValue]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className={cn('tv-input-wrapper', fullWidth && 'tv-input-wrapper--full-width')}>
        <div
          className={cn(
            'tv-input-container',
            `tv-input-container--${size}`,
            error && 'tv-input-container--error',
            disabled && 'tv-input-container--disabled',
            (isFocused || hasValue) && 'tv-input-container--active',
            label && 'tv-input-container--has-label'
          )}
        >
          {iconBefore && <span className="tv-input__icon-before">{iconBefore}</span>}
          <div className="tv-input__field">
            <input
              ref={ref}
              id={id}
              className={cn('tv-input', className)}
              disabled={disabled}
              aria-invalid={error || undefined}
              aria-describedby={helperId}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              {...props}
            />
            {label && (
              <label htmlFor={id} className="tv-input__label">
                {label}
              </label>
            )}
          </div>
          {iconAfter && <span className="tv-input__icon-after">{iconAfter}</span>}
        </div>
        {helperText && (
          <p
            id={helperId}
            className={cn('tv-input__helper-text', error && 'tv-input__helper-text--error')}
          >
            {error && (
              <span className="tv-input__error-inline" aria-hidden="true">
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

Input.displayName = 'Input';
