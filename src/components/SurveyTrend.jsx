import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '../utils/numberFormatter';

export default function SurveyTrend({ data = [] }) {
  const [timeframe, setTimeframe] = useState('Daily');
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const isFa = currentLang.startsWith('fa');

  // پارسر دقیق برای تاریخ میلادی یا شمسی
  const parseSafeDate = (rawDate) => {
    if (!rawDate) return null;
    const str = String(rawDate).trim();

    // اگر تاریخ شمسی باشد (مثلاً 1405/05/10)
    const parts = str.split(/[-/]/).map(Number);
    if (parts.length === 3 && parts[0] >= 1300 && parts[0] <= 1500) {
      const gYear = parts[0] + 621; // تبدیل متناسب به میلادی برای محاسبات
      const d = new Date(gYear, parts[1] - 1, parts[2]);
      return isNaN(d.getTime()) ? null : d;
    }

    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  };

  const chartData = useMemo(() => {
    const groups = {};

    data.forEach(item => {
      const rawDate = item.survey_date;
      const d = parseSafeDate(rawDate);
      if (!d) return; // حذف داده‌های خراب یا معتبر نبودن تاریخ (مانند ۷۸۴)

      let groupKey = '';
      let sortKey = 0;
      let label = '';

      if (timeframe === 'Weekly') {
        const startOfWeek = new Date(d);
        startOfWeek.setDate(d.getDate() - d.getDay());
        sortKey = startOfWeek.getTime();
        
        const weekNum = Math.ceil(d.getDate() / 7);
        groupKey = `${d.getFullYear()}-W${weekNum}-${d.getMonth()}`;

        if (isFa) {
          const monthFa = new Intl.DateTimeFormat('fa-AF-u-ca-persian', { month: 'short' }).format(d);
          label = `هفته ${formatNumber(weekNum, currentLang)} (${monthFa})`;
        } else {
          const monthEn = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d);
          label = `Week ${weekNum} (${monthEn})`;
        }

      } else if (timeframe === 'Monthly') {
        const firstOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
        sortKey = firstOfMonth.getTime();
        groupKey = `${d.getFullYear()}-${d.getMonth()}`;

        label = isFa
          ? new Intl.DateTimeFormat('fa-AF-u-ca-persian', { month: 'long', year: 'numeric' }).format(d)
          : new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(d);

      } else {
        // Daily
        sortKey = d.getTime();
        groupKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

        label = isFa
          ? new Intl.DateTimeFormat('fa-AF-u-ca-persian', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
          : new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(d);
      }

      if (!groups[groupKey]) {
        groups[groupKey] = { sortKey, label, count: 0 };
      }
      groups[groupKey].count += 1;
    });

    return Object.values(groups)
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(g => ({
        date: g.label,
        count: g.count
      }));
  }, [data, timeframe, currentLang, isFa]);

  const timeframeLabels = {
    Daily: isFa ? 'روزانه' : 'Daily',
    Weekly: isFa ? 'هفتگی' : 'Weekly',
    Monthly: isFa ? 'ماهانه' : 'Monthly'
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            {isFa ? 'روند جمع‌آوری سروی' : 'Survey Collection Trend'}
          </h3>
          <p className="card-subtitle">
            {isFa ? 'تعداد نقاط سروی جمع‌آوری‌شده در طول زمان' : 'Number of survey points collected over time'}
          </p>
        </div>
        <div className="toggle-group">
          {['Daily', 'Weekly', 'Monthly'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`toggle-btn ${timeframe === tf ? 'active' : ''}`}
            >
              {timeframeLabels[tf]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '256px', width: '100%' }} dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart key={`${timeframe}-${currentLang}`} data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => formatNumber(val, currentLang)}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
              formatter={(value) => [formatNumber(value, currentLang), isFa ? 'تعداد سروی' : 'Surveys']}
              labelFormatter={(label) => `${isFa ? 'تاریخ/زمان:' : 'Date:'} ${label}`}
            />
            <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#trendGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}