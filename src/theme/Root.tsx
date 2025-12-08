import React, { ReactNode } from 'react';
import Chatbot from '../components/ChatBot'; // Check that this path matches your file structure

// The Root component wraps the entire Docusaurus application
export default function Root({children}: {children: ReactNode}) {
  return (
    <>
      {children}
      <Chatbot />
    </>
  );
}