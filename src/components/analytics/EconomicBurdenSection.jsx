import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { translateCategory } from '../../utils/dataTranslations';

const COLOR_PALETTES = {
  q19_practices: { primary: '#7C3AED', bg: '#F3E8FF' },
  q22_pressure: { 
    primary: '#EA580C', 
    set: ['#991B1B', '#EA580C', '#F97316', '#FB923C', '#FDBA74', '#FED7AA', '#F1F5F9'] 
  }
};

// نگاشت انگلیسی به فارسی (برای تبدیل عناوین انگلیسی دیتابیس به فارسی)
const EN_TO_FA_MAP = {
  // Q19: روش‌های تصفیه آب
  'None': 'هیچکدام',
  'Boil': 'جوشاندن',
  'Filter': 'فیلتر / تصفیه',
  'Bottled': 'بطری / آب معدنی',
  'Chlorine': 'کلرزنی / مواد شیمیایی',
  'Chlorine / Chemical': 'کلرزنی / مواد شیمیایی',
  'Bottled Water': 'بطری / آب معدنی',

  // Q22: فشار اقتصادی
  'No Pressure': 'بدون فشار',
  'Extremely High': 'بسیار زیاد',
  'Very High': 'خیلی زیاد',
  'High': 'زیاد',
  'Moderate': 'متوسط',
  'Low': 'کم',
  'Very Low': 'خیلی کم'
};

// نگاشت فارسی به انگلیسی (برای زمانی که دیتابیس فارسی ارسال می‌کند)
const FA_TO_EN_MAP = {
  // Q19: Water Treatment
  'None': 'None',
  'Boil': 'Boil',
  'Filter': 'Filter',
  'Bottled': 'Bottled Water',
  'Chlorine': 'Chlorine / Chemical',
  'هیچکدام': 'None',
  'هیچ': 'None',
  'جوشاندن': 'Boil',
  'فیلتر': 'Filter',
  'بطری/آب معدنی': 'Bottled Water',
  'کلرزنی': 'Chlorine',

  // Q22: Economic Pressure
  'بسیار زیاد': 'Extremely High',
  'خیلی زیاد': 'Very High',
  'زیاد': 'High',
  'متوسط': 'Moderate',
  'کم': 'Low',
  'خیلی کم': 'Very Low',
  'No Pressure': 'No Pressure',
  'Extremely High': 'Extremely High',
  'Very High': 'Very High',
  'High': 'High',
  'Moderate': 'Moderate',
  'Low': 'Low',
  'Very Low': 'Very Low'
};

