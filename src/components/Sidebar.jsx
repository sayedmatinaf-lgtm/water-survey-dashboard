import React from 'react';
import { LayoutDashboard, Database, BarChart3 } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isConnected }) {
  const navItems = [
    { section: 'OVERVIEW', items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
    { section: 'DATA', items: [{ id: 'survey-data', label: 'Survey Data', icon: Database }] },
    { section: 'ANALYSIS', items: [{ id: 'analytics', label: 'Analytics', icon: BarChart3 }] }
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header" style={{ padding: '20px 16px' }}>
          <div className="brand-title" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#070707' }}>
            GW Survey System
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((group, idx) => (
            <div key={idx} className="nav-group">
              <div className="nav-section-label">{group.section}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`nav-button ${active ? 'active' : ''}`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="status-row">
          <span>Data Status</span>
          <span className="status-indicator">
            <span className="status-dot"></span>
            {isConnected ? 'Connected' : 'Demo Mode'}
          </span>
        </div>
        <div className="status-row" style={{ color: 'var(--text-muted)' }}>
          <span>Last updated</span>
          <span>10:42 AM</span>
        </div>
      </div>
    </aside>
  );
}