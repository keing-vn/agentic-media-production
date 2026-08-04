'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LibraryItem {
  id: string;
  content: string;
  type: string;
  tags: string[];
  created_at: string;
}

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LibraryModal({ isOpen, onClose }: LibraryModalProps) {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchLibrary();
    }
  }, [isOpen]);

  const fetchLibrary = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/library');
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>My Library</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <p>Đang tải thư viện...</p>
          ) : items.length === 0 ? (
            <p className="empty-text">Thư viện trống. Hãy lưu các kịch bản hay từ đoạn chat!</p>
          ) : (
            <div className="library-grid">
              {items.map((item) => (
                <div key={item.id} className="library-card glass-panel">
                  <div className="card-header">
                    <span className="badge">{item.type}</span>
                    <span className="date">{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                  <div className="card-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {item.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
