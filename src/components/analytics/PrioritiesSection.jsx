import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { translateCategory } from '../../utils/dataTranslations';

// پلت رنگی مطابق با بخش 06
const CHART_COLORS = ['#0284C7', '#06B6D4', '#8B5CF6', '#EC4899', '#F97316', '#10B981', '#64748B'];

// نگاشت fallback برای کلمات جدید (فارسی / انگلیسی)
const PROBLEM_TRANSLATIONS = {
  water_shortage: { fa: 'کمبود آب', en: 'Water Shortage' },
  network_interruption: { fa: 'سکته‌گی شبکه', en: 'Network Interruption' },
  high_cost: { fa: 'هزینه زیاد', en: 'High Cost' },
  bad_quality: { fa: 'کیفیت بد', en: 'Poor Quality' },
  water_table_drop: { fa: 'افت سطح آب', en: 'Water Table Drop' },
  // کلیدهای فارسی مستقیم (در صورت دریافت مستقیم متن فارسی از دیتابیس)
  'کمبود آب': { fa: 'کمبود آب', en: 'Water Shortage' },
  'سکتگی شبکه': { fa: 'سکته‌گی شبکه', en: 'Network Interruption' },
  'سکته‌گی شبکه': { fa: 'سکته‌گی شبکه', en: 'Network Interruption' },
  'هزینه زیاد': { fa: 'هزینه زیاد', en: 'High Cost' },
  'کیفیت بد': { fa: 'کیفیت بد', en: 'Poor Quality' },
  'افت سطح آب': { fa: 'افت سطح آب', en: 'Water Table Drop' }
};

