'use client';

import React from 'react';

export type Persona = 'screenwriter' | 'filmmaker' | 'crew' | 'fan';

interface PersonaSelectorProps {
  selectedPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
}

const personas = [
  {
    id: 'screenwriter' as Persona,
    title: 'Biên Kịch (Screenwriter)',
    desc: 'Phân tích kịch bản, phát triển nhân vật, timeline.'
  },
  {
    id: 'filmmaker' as Persona,
    title: 'Đạo Diễn (Filmmaker)',
    desc: 'Moodboard, góc quay, kế hoạch phân cảnh.'
  },
  {
    id: 'crew' as Persona,
    title: 'Đoàn Phim (Studio Crew)',
    desc: 'Quản lý ngân sách, lịch trình quay, đạo cụ (Clickhouse data).'
  },
  {
    id: 'fan' as Persona,
    title: 'Người Hâm Mộ (Fan)',
    desc: 'Khám phá cốt truyện, giả thuyết fan, doanh thu phim.'
  }
];

export default function PersonaSelector({ selectedPersona, onSelectPersona }: PersonaSelectorProps) {
  return (
    <div className="glass-panel">
      <h2 style={{ marginBottom: '1.5rem' }}>Chọn Vai Trò</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {personas.map(p => (
          <div 
            key={p.id}
            className={`persona-item ${selectedPersona === p.id ? 'active' : ''}`}
            onClick={() => onSelectPersona(p.id)}
          >
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
