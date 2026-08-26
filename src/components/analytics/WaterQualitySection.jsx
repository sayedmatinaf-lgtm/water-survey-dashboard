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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { translateCategory } from '../../utils/dataTranslations';

const COLOR_PALETTES = {
  q13_taste: { primary: '#0284C7', set: ['#0284C7', '#06B6D4', '#38BDF8', '#7DD3FC', '#BAE6FD'] },
  q16_change: { primary: '#DB2777', set: ['#DB2777', '#EC4899', '#F472B6', '#FBCFE8', '#FCE7F3'] },
  q17_safety: { primary: '#0D9488', set: ['#0D9488', '#14B8A6', '#2DD4BF', '#99F6E4', '#CCFBF1'] }
};

const TOPIC_DESCRIPTIONS = {
  q13_taste: {
    fa: 'ارزیابی کیفیت، طعم و بو و ظاهر آب آشامیدنی خانوارها.',
    en: 'Evaluation of water taste, odor, and physical appearance.'
  },
  q16_change: {
    fa: 'تحلیل تغییرات مشاهده‌شده در کیفیت آب طی ماه‌های اخیر.',
    en: 'Analysis of observed changes in water quality over recent months.'
  },
  q17_safety: {
    fa: 'بررسی درک خانوارها از سلامت و ایمنی بهداشتی آب مصرفی.',
    en: 'Evaluation of household perceived safety and healthiness of water.'
  }
};

const FA_TO_EN_MAP = {
  // Q13: Taste / Quality
  'عالی': 'Excellent',
  'خوب': 'Good',
  'متوسط': 'Moderate',
  'بد': 'Bad',
  'خیلی بد': 'Very Bad',
  'دارای طعم/بو': 'Has Taste/Odor',
  'بدون طعم و بو': 'No Taste or Odor',
  'شور': 'Salty',
  'تلخ': 'Bitter',
  'کدر': 'Turbid / Cloudy',
  'نامطبوع': 'Unpleasant',
  'فلزی': 'Metallic',

  // Q16: Quality Change
  'بدون تغییر': 'No Change',
  'بهتر شده': 'Improved',
  'بهتر': 'Improved',
  'بدتر شده': 'Worsened',
  'بدتر': 'Worsened',
  'خیلی بدتر': 'Much Worse',
  'خیلی بدتر شده': 'Much Worse',
  'متغیر': 'Fluctuating',
  'نامشخص': 'Unknown',

  // Q17: Perceived Safety / Healthiness
  'کاملا امن': 'Completely Safe',
  'کاملاً امن': 'Completely Safe',
  'نسبتا امن': 'Relatively Safe',
  'نسبتاً امن': 'Relatively Safe',
  'تا حدی': 'Partially / Somewhat',
  'سالم': 'Safe / Healthy',
  'سالم نیست': 'Unsafe / Unhealthy',
  'ناامن': 'Unsafe',
  'خیلی ناامن': 'Very Unsafe',
  'نمیدانم': 'Do not know',
  'نمی‌دانم': 'Do not know'
};

const fixBidiText = (text, lang) => {
  if (!text) return '';
  const str = String(text).trim();
  if (FA_TO_EN_MAP[str]) {
    return lang === 'en' ? FA_TO_EN_MAP[str] : str;
  }
  return null;
};

