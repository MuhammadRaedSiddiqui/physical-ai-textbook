/**
 * AuthNavbarItem Component.
 * A wrapper for AuthButton specifically designed for Docusaurus navbar integration.
 * Handles the navbar item props interface expected by Docusaurus.
 */

import React from 'react';
import { AuthButton } from './AuthButton';

// Props interface matching Docusaurus NavbarItem requirements
interface AuthNavbarItemProps {
  mobile?: boolean;
  className?: string;
}

export default function AuthNavbarItem({ mobile, className }: AuthNavbarItemProps) {
  // On mobile navbar, we might want different styling
  if (mobile) {
    return (
      <div className="menu__list-item">
        <AuthButton className={className} />
      </div>
    );
  }

  return <AuthButton className={className} />;
}
