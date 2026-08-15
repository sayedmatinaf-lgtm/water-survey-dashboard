import React, { useState, useMemo } from 'react';
import { Search, Download, Eye } from 'lucide-react';

export default function SurveyTable({ data = [], onSelectRecord }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.point_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.province?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.water_source?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportCSV = () => {
    const headers = ['Point ID', 'Survey Date', 'Province', 'District', 'Water Source', 'Water Quality', 'Water Available', 'Latitude', 'Longitude'];
    const rows = filteredData.map(d => [
      d.point_id, d.survey_date, d.province, d.district, d.water_source, d.water_quality, d.water_available ? 'Yes' : 'No', d.latitude, d.longitude
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `water_survey_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card">
      <div className="table-header">
        <div>
          <h3 className="card-title">Recent Survey Records</h3>
          <p className="card-subtitle">Filtered view of physical point assessments</p>
        </div>
        <div className="table-actions">
          <div className="search-wrapper">
            <Search className="search-icon" size={14} />
            <input
              type="text"
              placeholder="Search Point ID or Location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
          </div>
          <button onClick={exportCSV} className="btn">
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Point ID</th>
              <th>Date</th>
              <th>Province</th>
              <th>District</th>
              <th>Water Source</th>
              <th>Quality</th>
              <th>Availability</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id || row.point_id}>
                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{row.point_id}</td>
                <td style={{ color: 'var(--text-muted)' }}>{row.survey_date}</td>
                <td>{row.province}</td>
                <td>{row.district}</td>
                <td>{row.water_source}</td>
                <td>
                  <span className={`badge ${
                    row.water_quality === 'Safe' ? 'badge-success' :
                    row.water_quality === 'Moderate' ? 'badge-warning' :
                    'badge-danger'
                  }`}>
                    {row.water_quality}
                  </span>
                </td>
                <td>
                  <span className={`badge ${row.water_available ? 'badge-info' : 'badge-neutral'}`}>
                    {row.water_available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => onSelectRecord(row)}
                    className="action-btn"
                    title="View details"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <span>
          Showing {filteredData.length ? ((currentPage - 1) * pageSize) + 1 : 0} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} records
        </span>
        <div className="pagination-buttons">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="btn"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}