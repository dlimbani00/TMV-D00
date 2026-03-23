import React from 'react';
import { cn } from '../../utils';
import './Toggle.css';

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /**
   * Whether the toggle is checked
   */
  checked?: boolean;
  /**
   * Change handler
   */
  onChange?: (checked: boolean) => void;
  /**
   * Accessible label
   */
  label?: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, checked = false, onChange, label, disabled = false, id, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    return (
      <label
        className={cn(
          'tv-toggle',
          checked && 'tv-toggle--checked',
          disabled && 'tv-toggle--disabled',
          className
        )}
        htmlFor={id}
      >
        <input
          ref={ref}
          type="checkbox"
          id={id}
          className="tv-toggle__input"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          role="switch"
          aria-checked={checked}
          {...props}
        />
        <span className="tv-toggle__track">
          <span className="tv-toggle__thumb" />
        </span>
        {label && <span className="tv-toggle__label">{label}</span>}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';
