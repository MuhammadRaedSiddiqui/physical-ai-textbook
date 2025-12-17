/**
 * Custom Navbar Item Component Types for Docusaurus.
 * Extends the default navbar item types with our custom AuthButton.
 */

import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import AuthNavbarItem from '@site/src/components/auth/AuthNavbarItem';

export default {
  ...ComponentTypes,
  'custom-authButton': AuthNavbarItem,
};
