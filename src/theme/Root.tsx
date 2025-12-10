import React, { ReactNode } from 'react';
import {HeroUIProvider} from "@heroui/react";
import Chatbot from '../components/ChatBot';

export default function Root({children}: {children: ReactNode}) {
  return (
    <HeroUIProvider>
      <div className="dark text-foreground bg-background">
        {children}
        <Chatbot />
      </div>
    </HeroUIProvider>
  );
}