import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function SurveyTrend({ data = [] }) {
  const [timeframe, setTimeframe] = useState('Daily');

  const chartData = useMemo(() => {
    const counts = {};
    data.forEach(item => {
      let key = item.survey_date;
      if (timeframe === 'Weekly') {
        const d = new Date(item.survey_date);
        key = `Week ${Math.ceil(d.getDate() / 7)} (${d.toLocaleString('default', { month: 'short' })})`;
      } else if (timeframe === 'Monthly') {
        const d = new Date(item.survey_date);
        key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      }
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data, timeframe]);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Survey Collection Trend</h3>
          <p className="card-subtitle">Number of survey points collected over time</p>
        </div>
        <div className="toggle-group">
          {['Daily', 'Weekly', 'Monthly'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`toggle-btn ${timeframe === tf ? 'active' : ''}`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '256px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#trendGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}