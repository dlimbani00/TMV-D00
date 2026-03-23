import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to merge class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Generate consistent component class names
 */
export function createClassName(component: string, variant?: string, size?: string) {
  const base = `tv-${component}`;
  const classes = [base];
  
  if (variant) classes.push(`${base}--${variant}`);
  if (size) classes.push(`${base}--${size}`);
  
  return classes.join(' ');
}
