import React from 'react';
import { cn } from '../../utils';
import './Avatar.css';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Image source URL
   */
  src?: string;
  /**
   * Alt text for the image
   */
  alt?: string;
  /**
   * Full name (used for initials fallback)
   */
  name?: string;
  /**
   * Avatar size
   */
  size?: 'sm' | 'md' | 'lg';
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);

    const showImage = src && !imgError;
    const initials = name ? getInitials(name) : '?';

    return (
      <div
        ref={ref}
        className={cn('tv-avatar', `tv-avatar--${size}`, className)}
        role="img"
        aria-label={alt || name || 'Avatar'}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="tv-avatar__image"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="tv-avatar__initials">{initials}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
