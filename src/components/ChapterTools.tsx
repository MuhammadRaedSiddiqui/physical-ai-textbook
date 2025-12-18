import React, { useState } from 'react';

const API_BASE_URL = 'https://physical-ai-textbook.onrender.com';

interface ChapterToolsProps {
  title: string;
  description?: string;
}

export default function ChapterTools({ title, description }: ChapterToolsProps) {
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [personalizedContent, setPersonalizedContent] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'translate' | 'personalize' | null>(null);
  const [userContext, setUserContext] = useState<string>('');
  const [showContextInput, setShowContextInput] = useState(false);

  // Content to process - use description if available, otherwise use title
  const contentToProcess = description || title;

  const handleTranslate = async () => {
    setError(null);
    setIsTranslating(true);
    setActiveTab('translate');
    setPersonalizedContent(null);
    setShowContextInput(false);

    try {
      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: contentToProcess,
          target_language: 'Urdu'
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setTranslatedContent(data.translated);
    } catch (err) {
      console.error('Translation error:', err);
      setError('Failed to translate content. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePersonalizeClick = () => {
    setShowContextInput(true);
    setActiveTab('personalize');
    setTranslatedContent(null);
  };

  const handlePersonalize = async () => {
    if (!userContext.trim()) {
      setError('Please enter your background to personalize content.');
      return;
    }

    setError(null);
    setIsPersonalizing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/personalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: contentToProcess,
          user_context: userContext
        }),
      });

      if (!response.ok) {
        throw new Error('Personalization failed');
      }

      const data = await response.json();
      setPersonalizedContent(data.personalized);
      setShowContextInput(false);
    } catch (err) {
      console.error('Personalization error:', err);
      setError('Failed to personalize content. Please try again.');
    } finally {
      setIsPersonalizing(false);
    }
  };

  const clearResults = () => {
    setTranslatedContent(null);
    setPersonalizedContent(null);
    setActiveTab(null);
    setError(null);
    setShowContextInput(false);
    setUserContext('');
  };

  return (
    <div className="chapter-tools-wrapper">
      <div className="chapter-tools-container">
        {/* Header */}
        <div className="tools-header">
          <span className="tools-icon">◈</span>
          <span className="tools-label">CONTENT_TOOLS</span>
          <span className="tools-status"></span>
        </div>

        {/* Buttons */}
        <div className="tools-buttons">
          <button
            onClick={handlePersonalizeClick}
            disabled={isPersonalizing || isTranslating}
            className={`tool-btn personalize-btn ${activeTab === 'personalize' ? 'active' : ''}`}
          >
            {isPersonalizing ? (
              <>
                <span className="btn-icon">⟳</span>
                PROCESSING...
              </>
            ) : (
              <>
                <span className="btn-icon">◇</span>
                PERSONALIZE
              </>
            )}
          </button>
          <button
            onClick={handleTranslate}
            disabled={isTranslating || isPersonalizing}
            className={`tool-btn translate-btn ${activeTab === 'translate' ? 'active' : ''}`}
          >
            {isTranslating ? (
              <>
                <span className="btn-icon">⟳</span>
                TRANSLATING...
              </>
            ) : (
              <>
                <span className="btn-icon">اردو</span>
                TRANSLATE TO URDU
              </>
            )}
          </button>
        </div>

        {/* Context Input for Personalization */}
        {showContextInput && !personalizedContent && (
          <div className="context-input-container">
            <label className="context-label">// ENTER YOUR BACKGROUND</label>
            <textarea
              value={userContext}
              onChange={(e) => setUserContext(e.target.value)}
              placeholder="e.g., Software engineer with 3 years Python experience, interested in robotics..."
              className="context-textarea"
              rows={3}
            />
            <div className="context-actions">
              <button
                onClick={handlePersonalize}
                disabled={isPersonalizing || !userContext.trim()}
                className="submit-btn"
              >
                {isPersonalizing ? 'PROCESSING...' : 'GENERATE'}
              </button>
              <button onClick={clearResults} className="cancel-btn">CANCEL</button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-display">
            <span className="error-icon">✕</span>
            <span className="error-text">{error}</span>
            <button onClick={() => setError(null)} className="error-close">DISMISS</button>
          </div>
        )}

        {/* Results Display */}
        {(translatedContent || personalizedContent) && (
          <div className="results-container">
            <div className="results-header">
              <span className="results-title">
                {activeTab === 'translate' ? '// URDU_TRANSLATION' : '// PERSONALIZED_CONTENT'}
              </span>
              <button onClick={clearResults} className="clear-btn">CLEAR</button>
            </div>
            <div className="results-content">
              {translatedContent && (
                <div className="translated-text" dir="rtl" lang="ur">
                  {translatedContent}
                </div>
              )}
              {personalizedContent && (
                <div className="personalized-text">
                  {personalizedContent}
                </div>
              )}
            </div>
            {personalizedContent && userContext && (
              <div className="context-info">
                <small>// Personalized for: {userContext.substring(0, 50)}{userContext.length > 50 ? '...' : ''}</small>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Embedded Styles */}
      <style>{`
        .chapter-tools-wrapper {
          margin-bottom: 24px;
          font-family: 'Rajdhani', sans-serif;
        }

        .chapter-tools-container {
          background: rgba(5, 5, 5, 0.95);
          border: 1px solid rgba(0, 243, 255, 0.3);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 243, 255, 0.1);
        }

        .tools-header {
          background: linear-gradient(180deg, rgba(0, 243, 255, 0.1) 0%, rgba(0, 243, 255, 0.02) 100%);
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid rgba(0, 243, 255, 0.2);
        }

        .tools-icon {
          color: #00f3ff;
          font-size: 14px;
        }

        .tools-label {
          color: #00f3ff;
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          letter-spacing: 1px;
          font-weight: bold;
        }

        .tools-status {
          width: 6px;
          height: 6px;
          background: #00ff88;
          border-radius: 50%;
          box-shadow: 0 0 8px #00ff88;
          margin-left: auto;
        }

        .tools-buttons {
          padding: 12px 16px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .tool-btn {
          background: rgba(0, 243, 255, 0.05);
          border: 1px solid rgba(0, 243, 255, 0.3);
          color: #00f3ff;
          padding: 10px 18px;
          border-radius: 4px;
          cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tool-btn:hover:not(:disabled) {
          background: rgba(0, 243, 255, 0.15);
          border-color: #00f3ff;
          box-shadow: 0 0 15px rgba(0, 243, 255, 0.3);
          transform: translateY(-1px);
        }

        .tool-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tool-btn.active {
          background: rgba(0, 243, 255, 0.2);
          border-color: #00f3ff;
          box-shadow: 0 0 15px rgba(0, 243, 255, 0.3);
        }

        .btn-icon {
          font-size: 14px;
        }

        .personalize-btn .btn-icon {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .context-input-container {
          padding: 16px;
          border-top: 1px solid rgba(0, 243, 255, 0.2);
          background: rgba(0, 243, 255, 0.02);
        }

        .context-label {
          display: block;
          color: #00ff88;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }

        .context-textarea {
          width: 100%;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(0, 243, 255, 0.3);
          border-radius: 4px;
          color: #e0e0e0;
          padding: 12px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px;
          resize: vertical;
          min-height: 80px;
        }

        .context-textarea:focus {
          outline: none;
          border-color: #00f3ff;
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.2);
        }

        .context-textarea::placeholder {
          color: #606060;
        }

        .context-actions {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }

        .submit-btn {
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.5);
          color: #00ff88;
          padding: 8px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 1px;
          transition: all 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          background: rgba(0, 255, 136, 0.2);
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cancel-btn {
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #808080;
          padding: 8px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 1px;
          transition: all 0.3s;
        }

        .cancel-btn:hover {
          border-color: #ff4444;
          color: #ff4444;
        }

        .error-display {
          padding: 12px 16px;
          background: rgba(255, 68, 68, 0.1);
          border-top: 1px solid rgba(255, 68, 68, 0.3);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .error-icon {
          color: #ff4444;
          font-size: 12px;
        }

        .error-text {
          color: #ff4444;
          font-size: 12px;
          flex: 1;
        }

        .error-close {
          background: none;
          border: 1px solid rgba(255, 68, 68, 0.3);
          color: #ff4444;
          padding: 4px 10px;
          font-size: 10px;
          cursor: pointer;
          border-radius: 2px;
          font-family: 'Rajdhani', sans-serif;
        }

        .results-container {
          border-top: 1px solid rgba(0, 243, 255, 0.2);
        }

        .results-header {
          padding: 10px 16px;
          background: rgba(0, 255, 136, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0, 243, 255, 0.1);
        }

        .results-title {
          color: #00ff88;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .clear-btn {
          background: none;
          border: 1px solid rgba(0, 243, 255, 0.2);
          color: #808080;
          padding: 4px 10px;
          font-size: 10px;
          cursor: pointer;
          border-radius: 2px;
          font-family: 'Rajdhani', sans-serif;
          transition: all 0.2s;
        }

        .clear-btn:hover {
          border-color: #ff4444;
          color: #ff4444;
        }

        .results-content {
          padding: 16px;
          max-height: 300px;
          overflow-y: auto;
        }

        .translated-text {
          color: #e0e0e0;
          font-size: 16px;
          line-height: 1.8;
          font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif;
          text-align: right;
        }

        .personalized-text {
          color: #e0e0e0;
          font-size: 14px;
          line-height: 1.7;
        }

        .context-info {
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(0, 243, 255, 0.1);
        }

        .context-info small {
          color: #606060;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
        }

        /* Scrollbar styling */
        .results-content::-webkit-scrollbar {
          width: 4px;
        }

        .results-content::-webkit-scrollbar-track {
          background: rgba(0, 243, 255, 0.05);
        }

        .results-content::-webkit-scrollbar-thumb {
          background: #00f3ff;
          border-radius: 2px;
        }

        /* Dark mode compatibility for Docusaurus */
        [data-theme='dark'] .chapter-tools-container {
          background: rgba(5, 5, 5, 0.95);
        }

        [data-theme='light'] .chapter-tools-container {
          background: rgba(20, 20, 30, 0.95);
        }
      `}</style>
    </div>
  );
}