export default function WaterQualitySection({ sectionD = {} }) {
  const { t, i18n } = useTranslation();
  const activeLang = i18n.language?.startsWith('fa') ? 'fa' : 'en';
  const isRtl = activeLang === 'fa';

  const [activeTopic, setActiveTopic] = useState('q13_taste');
  const [valueType, setValueType] = useState('percentage');
  const [chartType, setChartType] = useState('pie'); // 'pie' or 'bar'

  const getDomainKey = (topic) => {
    switch (topic) {
      case 'q13_taste': return 'water_taste';
      case 'q16_change': return 'quality_change';
      case 'q17_safety': return 'perceived_safety';
      default: return '';
    }
  };

  const getLabel = (rawKey) => {
    if (!rawKey) return '';
    const cleanKey = String(rawKey).trim();

    const fixed = fixBidiText(cleanKey, activeLang);
    if (fixed) return fixed;

    if (activeLang === 'en') {
      const translated = translateCategory(getDomainKey(activeTopic), cleanKey, 'en');
      return FA_TO_EN_MAP[translated] || translated;
    }

    return translateCategory(getDomainKey(activeTopic), cleanKey, 'fa') || cleanKey;
  };

  const chartData = useMemo(() => {
    const rawMap = {
      q13_taste: sectionD?.q13_taste || sectionD?.q13 || [],
      q16_change: sectionD?.q16_change || sectionD?.q16 || [],
      q17_safety: sectionD?.q17_safety || sectionD?.q17 || []
    };

    const rawItems = Array.isArray(rawMap[activeTopic]) ? rawMap[activeTopic] : [];

    return rawItems.map((item) => {
      const keyVal = item.key || item.name || item.label || item.option;
      return {
        rawName: keyVal,
        name: getLabel(keyVal),
        value: valueType === 'percentage' ? (item.percentage || item.value || 0) : (item.count || item.total || 0),
        percentage: item.percentage || item.value || 0,
        count: item.count || item.total || 0
      };
    });
  }, [sectionD, activeTopic, valueType, activeLang]);

  const topMetric = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;
    return chartData.reduce((prev, current) => (prev.value > current.value ? prev : current), chartData[0]);
  }, [chartData]);

  const currentTheme = COLOR_PALETTES[activeTopic] || COLOR_PALETTES.q13_taste;

  return (
    <div style={{ ...styles.cardContainer, direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <div style={{ ...styles.headerRow, flexDirection: 'row' }}>
        <div>
          <h3 style={styles.titleText}>
            {t('analytics.sections.waterQuality') || (isRtl ? '۰۳ — کیفیت و سلامت آب' : '03 — Water Quality & Safety')}
          </h3>
          <p style={styles.subtitleText}>
            {TOPIC_DESCRIPTIONS[activeTopic]?.[activeLang] || TOPIC_DESCRIPTIONS[activeTopic]?.fa}
          </p>
        </div>

        {/* Controls */}
        <div style={{ ...styles.controlsGroup, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <div style={styles.filterBox}>
            <span style={styles.filterLabel}>{isRtl ? 'شاخص:' : 'Indicator:'}</span>
            <select
              value={activeTopic}
              onChange={(e) => setActiveTopic(e.target.value)}
              style={styles.selectInput}
            >
              <option value="q13_taste">{t('analytics.questions.q13') || (isRtl ? 'کیفیت و طعم آب' : 'Water Taste & Quality')}</option>
              <option value="q16_change">{t('analytics.questions.q16') || (isRtl ? 'تغییرات کیفیت آب' : 'Water Quality Change')}</option>
              <option value="q17_safety">{t('analytics.questions.q17') || (isRtl ? 'امنیت و سلامت آب' : 'Perceived Water Safety')}</option>
            </select>
          </div>

          {/* Toggle Type Switch */}
          <div style={styles.toggleContainer}>
            <button
              type="button"
              onClick={() => setChartType('pie')}
              style={{
                ...styles.toggleBtn,
                backgroundColor: chartType === 'pie' ? currentTheme.primary : 'transparent',
                color: chartType === 'pie' ? '#FFFFFF' : '#64748B'
              }}
            >
              {isRtl ? 'دائره‌ای (Pie)' : 'Pie Chart'}
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              style={{
                ...styles.toggleBtn,
                backgroundColor: chartType === 'bar' ? currentTheme.primary : 'transparent',
                color: chartType === 'bar' ? '#FFFFFF' : '#64748B'
              }}
            >
              {isRtl ? 'ستونی (Bar)' : 'Bar Chart'}
            </button>
          </div>

          {/* Toggle Value Switch */}
          <div style={styles.toggleContainer}>
            <button
              type="button"
              onClick={() => setValueType('percentage')}
              style={{
                ...styles.toggleBtn,
                backgroundColor: valueType === 'percentage' ? '#0F172A' : 'transparent',
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
                backgroundColor: valueType === 'count' ? '#0F172A' : 'transparent',
                color: valueType === 'count' ? '#FFFFFF' : '#64748B'
              }}
            >
              {isRtl ? 'تعداد' : 'Count'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={styles.kpiRow}>
        <div style={{ ...styles.kpiCard, [isRtl ? 'borderRight' : 'borderLeft']: `4px solid ${currentTheme.primary}` }}>
          <span style={styles.kpiTitle}>
            {isRtl ? 'بیشترین سهم ثبت‌شده' : 'HIGHEST RECORDED SHARE'}
          </span>
          <div style={{ ...styles.kpiValueRow, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
            <span style={{ ...styles.kpiValue, color: currentTheme.primary, whiteSpace: 'nowrap' }}>
              {topMetric ? (valueType === 'percentage' ? `${topMetric.percentage}%` : topMetric.count) : 'N/A'}
            </span>
            <span 
              dir={isRtl ? 'rtl' : 'ltr'} 
              style={{ 
                ...styles.kpiSubText, 
                whiteSpace: 'nowrap', 
                display: 'inline-block',
                direction: isRtl ? 'rtl' : 'ltr' 
              }}
            >
              {topMetric ? getLabel(topMetric.rawName || topMetric.name) : ''}
            </span>
          </div>
        </div>

        <div style={styles.kpiCard}>
          <span style={styles.kpiTitle}>
            {isRtl ? 'تعداد کل گزینه‌های ارزیابی' : 'TOTAL EVALUATED CATEGORIES'}
          </span>
          <div style={styles.kpiValueRow}>
            <span style={{ ...styles.kpiValue, color: '#0F172A' }}>{chartData.length}</span>
            <span style={styles.kpiSubText}>
              {isRtl ? 'دسته‌بندی فعال' : 'Active Categories'}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Display Area */}
      {chartData.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginTop: '15px' }}>
          <div style={{ flex: '1 1 350px', height: '380px' }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={125}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={currentTheme.set[idx % currentTheme.set.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '10px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: 'none',
                      direction: isRtl ? 'rtl' : 'ltr'
                    }}
                    formatter={(val) => [
                      valueType === 'percentage' ? `${val}%` : `${val} ${isRtl ? 'خانوار' : 'households'}`,
                      isRtl ? 'مقدار' : 'Value'
                    ]}
                  />
                </PieChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 12 }} />
                  <YAxis unit={valueType === 'percentage' ? '%' : ''} axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} orientation={isRtl ? 'right' : 'left'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '10px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: 'none',
                      direction: isRtl ? 'rtl' : 'ltr'
                    }}
                    formatter={(val) => [
                      valueType === 'percentage' ? `${val}%` : `${val} ${isRtl ? 'خانوار' : 'households'}`,
                      isRtl ? 'مقدار' : 'Value'
                    ]}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={36}>
                    {chartData.map((_, idx) => (
                      <Cell key={`bar-${idx}`} fill={currentTheme.set[idx % currentTheme.set.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Legend Table */}
          <div style={{ flex: '1 1 250px', padding: '10px 20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '12px' }}>
              {isRtl ? 'راهنمای توزیع شاخص:' : 'Category Breakdown:'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chartData.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: currentTheme.set[idx % currentTheme.set.length] }}></span>
                    <span style={{ color: '#1E293B', fontWeight: '500' }}>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: '700', color: '#0F172A' }}>
                    {valueType === 'percentage' ? `${item.percentage}%` : item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.noDataContainer}>
          <p style={styles.noDataText}>
            {isRtl ? 'اطلاعاتی برای این شاخص ثبت نشده است.' : 'No data available for this indicator.'}
          </p>
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
    color: '#0F172A',
    letterSpacing: '-0.02em'
  },
  subtitleText: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: '#64748B',
    lineHeight: '1.5'
  },
  controlsGroup: {
    display: 'flex',
    flexWrap: 'wrap',
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
    marginBottom: '20px'
  },
  kpiCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  kpiTitle: {
    fontSize: '11px',
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: '0.05em'
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
  noDataContainer: {
    height: '220px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    border: '1px dashed #CBD5E1',
    marginTop: '15px'
  },
  noDataText: {
    color: '#94A3B8',
    fontSize: '14px',
    fontWeight: '500'
  }
};