import React, { useState, useEffect, useMemo } from 'react';
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
import { fetchWaterSurveyAnalytics } from '../../services/waterSurveyAnalyticsService';
import { translateCategory } from '../../utils/dataTranslations';

const COLOR_PALETTES = {
  q09_sufficiency: { primary: '#00A8CC', accent: '#E0F7FA' },
  q10_availability: { primary: '#0284C7', accent: '#E0F2FE' },
  q11_outage_frequency: { primary: '#2563EB', accent: '#EFF6FF' },
  q12_restoration_time: { primary: '#4F46E5', accent: '#EEF2FF' },
  q13_fetch_neighbor: { primary: '#0D9488', accent: '#CCFBF1' }
};

const TOPIC_DESCRIPTIONS = {
  q09_sufficiency: {
    fa: 'ارزیابی میزان کفایت آب دریافت شده برای مصارف روزانه خانوار.',
    en: 'Evaluation of water adequacy for daily household needs.'
  },
  q10_availability: {
    fa: 'بررسی تعداد ساعات دسترسی روزانه خانوار به سیستم آبرسانی.',
    en: 'Daily water availability hours for households.'
  },
  q11_outage_frequency: {
    fa: 'تحلیل میزان و تناوب قطع شدن آب در طول هفته.',
    en: 'Analysis of weekly water outage and interruption frequency.'
  },
  q12_restoration_time: {
    fa: 'بررسی مدت زمان مورد نیاز برای وصل مجدد آب پس از قطعی.',
    en: 'Required duration for water restoration following an outage.'
  },
  q13_fetch_neighbor: {
    fa: 'ارزیابی نیاز خانوارها به تامین آب از بیرون یا همسایگان.',
    en: 'Evaluation of relying on external sources or neighbors for water.'
  }
};

// دیکشنری جامع نگاشت گزینه‌های فارسی به انگلیسی
const FA_TO_EN_MAP = {
  // --- Q09: Water Sufficiency ---
  'گاهی کم': 'Rarely Sufficient',
  'اغلب کم': 'Mostly Insufficient',
  'اکثرا کافی': 'Mostly Sufficient',
  'اکثراً کافی': 'Mostly Sufficient',
  'همیشه کافی': 'Always Sufficient',
  'کفایت دارد': 'Sufficient',
  'کفایت ندارد': 'Insufficient',
  'اصلا کافی نیست': 'Not Sufficient At All',
  'اصلاً کافی نیست': 'Not Sufficient At All',

  // --- Q10: Daily Availability Hours ---
  'less_4_hours': 'Less than 4 Hours',
  'کمتر از ۴ ساعت': 'Less than 4 Hours',
  'کمتر از 4 ساعت': 'Less than 4 Hours',
  'کمتر از ۴': 'Less than 4 Hours',
  'کمتر از 4': 'Less than 4 Hours',

  '4_11_hours': '4 to 11 Hours',
  '۴ تا ۱۱ ساعت': '4 to 11 Hours',
  '4 تا 11 ساعت': '4 to 11 Hours',
  '۴ تا ۱۱': '4 to 11 Hours',
  '4 تا 11': '4 to 11 Hours',

  '12_24_hours': '12 to 24 Hours',
  '۱۲ تا ۲۴ ساعت': '12 to 24 Hours',
  '12 تا 24 ساعت': '12 to 24 Hours',
  '۱۲ تا ۲۳': '12 to 23 Hours',
  '12 تا 23': '12 to 23 Hours',

  '24_hours': '24 Hours',
  '۲۴ ساعت': '24 Hours',
  '24 ساعت': '24 Hours',
  '۲۴ ساعته': '24 Hours',

  // --- Q11: Weekly Outage Frequency ---
  'هرگز': 'Never',
  'هیچ': 'None / Never',
  'بدون قطعی': 'No Outages',
  '۱ تا ۲ بار': '1 to 2 Times',
  '1 تا 2 بار': '1 to 2 Times',
  '۳ تا ۵ بار': '3 to 5 Times',
  '3 تا 5 بار': '3 to 5 Times',
  'بیش از ۵ بار': 'More than 5 Times',
  'بیش از 5 بار': 'More than 5 Times',
  'بیشتر از ۵': 'More than 5 Times',
  'روزانه': 'Daily',

  // --- Q12: Restoration Time ---
  'بلافاصله': 'Immediately',
  'چند ساعت': 'A few hours',
  'حدود یک روز': 'About a day',
  'یک روز کامل': 'Full day',
  '۱ روز': '1 Day',
  '1 روز': '1 Day',
  'چند روز': 'Multiple days',
  'بیش از یک روز': 'More than a day',
  'بیشتر از یک هفته': 'More than a week',
  'نامشخص': 'Unknown / Variable',

  // --- Q13: Fetching Water / Neighbor ---
  'بله': 'Yes',
  'خیر': 'No',
  'گاهی': 'Sometimes',
  'گاهی اوقات': 'Sometimes',
  'اغلب': 'Often',
  'همیشه': 'Always',
  'در صورت قطعی': 'Only during outages'
};

