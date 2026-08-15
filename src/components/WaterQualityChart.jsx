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

const QUALITY_COLORS = {
  'سالم': '#16a34a',
  'تا حدی': '#d97706',
  'سالم نیست': '#dc2626',
  'نامشخص': '#64748b'
};

export default function WaterQualityChart({ data = [] }) {
  const chartData = useMemo(() => {
    const counts = {
      'سالم': 0,
      'تا حدی': 0,
      'سالم نیست': 0,
      'نامشخص': 0
    };

    data.forEach((item) => {
      const status = item.perceived_safety;

      if (status === 'سالم') {
        counts['سالم'] += 1;
      } else if (status === 'تا حدی') {
        counts['تا حدی'] += 1;
      } else if (status === 'سالم نیست') {
        counts['سالم نیست'] += 1;
      } else {
        counts['نامشخص'] += 1;
      }
    });

    const total = data.length;

    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0
    }));
  }, [data]);

  return (
    <div className="card">
      <div style={{ marginBottom: '16px' }}>
        <h3 className="card-title">Water Safety Assessment</h3>
        <p className="card-subtitle">Perceived water safety based on survey responses</p>
      </div>

      <div style={{ height: '192px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <XAxis
              dataKey="status"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value, name, props) => [
                `${value} responses (${props.payload.percentage}%)`,
                'Responses'
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
                  key={entry.status}
                  fill={QUALITY_COLORS[entry.status]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-legend-grid">
        {chartData.map((item) => (
          <div key={item.status} className="legend-item">
            <div className="legend-label">
              <span
                className="status-dot"
                style={{ backgroundColor: QUALITY_COLORS[item.status] }}
              />
              <span className="legend-text">{item.status}</span>
            </div>
            <span className="legend-value">
              {item.count} ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}