/**
 * Authentication Modal Component.
 * Displays sign in/sign up forms in a modal overlay.
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import styles from './AuthForms.module.css';

type AuthMode = 'signin' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSuccess = () => {
    onClose();
  };

  return createPortal(
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div style={{ position: 'relative', margin: 'auto', width: '100%', maxWidth: '640px' }}>
        <button
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Close"
        >
          X
        </button>

        {mode === 'signin' ? (
          <SignInForm
            onSuccess={handleSuccess}
            onSwitchToSignUp={() => setMode('signup')}
          />
        ) : (
          <SignUpForm
            onSuccess={handleSuccess}
            onSwitchToSignIn={() => setMode('signin')}
          />
        )}
      </div>
    </div>,
    document.body
  );
}

export default AuthModal;
