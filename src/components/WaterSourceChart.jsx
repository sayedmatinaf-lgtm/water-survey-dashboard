import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#2563eb', '#0284c7', '#0d9488', '#16a34a', '#d97706', '#dc2626', '#64748b'];

export default function WaterSourceChart({ data = [] }) {
  const { chartData, total } = useMemo(() => {
    const counts = {};
    data.forEach(d => {
      const src = d.water_source || 'Other';
      counts[src] = (counts[src] || 0) + 1;
    });

    const formatted = Object.entries(counts).map(([name, count]) => ({
      name,
      value: count
    })).sort((a, b) => b.value - a.value);

    return { chartData: formatted, total: data.length };
  }, [data]);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <h3 className="card-title">Primary Water Sources</h3>
        <p className="card-subtitle" style={{ marginBottom: '8px' }}>Source category distribution</p>
        
        <div style={{ height: '176px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '6px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-container" style={{ maxHeight: '144px', overflowY: 'auto', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Water Source</th>
              <th style={{ textAlign: 'right' }}>Count</th>
              <th style={{ textAlign: 'right' }}>%</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item, idx) => (
              <tr key={item.name}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="status-dot" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  {item.name}
                </td>
                <td style={{ textAlign: 'right', fontWeight: 500 }}>{item.value}</td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                  {total ? Math.round((item.value / total) * 100) : 0}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}