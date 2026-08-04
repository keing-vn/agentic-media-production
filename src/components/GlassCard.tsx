import React, { ReactNode, CSSProperties } from 'react';
import styles from './GlassCard.module.css';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function GlassCard({ children, className = '', style }: GlassCardProps) {
  return (
    <div className={`${styles.glassCard} ${className}`} style={style}>
      {children}
    </div>
  );
}
