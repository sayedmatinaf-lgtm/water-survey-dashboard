import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '../utils/numberFormatter';

const QUALITY_COLORS = {
  Safe: '#16a34a',
  Moderate: '#d97706',
  Unsafe: '#dc2626',
  Unknown: '#64748b'
};

const STATUS_KEYS = {
  'سالم': 'Safe',
  'تا حدی': 'Moderate',
  'سالم نیست': 'Unsafe',
  'نامشخص': 'Unknown',
  'Safe': 'Safe',
  'Moderate': 'Moderate',
  'Unsafe': 'Unsafe',
  'Unknown': 'Unknown'
};

export default function WaterQualityChart({ data = [] }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const isFa = currentLang === 'fa';

  const statusLabels = {
    Safe: isFa ? 'سالم' : 'Safe',
    Moderate: isFa ? 'تا حدی' : 'Moderate',
    Unsafe: isFa ? 'سالم نیست' : 'Unsafe',
    Unknown: isFa ? 'نامشخص' : 'Unknown'
  };

  const chartData = useMemo(() => {
    const counts = {
      Safe: 0,
      Moderate: 0,
      Unsafe: 0,
      Unknown: 0
    };

    data.forEach((item) => {
      const rawStatus = item.perceived_safety;
      const key = STATUS_KEYS[rawStatus] || 'Unknown';
      counts[key] += 1;
    });

    const total = data.length;

    return Object.entries(counts).map(([key, count]) => ({
      key,
      label: statusLabels[key],
      count,
      percentage: total ? Math.round((count / total) * 100) : 0
    }));
  }, [data, isFa, statusLabels]);

  return (
    <div className="card">
      <div style={{ marginBottom: '16px' }}>
        <h3 className="card-title">
          {isFa ? 'ارزیابی مصئونیت آب' : 'Water Safety Assessment'}
        </h3>
        <p className="card-subtitle">
          {isFa ? 'ارزیابی کیفیت آب بر اساس پاسخ‌های سروی' : 'Perceived water safety based on survey responses'}
        </p>
      </div>

      <div style={{ height: '192px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => formatNumber(val, currentLang)}
            />
            <Tooltip
              formatter={(value, name, props) => [
                isFa
                  ? `${formatNumber(value, currentLang)} پاسخ (${formatNumber(props.payload.percentage, currentLang)}٪)`
                  : `${value} responses (${props.payload.percentage}%)`,
                isFa ? 'پاسخ‌ها' : 'Responses'
              ]}
              contentStyle={{
                backgroundColor: '#0f172a',
                color: '#fff',
                borderRadius: '6px',
                border: 'none',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={QUALITY_COLORS[entry.key]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-legend-grid">
        {chartData.map((item) => (
          <div key={item.key} className="legend-item">
            <div className="legend-label">
              <span
                className="status-dot"
                style={{ backgroundColor: QUALITY_COLORS[item.key] }}
              />
              <span className="legend-text">{item.label}</span>
            </div>
            <span className="legend-value">
              {isFa
                ? `${formatNumber(item.count, currentLang)} (${formatNumber(item.percentage, currentLang)}٪)`
                : `${item.count} (${item.percentage}%)`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}