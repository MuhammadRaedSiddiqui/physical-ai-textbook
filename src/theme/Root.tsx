import React, { ReactNode } from 'react';
import Chatbot from '../components/ChatBot';
import ClickSpark from '../components/react-bits/Crosshair';


// The Root component wraps the entire Docusaurus application
// Includes global HUD elements: Crosshair cursor (FR-006)
export default function Root({ children }: { children: ReactNode }) {
  return (
    <>
      <ClickSpark
        sparkColor='#fff'
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        {/* Your content here */}
      </ClickSpark>


      {children}
      <Chatbot />
    </>
  );
}