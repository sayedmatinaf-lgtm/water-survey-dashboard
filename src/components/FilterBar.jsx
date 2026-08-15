import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function FilterBar({ filters, setFilters, availableOptions, onReset }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        {/* District Filter */}
        <select
          value={filters.district}
          onChange={(e) => setFilters(f => ({ ...f, district: e.target.value }))}
          className="select-input"
        >
          <option value="">All Districts</option>
          {availableOptions.districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* Water Source Filter */}
        <select
          value={filters.waterSource}
          onChange={(e) => setFilters(f => ({ ...f, waterSource: e.target.value }))}
          className="select-input"
        >
          <option value="">All Water Sources</option>
          {availableOptions.waterSources.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
          className="select-input"
        >
          <option value="">All Survey Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Verified">Verified</option>
          <option value="Pending Review">Pending Review</option>
        </select>
      </div>

      <button onClick={onReset} className="btn">
        <RotateCcw size={14} />
        Reset Filters
      </button>
    </div>
  );
}