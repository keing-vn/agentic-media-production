'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Persona } from './PersonaSelector';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'agent';
  content: string;
}

interface ChatInterfaceProps {
  persona: Persona;
  onCostUpdate?: (cost: number) => void;
  sessionId?: string;
}

export default function ChatInterface({ persona, onCostUpdate, sessionId = 'default' }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      setIsFetchingHistory(true);
      try {
        const res = await fetch(`/api/chat/history?sessionId=${sessionId}`);
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          setMessages([
            { role: 'agent', content: `Xin chào! Tôi là AI Agentic Media Production. Bạn đang truy cập với tư cách: ${persona}. Tôi có thể giúp gì cho bạn?` }
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetchingHistory(false);
      }
    };
    fetchHistory();
  }, [sessionId, persona]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Send the last 10 messages (including the new user message) to maintain context
      const historyToSend = [...messages, { role: 'user', content: userMessage }].slice(-10);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, persona, sessionId, history: historyToSend })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'agent', content: data.reply || 'Có lỗi xảy ra khi xử lý.' }]);
      
      if (data.usage?.estimatedCostUsd && onCostUpdate) {
        onCostUpdate(data.usage.estimatedCostUsd);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'agent', content: 'Lỗi kết nối tới server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToLibrary = async (content: string) => {
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type: 'Saved Snippet' })
      });
      if (res.ok) {
        alert('Đã lưu vào My Library!');
      } else {
        alert('Có lỗi khi lưu.');
      }
    } catch (err) {
      alert('Lỗi kết nối khi lưu.');
    }
  };

  return (
    <div className="glass-panel chat-container">
      <div className="chat-messages">
        {isFetchingHistory ? (
          <div className="message agent">
            <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>Đang tải lịch sử...</span>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`message-wrapper ${msg.role}`}>
              <div className={`message ${msg.role}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
              {msg.role === 'agent' && (
                <button 
                  className="save-btn" 
                  onClick={() => handleSaveToLibrary(msg.content)}
                  title="Lưu vào My Library"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                  </svg>
                </button>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="message-wrapper agent">
            <div className="message agent">
              <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>Đang xử lý...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-area">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={`Hỏi Agent với vai trò ${persona}...`}
          disabled={isLoading || isFetchingHistory}
        />
        <button onClick={handleSend} disabled={isLoading || isFetchingHistory || !input.trim()}>
          Gửi
        </button>
      </div>
    </div>
  );
}
