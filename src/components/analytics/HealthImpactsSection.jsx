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
  q23_health: { primary: '#DC2626', bg: '#FEE2E2' },
  q24_link: { 
    primary: '#2563EB', 
    set: ['#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#CBD5E1'] 
  }
};

// نگاشت فارسی به انگلیسی
const FA_TO_EN_MAP = {
  // Q23: Health Problems
  'اسهال': 'Diarrhea',
  'بیماری‌های پوستی': 'Skin Diseases',
  'بیماری‌های کلیوی': 'Kidney Issues',
  'سایر': 'Other',
  'بیماری‌های گوارشی': 'Stomach/GI Issues',
  'کرم یا انگل': 'Worms/Parasites',
  'تب': 'Fever',
  'حصبه / تایفوئید': 'Typhoid',
  'هیچکدام': 'None',
  'هیچ': 'None',

  // Q24: Health Link to Water
  'بلی': 'Yes',
  'خیر': 'No',
  'مطمئناً': 'Definitely',
  'احتمالاً': 'Probably',
  'کاملا مرتبط': 'Definitely Related',
  'بسیار زیاد': 'Definitely / Strongly Related',
  'خیلی زیاد': 'Very High',
  'زیاد': 'Highly Likely',
  'متوسط': 'Moderately',
  'کم': 'Unlikely',
  'خیلی کم': 'Very Unlikely',
  'اصلا': 'Not Related',
  'نمی‌دانم': 'Don\'t Know'
};

// نگاشت انگلیسی به فارسی (برای حل مشکل عدم ترجمه کارت‌های انگلیسی)
const EN_TO_FA_MAP = {
  // Q23: Health Problems
  'Diarrhea': 'اسهال',
  'Skin': 'بیماری‌های پوستی',
  'Skin Diseases': 'بیماری‌های پوستی',
  'Kidney': 'بیماری‌های کلیوی',
  'Kidney Issues': 'بیماری‌های کلیوی',
  'Other': 'سایر موارد',
  'Stomach/GI Issues': 'بیماری‌های گوارشی',
  'Worms/Parasites': 'کرم یا انگل',
  'Fever': 'تب',
  'Typhoid': 'حصبه / تایفوئید',
  'None': 'هیچکدام',

  // Q24: Health Link to Water
  'Yes': 'بلی',
  'No': 'خیر',
  'Definitely': 'مطمئناً',
  'Probably': 'احتمالاً',
  'Definitely / Strongly Related': 'بسیار زیاد',
  'Definitely Related': 'کاملاً مرتبط',
  'Very High': 'خیلی زیاد',
  'Highly Likely': 'زیاد',
  'Moderately': 'متوسط',
  'Unlikely': 'کم',
  'Very Unlikely': 'خیلی کم',
  'Not Related': 'اصلاً',
  'Don\'t Know': 'نمی‌دانم'
};

