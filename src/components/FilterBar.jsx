import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { translateCategory } from '../utils/dataTranslations';

export default function FilterBar({ filters, setFilters, availableOptions, onReset }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('fa') ? 'fa' : 'en';

  // نقشه ترجمه منابع آب برای اطمینان از نمایش درست در دو زبان
  const waterSourceMap = {
    'چاه خانگی': { fa: 'چاه خانگی', en: 'Private Well' },
    'شبکه شهری': { fa: 'شبکه شهری', en: 'Piped Water / Network' },
    'تانکر/آب‌فروش': { fa: 'تانکر/آب‌فروش', en: 'Water Tanker / Vendor' },
    'چاه مشترک': { fa: 'چاه مشترک', en: 'Shared Well' },
    'همسایه': { fa: 'همسایه', en: 'Neighbor' },
    // پشتیبانی از کلیدهای انگلیسی دیتابیس
    'Private Well': { fa: 'چاه خانگی', en: 'Private Well' },
    'Piped Water Network': { fa: 'شبکه شهری', en: 'Piped Water Network' },
    'Water Tanker': { fa: 'تانکر/آب‌فروش', en: 'Water Tanker' },
    'Shared Well': { fa: 'چاه مشترک', en: 'Shared Well' },
    'Neighbor': { fa: 'همسایه', en: 'Neighbor' }
  };

  const statusTranslations = {
    'Completed': { fa: 'تکمیل شده', en: 'Completed' },
    'Verified': { fa: 'تأیید شده', en: 'Verified' },
    'Pending Review': { fa: 'در انتظار بررسی', en: 'Pending Review' }
  };

  const statuses = ['Completed', 'Verified', 'Pending Review'];

  // تابع کمکی برای ترجمه هر گزینه
  const getTranslatedSource = (source) => {
    if (waterSourceMap[source]) {
      return waterSourceMap[source][currentLang];
    }
    return translateCategory('waterSource', source, currentLang) || source;
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        {/* District Filter */}
        <select
          value={filters.district}
          onChange={(e) => setFilters(f => ({ ...f, district: e.target.value }))}
          className="select-input"
        >
          <option value="">
            {currentLang === 'fa' ? 'همه ناحیه‌ها / ولسوالی‌ها' : 'All Districts'}
          </option>
          {(availableOptions?.districts || []).map(d => (
            <option key={d} value={d}>
              {translateCategory('district', d, currentLang) || d}
            </option>
          ))}
        </select>

        {/* Water Source Filter */}
        <select
          value={filters.waterSource}
          onChange={(e) => setFilters(f => ({ ...f, waterSource: e.target.value }))}
          className="select-input"
        >
          <option value="">
            {currentLang === 'fa' ? 'همه منابع آب' : 'All Water Sources'}
          </option>
          {(availableOptions?.waterSources || []).map(s => (
            <option key={s} value={s}>
              {getTranslatedSource(s)}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
          className="select-input"
        >
          <option value="">
            {currentLang === 'fa' ? 'همه وضعیت‌های سروی' : 'All Survey Statuses'}
          </option>
          {statuses.map(st => (
            <option key={st} value={st}>
              {statusTranslations[st]?.[currentLang] || st}
            </option>
          ))}
        </select>
      </div>

      <button onClick={onReset} className="btn">
        <RotateCcw size={14} />
        {currentLang === 'fa' ? 'بازنشانی فیلترها' : 'Reset Filters'}
      </button>
    </div>
  );
}