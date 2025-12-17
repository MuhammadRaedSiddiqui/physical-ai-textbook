/**
 * Authentication Button Component.
 * Shows sign in button when not authenticated, user menu when authenticated.
 */

import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { UserMenu } from './UserMenu';
import { AuthModal } from './AuthModal';
import styles from './AuthForms.module.css';

interface AuthButtonProps {
  className?: string;
}

export function AuthButton({ className }: AuthButtonProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>('signin');

  if (isLoading) {
    return (
      <button className={`${styles.authButton} ${className || ''}`} disabled>
        LOADING...
      </button>
    );
  }

  if (isAuthenticated) {
    return <UserMenu />;
  }

  return (
    <>
      <button
        className={`${styles.authButton} ${className || ''}`}
        onClick={() => {
          setModalMode('signin');
          setIsModalOpen(true);
        }}
      >
        SIGN_IN
      </button>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialMode={modalMode}
      />
    </>
  );
}

export default AuthButton;
