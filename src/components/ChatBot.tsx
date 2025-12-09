import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';

// Simple types for our messages
type Message = {
  role: 'user' | 'bot';
  text: string;
  sources?: string[];
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! I am your AI Teaching Assistant. Ask me anything about the textbook!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Check if session ID exists in local storage
    let storedSession = localStorage.getItem('chat_session_id');
    if (!storedSession) {
      storedSession = crypto.randomUUID(); // Browser native UUID or use 'uuid' package
      localStorage.setItem('chat_session_id', storedSession);
    }
    setSessionId(storedSession);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // 🚀 Connects to your local Python/FastAPI backend
      const response = await fetch('https://physical-ai-textbook.onrender.com/chat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            question: userMessage,
            session_id: sessionId // <--- SEND THIS
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: data.answer,
        sources: data.sources 
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', text: '⚠️ Sorry, I cannot connect to the brain. Is the Python server running?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* 1. Toggle Button */}
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          🤖 Ask AI
        </button>
      )}

      {/* 2. Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>AI Tutor (Gemini Powered)</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={clsx('message', msg.role)}>
                <div className="message-content">{msg.text}</div>
                {/* Show sources if available */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="message-sources">
                    <small>Sources:</small>
                    <ul>
                      {msg.sources.map((src, i) => (
                        <li key={i}>{src.split('/').pop()}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            {isLoading && <div className="message bot pulsing">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={isLoading}>Send</button>
          </div>
        </div>
      )}

      {/* 3. Embedded Styles */}
      <style>{`
        .chatbot-wrapper {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          font-family: var(--ifm-font-family-base);
        }
        .chatbot-toggle {
          background: var(--ifm-color-primary);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: transform 0.2s;
        }
        .chatbot-toggle:hover {
          transform: scale(1.05);
        }
        .chatbot-window {
          width: 360px;
          height: 550px;
          background: var(--ifm-background-color);
          border: 1px solid var(--ifm-color-emphasis-200);
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .chatbot-header {
          background: var(--ifm-color-primary);
          color: white;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
        }
        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          line-height: 1;
        }
        .chatbot-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: var(--ifm-background-surface-color);
        }
        .message {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
        }
        .message.user {
          align-self: flex-end;
          background: var(--ifm-color-primary);
          color: white;
          border-bottom-right-radius: 2px;
        }
        .message.bot {
          align-self: flex-start;
          background: var(--ifm-color-emphasis-100);
          color: var(--ifm-font-color-base);
          border-bottom-left-radius: 2px;
        }
        .message-sources {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(0,0,0,0.1);
          font-size: 11px;
        }
        .message-sources ul {
          margin: 0;
          padding-left: 16px;
        }
        .chatbot-input-area {
          padding: 12px;
          border-top: 1px solid var(--ifm-color-emphasis-200);
          display: flex;
          gap: 8px;
          background: var(--ifm-background-color);
        }
        .chatbot-input-area input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid var(--ifm-color-emphasis-300);
          border-radius: 20px;
          background: var(--ifm-background-color);
          color: var(--ifm-font-color-base);
        }
        .chatbot-input-area button {
          background: var(--ifm-color-primary);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 13px;
        }
        .chatbot-input-area button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}