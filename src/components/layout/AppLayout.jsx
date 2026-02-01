import React from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MobileFocusPanel } from './MobileFocusPanel';
import { MapContainer } from '../map/MapContainer';
import { Menu, Map as MapIcon, Calendar, Settings } from 'lucide-react';
import { useAuth } from '../security/AuthContext';

export function AppLayout({ children }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { logout, role } = useAuth();

  if (isDesktop) {
    return (
      <div className="layout-desktop">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <div className="logo-area">Outdoor Planner</div>
          <nav style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)' }}>
            <div className="nav-item active"><Calendar size={20} /> 行程</div>
            <div className="nav-item"><Settings size={20} /> 設定</div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ padding: '1rem 0 0.5rem 0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                目前身份: {role}
              </div>
              <button onClick={logout} className="nav-item" style={{ width: '100%', border: 'none', background: 'transparent' }}>
                <span style={{ color: 'var(--color-danger)' }}>登出</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {children}
        </main>

        {/* Right Map Panel */}
        <aside className="map-panel">
          <MapContainer />
        </aside>

        <style>{`
          .layout-desktop {
            display: grid;
            grid-template-columns: 240px 1fr 350px;
            height: 100vh;
            background-color: hsl(var(--color-bg-h), var(--color-bg-s), var(--color-bg-l));
          }
          .sidebar {
            background-color: hsl(var(--color-surface-h), var(--color-surface-s), var(--color-surface-l));
            border-right: 1px solid hsl(var(--color-border-h), var(--color-border-s), var(--color-border-l));
            padding: var(--space-4);
          }
          .map-panel {
            background-color: hsl(var(--color-surface-h), var(--color-surface-s), var(--color-surface-l));
            border-left: 1px solid hsl(var(--color-border-h), var(--color-border-s), var(--color-border-l));
            overflow: hidden;
            position: relative;
          }
          .main-content {
            padding: var(--space-6);
            overflow-y: auto;
          }
          .nav-item {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            padding: var(--space-2);
            border-radius: var(--radius-md);
            cursor: pointer;
            color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
            transition: all 0.2s;
          }
          .nav-item:hover {
             background-color: hsl(var(--color-bg-h), var(--color-bg-s), var(--color-bg-l));
             color: hsl(var(--color-text-main-h), var(--color-text-main-s), var(--color-text-main-l));
          }
          .nav-item.active {
            background-color: hsl(var(--color-p-h), var(--color-p-s), var(--color-p-l));
            color: white;
          }
          .logo-area {
            font-weight: bold;
            font-size: 1.25rem;
            margin-bottom: var(--space-6);
            color: hsl(var(--color-p-h), var(--color-p-s), var(--color-p-l));
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="layout-mobile">
      <header className="mobile-header">
        <Menu size={24} />
        <span className="mobile-title">Outdoor Planner</span>
        <button onClick={logout} style={{ border: 'none', background: 'none', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          登出
        </button>
      </header>

      <main className="mobile-content">
        {children}
      </main>

      <MobileFocusPanel />

      <style>{`
        .layout-mobile {
          min-height: 100vh;
          background-color: hsl(var(--color-bg-h), var(--color-bg-s), var(--color-bg-l));
          padding-bottom: 80px;
        }
        .mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          background-color: hsl(var(--color-surface-h), var(--color-surface-s), var(--color-surface-l));
          border-bottom: 1px solid hsl(var(--color-border-h), var(--color-border-s), var(--color-border-l));
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .mobile-title {
          font-weight: bold;
          font-size: 1.1rem;
        }
        .mobile-content {
          padding: var(--space-4);
        }
      `}</style>
    </div>
  );
}
