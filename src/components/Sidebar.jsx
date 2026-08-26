import React from 'react';
import { LayoutDashboard, Database, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Sidebar({ activeTab, setActiveTab, isConnected }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const isFa = currentLang.startsWith('fa');

  const navItems = [
    {
      section: isFa ? 'نمای کلی' : 'OVERVIEW',
      items: [
        {
          id: 'dashboard',
          label: isFa ? 'داشبورد' : 'Dashboard',
          icon: LayoutDashboard
        }
      ]
    },
    {
      section: isFa ? 'داده‌ها' : 'DATA',
      items: [
        {
          id: 'survey-data',
          label: isFa ? 'داده‌های سروی' : 'Survey Data',
          icon: Database
        }
      ]
    },
    {
      section: isFa ? 'تحلیل و آمار' : 'ANALYSIS',
      items: [
        {
          id: 'analytics',
          label: isFa ? 'تحلیل‌ها' : 'Analytics',
          icon: BarChart3
        }
      ]
    }
  ];

  return (
    <aside className={`sidebar ${isFa ? 'rtl' : ''}`}>
      <div>
        <div className="sidebar-header" style={{ padding: '20px 16px' }}>
          <div className="brand-title" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#070707' }}>
            {isFa ? 'سیستم سروی آب‌های زیرزمینی' : 'GW Survey System'}
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
          <span>{isFa ? 'وضعیت داده‌ها' : 'Data Status'}</span>
          <span className="status-indicator">
            <span className="status-dot"></span>
            {isConnected
              ? (isFa ? 'متصل' : 'Connected')
              : (isFa ? 'حالت آزمایشی' : 'Demo Mode')}
          </span>
        </div>
        <div className="status-row" style={{ color: 'var(--text-muted)' }}>
          <span>{isFa ? 'آخرین به‌روزرسانی' : 'Last updated'}</span>
          <span>{isFa ? '۱۰:۴۲ صبح' : '10:42 AM'}</span>
        </div>
      </div>
    </aside>
  );
}