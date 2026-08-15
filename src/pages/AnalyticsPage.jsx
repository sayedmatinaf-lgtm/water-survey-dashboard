import React, { useState, useEffect, useMemo } from 'react';
import { waterSurveyService } from '../services/waterSurveyService';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import {
  BarChart3,
  Filter,
  RotateCcw,
  Loader2,
  Droplets,
  ShieldAlert,
  Wifi,
  Clock,
  Sparkles,
  Heart,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

// Color Palettes
const PRIMARY_PALETTE = ['#2563eb', '#0284c7', '#0d9488', '#16a34a', '#d97706', '#dc2626', '#64748b'];
const SAFETY_COLORS = {
  'Safe': '#16a34a',
  'At Risk': '#d97706',
  'Unsafe': '#dc2626',
  'Unknown': '#64748b'
};

export default function AnalyticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Global Analytics Filters
  const [districtFilter, setDistrictFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [networkFilter, setNetworkFilter] = useState('');
  const [safetyFilter, setSafetyFilter] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const result = await waterSurveyService.getAllSurveys();
        setData(result || []);
      } catch (err) {
        console.error('Error fetching analytics dataset:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter Options derived from database
  const filterOptions = useMemo(() => {
    const districts = new Set();
    const sources = new Set();
    const dates = new Set();
    const networks = new Set();
    const safeties = new Set();

    data.forEach(item => {
      if (item.district) districts.add(item.district);
      const src = item.q5_source || item.water_source;
      if (src) sources.add(src);
      if (item.survey_date) dates.add(item.survey_date);
      const net = item.q6_network || item.network_connection;
      if (net) networks.add(net);
      const safe = item.q18_safe || item.perceived_safety;
      if (safe) safeties.add(safe);
    });

    return {
      districts: Array.from(districts).sort(),
      sources: Array.from(sources).sort(),
      dates: Array.from(dates).sort(),
      networks: Array.from(networks).sort(),
      safeties: Array.from(safeties).sort()
    };
  }, [data]);

  // Client-side Filtered Dataset
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const itemSource = item.q5_source || item.water_source || '';
      const itemNetwork = item.q6_network || item.network_connection || '';
      const itemSafety = item.q18_safe || item.perceived_safety || '';

      const matchesDistrict = !districtFilter || item.district === districtFilter;
      const matchesSource = !sourceFilter || itemSource === sourceFilter;
      const matchesDate = !dateFilter || item.survey_date === dateFilter;
      const matchesNetwork = !networkFilter || itemNetwork === networkFilter;
      const matchesSafety = !safetyFilter || itemSafety === safetyFilter;

      return matchesDistrict && matchesSource && matchesDate && matchesNetwork && matchesSafety;
    });
  }, [data, districtFilter, sourceFilter, dateFilter, networkFilter, safetyFilter]);

  const total = filteredData.length || 1;

  // SECTION 1 — Water Source Analysis
  const sourceAnalytics = useMemo(() => {
    const counts = {};
    filteredData.forEach(d => {
      const src = d.q5_source || d.water_source || 'Unspecified';
      counts[src] = (counts[src] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredData, total]);

  // SECTION 2 — Water Safety Analysis
  const safetyAnalytics = useMemo(() => {
    const counts = { 'Safe': 0, 'At Risk': 0, 'Unsafe': 0, 'Unknown': 0 };
    filteredData.forEach(d => {
      const safe = d.q18_safe || d.perceived_safety;
      if (safe === 'سالم' || safe === 'Safe') counts['Safe']++;
      else if (safe === 'تا حدی' || safe === 'At Risk' || safe === 'Moderate') counts['At Risk']++;
      else if (safe === 'سالم نیست' || safe === 'Unsafe') counts['Unsafe']++;
      else counts['Unknown']++;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  }, [filteredData, total]);

  // SECTION 3 — Network Status
  const networkAnalytics = useMemo(() => {
    const counts = { 'Active': 0, 'Not Connected': 0, 'Connected but Inactive': 0, 'Unspecified': 0 };
    filteredData.forEach(d => {
      const net = d.q6_network || d.network_connection;
      if (net === 'وصل و فعال' || net === 'Active') counts['Active']++;
      else if (net === 'وصل نیست' || net === 'Not Connected') counts['Not Connected']++;
      else if (net === 'وصل اما غیر فعال' || net === 'Connected but Inactive') counts['Connected but Inactive']++;
      else counts['Unspecified']++;
    });

    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100)
      }));
  }, [filteredData, total]);

  // SECTION 4 — Water Availability
  const availabilityAnalytics = useMemo(() => {
    const counts = {
      'Always sufficient': 0,
      'Mostly sufficient': 0,
      'Sometimes insufficient': 0,
      'Often insufficient': 0,
      'Unspecified': 0
    };

    filteredData.forEach(d => {
      const suff = d.q9_sufficiency || d.water_sufficiency;
      if (suff === 'همیشه کافی' || suff === 'Always sufficient') counts['Always sufficient']++;
      else if (suff === 'اکثرا کافی' || suff === 'Mostly sufficient') counts['Mostly sufficient']++;
      else if (suff === 'گاهی کم' || suff === 'Sometimes insufficient') counts['Sometimes insufficient']++;
      else if (suff === 'اغلب کم' || suff === 'Often insufficient') counts['Often insufficient']++;
      else counts['Unspecified']++;
    });

    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100)
      }));
  }, [filteredData, total]);

  // SECTION 5 — Water Quality Perception (Taste, Color, Odor, Quality Trend)
  const qualityPerception = useMemo(() => {
    const helper = (field) => {
      const counts = {};
      filteredData.forEach(d => {
        const val = d[field] || 'Unspecified';
        counts[val] = (counts[val] || 0) + 1;
      });
      return Object.entries(counts).map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100)
      }));
    };

    return {
      taste: helper('q14_taste'),
      color: helper('q15_color'),
      odor: helper('q16_odor'),
      trend: helper('q17_trend')
    };
  }, [filteredData, total]);

  // SECTION 6 — Water Treatment Practices
  const treatmentAnalytics = useMemo(() => {
    let none = 0, boil = 0, filter = 0, bottled = 0, chlorine = 0;

    filteredData.forEach(d => {
      if (d.q20a_none || d.treatment_none) none++;
      if (d.q20b_boil || d.treatment_boil) boil++;
      if (d.q20c_filter || d.treatment_filter) filter++;
      if (d.q20d_bottled || d.treatment_bottled) bottled++;
      if (d.q20e_chlor || d.treatment_chlorine) chlorine++;
    });

    return [
      { name: 'None', count: none, percentage: Math.round((none / total) * 100) },
      { name: 'Boiling', count: boil, percentage: Math.round((boil / total) * 100) },
      { name: 'Household Filter', count: filter, percentage: Math.round((filter / total) * 100) },
      { name: 'Bottled Water', count: bottled, percentage: Math.round((bottled / total) * 100) },
      { name: 'Chlorination', count: chlorine, percentage: Math.round((chlorine / total) * 100) }
    ].sort((a, b) => b.count - a.count);
  }, [filteredData, total]);

  // SECTION 7 — Household Water Burden (Cost & Burden)
  const burdenAnalytics = useMemo(() => {
    const costCounts = {};
    const burdenCounts = {};

    filteredData.forEach(d => {
      const cost = d.q22_cost || d.water_cost || 'Unspecified';
      const burden = d.q23_burden || d.water_burden || 'Unspecified';

      costCounts[cost] = (costCounts[cost] || 0) + 1;
      burdenCounts[burden] = (burdenCounts[burden] || 0) + 1;
    });

    return {
      cost: Object.entries(costCounts).map(([name, count]) => ({ name, count, percentage: Math.round((count / total) * 100) })),
      burden: Object.entries(burdenCounts).map(([name, count]) => ({ name, count, percentage: Math.round((count / total) * 100) }))
    };
  }, [filteredData, total]);

  // SECTION 8 — Health Indicators
  const healthAnalytics = useMemo(() => {
    let diarrhea = 0, kidney = 0, skin = 0, other = 0;

    filteredData.forEach(d => {
      if (d.q24b_diarr || d.health_diarrhea) diarrhea++;
      if (d.q24c_kidney || d.health_kidney) kidney++;
      if (d.q24d_skin || d.health_skin) skin++;
      if (d.q24e_other || d.health_other) other++;
    });

    return [
      { name: 'Diarrhea', count: diarrhea, percentage: Math.round((diarrhea / total) * 100) },
      { name: 'Kidney Problems', count: kidney, percentage: Math.round((kidney / total) * 100) },
      { name: 'Skin Conditions', count: skin, percentage: Math.round((skin / total) * 100) },
      { name: 'Other Illnesses', count: other, percentage: Math.round((other / total) * 100) }
    ].sort((a, b) => b.count - a.count);
  }, [filteredData, total]);

  // SECTION 9 — Main Problems (q26_problem)
  const problemAnalytics = useMemo(() => {
    const counts = {};
    filteredData.forEach(d => {
      const prob = d.q26_problem || d.main_problem;
      if (prob) {
        counts[prob] = (counts[prob] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count, percentage: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 reported problems
  }, [filteredData, total]);

  // SECTION 10 — Proposed Solutions (q27_solution)
  const solutionAnalytics = useMemo(() => {
    const counts = {};
    filteredData.forEach(d => {
      const sol = d.q27_solution || d.proposed_solution;
      if (sol) {
        counts[sol] = (counts[sol] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count, percentage: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 proposed solutions
  }, [filteredData, total]);

  const resetFilters = () => {
    setDistrictFilter('');
    setSourceFilter('');
    setDateFilter('');
    setNetworkFilter('');
    setSafetyFilter('');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="card state-card">
          <Loader2 className="spinner" size={32} />
          <p className="state-title">Computing survey analytics dataset...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Survey Analytics</h1>
          <p className="page-subtitle">In-depth statistical cross-analysis of 387 water assessments</p>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="card filter-card">
        <div className="filter-grid">
          <div className="filter-item">
            <label className="filter-label">District</label>
            <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="select-input">
              <option value="">All Districts</option>
              {filterOptions.districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Water Source</label>
            <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="select-input">
              <option value="">All Water Sources</option>
              {filterOptions.sources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Survey Date</label>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="select-input">
              <option value="">All Dates</option>
              {filterOptions.dates.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Network Status</label>
            <select value={networkFilter} onChange={(e) => setNetworkFilter(e.target.value)} className="select-input">
              <option value="">All Network Statuses</option>
              {filterOptions.networks.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Water Safety</label>
            <select value={safetyFilter} onChange={(e) => setSafetyFilter(e.target.value)} className="select-input">
              <option value="">All Safety Levels</option>
              {filterOptions.safeties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="filter-item filter-reset-item">
            <label className="filter-label">&nbsp;</label>
            <button onClick={resetFilters} className="btn btn-secondary filter-reset-btn">
              <RotateCcw size={14} /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Analytical Sections */}
      <div className="analytics-grid">
        {/* SECTION 1: Water Source Analysis */}
        <div className="card analytics-card">
          <div className="card-header">
            <div>
              <h3 className="card-title"><Droplets size={16} /> Section 1 — Water Source Analysis</h3>
              <p className="card-subtitle">Distribution by primary water access category</p>
            </div>
          </div>

          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val, _, props) => [`${val} (${props.payload.percentage}%)`, 'Count']} />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 2: Water Safety Analysis */}
        <div className="card analytics-card">
          <div className="card-header">
            <div>
              <h3 className="card-title"><ShieldAlert size={16} /> Section 2 — Water Safety Assessment</h3>
              <p className="card-subtitle">Perceived safety rating distribution</p>
            </div>
          </div>

          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={safetyAnalytics}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                >
                  {safetyAnalytics.map((entry) => (
                    <Cell key={entry.name} fill={SAFETY_COLORS[entry.name] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip formatter={(val, name, props) => [`${val} (${props.payload.percentage}%)`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="legend-grid">
            {safetyAnalytics.map((item) => (
              <div key={item.name} className="legend-chip">
                <span className="dot" style={{ backgroundColor: SAFETY_COLORS[item.name] || '#64748b' }}></span>
                <span>{item.name}: <strong>{item.count}</strong> ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Network Status */}
        <div className="card analytics-card">
          <div className="card-header">
            <div>
              <h3 className="card-title"><Wifi size={16} /> Section 3 — Network Connection Status</h3>
              <p className="card-subtitle">Piped distribution grid connectivity</p>
            </div>
          </div>

          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={networkAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val, _, props) => [`${val} (${props.payload.percentage}%)`, 'Count']} />
                <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 4: Water Availability */}
        <div className="card analytics-card">
          <div className="card-header">
            <div>
              <h3 className="card-title"><Clock size={16} /> Section 4 — Water Sufficiency & Availability</h3>
              <p className="card-subtitle">Supply constancy reported by households</p>
            </div>
          </div>

          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={availabilityAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val, _, props) => [`${val} (${props.payload.percentage}%)`, 'Count']} />
                <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 5: Water Quality Perception */}
        <div className="card analytics-card card-full-width">
          <div className="card-header">
            <div>
              <h3 className="card-title"><Sparkles size={16} /> Section 5 — Water Quality Sensory Perception</h3>
              <p className="card-subtitle">Multi-parameter organoleptic assessment (Taste, Color, Odor, Quality Trend)</p>
            </div>
          </div>

          <div className="sub-charts-grid">
            <div className="sub-chart-box">
              <h4 className="sub-chart-title">Taste Perception</h4>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={qualityPerception.taste}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="sub-chart-box">
              <h4 className="sub-chart-title">Color Appearance</h4>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={qualityPerception.color}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="sub-chart-box">
              <h4 className="sub-chart-title">Odor Assessment</h4>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={qualityPerception.odor}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#14b8a6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="sub-chart-box">
              <h4 className="sub-chart-title">Quality Trend over Time</h4>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={qualityPerception.trend}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: Water Treatment Practices */}
        <div className="card analytics-card">
          <div className="card-header">
            <div>
              <h3 className="card-title"><Filter size={16} /> Section 6 — Household Water Treatment Practices</h3>
              <p className="card-subtitle">Purification methods utilized prior to consumption</p>
            </div>
          </div>

          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={treatmentAnalytics} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val, _, props) => [`${val} (${props.payload.percentage}%)`, 'Households']} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 7: Household Water Burden */}
        <div className="card analytics-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Section 7 — Household Water Cost & Financial Burden</h3>
              <p className="card-subtitle">Economic impact of household water procurement</p>
            </div>
          </div>

          <div className="table-container" style={{ maxHeight: 220, overflowY: 'auto' }}>
            <p className="font-semibold text-xs mb-1">Monthly Cost Category</p>
            <table className="data-table mb-3">
              <thead>
                <tr>
                  <th>Cost Range</th>
                  <th style={{ textAlign: 'right' }}>Households</th>
                  <th style={{ textAlign: 'right' }}>%</th>
                </tr>
              </thead>
              <tbody>
                {burdenAnalytics.cost.map(c => (
                  <tr key={c.name}>
                    <td>{c.name}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{c.count}</td>
                    <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{c.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 8: Health Indicators */}
        <div className="card analytics-card">
          <div className="card-header">
            <div>
              <h3 className="card-title"><Heart size={16} /> Section 8 — Reported Health Indicators</h3>
              <p className="card-subtitle">Prevalence of water-related health symptoms</p>
            </div>
          </div>

          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthAnalytics} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val, _, props) => [`${val} (${props.payload.percentage}%)`, 'Cases']} />
                <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 9: Main Problems */}
        <div className="card analytics-card">
          <div className="card-header">
            <div>
              <h3 className="card-title"><AlertCircle size={16} /> Section 9 — Primary Reported Water Problems</h3>
              <p className="card-subtitle">Most frequent community-identified challenges</p>
            </div>
          </div>

          <div style={{ height: 240 }}>
            {problemAnalytics.length === 0 ? (
              <p className="text-muted text-xs p-3">No water problems recorded in selected subset.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={problemAnalytics} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip formatter={(val, _, props) => [`${val} (${props.payload.percentage}%)`, 'Mentions']} />
                  <Bar dataKey="count" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* SECTION 10: Proposed Solutions */}
        <div className="card analytics-card card-full-width">
          <div className="card-header">
            <div>
              <h3 className="card-title"><Lightbulb size={16} /> Section 10 — Ranked Community Proposed Solutions</h3>
              <p className="card-subtitle">Community recommendations for infrastructure improvement</p>
            </div>
          </div>

          <div className="rank-list-grid">
            {solutionAnalytics.map((sol, index) => (
              <div key={sol.name} className="rank-card">
                <div className="rank-number">#{index + 1}</div>
                <div className="rank-content">
                  <h4 className="rank-title">{sol.name}</h4>
                  <p className="rank-meta">{sol.count} Households ({sol.percentage}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}