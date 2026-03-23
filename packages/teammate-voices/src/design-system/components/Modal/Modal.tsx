import React from 'react';
import { cn } from '../../utils';
import './Modal.css';

export interface ModalProps extends React.HTMLAttributes<HTMLDialogElement> {
  /**
   * Whether the modal is open
   */
  open?: boolean;
  /**
   * Callback when the modal requests to close
   */
  onClose?: () => void;
  /**
   * Modal size
   */
  size?: 'sm' | 'md' | 'lg';
}

export const Modal = React.forwardRef<HTMLDialogElement, ModalProps>(
  ({ className, open = false, onClose, size = 'md', children, ...props }, ref) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const combinedRef = React.useCallback(
      (node: HTMLDialogElement | null) => {
        (dialogRef as React.MutableRefObject<HTMLDialogElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDialogElement | null>).current = node;
        }
      },
      [ref]
    );

    React.useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (open) {
        if (!dialog.open) {
          dialog.showModal();
        }
      } else {
        if (dialog.open) {
          dialog.close();
        }
      }
    }, [open]);

    const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
      e.preventDefault();
      onClose?.();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        onClose?.();
      }
    };

    return (
      <dialog
        ref={combinedRef}
        className={cn('tv-modal', `tv-modal--${size}`, className)}
        onCancel={handleCancel}
        onClick={handleBackdropClick}
        {...props}
      >
        <div className="tv-modal__content">{children}</div>
      </dialog>
    );
  }
);

Modal.displayName = 'Modal';

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('tv-modal__header', className)} {...props}>
        {children}
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('tv-modal__body', className)} {...props}>
        {children}
      </div>
    );
  }
);

ModalBody.displayName = 'ModalBody';

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('tv-modal__footer', className)} {...props}>
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';
