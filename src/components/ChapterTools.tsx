import React, { useState } from 'react';

const API_BASE_URL = 'https://physical-ai-textbook.onrender.com';

// Store original content for restoration
const originalTexts = new Map<Element, string>();

interface ChapterToolsProps {
  title: string;
  description?: string;
}

export default function ChapterTools({ title, description }: ChapterToolsProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'original' | 'translated' | 'personalized'>('original');
  const [progress, setProgress] = useState<string>('');
  const [userContext, setUserContext] = useState<string>('');
  const [showContextInput, setShowContextInput] = useState(false);

  // Get all translatable elements from the page (skip code blocks)
  const getTranslatableElements = (): Element[] => {
    const container = document.querySelector('.markdown') || document.querySelector('article');
    if (!container) return [];

    const elements: Element[] = [];
    const selectors = 'p, h1, h2, h3, h4, h5, h6, li, td, th, blockquote, figcaption';
    const candidates = container.querySelectorAll(selectors);

    candidates.forEach((el) => {
      // Skip code blocks and empty elements
      if (el.closest('pre') || el.closest('code')) return;
      const text = el.textContent?.trim();
      if (!text || text.length < 3) return;
      elements.push(el);
    });

    return elements;
  };

  // Extract text preserving inline code as placeholders
  const extractText = (el: Element): { text: string; codeMap: Map<string, string> } => {
    const codeMap = new Map<string, string>();
    let html = el.innerHTML;

    const inlineCodes = el.querySelectorAll('code');
    inlineCodes.forEach((code, i) => {
      const placeholder = `[[CODE${i}]]`;
      codeMap.set(placeholder, code.outerHTML);
      html = html.replace(code.outerHTML, placeholder);
    });

    const temp = document.createElement('div');
    temp.innerHTML = html;
    return { text: temp.textContent || '', codeMap };
  };

  // Apply translated text back, restoring code placeholders
  const applyText = (el: Element, translatedText: string, codeMap: Map<string, string>, isRTL: boolean) => {
    if (!originalTexts.has(el)) {
      originalTexts.set(el, el.innerHTML);
    }

    let result = translatedText;
    codeMap.forEach((html, placeholder) => {
      result = result.replace(placeholder, html);
    });

    el.innerHTML = result;

    if (isRTL) {
      (el as HTMLElement).style.direction = 'rtl';
      (el as HTMLElement).style.textAlign = 'right';
    }
  };

  // Restore all elements to original
  const restoreOriginal = () => {
    originalTexts.forEach((originalHTML, el) => {
      el.innerHTML = originalHTML;
      (el as HTMLElement).style.direction = '';
      (el as HTMLElement).style.textAlign = '';
    });
    setMode('original');
    setShowContextInput(false);
  };

  const handleTranslate = async () => {
    if (mode === 'translated') {
      restoreOriginal();
      return;
    }

    if (mode === 'personalized') restoreOriginal();

    setError(null);
    setIsTranslating(true);
    setProgress('Finding content...');
    setShowContextInput(false);

    try {
      const elements = getTranslatableElements();
      if (elements.length === 0) {
        throw new Error('No content found to translate');
      }

      // Extract all texts
      const extracted = elements.map(el => extractText(el));
      const texts = extracted.map(e => e.text);

      setProgress(`Translating ${texts.length} sections...`);

      // Use batch API for speed
      const response = await fetch(`${API_BASE_URL}/translate/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts, target_language: 'Urdu' }),
      });

      if (!response.ok) throw new Error('Translation failed');

      const data = await response.json();

      setProgress('Applying translations...');

      // Apply translations in-place
      elements.forEach((el, i) => {
        if (data.translations[i]) {
          applyText(el, data.translations[i], extracted[i].codeMap, true);
        }
      });

      setMode('translated');
    } catch (err) {
      console.error('Translation error:', err);
      setError('Translation failed. Please try again.');
      restoreOriginal();
    } finally {
      setIsTranslating(false);
      setProgress('');
    }
  };

  const handlePersonalizeClick = () => {
    if (mode === 'personalized') {
      restoreOriginal();
      return;
    }
    setShowContextInput(true);
    setError(null);
  };

  const handlePersonalize = async () => {
    if (!userContext.trim()) {
      setError('Please enter your background.');
      return;
    }

    if (mode === 'translated') restoreOriginal();

    setError(null);
    setIsPersonalizing(true);
    setProgress('Personalizing content...');
    setShowContextInput(false);

    try {
      const container = document.querySelector('.markdown') || document.querySelector('article');
      if (!container) throw new Error('Content not found');

      // Store original
      if (!originalTexts.has(container as Element)) {
        originalTexts.set(container as Element, container.innerHTML);
      }

      const fullText = container.textContent || '';

      const response = await fetch(`${API_BASE_URL}/personalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: fullText.substring(0, 8000),
          user_context: userContext
        }),
      });

      if (!response.ok) throw new Error('Personalization failed');

      const data = await response.json();

      // Create personalized overlay
      const overlay = document.createElement('div');
      overlay.className = 'personalized-overlay';
      overlay.innerHTML = `
        <div class="personalized-header">
          <span>◈ PERSONALIZED FOR: ${userContext.substring(0, 50)}${userContext.length > 50 ? '...' : ''}</span>
        </div>
        <div class="personalized-body">${data.personalized.replace(/\n/g, '<br>')}</div>
      `;

      // Hide original, show personalized
      Array.from(container.children).forEach(child => {
        (child as HTMLElement).dataset.originalDisplay = (child as HTMLElement).style.display;
        (child as HTMLElement).style.display = 'none';
      });
      container.insertBefore(overlay, container.firstChild);

      setMode('personalized');
    } catch (err) {
      console.error('Personalization error:', err);
      setError('Personalization failed. Please try again.');
    } finally {
      setIsPersonalizing(false);
      setProgress('');
    }
  };

  const handleShowOriginal = () => {
    const container = document.querySelector('.markdown') || document.querySelector('article');
    if (container) {
      const overlay = container.querySelector('.personalized-overlay');
      if (overlay) {
        overlay.remove();
        Array.from(container.children).forEach(child => {
          const el = child as HTMLElement;
          el.style.display = el.dataset.originalDisplay || '';
        });
      }
    }
    restoreOriginal();
  };

  return (
    <div className="chapter-tools-wrapper">
      <div className="chapter-tools-container">
        <div className="tools-header">
          <span className="tools-icon">◈</span>
          <span className="tools-label">CONTENT_TOOLS</span>
          {mode !== 'original' && (
            <span className="mode-badge">
              {mode === 'translated' ? '🌐 URDU' : '◇ PERSONALIZED'}
            </span>
          )}
          <span className="tools-status"></span>
        </div>

        <div className="tools-buttons">
          {mode !== 'original' && (
            <button onClick={handleShowOriginal} className="tool-btn original-btn">
              <span className="btn-icon">↩</span>
              ORIGINAL
            </button>
          )}
          <button
            onClick={handlePersonalizeClick}
            disabled={isPersonalizing || isTranslating}
            className={`tool-btn personalize-btn ${mode === 'personalized' ? 'active' : ''}`}
          >
            {isPersonalizing ? (
              <><span className="btn-icon spinning">⟳</span> PROCESSING...</>
            ) : (
              <><span className="btn-icon">◇</span> PERSONALIZE</>
            )}
          </button>
          <button
            onClick={handleTranslate}
            disabled={isTranslating || isPersonalizing}
            className={`tool-btn translate-btn ${mode === 'translated' ? 'active' : ''}`}
          >
            {isTranslating ? (
              <><span className="btn-icon spinning">⟳</span> TRANSLATING...</>
            ) : (
              <><span className="btn-icon">اردو</span> TRANSLATE</>
            )}
          </button>
        </div>

        {progress && (
          <div className="progress-bar">
            <span className="progress-icon spinning">⟳</span>
            {progress}
          </div>
        )}

        {showContextInput && (
          <div className="context-input-container">
            <label className="context-label">// ENTER YOUR BACKGROUND</label>
            <textarea
              value={userContext}
              onChange={(e) => setUserContext(e.target.value)}
              placeholder="e.g., Python developer with 3 years experience, new to robotics..."
              className="context-textarea"
              rows={2}
            />
            <div className="context-actions">
              <button
                onClick={handlePersonalize}
                disabled={isPersonalizing || !userContext.trim()}
                className="submit-btn"
              >
                GENERATE
              </button>
              <button onClick={() => setShowContextInput(false)} className="cancel-btn">
                CANCEL
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-display">
            <span className="error-icon">✕</span>
            <span className="error-text">{error}</span>
            <button onClick={() => setError(null)} className="error-close">DISMISS</button>
          </div>
        )}
      </div>

      <style>{`
        .chapter-tools-wrapper {
          margin-bottom: 24px;
          font-family: 'Rajdhani', 'Segoe UI', sans-serif;
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
        .tools-icon { color: #00f3ff; font-size: 14px; }
        .tools-label {
          color: #00f3ff;
          font-family: 'Orbitron', monospace;
          font-size: 11px;
          letter-spacing: 1px;
          font-weight: bold;
        }
        .mode-badge {
          background: rgba(0, 255, 136, 0.2);
          color: #00ff88;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          letter-spacing: 1px;
        }
        .tools-status {
          width: 6px; height: 6px;
          background: #00ff88;
          border-radius: 50%;
          box-shadow: 0 0 8px #00ff88;
          margin-left: auto;
        }
        .tools-buttons {
          padding: 12px 16px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .tool-btn {
          background: rgba(0, 243, 255, 0.05);
          border: 1px solid rgba(0, 243, 255, 0.3);
          color: #00f3ff;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tool-btn:hover:not(:disabled) {
          background: rgba(0, 243, 255, 0.15);
          border-color: #00f3ff;
          box-shadow: 0 0 15px rgba(0, 243, 255, 0.3);
        }
        .tool-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .tool-btn.active {
          background: rgba(0, 243, 255, 0.2);
          border-color: #00f3ff;
          box-shadow: 0 0 12px rgba(0, 243, 255, 0.4);
        }
        .original-btn {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.3);
          color: #aaa;
        }
        .original-btn:hover { border-color: #fff; color: #fff; }
        .btn-icon { font-size: 12px; }
        .spinning { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .progress-bar {
          padding: 10px 16px;
          background: rgba(0, 243, 255, 0.05);
          border-top: 1px solid rgba(0, 243, 255, 0.1);
          color: #00f3ff;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .progress-icon { font-size: 14px; }
        .context-input-container {
          padding: 16px;
          border-top: 1px solid rgba(0, 243, 255, 0.2);
          background: rgba(0, 243, 255, 0.02);
        }
        .context-label {
          display: block;
          color: #00ff88;
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .context-textarea {
          width: 100%;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(0, 243, 255, 0.3);
          border-radius: 4px;
          color: #e0e0e0;
          padding: 10px;
          font-family: inherit;
          font-size: 13px;
          resize: none;
        }
        .context-textarea:focus {
          outline: none;
          border-color: #00f3ff;
        }
        .context-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .submit-btn {
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.5);
          color: #00ff88;
          padding: 6px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
          font-weight: bold;
        }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .cancel-btn {
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #808080;
          padding: 6px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
        }
        .error-display {
          padding: 10px 16px;
          background: rgba(255, 68, 68, 0.1);
          border-top: 1px solid rgba(255, 68, 68, 0.3);
          display: flex;
          align-items: center;
          gap: 8px;
          color: #ff4444;
          font-size: 12px;
        }
        .error-close {
          margin-left: auto;
          background: none;
          border: 1px solid rgba(255, 68, 68, 0.3);
          color: #ff4444;
          padding: 2px 8px;
          font-size: 10px;
          cursor: pointer;
          border-radius: 2px;
        }
        /* Personalized overlay styles */
        .personalized-overlay {
          background: rgba(0, 20, 30, 0.95);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 8px;
          margin-bottom: 20px;
          overflow: hidden;
        }
        .personalized-header {
          background: rgba(0, 255, 136, 0.1);
          padding: 10px 16px;
          color: #00ff88;
          font-size: 11px;
          font-family: monospace;
          letter-spacing: 1px;
          border-bottom: 1px solid rgba(0, 255, 136, 0.2);
        }
        .personalized-body {
          padding: 20px;
          color: #e0e0e0;
          font-size: 15px;
          line-height: 1.8;
        }
        [data-theme='light'] .chapter-tools-container {
          background: rgba(20, 25, 35, 0.98);
        }
      `}</style>
    </div>
  );
}