export default function EconomicBurdenSection({ sectionE = {} }) {
  const { t, i18n } = useTranslation();
  const activeLang = i18n.language?.startsWith('fa') ? 'fa' : 'en';
  const isRtl = activeLang === 'fa';

  const [activeTopic, setActiveTopic] = useState('q19_practices');
  const [valueType, setValueType] = useState('count'); // 'count' or 'percentage'

  const getDomainKey = (topic) => {
    return topic === 'q19_practices' ? 'treatment_practices' : 'economic_pressure';
  };

  const getLabel = (rawKey) => {
    if (!rawKey) return '';
    const cleanKey = String(rawKey).trim();

    // ۱. ترجمه به فارسی
    if (activeLang === 'fa') {
      if (EN_TO_FA_MAP[cleanKey]) {
        return EN_TO_FA_MAP[cleanKey];
      }
      const translated = translateCategory(getDomainKey(activeTopic), cleanKey, 'fa');
      return translated || cleanKey;
    }

    // ۲. ترجمه به انگلیسی
    const translated = translateCategory(getDomainKey(activeTopic), cleanKey, 'en');
    return FA_TO_EN_MAP[cleanKey] || FA_TO_EN_MAP[translated] || translated || cleanKey;
  };

  const currentData = useMemo(() => {
    const rawMap = {
      q19_practices: sectionE?.q19_practices || sectionE?.q19 || [
        { key: 'None', count: 387, percentage: 100 },
        { key: 'Boil', count: 387, percentage: 100 },
        { key: 'Filter', count: 387, percentage: 100 },
        { key: 'Bottled', count: 387, percentage: 100 },
        { key: 'Chlorine', count: 387, percentage: 100 }
      ],
      q22_pressure: sectionE?.q22_pressure || sectionE?.q22 || [
        { key: 'بسیار زیاد', count: 95, percentage: 24.5 },
        { key: 'خیلی زیاد', count: 120, percentage: 31.0 },
        { key: 'زیاد', count: 85, percentage: 22.0 },
        { key: 'متوسط', count: 45, percentage: 11.6 },
        { key: 'کم', count: 25, percentage: 6.4 },
        { key: 'خیلی کم', count: 12, percentage: 3.1 },
        { key: 'هیچ', count: 5, percentage: 1.4 }
      ]
    };

    const rawItems = Array.isArray(rawMap[activeTopic]) ? rawMap[activeTopic] : [];

    return rawItems.map((item) => {
      const keyVal = item.key || item.name || item.label;
      return {
        rawName: keyVal,
        name: getLabel(keyVal),
        value: valueType === 'percentage' ? (item.percentage || 0) : (item.count || 0),
        percentage: item.percentage || 0,
        count: item.count || 0
      };
    });
  }, [sectionE, activeTopic, valueType, activeLang]);

  const totalHouseholds = useMemo(() => {
    if (currentData.length === 0) return 0;
    return Math.max(...currentData.map((d) => d.count));
  }, [currentData]);

  const theme = COLOR_PALETTES[activeTopic];

  return (
    <div style={{ ...styles.cardContainer, direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* هدر بخش */}
      <div style={styles.headerRow}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={styles.titleText}>
              {isRtl ? '۰۴ — راهکارهای مقابله و بار اقتصادی' : '04 — Coping Strategies and Economic Burden'}
            </h3>
            {activeTopic === 'q19_practices' && (
              <span style={styles.multipleBadge}>
                {isRtl ? 'چندپاسخی' : 'Multiple Allowed'}
              </span>
            )}
          </div>
          <p style={styles.subtitleText}>
            {activeTopic === 'q19_practices'
              ? (isRtl ? 'روش‌ها و رفتارهای خانوارها در تصفیه و سالم‌سازی آب' : 'Household water treatment practices and methods.')
              : (isRtl ? 'تحلیل میزان فشار اقتصادی و بار مالی تامین آب' : 'Evaluation of economic pressure and financial burden.')}
          </p>
        </div>

        {/* کنترلها */}
        <div style={styles.controlsGroup}>
          <div style={styles.filterBox}>
            <span style={styles.filterLabel}>{isRtl ? 'شاخص:' : 'Indicator:'}</span>
            <select
              value={activeTopic}
              onChange={(e) => setActiveTopic(e.target.value)}
              style={styles.selectInput}
            >
              <option value="q19_practices">
                {isRtl ? 'روش‌های تصفیه آب (کارت‌ها)' : 'Water Treatment Practices (Cards)'}
              </option>
              <option value="q22_pressure">
                {isRtl ? 'فشار اقتصادی (نمودار)' : 'Economic Pressure (Graph)'}
              </option>
            </select>
          </div>

          <div style={styles.toggleContainer}>
            <button
              type="button"
              onClick={() => setValueType('percentage')}
              style={{
                ...styles.toggleBtn,
                backgroundColor: valueType === 'percentage' ? theme.primary : 'transparent',
                color: valueType === 'percentage' ? '#FFFFFF' : '#64748B'
              }}
            >
              {isRtl ? 'درصد (%)' : 'Percentage (%)'}
            </button>
            <button
              type="button"
              onClick={() => setValueType('count')}
              style={{
                ...styles.toggleBtn,
                backgroundColor: valueType === 'count' ? theme.primary : 'transparent',
                color: valueType === 'count' ? '#FFFFFF' : '#64748B'
              }}
            >
              {isRtl ? 'تعداد' : 'Count'}
            </button>
          </div>
        </div>
      </div>

      {/* کارت‌های KPI */}
      <div style={styles.kpiRow}>
        <div style={{ ...styles.kpiCard, [isRtl ? 'borderRight' : 'borderLeft']: `4px solid ${theme.primary}` }}>
          <span style={styles.kpiTitle}>
            {isRtl ? 'مجموع خانوارهای بررسی‌شده' : 'TOTAL SURVEYED HOUSEHOLDS'}
          </span>
          <div style={styles.kpiValueRow}>
            <span style={{ ...styles.kpiValue, color: theme.primary }}>{totalHouseholds}</span>
            <span style={styles.kpiSubText}>
              {isRtl ? 'خانوار' : 'Households'}
            </span>
          </div>
        </div>

        <div style={styles.kpiCard}>
          <span style={styles.kpiTitle}>
            {isRtl ? 'دسته‌بندی‌های ارزیابی‌شده' : 'EVALUATED CATEGORIES'}
          </span>
          <div style={styles.kpiValueRow}>
            <span style={{ ...styles.kpiValue, color: '#0F172A' }}>{currentData.length}</span>
            <span style={styles.kpiSubText}>
              {isRtl ? 'دسته‌بندی فعال' : 'Active Categories'}
            </span>
          </div>
        </div>
      </div>

      {/* نمایش شرطی */}
      {activeTopic === 'q19_practices' ? (
        <div style={styles.gridContainer}>
          {currentData.map((item, index) => (
            <div key={index} style={styles.methodCard}>
              <div style={styles.cardHeader}>
                <span style={styles.methodName}>{item.name}</span>
                <span style={{ ...styles.methodBadge, color: theme.primary, backgroundColor: theme.bg }}>
                  {isRtl ? 'فعال' : 'Active'}
                </span>
              </div>
              <div style={styles.cardBody}>
                <span style={styles.cardValue}>
                  {valueType === 'percentage' ? `${item.percentage}%` : item.count}
                </span>
                <span style={styles.cardUnit}>
                  {valueType === 'percentage' 
                    ? (isRtl ? 'از کل خانوارها' : 'of households') 
                    : (isRtl ? 'خانوار' : 'households')}
                </span>
              </div>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressBar, width: `${item.percentage}%`, backgroundColor: theme.primary }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ width: '100%', height: '340px', marginTop: '15px', direction: 'ltr' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData} margin={{ top: 20, right: 20, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                unit={valueType === 'percentage' ? '%' : ''}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                orientation={isRtl ? 'right' : 'left'}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: 'none',
                  direction: isRtl ? 'rtl' : 'ltr'
                }}
                formatter={(val) => [
                  valueType === 'percentage' 
                    ? `${val}%` 
                    : `${val} ${isRtl ? 'خانوار' : 'households'}`,
                  isRtl ? 'مقدار' : 'Value'
                ]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={36}>
                {currentData.map((_, idx) => (
                  <Cell key={`bar-${idx}`} fill={theme.set[idx % theme.set.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

const styles = {
  cardContainer: {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
  border: '1px solid #F1F5F9',
  
  // اضافه کردن این سه خط برای یکسان‌سازی ارتفاع:
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justify: 'space-between'
},
  headerRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px'
  },
  titleText: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: '#0F172A'
  },
  subtitleText: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: '#64748B'
  },
  multipleBadge: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '6px'
  },
  controlsGroup: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  filterBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#F8FAFC',
    padding: '4px 10px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0'
  },
  filterLabel: {
    fontSize: '12px',
    color: '#64748B',
    fontWeight: '500'
  },
  selectInput: {
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '13px',
    color: '#1E293B',
    fontWeight: '600',
    outline: 'none',
    cursor: 'pointer'
  },
  toggleContainer: {
    display: 'flex',
    backgroundColor: '#F1F5F9',
    borderRadius: '10px',
    padding: '3px'
  },
  toggleBtn: {
    padding: '5px 12px',
    fontSize: '12px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  kpiRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  kpiCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column'
  },
  kpiTitle: {
    fontSize: '11px',
    color: '#64748B',
    fontWeight: '700'
  },
  kpiValueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginTop: '4px'
  },
  kpiValue: {
    fontSize: '22px',
    fontWeight: '800'
  },
  kpiSubText: {
    fontSize: '12px',
    color: '#475569',
    fontWeight: '500'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px'
  },
  methodCard: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  methodName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1E293B'
  },
  methodBadge: {
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  cardBody: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
    marginBottom: '12px'
  },
  cardValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#0F172A'
  },
  cardUnit: {
    fontSize: '12px',
    color: '#64748B',
    fontWeight: '500'
  },
  progressTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: '#E2E8F0',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease'
  }
};