// تابع اختصاصی جهت اصلاح کامل متون به‌هم‌ریخته عددی (BiDi Fixer)
const fixBidiText = (text, lang) => {
  if (!text) return '';
  const str = String(text).trim();

  // نگاشت مستقیم گزینه‌های Q10
  if (str.includes('12_24') || str.includes('12 تا 24') || str.includes('۱۲ تا ۲۴') || str.includes('۱۲ ۲۴')) {
    return lang === 'en' ? '12 to 24 Hours' : '۱۲ تا ۲۴ ساعت';
  }
  if (str.includes('4_11') || str.includes('4 تا 11') || str.includes('۴ تا ۱۱')) {
    return lang === 'en' ? '4 to 11 Hours' : '۴ تا ۱۱ ساعت';
  }
  if (str.includes('less_4') || str.includes('کمتر از ۴') || str.includes('کمتر از 4')) {
    return lang === 'en' ? 'Less than 4 Hours' : 'کمتر از ۴ ساعت';
  }
  if (str.includes('24_hours') || str.includes('۲۴ ساعته') || str.includes('24 ساعته')) {
    return lang === 'en' ? '24 Hours' : '۲۴ ساعته';
  }

  return null;
};

const Q11_ALLOWED_KEYS = ['never', '1_2_times', '3_5_times', 'more_than_5_times'];

