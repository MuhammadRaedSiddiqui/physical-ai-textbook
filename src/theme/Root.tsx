import React, { ReactNode } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Chatbot from '../components/ChatBot';
import ClickSpark from '../components/react-bits/Crosshair';
import { AuthProvider } from '../components/auth';
import { ChatProvider } from '../context/ChatContext';


// The Root component wraps the entire Docusaurus application
// Includes global HUD elements: Crosshair cursor (FR-006)
// Provides authentication context to the entire app
export default function Root({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ChatProvider>
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

        {/* Single Chatbot instance - renders in fixed or embedded mode based on context */}
        <BrowserOnly>
          {() => <Chatbot />}
        </BrowserOnly>
      </ChatProvider>
    </AuthProvider>
  );
}
