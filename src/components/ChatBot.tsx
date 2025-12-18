import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatContext } from '../context/ChatContext';

// Simple types for our messages
type Message = {
  role: 'user' | 'bot';
  text: string;
  sources?: string[];
};

export default function Chatbot() {
  const { isEmbedded, embeddedContainerRef } = useChatContext();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'SYSTEM_INITIALIZED // Ask me anything about Physical AI & Robotics.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState('');
  const prevEmbeddedRef = useRef(isEmbedded);

  // Close chatbot when transitioning between embedded and floating modes
  useEffect(() => {
    // Detect mode change (embedded <-> floating)
    if (prevEmbeddedRef.current !== isEmbedded) {
      setIsOpen(false); // Close the chat window during transition
      prevEmbeddedRef.current = isEmbedded;
    }
  }, [isEmbedded]);

  useEffect(() => {
    // Check if session ID exists in local storage
    let storedSession = localStorage.getItem('chat_session_id');
    if (!storedSession) {
      storedSession = crypto.randomUUID();
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
      const response = await fetch('https://physical-ai-textbook.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage,
          session_id: sessionId
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
      setMessages(prev => [...prev, { role: 'bot', text: '⚠ CONNECTION_FAILED // Backend server unreachable.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 20,
      }
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      transition: { duration: 0.15 }
    }
  };

  const windowVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 25,
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      }
    }
  };

  // Chat window content - shared between both modes
  const chatWindowContent = (
    <motion.div
      className={clsx('chatbot-window', { 'embedded': isEmbedded })}
      variants={windowVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      layoutId="chatbot-window"
    >
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
          {!isEmbedded && (
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          )}
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            className={clsx('message', msg.role)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
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
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            className="message bot"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="message-prefix">&gt; SYS</div>
            <div className="message-content pulsing">PROCESSING_QUERY<span className="loading-dots"></span></div>
          </motion.div>
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
        <span>GROQ_POWERED</span>
        <span>SESSION: {sessionId.slice(0, 8)}</span>
      </div>
    </motion.div>
  );

  // Render embedded version via portal if container exists and is embedded
  const renderEmbedded = isEmbedded && embeddedContainerRef.current;

  return (
    <>
      {/* Fixed floating wrapper - only when not embedded */}
      {!isEmbedded && (
        <div className="chatbot-wrapper chatbot-fixed">
          {/* Toggle Button */}
          <AnimatePresence mode="wait">
            {!isOpen && (
              <motion.button
                className="chatbot-toggle"
                onClick={() => setIsOpen(true)}
                aria-label="Open AI Tutor"
                variants={toggleVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <span className="toggle-status"></span>
                <svg className="toggle-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.55 3.35 17L2 22L7 20.65C8.45 21.5 10.15 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                  <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                  <circle cx="16" cy="12" r="1.5" fill="currentColor"/>
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Chat Window - Fixed Mode */}
          <AnimatePresence mode="wait">
            {isOpen && chatWindowContent}
          </AnimatePresence>
        </div>
      )}

      {/* Embedded version via portal */}
      {renderEmbedded && createPortal(
        <div className="chatbot-wrapper chatbot-embedded">
          {/* Toggle Button for embedded mode */}
          <AnimatePresence mode="wait">
            {!isOpen && (
              <motion.div
                className="embedded-toggle-wrapper"
                variants={toggleVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.button
                  className="chatbot-toggle chatbot-toggle-embedded"
                  onClick={() => setIsOpen(true)}
                  aria-label="Open AI Tutor"
                >
                  <span className="toggle-status"></span>
                  <svg className="toggle-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.55 3.35 17L2 22L7 20.65C8.45 21.5 10.15 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                    <circle cx="16" cy="12" r="1.5" fill="currentColor"/>
                  </svg>
                </motion.button>
                <span className="embedded-toggle-label">Click to chat with AI Tutor</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Window for embedded mode */}
          <AnimatePresence mode="wait">
            {isOpen && chatWindowContent}
          </AnimatePresence>
        </div>,
        embeddedContainerRef.current
      )}

      {/* Styles */}
      <style>{`
        .chatbot-wrapper {
          font-family: 'Rajdhani', sans-serif;
        }

        .chatbot-fixed {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
        }

        .chatbot-embedded {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .embedded-toggle-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .chatbot-toggle-embedded {
          width: 80px;
          height: 80px;
        }

        .chatbot-toggle-embedded .toggle-icon {
          width: 36px;
          height: 36px;
        }

        .chatbot-toggle-embedded .toggle-status {
          width: 14px;
          height: 14px;
          top: 4px;
          right: 4px;
        }

        .embedded-toggle-label {
          font-family: 'Rajdhani', sans-serif;
          font-size: 16px;
          color: #00f3ff;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 2px;
          animation: labelPulse 2s ease-in-out infinite;
        }

        @keyframes labelPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.5; }
        }

        /* Toggle Button - Circle */
        .chatbot-toggle {
          width: 60px;
          height: 60px;
          background: rgba(5, 5, 5, 0.95);
          color: #00f3ff;
          border: 2px solid #00f3ff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow:
            0 0 25px rgba(0, 243, 255, 0.4),
            0 0 50px rgba(0, 243, 255, 0.2),
            inset 0 0 20px rgba(0, 243, 255, 0.1);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: visible;
        }
        .toggle-icon {
          width: 28px;
          height: 28px;
          animation: iconFloat 3s ease-in-out infinite;
        }
        .toggle-status {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #00ff88;
          border-radius: 50%;
          box-shadow: 0 0 12px #00ff88, 0 0 20px rgba(0, 255, 136, 0.5);
          animation: statusBlink 1.5s infinite;
          border: 2px solid rgba(5, 5, 5, 0.95);
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes statusBlink {
          0%, 100% { opacity: 1; box-shadow: 0 0 12px #00ff88, 0 0 20px rgba(0, 255, 136, 0.5); }
          50% { opacity: 0.6; box-shadow: 0 0 8px #00ff88, 0 0 12px rgba(0, 255, 136, 0.3); }
        }
        .chatbot-toggle:hover {
          transform: scale(1.1);
          box-shadow:
            0 0 35px rgba(0, 243, 255, 0.6),
            0 0 70px rgba(0, 243, 255, 0.3),
            inset 0 0 30px rgba(0, 243, 255, 0.15);
          border-color: #00f3ff;
        }
        .chatbot-toggle:hover .toggle-icon {
          animation: none;
          transform: scale(1.1);
        }
        .chatbot-toggle:active {
          transform: scale(0.95);
        }

        /* Pulse ring animation */
        .chatbot-toggle::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid #00f3ff;
          animation: pulseRing 2s ease-out infinite;
          pointer-events: none;
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        /* Chat Window */
        .chatbot-window {
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

        .chatbot-fixed .chatbot-window {
          width: 400px;
          height: 550px;
        }

        .chatbot-window.embedded {
          width: 100%;
          height: 100%;
          min-height: 500px;
          border-radius: 16px;
          box-shadow:
            0 0 60px rgba(0, 243, 255, 0.3),
            0 0 120px rgba(0, 243, 255, 0.15),
            inset 0 0 60px rgba(0, 243, 255, 0.05);
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

        .chatbot-window.embedded .corner {
          width: 30px;
          height: 30px;
        }

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
    </>
  );
}