export default function QuantityAccessSection({ filters = {} }) {
  const { t, i18n } = useTranslation();
  const activeLang = i18n.language?.startsWith('fa') ? 'fa' : 'en';
  const isRtl = activeLang === 'fa';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sectionCData, setSectionCData] = useState(null);

  const [activeTopic, setActiveTopic] = useState('q09_sufficiency');
  const [valueType, setValueType] = useState('percentage');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await fetchWaterSurveyAnalytics(filters);
      const details = res?.sectionC?.details || res?.sectionC || null;
      setSectionCData(details);
    } catch (err) {
      console.error('Error fetching Section C analytics:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const getDomainKey = (topic) => {
    switch (topic) {
      case 'q09_sufficiency': return 'water_sufficiency';
      case 'q10_availability': return 'water_availability';
      case 'q11_outage_frequency': return 'outage_frequency';
      case 'q12_restoration_time': return 'restoration_time';
      case 'q13_fetch_neighbor': return 'fetch_neighbor';
      default: return '';
    }
  };

  const getLabel = (rawKey) => {
    if (!rawKey) return '';
    const cleanKey = String(rawKey).trim();

    // ۱. بررسی توسط تابع Fixer دستی
    const fixedText = fixBidiText(cleanKey, activeLang);
    if (fixedText) return fixedText;

    // ۲. در صورت عدم تطابق با حالت خاص، استفاده از FA_TO_EN_MAP یا سیستم ترجمه پروژه
    if (activeLang === 'en') {
      if (FA_TO_EN_MAP[cleanKey]) return FA_TO_EN_MAP[cleanKey];

      const translated = translateCategory(getDomainKey(activeTopic), cleanKey, 'en');
      const cleanTranslated = String(translated).trim();
      if (FA_TO_EN_MAP[cleanTranslated]) return FA_TO_EN_MAP[cleanTranslated];

      const enDigitsKey = cleanTranslated.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
      if (FA_TO_EN_MAP[enDigitsKey]) return FA_TO_EN_MAP[enDigitsKey];

      return cleanTranslated;
    }

    // ۳. حالت فارسی
    const faText = translateCategory(getDomainKey(activeTopic), cleanKey, 'fa') || cleanKey;
    return faText;
  };

  const getTopicDataFromResponse = (sectionData, topic) => {
    if (!sectionData) return null;
    if (sectionData[topic]) return sectionData[topic];

    const keyMap = {
      q09_sufficiency: ['q09_sufficiency', 'q09', 'sufficiency', 'water_sufficiency'],
      q10_availability: ['q10_availability', 'q10', 'availability', 'water_availability'],
      q11_outage_frequency: ['q11_outage_frequency', 'q11', 'outage_frequency', 'q11_outage'],
      q12_restoration_time: ['q12_restoration_time', 'q12', 'restoration_time', 'q12_restoration'],
      q13_fetch_neighbor: ['q13_fetch_neighbor', 'q13', 'fetch_neighbor', 'q13_fetch']
    };

    const possibleKeys = keyMap[topic] || [];
    for (const k of possibleKeys) {
      if (sectionData[k]) return sectionData[k];
    }
    return null;
  };

  const chartData = useMemo(() => {
    const targetTopicData = getTopicDataFromResponse(sectionCData, activeTopic);
    if (!targetTopicData) return [];

    let rawItems = Array.isArray(targetTopicData)
      ? targetTopicData
      : targetTopicData?.data || targetTopicData?.details || [];

    if (!Array.isArray(rawItems) || rawItems.length === 0) return [];

    if (activeTopic === 'q11_outage_frequency') {
      const filteredItems = rawItems.filter(item => {
        const itemKey = (item.key || item.name || item.label || item.option || '').toLowerCase();
        return Q11_ALLOWED_KEYS.some(k => itemKey.includes(k)) || rawItems.indexOf(item) < 4;
      });
      rawItems = filteredItems.length > 0 ? filteredItems.slice(0, 4) : rawItems.slice(0, 4);
    }

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
  }, [sectionCData, activeTopic, valueType, activeLang]);

  const topMetric = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;
    return chartData.reduce((prev, current) => (prev.value > current.value ? prev : current), chartData[0]);
  }, [chartData]);

  const currentTheme = COLOR_PALETTES[activeTopic] || COLOR_PALETTES.q09_sufficiency;

  if (loading) {
    return (
      <div style={styles.cardContainer}>
        <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
          <p>{t('analytics.loading') || (isRtl ? 'در حال بارگذاری داده‌ها...' : 'Loading analytics data...')}</p>
        </div>
      </div>
    );
  }

  if (error || !sectionCData) {
    return (
      <div style={styles.cardContainer}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#EF4444', fontWeight: '500' }}>
            {t('analytics.error') || (isRtl ? 'خطا در دریافت داده‌ها' : 'Error loading analytics data')}
          </p>
          <button onClick={loadData} style={styles.retryBtn}>
            {t('analytics.tryAgain') || (isRtl ? 'تلاش مجدد' : 'Try Again')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.cardContainer, direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <div style={{ ...styles.headerRow, flexDirection: 'row' }}>
        <div>
          <h3 style={styles.titleText}>
            {t('analytics.sections.quantityAccess') || (isRtl ? '۰۲ — کمیت و دسترسی روزانه' : '02 — Quantity and Daily Access')}
          </h3>
          <p style={styles.subtitleText}>
            {TOPIC_DESCRIPTIONS[activeTopic]?.[activeLang] || TOPIC_DESCRIPTIONS[activeTopic]?.fa}
          </p>
        </div>

        {/* Filter Select & Toggle Switches */}
        <div style={{ ...styles.controlsGroup, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <div style={styles.filterBox}>
            <span style={styles.filterLabel}>{isRtl ? 'شاخص:' : 'Indicator:'}</span>
            <select
              value={activeTopic}
              onChange={(e) => setActiveTopic(e.target.value)}
              style={styles.selectInput}
            >
              <option value="q09_sufficiency">{t('analytics.questions.q09') || (isRtl ? 'کفایت آب برای مصارف روزانه' : 'Water Sufficiency')}</option>
              <option value="q10_availability">{t('analytics.questions.q10') || (isRtl ? 'ساعات دسترسی روزانه به آب' : 'Daily Availability Hours')}</option>
              <option value="q11_outage_frequency">{t('analytics.questions.q11') || (isRtl ? 'تعداد قطعی آب در هفته' : 'Weekly Outage Frequency')}</option>
              <option value="q12_restoration_time">{t('analytics.questions.q12') || (isRtl ? 'مدت زمان وصل مجدد آب' : 'Restoration Time')}</option>
              <option value="q13_fetch_neighbor">{t('analytics.questions.q13') || (isRtl ? 'آوردن آب از خارج خانه/همسایه' : 'Fetching Water Elsewhere')}</option>
            </select>
          </div>

          <div style={styles.toggleContainer}>
            <button
              type="button"
              onClick={() => setValueType('percentage')}
              style={{
                ...styles.toggleBtn,
                backgroundColor: valueType === 'percentage' ? currentTheme.primary : 'transparent',
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
                backgroundColor: valueType === 'count' ? currentTheme.primary : 'transparent',
                color: valueType === 'count' ? '#FFFFFF' : '#64748B'
              }}
            >
              {isRtl ? 'تعداد' : 'Count'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
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

      {/* Vertical Chart Section */}
      {chartData.length > 0 ? (
        <div style={{ width: '100%', height: '360px', marginTop: '15px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }}
                interval={0}
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
                  valueType === 'percentage' ? `${val}%` : `${val} ${isRtl ? 'خانوار' : 'households'}`,
                  isRtl ? 'مقدار' : 'Value'
                ]}
              />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                barSize={32}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={currentTheme.primary} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={styles.noDataContainer}>
          <p style={styles.noDataText}>
            {isRtl 
              ? 'اطلاعاتی برای این شاخص ثبت نشده است.' 
              : 'No data available for this indicator.'}
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
  },
  retryBtn: {
    marginTop: '12px',
    padding: '8px 16px',
    backgroundColor: '#00A8CC',
    color: '#FFF',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500'
  }
};