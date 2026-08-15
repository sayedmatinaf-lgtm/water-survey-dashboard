import React, { useMemo, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

export default function GeographicSummary({ data = [] }) {
  const [sortAsc, setSortAsc] = useState(false);

  const summary = useMemo(() => {
    const counts = {};
    data.forEach(d => {
      const loc = d.district || 'Unassigned';
      counts[loc] = (counts[loc] || 0) + 1;
    });

    const total = data.length || 1;
    const items = Object.entries(counts).map(([district, count]) => ({
      district,
      count,
      percentage: Math.round((count / total) * 100)
    }));

    return items.sort((a, b) => sortAsc ? a.count - b.count : b.count - a.count);
  }, [data, sortAsc]);

  return (
    <div className="card">
      <div className="summary-header">
        <div>
          <h3 className="card-title">Geographic Summary</h3>
          <p className="card-subtitle">Distribution by District</p>
        </div>
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="btn"
        >
          <ArrowUpDown size={12} />
          Sort
        </button>
      </div>

      <div className="table-container" style={{ maxHeight: '240px', overflowY: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Location</th>
              <th style={{ textAlign: 'right' }}>Surveys</th>
              <th style={{ textAlign: 'right' }}>%</th>
            </tr>
          </thead>
          <tbody>
            {summary.map(item => (
              <tr key={item.district}>
                <td style={{ fontWeight: 600 }}>{item.district}</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{item.count}</td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{item.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}