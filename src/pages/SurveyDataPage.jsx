import React, { useState, useEffect, useMemo } from 'react';
import { waterSurveyService } from '../services/waterSurveyService';
import SurveyDetailsModal from '../components/SurveyDetailsModal';
import { Search, RotateCcw, Eye, ChevronLeft, ChevronRight, FileSpreadsheet, AlertCircle, Loader2 } from 'lucide-react';

export default function SurveyDataPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [safetyFilter, setSafetyFilter] = useState('');
  const [networkFilter, setNetworkFilter] = useState('');
  const [sufficiencyFilter, setSufficiencyFilter] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await waterSurveyService.getAllSurveys();
        setData(result || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching survey data:', err);
        setError('Failed to load survey records from database.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter options dynamically derived from real data
  const filterOptions = useMemo(() => {
    const districts = new Set();
    const sources = new Set();
    const safeties = new Set();
    const networks = new Set();
    const sufficiencies = new Set();

    data.forEach(item => {
      if (item.district) districts.add(item.district);
      const src = item.q5_source || item.water_source;
      if (src) sources.add(src);
      const safe = item.q18_safe || item.perceived_safety;
      if (safe) safeties.add(safe);
      const net = item.q6_network || item.network_connection;
      if (net) networks.add(net);
      const suff = item.q9_sufficiency || item.water_sufficiency;
      if (suff) sufficiencies.add(suff);
    });

    return {
      districts: Array.from(districts).sort(),
      sources: Array.from(sources).sort(),
      safeties: Array.from(safeties).sort(),
      networks: Array.from(networks).sort(),
      sufficiencies: Array.from(sufficiencies).sort()
    };
  }, [data]);

  // Client-side filtering with useMemo
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search check across point_id, locality, interviewer, district
      const term = searchTerm.toLowerCase().trim();
      const pointId = String(item.point_id || '').toLowerCase();
      const locality = String(item.locality || item.village || '').toLowerCase();
      const interviewer = String(item.interviewer || item.enumerator || '').toLowerCase();
      const district = String(item.district || '').toLowerCase();

      const matchesSearch = !term ||
        pointId.includes(term) ||
        locality.includes(term) ||
        interviewer.includes(term) ||
        district.includes(term);

      // Category filter checks
      const itemSource = item.q5_source || item.water_source || '';
      const itemSafety = item.q18_safe || item.perceived_safety || '';
      const itemNetwork = item.q6_network || item.network_connection || '';
      const itemSufficiency = item.q9_sufficiency || item.water_sufficiency || '';

      const matchesDistrict = !districtFilter || item.district === districtFilter;
      const matchesSource = !sourceFilter || itemSource === sourceFilter;
      const matchesSafety = !safetyFilter || itemSafety === safetyFilter;
      const matchesNetwork = !networkFilter || itemNetwork === networkFilter;
      const matchesSufficiency = !sufficiencyFilter || itemSufficiency === sufficiencyFilter;

      return matchesSearch && matchesDistrict && matchesSource && matchesSafety && matchesNetwork && matchesSufficiency;
    });
  }, [data, searchTerm, districtFilter, sourceFilter, safetyFilter, networkFilter, sufficiencyFilter]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, districtFilter, sourceFilter, safetyFilter, networkFilter, sufficiencyFilter]);

  // Paginated data view
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDistrictFilter('');
    setSourceFilter('');
    setSafetyFilter('');
    setNetworkFilter('');
    setSufficiencyFilter('');
    setCurrentPage(1);
  };

  // Helper safety badge mapping
  const getSafetyBadgeClass = (val) => {
    if (!val) return 'badge-neutral';
    if (val === 'سالم' || val === 'Safe') return 'badge-success';
    if (val === 'تا حدی' || val === 'At Risk' || val === 'Moderate') return 'badge-warning';
    if (val === 'سالم نیست' || val === 'Unsafe') return 'badge-danger';
    return 'badge-neutral';
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Survey Data</h1>
          <p className="page-subtitle">Browse, filter and review collected water survey records</p>
        </div>
        <div className="page-header-actions">
          <span className="stats-pill">
            <FileSpreadsheet size={14} />
            Total Records: <strong>{data.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="card filter-card">
        <div className="filter-grid">
          {/* Search Input */}
          <div className="filter-item search-box">
            <label className="filter-label">Search</label>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={14} />
              <input
                type="text"
                placeholder="Search Point ID, locality, interviewer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="select-input search-field"
              />
            </div>
          </div>

          {/* District Filter */}
          <div className="filter-item">
            <label className="filter-label">District</label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="select-input"
            >
              <option value="">All Districts</option>
              {filterOptions.districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Water Source Filter */}
          <div className="filter-item">
            <label className="filter-label">Water Source</label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="select-input"
            >
              <option value="">All Water Sources</option>
              {filterOptions.sources.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Water Safety Filter */}
          <div className="filter-item">
            <label className="filter-label">Water Safety</label>
            <select
              value={safetyFilter}
              onChange={(e) => setSafetyFilter(e.target.value)}
              className="select-input"
            >
              <option value="">All Safety Levels</option>
              {filterOptions.safeties.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Network Status Filter */}
          <div className="filter-item">
            <label className="filter-label">Network Status</label>
            <select
              value={networkFilter}
              onChange={(e) => setNetworkFilter(e.target.value)}
              className="select-input"
            >
              <option value="">All Network Statuses</option>
              {filterOptions.networks.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Water Availability Filter */}
          <div className="filter-item">
            <label className="filter-label">Water Availability</label>
            <select
              value={sufficiencyFilter}
              onChange={(e) => setSufficiencyFilter(e.target.value)}
              className="select-input"
            >
              <option value="">All Availability Options</option>
              {filterOptions.sufficiencies.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          <div className="filter-item filter-reset-item">
            <label className="filter-label">&nbsp;</label>
            <button onClick={handleResetFilters} className="btn btn-secondary filter-reset-btn">
              <RotateCcw size={14} />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="card state-card">
          <Loader2 className="spinner" size={28} />
          <p className="state-title">Loading survey database...</p>
        </div>
      ) : error ? (
        <div className="card state-card error-state">
          <AlertCircle size={28} />
          <p className="state-title">{error}</p>
        </div>
      ) : (
        <div className="card table-card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Point ID</th>
                  <th>District</th>
                  <th>Locality</th>
                  <th>Water Source</th>
                  <th>Safety</th>
                  <th>Network</th>
                  <th>Water Availability</th>
                  <th>Interviewer</th>
                  <th>Survey Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="empty-table-cell">
                      No water survey records match your active filters.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row) => {
                    const sourceVal = row.q5_source || row.water_source || '-';
                    const safetyVal = row.q18_safe || row.perceived_safety || '-';
                    const networkVal = row.q6_network || row.network_connection || '-';
                    const availVal = row.q9_sufficiency || row.water_sufficiency || '-';

                    return (
                      <tr key={row.id || row.point_id}>
                        <td className="font-semibold text-primary">{row.point_id || '-'}</td>
                        <td className="font-medium">{row.district || '-'}</td>
                        <td>{row.locality || row.village || '-'}</td>
                        <td>{sourceVal}</td>
                        <td>
                          <span className={`badge ${getSafetyBadgeClass(safetyVal)}`}>
                            {safetyVal}
                          </span>
                        </td>
                        <td>{networkVal}</td>
                        <td>{availVal}</td>
                        <td className="text-muted">{row.interviewer || row.enumerator || '-'}</td>
                        <td className="text-muted font-mono">{row.survey_date || '-'}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedRecord(row)}
                            className="btn btn-sm btn-primary action-view-btn"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="table-footer">
            <div className="pagination-info">
              Showing <strong>{filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong>–
              <strong>{Math.min(currentPage * pageSize, filteredData.length)}</strong> of <strong>{filteredData.length}</strong>
              {filteredData.length !== data.length && ` (filtered from ${data.length} total)`}
            </div>

            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-sm"
              >
                <ChevronLeft size={14} />
                Previous
              </button>
              <span className="pagination-page-indicator">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="btn btn-sm"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <SurveyDetailsModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
}