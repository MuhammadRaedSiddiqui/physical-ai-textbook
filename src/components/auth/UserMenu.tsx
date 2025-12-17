/**
 * User Menu Component.
 * Displays user info and provides access to profile/signout.
 */

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from './AuthContext';
import styles from './AuthForms.module.css';

interface UserMenuProps {
  onOpenProfile?: () => void;
}

export function UserMenu({ onOpenProfile }: UserMenuProps) {
  const { user, signout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(`.${styles.dropdown}`)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update position on scroll/resize
  useEffect(() => {
    if (isOpen) {
      const updatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setPosition({
            top: rect.bottom + 5,
            right: window.innerWidth - rect.right,
          });
        }
      };
      
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email.slice(0, 2).toUpperCase();

  const handleSignout = async () => {
    setIsOpen(false);
    await signout();
  };

  return (
    <div className={styles.userMenu}>
      <button
        ref={buttonRef}
        className={styles.userButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={styles.userAvatar}>{initials}</span>
        <span>{user.name || user.email.split('@')[0]}</span>
      </button>

      {isOpen && createPortal(
        <div 
          className={styles.dropdown}
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            right: `${position.right}px`,
            left: 'auto',
            zIndex: 9999,
          }}
        >
          <div className={styles.profileSection}>
            <div>{user.name || 'User'}</div>
            <div className={styles.profileEmail}>{user.email}</div>
          </div>

          {onOpenProfile && (
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setIsOpen(false);
                onOpenProfile();
              }}
            >
              VIEW_PROFILE
            </button>
          )}

          <div className={styles.dropdownDivider} />

          <button
            className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
            onClick={handleSignout}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} style={{ borderColor: 'rgba(255, 107, 107, 0.3)', borderTopColor: '#ff6b6b' }} />
                SIGNING_OUT...
              </>
            ) : (
              'SIGN_OUT'
            )}
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}

export default UserMenu;
