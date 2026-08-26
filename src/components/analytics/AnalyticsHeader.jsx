import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AnalyticsHeader({ filters, onFilterChange, filterOptions, onReset }) {
  const { t } = useTranslation();

  return (
    <div className="analytics-header-card">
      <div className="analytics-header-top">
        <div>
          <h1 className="analytics-title">{t('analytics.title')}</h1>
          <p className="analytics-subtitle">{t('analytics.subtitle')}</p>
        </div>
        
      </div>

      
    </div>
  );
}