export default function HealthImpactsSection({ sectionW = {} }) {
  const { t, i18n } = useTranslation();
  const activeLang = i18n.language?.startsWith('fa') ? 'fa' : 'en';
  const isRtl = activeLang === 'fa';

  const [activeTopic, setActiveTopic] = useState('q23_health');
  const [valueType, setValueType] = useState('count'); // 'count' | 'percentage'

  const getDomainKey = (topic) => {
    return topic === 'q23_health' ? 'health_problems' : 'health_link';
  };

  const getLabel = (rawKey) => {
    if (!rawKey) return '';
    const cleanKey = String(rawKey).trim();
    
    if (activeLang === 'en') {
      const translated = translateCategory(getDomainKey(activeTopic), cleanKey, 'en');
      return FA_TO_EN_MAP[cleanKey] || FA_TO_EN_MAP[translated] || translated || cleanKey;
    } else {
      // پشتیبانی کامل ترجمه به فارسی در صورت انگلیسی بودن کلید ورود
      const translated = translateCategory(getDomainKey(activeTopic), cleanKey, 'fa');
      return EN_TO_FA_MAP[cleanKey] || EN_TO_FA_MAP[translated] || translated || cleanKey;
    }
  };

  const currentData = useMemo(() => {
    const rawMap = {
      q23_health: sectionW?.q23_health_problems || sectionW?.q23_health || sectionW?.q23 || [
        { key: 'Diarrhea', count: 145, percentage: 37.4 },
        { key: 'Skin', count: 88, percentage: 22.7 },
        { key: 'Kidney', count: 64, percentage: 16.5 },
        { key: 'Other', count: 32, percentage: 8.2 },
        { key: 'None', count: 58, percentage: 15.2 }
      ],
      q24_link: sectionW?.q24_link_to_water || sectionW?.q24_link || sectionW?.q24 || [
        { key: 'Definitely', count: 175, percentage: 45.2 },
        { key: 'Probably', count: 110, percentage: 28.4 },
        { key: 'Moderately', count: 55, percentage: 14.2 },
        { key: 'Unlikely', count: 27, percentage: 7.0 },
        { key: 'Don\'t Know', count: 20, percentage: 5.2 }
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
  }, [sectionW, activeTopic, valueType, activeLang]);

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
              {isRtl ? '۰۵ — پیامدهای بهداشتی و ارتباط آن با آب' : '05 — Health Impacts and Water Attribution'}
            </h3>
            {activeTopic === 'q23_health' && (
              <span style={styles.multipleBadge}>
                {isRtl ? 'خوداظهاری / چندپاسخی' : 'Self-Reported / Multiple'}
              </span>
            )}
          </div>
          <p style={styles.subtitleText}>
            {activeTopic === 'q23_health'
              ? (isRtl ? 'بررسی شیوع بیماری‌های مرتبط با آب در بین خانوارها' : 'Incidence of water-related health issues in households.')
              : (isRtl ? 'میزان ارتباط بیماری‌ها با کیفیت آب مصرفی از دیدگاه خانوار' : 'Perceived correlation between health issues and water quality.')}
          </p>
        </div>

        {/* فیلترها و دکمه‌های کنترلی */}
        <div style={styles.controlsGroup}>
          <div style={styles.filterBox}>
            <span style={styles.filterLabel}>{isRtl ? 'شاخص:' : 'Indicator:'}</span>
            <select
              value={activeTopic}
              onChange={(e) => setActiveTopic(e.target.value)}
              style={styles.selectInput}
            >
              <option value="q23_health">
                {isRtl ? 'مشکلات بهداشتی مشاهده‌شده (کارت)' : 'Health Problems Encountered (Cards)'}
              </option>
              <option value="q24_link">
                {isRtl ? 'میزان ارتباط با کیفیت آب (نمودار)' : 'Perceived Link to Water Quality (Graph)'}
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

      {/* کارت‌های KPI بالایی */}
      <div style={styles.kpiRow}>
        <div style={{ ...styles.kpiCard, [isRtl ? 'borderRight' : 'borderLeft']: `4px solid ${theme.primary}` }}>
          <span style={styles.kpiTitle}>
            {isRtl ? 'مجموع پاسخ‌دهندگان' : 'TOTAL RESPONDENTS'}
          </span>
          <div style={styles.kpiValueRow}>
            <span style={{ ...styles.kpiValue, color: theme.primary }}>{totalHouseholds}</span>
            <span style={styles.kpiSubText}>{isRtl ? 'خانوار' : 'Households'}</span>
          </div>
        </div>

        <div style={styles.kpiCard}>
          <span style={styles.kpiTitle}>
            {isRtl ? 'دسته‌های گزارش‌شده' : 'REPORTED CATEGORIES'}
          </span>
          <div style={styles.kpiValueRow}>
            <span style={{ ...styles.kpiValue, color: '#0F172A' }}>{currentData.length}</span>
            <span style={styles.kpiSubText}>{isRtl ? 'گزینه فعال' : 'Active Options'}</span>
          </div>
        </div>
      </div>

      {/* نمایش شرطی کارت‌ها و نمودار */}
      {activeTopic === 'q23_health' ? (
        <div style={styles.gridContainer}>
          {currentData.map((item, index) => (
            <div key={index} style={styles.methodCard}>
              <div style={styles.cardHeader}>
                <span style={styles.methodName}>{item.name}</span>
                <span style={{ ...styles.methodBadge, color: theme.primary, backgroundColor: theme.bg }}>
                  {isRtl ? 'گزارش شده' : 'Reported'}
                </span>
              </div>
              <div style={styles.cardBody}>
                <span style={styles.cardValue}>
                  {valueType === 'percentage' ? `${item.percentage}%` : item.count}
                </span>
                <span style={styles.cardUnit}>
                  {valueType === 'percentage' 
                    ? (isRtl ? 'از خانوارها' : 'of households') 
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
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={42}>
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
    marginBottom: '24px'
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
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
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