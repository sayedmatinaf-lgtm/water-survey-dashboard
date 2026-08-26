import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function CombinedSurveyAnalyticsCard({
  suggestions = [],
  trendData = [],
  lang
}) {
  const { t, i18n } = useTranslation();
  
  // پشتیبانی همزمان از i18n و prop ورودی lang
  const currentLang = lang || i18n.language || 'fa';
  const isRtl = currentLang.startsWith('fa');

  const [term, setTerm] = useState('');
  const [timeRange, setTimeRange] = useState('daily'); // 'daily' | 'weekly' | 'monthly'

  // داده‌های پیش‌فرض نمودار روند
  const defaultTrendData = [
    { date: '۱۴۰۴/۰۱/۱۱', count: 12 },
    { date: '۱۴۰۴/۰۱/۱۰', count: 45 },
    { date: '۱۴۰۴/۰۱/۱۱', count: 8 },
    { date: '۱۴۰۴/۰۱/۱۲', count: 60 },
    { date: '۱۴۰۵/۰۱/۱۰', count: 165 },
    { date: '۱۴۰۵/۰۱/۱۱', count: 80 },
    { date: '۱۴۰۵/۰۱/۱۲', count: 50 }
  ];

  const chartData = trendData.length > 0 ? trendData : defaultTrendData;

  // فیلتر کردن پیشنهادها براساس متن، ولسوالی/ناحیه و ولایت
  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(
      (s) =>
        s.text?.toLowerCase().includes(term.toLowerCase()) ||
        s.district?.toLowerCase().includes(term.toLowerCase()) ||
        s.province?.toLowerCase().includes(term.toLowerCase())
    );
  }, [suggestions, term]);

  return (
    <div style={{ ...styles.card, direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* ----------------- بخش اول: هدر و نمودار روند ----------------- */}
      <div style={styles.headerRow}>
        {/* عنوان و زیرعنوان هدر */}
        <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
          <h3 style={styles.titleText}>
            {isRtl ? 'روند جمع‌آوری سروی' : 'Survey Collection Trend'}
          </h3>
          <p style={styles.subtitleText}>
            {isRtl
              ? 'تعداد نقاط سروی جمع‌آوری‌شده در طول زمان'
              : 'Number of survey points collected over time'}
          </p>
        </div>

        {/* دکمه‌های فیلتر زمانی */}
        <div style={styles.timeFilterContainer}>
          <button
            type="button"
            onClick={() => setTimeRange('daily')}
            style={{
              ...styles.timeBtn,
              backgroundColor: timeRange === 'daily' ? '#FFFFFF' : 'transparent',
              color: timeRange === 'daily' ? '#2563EB' : '#64748B',
              boxShadow: timeRange === 'daily' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {isRtl ? 'روزانه' : 'Daily'}
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('weekly')}
            style={{
              ...styles.timeBtn,
              backgroundColor: timeRange === 'weekly' ? '#FFFFFF' : 'transparent',
              color: timeRange === 'weekly' ? '#2563EB' : '#64748B',
              boxShadow: timeRange === 'weekly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {isRtl ? 'هفتگی' : 'Weekly'}
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('monthly')}
            style={{
              ...styles.timeBtn,
              backgroundColor: timeRange === 'monthly' ? '#FFFFFF' : 'transparent',
              color: timeRange === 'monthly' ? '#2563EB' : '#64748B',
              boxShadow: timeRange === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {isRtl ? 'ماهانه' : 'Monthly'}
          </button>
        </div>
      </div>

      {/* نمودار منحنی */}
      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
              orientation={isRtl ? 'right' : 'left'}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div style={styles.tooltipBox}>
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '4px' }}>
                        {isRtl ? `تاریخ/زمان: ${payload[0].payload.date}` : `Date: ${payload[0].payload.date}`}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#60A5FA' }}>
                        {isRtl ? `تعداد سروی : ${payload[0].value}` : `Surveys: ${payload[0].value}`}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#2563EB"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCount)"
              dot={{ r: 3, fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#1D4ED8', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <hr style={styles.divider} />

      {/* ----------------- بخش دوم: پیشنهادها و نظرات مردم ----------------- */}
      <div style={styles.commentsHeader}>
        <div>
          <h4 style={styles.commentsTitle}>
            {isRtl ? 'پیشنهادهای مردم' : 'Community Suggestions'}
          </h4>
          <p style={styles.commentsSubtitle}>
            {isRtl
              ? 'پاسخ‌های آزاد درباره نیازهای عاجل و راهکارها'
              : 'Open-ended responses regarding urgent needs and solutions'}
          </p>
        </div>
        <span style={styles.badge}>
          {filteredSuggestions.length} {isRtl ? 'پاسخ' : 'Responses'}
        </span>
      </div>

      {/* کادر جستجو */}
      <div style={styles.searchWrapper}>
        <Search size={16} style={{ ...styles.searchIcon, [isRtl ? 'right' : 'left']: '12px' }} />
        <input
          type="text"
          style={{
            ...styles.searchInput,
            paddingRight: isRtl ? '36px' : '12px',
            paddingLeft: isRtl ? '12px' : '36px'
          }}
          placeholder={isRtl ? 'جستجو در پیشنهادها...' : 'Search suggestions...'}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      {/* لیست نظرات */}
      <div style={styles.listContainer}>
        {filteredSuggestions.length === 0 ? (
          <div style={styles.emptyState}>
            {isRtl ? 'هیچ پیشنهادی دریافت نشد.' : 'No suggestions found.'}
          </div>
        ) : (
          filteredSuggestions.map((item, idx) => (
            <div
              key={item.id || idx}
              style={{
                ...styles.commentCard,
                borderRight: isRtl ? '4px solid #2563EB' : 'none',
                borderLeft: isRtl ? 'none' : '4px solid #2563EB'
              }}
            >
              <p style={styles.commentText}>"{item.text}"</p>
              <div style={styles.commentMeta}>
                <span>{item.district || '-'}</span>
                {item.province ? ` (${item.province})` : ''}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid #F1F5F9',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '24px'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  timeFilterContainer: {
    display: 'flex',
    backgroundColor: '#F1F5F9',
    padding: '3px',
    borderRadius: '10px',
    gap: '2px'
  },
  timeBtn: {
    border: 'none',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
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
  chartWrapper: {
    width: '100%',
    marginBottom: '10px',
    direction: 'ltr'
  },
  tooltipBox: {
    backgroundColor: '#0F172A',
    borderRadius: '8px',
    padding: '8px 12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #F1F5F9',
    margin: '16px 0'
  },
  commentsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px'
  },
  commentsTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '700',
    color: '#0F172A'
  },
  commentsSubtitle: {
    margin: '2px 0 0 0',
    fontSize: '12px',
    color: '#64748B'
  },
  badge: {
    backgroundColor: '#EFF6FF',
    color: '#2563EB',
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '14px'
  },
  searchIcon: {
    position: 'absolute',
    color: '#94A3B8'
  },
  searchInput: {
    width: '100%',
    paddingTop: '9px',
    paddingBottom: '9px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    backgroundColor: '#F8FAFC',
    fontSize: '13px',
    outline: 'none',
    color: '#1E293B'
  },
  listContainer: {
    maxHeight: '280px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  commentCard: {
    backgroundColor: '#F8FAFC',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0'
  },
  commentText: {
    margin: '0 0 6px 0',
    fontSize: '13px',
    color: '#1E293B',
    lineHeight: '1.5'
  },
  commentMeta: {
    fontSize: '11px',
    color: '#64748B',
    fontWeight: '500'
  },
  emptyState: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: '13px',
    padding: '20px 0'
  }
};