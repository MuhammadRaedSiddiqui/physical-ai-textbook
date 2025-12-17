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
    { role: 'bot', text: 'SYSTEM_INITIALIZED // Ask me anything about Physical AI & Robotics.' }
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
      setMessages(prev => [...prev, { role: 'bot', text: '⚠️ CONNECTION_FAILED // Backend server unreachable.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* 1. Toggle Button */}
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <span className="toggle-icon">◈</span>
          <span className="toggle-text">AI_TUTOR</span>
          <span className="toggle-status"></span>
        </button>
      )}

      {/* 2. Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* HUD Corner Decorations */}
          <div className="corner corner-tl"></div>
          <div className="corner corner-tr"></div>
          <div className="corner corner-bl"></div>
          <div className="corner corner-br"></div>
          
          {/* Scanline Effect */}
          <div className="scanline"></div>

          <div className="chatbot-header">
            <div className="header-left">
              <span className="status-dot"></span>
              <span className="header-title">AI_TEACHING_ASSISTANT</span>
            </div>
            <div className="header-right">
              <span className="header-version">v2.0</span>
              <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={clsx('message', msg.role)}>
                <div className="message-prefix">{msg.role === 'user' ? '> USER' : '> SYS'}</div>
                <div className="message-content">{msg.text}</div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="message-sources">
                    <small>// SOURCES_REFERENCED:</small>
                    <ul>
                      {msg.sources.map((src, i) => (
                        <li key={i}>→ {src.split('/').pop()}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-prefix">&gt; SYS</div>
                <div className="message-content pulsing">PROCESSING_QUERY<span className="loading-dots"></span></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <div className="input-prefix">&gt;</div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Enter query..."
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={isLoading}>
              {isLoading ? '...' : 'EXEC'}
            </button>
          </div>
          
          <div className="chatbot-footer">
            <span>GEMINI_POWERED</span>
            <span>SESSION: {sessionId.slice(0, 8)}</span>
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
          font-family: 'Rajdhani', sans-serif;
        }
        
        /* Toggle Button */
        .chatbot-toggle {
          background: rgba(5, 5, 5, 0.95);
          color: #00f3ff;
          border: 1px solid #00f3ff;
          padding: 14px 24px;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(0, 243, 255, 0.3), inset 0 0 20px rgba(0, 243, 255, 0.05);
          transition: all 0.3s ease;
          font-family: 'Rajdhani', sans-serif;
          display: flex;
          align-items: center;
          gap: 10px;
          backdrop-filter: blur(10px);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 12px;
        }
        .toggle-icon {
          font-size: 16px;
          animation: iconPulse 2s infinite;
        }
        .toggle-status {
          width: 8px;
          height: 8px;
          background: #00ff88;
          border-radius: 50%;
          box-shadow: 0 0 10px #00ff88;
          animation: statusBlink 1.5s infinite;
        }
        @keyframes iconPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes statusBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .chatbot-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(0, 243, 255, 0.5), inset 0 0 30px rgba(0, 243, 255, 0.1);
          border-color: #00f3ff;
        }
        
        /* Chat Window */
        .chatbot-window {
          width: 400px;
          height: 550px;
          background: rgba(5, 5, 5, 0.98);
          border: 1px solid #00f3ff;
          border-radius: 8px;
          box-shadow: 0 0 40px rgba(0, 243, 255, 0.2), inset 0 0 60px rgba(0, 243, 255, 0.03);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          backdrop-filter: blur(15px);
          position: relative;
        }
        
        /* HUD Corners */
        .corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: #00f3ff;
          border-style: solid;
          z-index: 10;
          pointer-events: none;
        }
        .corner-tl { top: 4px; left: 4px; border-width: 2px 0 0 2px; }
        .corner-tr { top: 4px; right: 4px; border-width: 2px 2px 0 0; }
        .corner-bl { bottom: 4px; left: 4px; border-width: 0 0 2px 2px; }
        .corner-br { bottom: 4px; right: 4px; border-width: 0 2px 2px 0; }
        
        /* Scanline Effect */
        .scanline {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.5), transparent);
          animation: scan 3s linear infinite;
          pointer-events: none;
          z-index: 5;
        }
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        
        /* Header */
        .chatbot-header {
          background: linear-gradient(180deg, rgba(0, 243, 255, 0.15) 0%, rgba(0, 243, 255, 0.05) 100%);
          color: #00f3ff;
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0, 243, 255, 0.4);
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          background: #00ff88;
          border-radius: 50%;
          box-shadow: 0 0 8px #00ff88;
          animation: statusBlink 1.5s infinite;
        }
        .header-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 12px;
          letter-spacing: 1px;
          font-weight: bold;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .header-version {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          opacity: 0.6;
        }
        .close-btn {
          background: none;
          border: 1px solid rgba(0, 243, 255, 0.3);
          color: #00f3ff;
          font-size: 14px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 2px;
          transition: all 0.2s;
        }
        .close-btn:hover {
          background: rgba(255, 0, 0, 0.2);
          border-color: #ff4444;
          color: #ff4444;
        }
        
        /* Messages */
        .chatbot-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 243, 255, 0.01) 2px,
            rgba(0, 243, 255, 0.01) 4px
          );
        }
        .chatbot-messages::-webkit-scrollbar {
          width: 4px;
        }
        .chatbot-messages::-webkit-scrollbar-track {
          background: rgba(0, 243, 255, 0.05);
        }
        .chatbot-messages::-webkit-scrollbar-thumb {
          background: #00f3ff;
          border-radius: 2px;
        }
        
        .message {
          max-width: 90%;
          padding: 10px 14px;
          border-radius: 4px;
          font-size: 14px;
          line-height: 1.6;
          position: relative;
        }
        .message-prefix {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          margin-bottom: 4px;
          opacity: 0.7;
        }
        .message.user {
          align-self: flex-end;
          background: rgba(0, 243, 255, 0.1);
          color: #00f3ff;
          border: 1px solid rgba(0, 243, 255, 0.4);
          border-left: 3px solid #00f3ff;
        }
        .message.user .message-prefix {
          color: #00f3ff;
          text-align: right;
        }
        .message.bot {
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.03);
          color: #d0d0d0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-left: 3px solid #00ff88;
        }
        .message.bot .message-prefix {
          color: #00ff88;
        }
        .message-sources {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px dashed rgba(0, 243, 255, 0.2);
          font-size: 11px;
          color: #808080;
          font-family: 'JetBrains Mono', monospace;
        }
        .message-sources ul {
          margin: 6px 0 0 0;
          padding: 0;
          list-style: none;
        }
        .message-sources li {
          color: #00f3ff;
          opacity: 0.8;
          padding: 2px 0;
        }
        
        /* Loading */
        .pulsing {
          animation: pulse 1s infinite;
        }
        .loading-dots::after {
          content: '';
          animation: dots 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes dots {
          0% { content: ''; }
          25% { content: '.'; }
          50% { content: '..'; }
          75% { content: '...'; }
        }
        
        /* Input Area */
        .chatbot-input-area {
          padding: 12px 16px;
          border-top: 1px solid rgba(0, 243, 255, 0.3);
          display: flex;
          gap: 8px;
          background: rgba(0, 0, 0, 0.4);
          align-items: center;
        }
        .input-prefix {
          color: #00f3ff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 16px;
        }
        .chatbot-input-area input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid rgba(0, 243, 255, 0.2);
          border-radius: 2px;
          background: rgba(5, 5, 5, 0.9);
          color: #fff;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px;
          transition: all 0.3s;
        }
        .chatbot-input-area input:focus {
          outline: none;
          border-color: #00f3ff;
          box-shadow: 0 0 15px rgba(0, 243, 255, 0.15);
        }
        .chatbot-input-area input::placeholder {
          color: #555;
          font-style: italic;
        }
        .chatbot-input-area button {
          background: rgba(0, 243, 255, 0.1);
          color: #00f3ff;
          border: 1px solid #00f3ff;
          padding: 10px 18px;
          border-radius: 2px;
          cursor: pointer;
          font-size: 12px;
          font-family: 'Orbitron', sans-serif;
          font-weight: bold;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .chatbot-input-area button:hover:not(:disabled) {
          background: #00f3ff;
          color: #000;
          box-shadow: 0 0 20px rgba(0, 243, 255, 0.5);
        }
        .chatbot-input-area button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          border-color: #333;
          color: #333;
        }
        
        /* Footer */
        .chatbot-footer {
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.5);
          border-top: 1px solid rgba(0, 243, 255, 0.1);
          display: flex;
          justify-content: space-between;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: #00f3ff;
          opacity: 0.5;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}