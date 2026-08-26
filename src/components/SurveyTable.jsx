import React, { useState, useMemo } from 'react';
import { Search, Download, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '../utils/numberFormatter';

export default function SurveyTable({ data = [], onSelectRecord }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const isFa = currentLang.startsWith('fa');

  // دیکشنری جامع ترجمه منابع آب (فارسی به انگلیسی و برعکس)
// دیکشنری دوطرفه و استاندارد منابع آب
const waterSourceMap = {
  // تبدیل از فارسی به انگلیسی
  'چاه خانگی': 'Domestic Well',
  'شبکه شهری': 'Urban Network',
  'چاه دستی': 'Hand Pump / Shallow Well',
  'چاه عمیق': 'Deep Well',
  'چشمه': 'Spring',
  'کاریز': 'Karez / Canal',
  'شبکه آبرسانی': 'Piped Network',
  'چاه': 'Well',
  'رودخانه': 'River',
  'تانکر': 'Water Tanker',

  // تبدیل از انگلیسی به فارسی
  'Domestic Well': 'چاه خانگی',
  'Urban Network': 'شبکه شهری',
  'Hand Pump / Shallow Well': 'چاه دستی',
  'Hand Pump': 'چاه دستی',
  'Deep Well': 'چاه عمیق',
  'Spring': 'چشمه',
  'Karez / Canal': 'کاریز',
  'Karez': 'کاریز',
  'Piped Network': 'شبکه آبرسانی',
  'Well': 'چاه',
  'River': 'رودخانه',
  'Water Tanker': 'تانکر'
};

const renderWaterSource = (source) => {
  if (!source) return '-';
  const trimmed = String(source).trim();

  // کلیدهای انگلیسی ممکن برای چک کردن حالت فارسی
  const englishValues = [
    'Domestic Well', 'Urban Network', 'Hand Pump / Shallow Well', 
    'Hand Pump', 'Deep Well', 'Spring', 'Karez / Canal', 'Karez', 
    'Piped Network', 'Well', 'River', 'Water Tanker'
  ];

  if (isFa) {
    // اگر زبان فارسی است و مقدار ورودی انگلیسی باشد، به فارسی تبدیل شود
    if (englishValues.includes(trimmed) && waterSourceMap[trimmed]) {
      return waterSourceMap[trimmed];
    }
    // اگر مقدار خودش فارسی است، همان را نشان بده
    return trimmed;
  } else {
    // اگر زبان انگلیسی است و مقدار ورودی فارسی باشد، به انگلیسی تبدیل شود
    if (waterSourceMap[trimmed]) {
      return waterSourceMap[trimmed];
    }
    return trimmed;
  }
};

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const translatedSource = renderWaterSource(item.water_source);
      return (
        item.point_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.province?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.water_source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        translatedSource.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, searchTerm, isFa]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportCSV = () => {
    const headers = [
      'Point ID', 'Survey Date', 'Province', 'District', 
      'Water Source', 'Water Quality', 'Water Available', 'Latitude', 'Longitude'
    ];
    const rows = filteredData.map(d => [
      d.point_id, d.survey_date, d.province, d.district, 
      renderWaterSource(d.water_source), d.water_quality, d.water_available ? 'Yes' : 'No', d.latitude, d.longitude
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

  // نمایش وضعیت کیفیت آب
  const renderQualityBadge = (quality) => {
    let text = quality || '-';
    if (isFa) {
      if (quality === 'Safe') text = 'مصئون';
      else if (quality === 'Moderate') text = 'متوسط';
      else if (quality === 'Unsafe' || quality === 'Risk') text = 'غیرمصئون';
    } else {
      if (quality === 'مصئون') text = 'Safe';
      else if (quality === 'متوسط') text = 'Moderate';
      else if (quality === 'غیرمصئون') text = 'Unsafe';
    }

    const badgeClass =
      (quality === 'Safe' || quality === 'مصئون') ? 'badge-success' :
      (quality === 'Moderate' || quality === 'متوسط') ? 'badge-warning' :
      (quality === 'Unsafe' || quality === 'غیرمصئون' || quality === 'Risk') ? 'badge-danger' :
      'badge-neutral';

    return <span className={`badge ${badgeClass}`}>{text}</span>;
  };

  return (
    <div className="card">
      <div className="table-header">
        <div>
          <h3 className="card-title">
            {isFa ? 'ریکوردهای اخیر سروی' : 'Recent Survey Records'}
          </h3>
          <p className="card-subtitle">
            {isFa ? 'نمای فیلترشده از ارزیابی‌های نقاط فزیکی' : 'Filtered view of physical point assessments'}
          </p>
        </div>
        <div className="table-actions">
          <div className="search-wrapper">
            <Search className="search-icon" size={14} />
            <input
              type="text"
              placeholder={isFa ? 'جستجوی آیدی نقطه یا موقعیت...' : 'Search Point ID or Location...'}
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
            {isFa ? 'خروجی CSV' : 'Export CSV'}
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>{isFa ? 'آیدی نقطه' : 'Point ID'}</th>
              <th>{isFa ? 'تاریخ' : 'Date'}</th>
              <th>{isFa ? 'ولایت' : 'Province'}</th>
              <th>{isFa ? 'ولسوالی / ناحیه' : 'District'}</th>
              <th>{isFa ? 'منبع آب' : 'Water Source'}</th>
              <th>{isFa ? 'کیفیت' : 'Quality'}</th>
              <th>{isFa ? 'دسترسی' : 'Availability'}</th>
              <th style={{ textAlign: isFa ? 'left' : 'right' }}>
                {isFa ? 'عملیات' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id || row.point_id}>
                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  {formatNumber(row.point_id, currentLang)}
                </td>
                <td style={{ color: 'var(--text-muted)' }}>
                  {formatNumber(row.survey_date, currentLang)}
                </td>
                <td>{row.province || '-'}</td>
                <td>{row.district || '-'}</td>
                <td>{renderWaterSource(row.water_source)}</td>
                <td>{renderQualityBadge(row.water_quality)}</td>
                <td>
                  <span className={`badge ${row.water_available ? 'badge-info' : 'badge-neutral'}`}>
                    {row.water_available
                      ? (isFa ? 'موجود' : 'Available')
                      : (isFa ? 'ناموجود' : 'Unavailable')}
                  </span>
                </td>
                <td style={{ textAlign: isFa ? 'left' : 'right' }}>
                  <button
                    onClick={() => onSelectRecord(row)}
                    className="action-btn"
                    title={isFa ? 'مشاهده جزئیات' : 'View details'}
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
          {isFa
            ? `نمایش ${formatNumber(filteredData.length ? ((currentPage - 1) * pageSize) + 1 : 0, currentLang)} الی ${formatNumber(Math.min(currentPage * pageSize, filteredData.length), currentLang)} از ${formatNumber(filteredData.length, currentLang)} ریکورد`
            : `Showing ${filteredData.length ? ((currentPage - 1) * pageSize) + 1 : 0} to ${Math.min(currentPage * pageSize, filteredData.length)} of ${filteredData.length} records`}
        </span>
        <div className="pagination-buttons">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="btn"
          >
            {isFa ? 'قبلی' : 'Previous'}
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn"
          >
            {isFa ? 'بعدی' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}