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
  q05: { primary: '#00B4D8', accent: '#E0F7FA' },
  q06: { primary: '#10B981', accent: '#ECFDF5' },
  q07: { primary: '#06B6D4', accent: '#CFFAFE' },
  q08: { primary: '#8B5CF6', accent: '#F5F3FF' }
};

const TOPIC_DESCRIPTIONS = {
  q05: {
    fa: 'ارزیابی و تحلیل منابع اصلی تامین آب آشامیدنی و مصارف خانگی.',
    en: 'Analysis of primary drinking and domestic water sources.'
  },
  q06: {
    fa: 'بررسی وضعیت اتصال، پایداری و عملکرد شبکه آبرسانی شهری.',
    en: 'Evaluation of urban water network connection and operational status.'
  },
  q07: {
    fa: 'تحلیل توزیع عمق چاه‌های آب موجود و سطح آب‌های زیرزمینی.',
    en: 'Analysis of existing well depths and groundwater table levels.'
  },
  q08: {
    fa: 'بررسی روند حفر چاه‌های جدید و میزان تعمیق چاه‌های قدیمی.',
    en: 'Overview of new well drilling and deepening trends of existing wells.'
  }
};

const FA_TO_EN_MAP = {
  // Q05: Main Water Source
  'چاه خانگی': 'Private Well',
  'شبکه شهری': 'City Network',
  'تانکر/آب‌فروش': 'Water Tanker / Vendor',
  'تانکر / آب فروش': 'Water Tanker / Vendor',
  'چاه مشترک': 'Shared Well',
  'همسایه': 'Neighbor',

  // Q06: Network Status
  'متصل': 'Connected',
  'غیر متصل': 'Not Connected',
  'قطع': 'Disconnected',
  'وصل نیست': 'Not Connected',
  'وصل و فعال': 'Connected & Active',
  'وصل اما غیرفعال': 'Connected but Inactive',

  // Q07: Well Depth
  'کمتر از ۲۰م': 'Less than 20m',
  'کمتر از 20m': 'Less than 20m',
  '۲۰ تا ۴۰م': '20m to 40m',
  '20 تا 40m': '20m to 40m',
  'تا ۴۰ م ۲۰': '20m to 40m',
  'تا 40m 20': '20m to 40m',
  '۴۱ تا ۷۰م': '41m to 70m',
  '41 تا 70m': '41m to 70m',
  'تا ۴۰م ۴۱': '41m to 70m',
  'تا 40m 41': '41m to 70m',
  'تا ۷۰م ۴۱': '41m to 70m',
  'بیشتر از ۷۰م': 'More than 70m',
  'بیشتر از 70m': 'More than 70m',
  'چاه ندارم': 'No Well',

  // Q08: Well Deepening / Frequency & Trends
  'حفر جدید': 'New Drilling',
  'تعمیق': 'Deepening',
  'بدون تغییر': 'No Change',
  'یک بار': 'Once',
  'یکبار': 'Once',
  'خیر': 'No',
  'دو بار یا بیشتر': 'Twice or More',
  'دوبار یا بیشتر': 'Twice or More'
};

