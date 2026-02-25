import React from 'react';
import { cn } from '@/utils';
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
      <div className={cn('arya-input-wrapper', fullWidth && 'arya-input-wrapper--full-width')}>
        <div
          className={cn(
            'arya-input-container',
            `arya-input-container--${size}`,
            error && 'arya-input-container--error',
            disabled && 'arya-input-container--disabled',
            (isFocused || hasValue) && 'arya-input-container--active'
          )}
        >
          {iconBefore && <span className="arya-input__icon-before">{iconBefore}</span>}
          <div className="arya-input__field">
            <input
              ref={ref}
              id={id}
              className={cn('arya-input', className)}
              disabled={disabled}
              aria-invalid={error || undefined}
              aria-describedby={helperId}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              {...props}
            />
            {label && (
              <label htmlFor={id} className="arya-input__label">
                {label}
              </label>
            )}
          </div>
          {iconAfter && <span className="arya-input__icon-after">{iconAfter}</span>}
        </div>
        {helperText && (
          <p
            id={helperId}
            className={cn('arya-input__helper-text', error && 'arya-input__helper-text--error')}
          >
            {error && (
              <span className="arya-input__error-inline" aria-hidden="true">
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
