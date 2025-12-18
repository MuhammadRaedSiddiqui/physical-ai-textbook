import React, { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';

interface ChatContextType {
  // Embedded state - controlled by IntersectionObserver
  isEmbedded: boolean;
  setIsEmbedded: (value: boolean) => void;

  // Reference to the embedded container for portal rendering
  embeddedContainerRef: React.RefObject<HTMLDivElement>;

  // Register the embedded container
  registerEmbeddedContainer: (ref: React.RefObject<HTMLDivElement>) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [embeddedContainerRef, setEmbeddedContainerRef] = useState<React.RefObject<HTMLDivElement>>({ current: null });

  const registerEmbeddedContainer = useCallback((ref: React.RefObject<HTMLDivElement>) => {
    setEmbeddedContainerRef(ref);
  }, []);

  return (
    <ChatContext.Provider value={{
      isEmbedded,
      setIsEmbedded,
      embeddedContainerRef,
      registerEmbeddedContainer
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
