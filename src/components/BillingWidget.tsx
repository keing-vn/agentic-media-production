'use client';

import React, { useEffect, useState } from 'react';

interface BillingWidgetProps {
  totalCostUsd: number;
}

export default function BillingWidget({ totalCostUsd }: BillingWidgetProps) {
  const [displayCost, setDisplayCost] = useState(0);

  // Animated number counting effect
  useEffect(() => {
    if (totalCostUsd === displayCost) return;
    
    const increment = (totalCostUsd - displayCost) / 20;
    let current = displayCost;
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= totalCostUsd) || (increment < 0 && current <= totalCostUsd)) {
        current = totalCostUsd;
        clearInterval(timer);
      }
      setDisplayCost(current);
    }, 50);

    return () => clearInterval(timer);
  }, [totalCostUsd, displayCost]);

  // Convert to VND optionally, or keep USD. Since the plan requested USD, we'll show USD for now
  // USD formatting
  const formattedCost = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  }).format(displayCost);

  return (
    <div className="billing-widget glass-panel">
      <div className="billing-label">API Cost</div>
      <div className="billing-amount" style={{ 
        color: totalCostUsd > displayCost ? '#00ffcc' : 'var(--text-primary)',
        transition: 'color 0.3s'
      }}>
        {formattedCost}
      </div>
      
      <style jsx>{`
        .billing-widget {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 10px 20px;
          border-radius: 12px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          box-shadow: 0 4px 30px rgba(0, 255, 204, 0.1);
          border: 1px solid rgba(0, 255, 204, 0.2);
        }
        .billing-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .billing-amount {
          font-size: 1.2rem;
          font-weight: 700;
          font-family: monospace;
          text-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
        }
      `}</style>
    </div>
  );
}