export default function PrioritiesSection({ sectionZ = {} }) {
  const { t, i18n } = useTranslation();
  const activeLang = i18n.language?.startsWith('fa') ? 'fa' : 'en';
  const isRtl = activeLang === 'fa';

  const [valueType, setValueType] = useState('percentage'); // 'percentage' | 'count'

  // تابع کمکی برای دریافت نام ترجمه‌شده آیتم‌ها
  const getItemLabel = (rawKey) => {
    // 1. بررسی در نگاشت‌های محلی جدید
    if (PROBLEM_TRANSLATIONS[rawKey]) {
      return PROBLEM_TRANSLATIONS[rawKey][activeLang];
    }
    // 2. استفاده از تابع ترجمه سیستم
    const translated = translateCategory('main_problem', rawKey, activeLang);
    if (translated && translated !== rawKey) {
      return translated;
    }
    return rawKey;
  };

  // پردازش داده‌های سوال ۲۵ (Primary Water Problem)
  const q25Data = useMemo(() => {
    const raw = sectionZ?.q25_problem || [];
    return raw.map((item) => {
      const rawKey = item.key || item.name || item.label || '';
      return {
        rawKey,
        name: getItemLabel(rawKey),
        percentage: item.percentage || item.value || 0,
        count: item.count || item.total || 0,
        value: valueType === 'percentage' ? (item.percentage || item.value || 0) : (item.count || item.total || 0)
      };
    });
  }, [sectionZ?.q25_problem, activeLang, valueType]);

  // شاخص KPI: بیشترین مشکل گزارش‌شده
  const topProblem = useMemo(() => {
    if (!q25Data || q25Data.length === 0) return null;
    return q25Data.reduce((prev, curr) => (prev.value > curr.value ? prev : curr), q25Data[0]);
  }, [q25Data]);

  const openResponses = sectionZ?.q26_open_responses || [];

  return (
    <div style={{ ...styles.cardContainer, direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* ۱. هدر و دکمه‌های کنترلی */}
      <div style={styles.headerRow}>
        <div>
          <h3 style={styles.titleText}>
            {t('analytics.sections.priorities') || (isRtl ? '۰۶ — اولویت‌ها و نظرات مردم' : '06 — Priorities and Opinions')}
          </h3>
          <p style={styles.subtitleText}>
            {isRtl
              ? 'تحلیل اصلی‌ترین مشکلات آب و جمع‌آوری پیشنهادها و راهکارهای محلی'
              : 'Analysis of primary water challenges and local community suggestions'}
          </p>
        </div>

        {/* دکمه‌های سوئیچ درصد / تعداد */}
        <div style={styles.controlsGroup}>
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

      {/* ۲. کارت‌های KPI خلاصه */}
      <div style={styles.kpiRow}>
        <div style={{ ...styles.kpiCard, [isRtl ? 'borderRight' : 'borderLeft']: '4px solid #0284C7' }}>
          <span style={styles.kpiTitle}>
            {isRtl ? 'اصلی‌ترین چالش آب' : 'PRIMARY REPORTED PROBLEM'}
          </span>
          <div style={styles.kpiValueRow}>
            <span style={{ ...styles.kpiValue, color: '#0284C7' }}>
              {topProblem ? (valueType === 'percentage' ? `${topProblem.percentage}%` : topProblem.count) : 'N/A'}
            </span>
            <span style={styles.kpiSubText}>
              {topProblem ? topProblem.name : ''}
            </span>
          </div>
        </div>

        <div style={styles.kpiCard}>
          <span style={styles.kpiTitle}>
            {isRtl ? 'تعداد کل پیشنهادهای ثبت‌شده' : 'TOTAL COMMUNITY SUGGESTIONS'}
          </span>
          <div style={styles.kpiValueRow}>
            <span style={{ ...styles.kpiValue, color: '#0F172A' }}>{openResponses.length}</span>
            <span style={styles.kpiSubText}>
              {isRtl ? 'پاسخ آزاد' : 'Open Responses'}
            </span>
          </div>
        </div>
      </div>

      {/* ۳. شبکه‌بندی اصلی (نمودار دایره‌ای + نظرات مردم) */}
      <div style={styles.grid2}>
        {/* کارت نمودار دایره‌ای */}
        <div style={styles.innerCard}>
          <h4 style={styles.cardHeaderTitle}>
            {t('analytics.questions.q25') || (isRtl ? 'مشکل اصلی آب' : 'Primary Water Problem')}
          </h4>

          {q25Data.length > 0 ? (
            <div style={styles.chartWrapper}>
              <div style={{ width: '100%', height: '220px', direction: 'ltr' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Pie
                      data={q25Data}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {q25Data.map((_, idx) => (
                        <Cell key={`cell-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
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
                </ResponsiveContainer>
              </div>

              {/* راهنمای گزینه‌ها (Legend) */}
              <div style={styles.legendContainer}>
                {q25Data.map((item, idx) => (
                  <div key={idx} style={styles.legendItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: CHART_COLORS[idx % CHART_COLORS.length],
                          flexShrink: 0
                        }}
                      />
                      <span style={{ fontSize: '12px', color: '#334155', fontWeight: '500' }}>
                        {item.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                      {valueType === 'percentage' ? `${item.percentage}%` : item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={styles.noDataBox}>
              <p style={styles.noDataText}>{t('analytics.noData') || (isRtl ? 'اطلاعاتی موجود نیست' : 'No data available')}</p>
            </div>
          )}
        </div>

        {/* کارت نظرات مردم */}
        <div style={styles.innerCard}>
          <h4 style={styles.cardHeaderTitle}>
            {t('analytics.questions.q26') || (isRtl ? 'پیشنهادها و راهکارهای مردم' : 'Community Suggestions and Solutions')}
          </h4>

          <div style={styles.responsesList}>
            {openResponses.length === 0 ? (
              <div style={styles.noDataBox}>
                <p style={styles.noDataText}>
                  {t('analytics.noData') || (isRtl ? 'هیچ پیشنهادی ثبت نشده است.' : 'No suggestions found.')}
                </p>
              </div>
            ) : (
              openResponses.map((item, idx) => (
                <div key={item.id || idx} style={styles.responseCard}>
                  <div style={styles.badgeRow}>
                    <span style={styles.districtBadge}>
                      {item.district || (isRtl ? 'ناحیه / ولسوالی' : 'District')}
                    </span>
                    {item.province && (
                      <span style={{ fontSize: '10px', color: '#94A3B8' }}>{item.province}</span>
                    )}
                  </div>
                  <p style={styles.responseText}>"{item.text}"</p>
                </div>
              ))
            )}
          </div>
        </div>
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
    alignItems: 'center',
    gap: '12px'
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
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px'
  },
  innerCard: {
    backgroundColor: '#FAFAFA',
    border: '1px solid #F1F5F9',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeaderTitle: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    fontWeight: '700',
    color: '#334155'
  },
  chartWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  legendContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    paddingTop: '8px',
    borderTop: '1px solid #E2E8F0'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  responsesList: {
    height: '300px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    paddingRight: '4px'
  },
  responseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    padding: '12px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  badgeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px'
  },
  districtBadge: {
    backgroundColor: '#EFF6FF',
    color: '#0284C7',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '6px'
  },
  responseText: {
    margin: 0,
    fontSize: '12px',
    color: '#1E293B',
    lineHeight: '1.5',
    fontStyle: 'italic'
  },
  noDataBox: {
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noDataText: {
    color: '#94A3B8',
    fontSize: '13px',
    fontWeight: '500'
  }
};