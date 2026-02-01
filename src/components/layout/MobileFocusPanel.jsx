import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, CloudSun, Navigation, Sparkles, Map as MapIcon } from 'lucide-react';
import { generateRainPlan } from '../../services/ai';

export function MobileFocusPanel() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [advice, setAdvice] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGetAdvice = async () => {
        if (advice) {
            setAdvice(null);
            return;
        }
        setLoading(true);
        const result = await generateRainPlan('翠峰湖', 'hiking');
        setAdvice(result);
        setLoading(false);
    };

    return (
        <>
            <motion.div
                className="focus-panel"
                initial={{ height: '60px' }}
                animate={{ height: isExpanded ? 'auto' : '60px' }}
                transition={{ type: 'spring', damping: 20 }}
            >
                {/* Handle / Header */}
                <div
                    className="panel-header"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="focus-summary">
                        <Navigation size={18} className="text-primary" />
                        <span className="focus-text">目前目標：翠峰湖環山步道</span>
                    </div>
                    <ChevronUp
                        size={20}
                        className="toggle-icon"
                        style={{
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                        }}
                    />
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="panel-content"
                        >
                            <div
                                className="weather-widget"
                                onClick={handleGetAdvice}
                                style={{ cursor: 'pointer', border: advice ? '1px solid var(--color-p-h)' : 'none' }}
                            >
                                {loading ? (
                                    <Sparkles className="animate-spin text-warning" />
                                ) : (
                                    <CloudSun size={24} className="text-warning" />
                                )}

                                <div>
                                    <div className="weather-temp">18°C 晴時多雲</div>
                                    <div className="weather-tip">
                                        {loading ? '正在分析雨天備案...' : '點擊查看 AI 雨天建議'}
                                    </div>
                                </div>
                            </div>

                            {advice && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="ai-advice-box"
                                >
                                    <pre>{advice}</pre>
                                </motion.div>
                            )}

                            <div className="map-thumbnail" style={{ height: '120px', backgroundColor: '#e5e7eb', borderRadius: '8px', overflow: 'hidden', position: 'relative', marginBottom: '12px' }}>
                                {/* Mock Map Thumbnail */}
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
                                    <MapIcon size={24} style={{ marginRight: '8px' }} />
                                    地圖預覽 (Mock)
                                </div>
                            </div>

                            <div className="next-milestone">
                                <div className="milestone-label">下一個檢查點</div>
                                <div className="milestone-value">11:30 觀景台 (距離 1.2km)</div>
                            </div>

                            <div className="action-buttons">
                                <button className="btn btn-primary full-width">開啟導航</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <style>{`
        .focus-panel {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: hsl(var(--color-surface-h), var(--color-surface-s), var(--color-surface-l));
          border-top: 1px solid hsl(var(--color-border-h), var(--color-border-s), var(--color-border-l));
          box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
          z-index: 50;
          border-top-left-radius: var(--radius-xl);
          border-top-right-radius: var(--radius-xl);
          overflow: hidden;
        }
        .text-primary { color: hsl(var(--color-p-h), var(--color-p-s), var(--color-p-l)); }
        .text-warning { color: var(--color-warning); }
        
        .panel-header {
          height: 60px;
          padding: 0 var(--space-4);
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .focus-summary {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: 600;
          font-size: 0.95rem;
        }
        .panel-content {
          padding: 0 var(--space-4) var(--space-6) var(--space-4);
        }
        .weather-widget {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          background-color: hsl(var(--color-bg-h), var(--color-bg-s), var(--color-bg-l));
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-3);
          transition: background-color 0.2s;
        }
        .weather-widget:hover {
          background-color: rgba(0,0,0,0.05);
        }
        .weather-temp { font-weight: bold; }
        .weather-tip { font-size: 0.85rem; color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l)); }
        
        .ai-advice-box {
            background: #f0fdf4;
            padding: var(--space-3);
            border-radius: var(--radius-md);
            margin-bottom: var(--space-3);
            font-size: 0.85rem;
            color: #166534;
            white-space: pre-wrap;
            font-family: inherit;
        }

        .next-milestone {
          margin-bottom: var(--space-4);
        }
        .milestone-label {
          font-size: 0.8rem;
          color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
          margin-bottom: var(--space-1);
        }
        .milestone-value {
          font-weight: 500;
        }
        .full-width { width: 100%; }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin {
            animation: spin 1s linear infinite;
        }
      `}</style>
        </>
    );
}
