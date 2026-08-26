import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Header({ onRefresh, isRefreshing }) {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'fa' ? 'en' : 'fa';
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' }}>
      
      {/* سمت چپ: ۳ لوگو + عنوان اصلی داشبورد */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* لوگوها */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo1.png" alt="Logo 1" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
          <img src="/logo2.png" alt="Logo 2" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
          <img src="/logo3.png" alt="Logo 3" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
        </div>

        {/* خط جداکننده کوچک */}
        <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--border-color, #334155)' }}></div>

        {/* عنوان کامل */}
        <h1 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: 'var(--text-main, #f8fafc)' }}>
          {/* تغییر مهم در این خط */}
          {t('appTitle', 'Water Survey Dashboard')}
        </h1>
      </div>

      {/* سمت راست: دکمه تغییر زبان + دکمه به‌روزرسانی */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* دکمه تغییر زبان */}
        <button
          onClick={toggleLanguage}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>{i18n.language === 'fa' ? 'English' : 'دری'}</span>
        </button>

        {/* دکمه به‌روزرسانی */}
        <button 
          onClick={onRefresh} 
          disabled={isRefreshing}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
          {/* تغییر مهم در این خط */}
          <span>{isRefreshing ? t('refreshing', 'Refreshing...') : t('refresh', 'Refresh')}</span>
        </button>
      </div>

    </header>
  );
}