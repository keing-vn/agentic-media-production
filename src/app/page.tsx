'use client';

import React, { useState } from 'react';
import PersonaSelector, { Persona } from '@/components/PersonaSelector';
import ChatInterface from '@/components/ChatInterface';
import Scene from '@/components/Scene';
import GlassCard from '@/components/GlassCard';
import BillingWidget from '@/components/BillingWidget';
import LibraryModal from '@/components/LibraryModal';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const [selectedPersona, setSelectedPersona] = useState<Persona>('fan');
  const [totalCost, setTotalCost] = useState(0);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (session?.user) {
      fetch('/api/user/cost')
        .then(res => res.json())
        .then(data => {
          if (data.costUsd !== undefined) {
            setTotalCost(data.costUsd);
          }
        })
        .catch(console.error);
    }
  }, [session]);

  return (
    <>
      <BillingWidget totalCostUsd={totalCost} />
      <Scene />
      <main className="container" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <header style={{ marginBottom: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 className="text-gradient">Agentic Media Production</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '1rem' }}>
            Powered by Google Cloud Agent Builder & Gemini + Firebase
          </p>
          
          {status === 'loading' ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
          ) : session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              {session.user?.image && <img src={session.user.image} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />}
              <span style={{ color: 'white' }}>Hi, {session.user?.name}</span>
              <button 
                onClick={() => setIsLibraryOpen(true)}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                My Library
              </button>
              <button onClick={() => signOut()} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '15px', cursor: 'pointer' }}>Sign Out</button>
            </div>
          ) : (
            <button onClick={() => signIn('google')} style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', background: '#ffffff', color: '#000', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
              Sign in with Google
            </button>
          )}
        </header>

        <div className="main-layout">
          <aside>
            <GlassCard style={{ height: '100%' }}>
              <PersonaSelector 
                selectedPersona={selectedPersona} 
                onSelectPersona={setSelectedPersona} 
              />
            </GlassCard>
          </aside>
          
          <section>
            <GlassCard style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: session ? 'stretch' : 'center', justifyContent: session ? 'flex-start' : 'center' }}>
              {session ? (
                <ChatInterface 
                  persona={selectedPersona} 
                  onCostUpdate={(cost) => setTotalCost(prev => prev + cost)}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <h3>Vui lòng đăng nhập</h3>
                  <p>Bạn cần Sign in bằng tài khoản Google để sử dụng Chat AI và lưu trữ lịch sử.</p>
                </div>
              )}
            </GlassCard>
          </section>
        </div>
      </main>

      <LibraryModal 
        isOpen={isLibraryOpen} 
        onClose={() => setIsLibraryOpen(false)} 
      />
    </>
  );
}
