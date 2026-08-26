import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { fetchWaterSurveyAnalytics } from '../services/waterSurveyAnalyticsService';
import { translateCategory } from '../utils/dataTranslations';

import AnalyticsHeader from '../components/analytics/AnalyticsHeader';
import AnalysisCard from '../components/analytics/AnalysisCard';

// وارد کردن کامپوننت‌های تفکیک‌شده جدید
import WaterSourceSection from '../components/analytics/WaterSourceSection';
import WaterQualitySection from '../components/analytics/WaterQualitySection';
import QuantityAccessSection from '../components/analytics/QuantityAccessSection';
import EconomicBurdenSection from '../components/analytics/EconomicBurdenSection';
import HealthImpactsSection from '../components/analytics/HealthImpactsSection';
import PrioritiesSection from '../components/analytics/PrioritiesSection';

import '../components/analytics/analytics.css';

export default function AnalyticsView() {
  const { t, i18n } = useTranslation();
  const activeLang = i18n.language?.startsWith('fa') ? 'fa' : 'en';
  const isRtl = activeLang === 'fa';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // حذف استان/ولایت از استیت اولیه
  const [filters, setFilters] = useState({
    district: 'ALL',
    neighborhood: 'ALL'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWaterSurveyAnalytics(filters);
      setData(res);
    } catch (err) {
      console.error('Fetch Analytics Error:', err);
      setError(t('analytics.error') || 'Error loading analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({ district: 'ALL', neighborhood: 'ALL' });
  };

  const formatData = (items, domainKey) => {
    if (!Array.isArray(items)) return [];
    return items.map((i) => ({
      name: translateCategory(domainKey, i.key, activeLang),
      percentage: i.percentage || 0,
      count: i.count || 0
    }));
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="analytics-skeleton" style={{ height: '120px', marginBottom: '24px' }} />
        <div className="analytics-grid-2">
          <div className="analytics-skeleton" style={{ height: '260px' }} />
          <div className="analytics-skeleton" style={{ height: '260px' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container" style={{ textAlign: 'center', padding: '48px' }}>
        <p style={{ color: '#dc2626' }}>{error}</p>
        <button onClick={loadData} className="analytics-reset-btn" style={{ marginTop: '12px' }}>
          {t('analytics.tryAgain')}
        </button>
      </div>
    );
  }

  if (!data || data.totalCount === 0 || !data.sectionB) {
    return (
      <div className="analytics-container">
        <AnalyticsHeader
          filters={filters}
          onFilterChange={handleFilterChange}
          filterOptions={data?.filterOptions || {}}
          onReset={handleReset}
        />
        <div className="analysis-card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: '#6b7280' }}>{t('analytics.noData')}</p>
        </div>
      </div>
    );
  }

  const sectionC = data?.sectionC || {};
  const sectionD = data?.sectionD || {};
  const sectionE = data?.sectionE || {};
  const sectionW = data?.sectionW || {};
  const sectionZ = data?.sectionZ || {};
  const crossAnalysis = data?.crossAnalysis || {};

  return (
    <div className="analytics-container">
      <AnalyticsHeader
        filters={filters}
        onFilterChange={handleFilterChange}
        filterOptions={data.filterOptions || {}}
        onReset={handleReset}
      />

      {/* ردیف اول: سکشن B (منبع آب) و سکشن C (میزان دسترسی و تکافو) */}
      <div className="analytics-grid-2">
        <WaterSourceSection filters={filters} />
        <QuantityAccessSection filters={filters} />
      </div>

      {/* ردیف دوم: سکشن D (کیفیت آب) و سکشن E (بار اقتصادی) */}
      <div className="analytics-grid-2">
        <WaterQualitySection sectionD={sectionD} />
        <EconomicBurdenSection sectionE={sectionE} />
      </div>

      {/* SECTION W - تأثیرات سلامت */}
      <HealthImpactsSection sectionW={sectionW} />

      {/* SECTION Z - اولویت‌ها و نظرات */}
      <PrioritiesSection sectionZ={sectionZ} />
    </div>
  );
}