export default function WaterSourceSection({ filters = {} }) {
  const { t, i18n } = useTranslation();
  const activeLang = i18n.language?.startsWith('fa') ? 'fa' : 'en';
  const isRtl = activeLang === 'fa';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sectionBData, setSectionBData] = useState(null);

  const [activeTopic, setActiveTopic] = useState('q05');
  const [valueType, setValueType] = useState('percentage');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await fetchWaterSurveyAnalytics(filters);
      const details = res?.sectionB?.details || res?.sectionB || null;
      setSectionBData(details);
    } catch (err) {
      console.error('Error fetching Section B analytics:', err);
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
      case 'q05': return 'water_source';
      case 'q06': return 'network_connection';
      case 'q07': return 'well_depth';
      case 'q08': return 'well_deepening';
      default: return '';
    }
  };

  const getLabel = (rawKey) => {
    if (!rawKey) return '';
    const cleanKey = String(rawKey).trim();

    if (activeLang === 'en') {
      const translated = translateCategory(getDomainKey(activeTopic), cleanKey, 'en');
      return FA_TO_EN_MAP[cleanKey] || FA_TO_EN_MAP[translated] || translated;
    }

    return translateCategory(getDomainKey(activeTopic), cleanKey, 'fa') || cleanKey;
  };

  const chartData = useMemo(() => {
    if (!sectionBData || !sectionBData[activeTopic]) return [];
    const rawItems = sectionBData[activeTopic]?.data || [];

    return rawItems.map((item) => {
      const keyVal = item.key || item.name || item.label || item.option;
      return {
        rawName: keyVal,
        name: getLabel(keyVal),
        value: valueType === 'percentage' ? (item.percentage || 0) : (item.count || 0),
        percentage: item.percentage || 0,
        count: item.count || 0
      };
    });
  }, [sectionBData, activeTopic, valueType, activeLang]);

  const topMetric = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;
    return chartData.reduce((prev, current) => (prev.value > current.value ? prev : current), chartData[0]);
  }, [chartData]);

  if (loading) {
    return (
      <div style={styles.cardContainer}>
        <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
          <p>{t('analytics.loading') || (isRtl ? 'در حال بارگذاری داده‌ها...' : 'Loading analytics data...')}</p>
        </div>
      </div>
    );
  }

  if (error || !sectionBData) {
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

  const currentTheme = COLOR_PALETTES[activeTopic] || COLOR_PALETTES.q05;

  return (
    <div style={{ ...styles.cardContainer, direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* هدر بالا */}
      <div style={{ ...styles.headerRow, flexDirection: 'row' }}>
        <div>
          <h3 style={styles.titleText}>
            {t('analytics.sections.waterSourceAccess') || (isRtl ? '۰۱ — منبع و دسترسی به آب' : '01 — Water Source and Access')}
          </h3>
          <p style={styles.subtitleText}>
            {TOPIC_DESCRIPTIONS[activeTopic]?.[activeLang] || TOPIC_DESCRIPTIONS[activeTopic]?.fa}
          </p>
        </div>

        {/* فیلترها و دکمه سوئیچ واحد */}
        <div style={{ ...styles.controlsGroup, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <div style={styles.filterBox}>
            <span style={styles.filterLabel}>{isRtl ? 'شاخص:' : 'Indicator:'}</span>
            <select
              value={activeTopic}
              onChange={(e) => setActiveTopic(e.target.value)}
              style={styles.selectInput}
            >
              <option value="q05">{t('analytics.questions.q05') || (isRtl ? 'منبع اصلی آب آشامیدنی' : 'Main Source of Drinking Water')}</option>
              <option value="q06">{t('analytics.questions.q06') || (isRtl ? 'وضعیت شبکه شهری' : 'Urban Network Status')}</option>
              <option value="q07">{t('analytics.questions.q07') || (isRtl ? 'عمق چاه‌های خانوار' : 'Household Well Depth')}</option>
              <option value="q08">{t('analytics.questions.q08') || (isRtl ? 'تغییرات و حفر چاه' : 'Well Deepening Trends')}</option>
            </select>
          </div>

          <div style={styles.toggleContainer}>
            <button
              type="button"
              onClick={() => setValueType('percentage')}
              style={{
                ...styles.toggleBtn,
                backgroundColor: valueType === 'percentage' ? '#00B4D8' : 'transparent',
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
                backgroundColor: valueType === 'count' ? '#00B4D8' : 'transparent',
                color: valueType === 'count' ? '#FFFFFF' : '#64748B'
              }}
            >
              {isRtl ? 'تعداد' : 'Count'}
            </button>
          </div>
        </div>
      </div>

      {/* کارت‌های خلاصه (KPI Cards) */}
      <div style={styles.kpiRow}>
        <div style={{ ...styles.kpiCard, [isRtl ? 'borderRight' : 'borderLeft']: `4px solid #00B4D8` }}>
          <span style={styles.kpiTitle}>
            {isRtl ? 'بیشترین سهم ثبت‌شده' : 'HIGHEST RECORDED SHARE'}
          </span>
          <div style={styles.kpiValueRow}>
            <span style={{ ...styles.kpiValue, color: '#00B4D8' }}>
              {topMetric ? (valueType === 'percentage' ? `${topMetric.percentage}%` : topMetric.count) : 'N/A'}
            </span>
            <span style={styles.kpiSubText}>
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

      {/* نمودار افقی با اصلاح کامل موقعیت محور Y و مارجین‌ها در RTL */}
      <div style={{ width: '100%', height: '340px', marginTop: '15px', direction: 'ltr' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={
              isRtl
                ? { top: 10, right: 30, left: 140, bottom: 0 }
                : { top: 10, right: 30, left: 140, bottom: 0 }
            }
          >
            <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#F1F5F9" />
            <XAxis
              type="number"
              unit={valueType === 'percentage' ? '%' : ''}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={130}
              axisLine={false}
              tickLine={false}
              orientation={isRtl ? 'left' : 'left'}
              tick={{
                fill: '#334155',
                fontSize: 13,
                fontWeight: 500,
                textAnchor: isRtl ? 'end' : 'end'
              }}
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
              radius={[0, 6, 6, 0]}
              barSize={22}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={currentTheme.primary} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
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
} ,
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
  retryBtn: {
    marginTop: '12px',
    padding: '8px 16px',
    backgroundColor: '#00B4D8',
    color: '#FFF',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500'
  }
};