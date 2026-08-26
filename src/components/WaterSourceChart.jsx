import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '../utils/numberFormatter';

const COLORS = ['#2563eb', '#dc2626', '#0284c7', '#16a34a', '#d97706', '#0d9488', '#64748b'];

const TRANSLATION_MAP = {
  // English -> Persian & English
  'private well': { en: 'Private Well', fa: 'چاه خانگی' },
  'shared well': { en: 'Shared Well', fa: 'چاه مشترک' },
  'pipe schema': { en: 'Piped Network', fa: 'شبکه شهری' },
  'piped network': { en: 'Piped Network', fa: 'شبکه شهری' },
  'water tanker/vendor': { en: 'Water Tanker/Vendor', fa: 'تانکر/آب‌فروش' },
  'tanker/vendor': { en: 'Water Tanker/Vendor', fa: 'تانکر/آب‌فروش' },
  'neighbor': { en: "Neighbor's Water", fa: 'همسایه' },
  'neighbor water': { en: "Neighbor's Water", fa: 'همسایه' },
  'borehole': { en: 'Borehole', fa: 'چاه عمیق (بورول)' },
  'hand pump': { en: 'Hand Pump', fa: 'پمپ دستی' },
  'protected spring': { en: 'Protected Spring', fa: 'چشمه محافظت‌شده' },
  'unprotected spring': { en: 'Unprotected Spring', fa: 'چشمه غیرمحافظت‌شده' },
  'piped water': { en: 'Piped Water', fa: 'آب نل (لوله‌کشی)' },
  'surface water': { en: 'Surface Water', fa: 'آب‌های سطحی (جوی/رودخانه)' },
  'dug well': { en: 'Dug Well', fa: 'چاه دهانه باز' },
  'other': { en: 'Other', fa: 'سایر موارد' },

  // Persian -> English & Persian (Matches your survey responses)
  'همسایه': { en: "Neighbor's Water", fa: 'همسایه' },
  'چاه خانگی': { en: 'Private Well', fa: 'چاه خانگی' },
  'چاه مشترک': { en: 'Shared Well', fa: 'چاه مشترک' },
  'شبکه شهری': { en: 'Piped Network', fa: 'شبکه شهری' },
  'تانکر/آب‌فروش': { en: 'Water Tanker/Vendor', fa: 'تانکر/آب‌فروش' },
  'تانکر / فروشنده آب': { en: 'Water Tanker/Vendor', fa: 'تانکر/آب‌فروش' },
  'چاه عمیق (بورول)': { en: 'Borehole', fa: 'چاه عمیق (بورول)' },
  'چاه عمیق': { en: 'Borehole', fa: 'چاه عمیق (بورول)' },
  'پمپ دستی': { en: 'Hand Pump', fa: 'پمپ دستی' },
  'چشمه محافظت‌شده': { en: 'Protected Spring', fa: 'چشمه محافظت‌شده' },
  'چشمه غیرمحافظت‌شده': { en: 'Unprotected Spring', fa: 'چشمه غیرمحافظت‌شده' },
  'آب نل (لوله‌کشی)': { en: 'Piped Water', fa: 'آب نل (لوله‌کشی)' },
  'آب نل': { en: 'Piped Water', fa: 'آب نل (لوله‌کشی)' },
  'آب‌های سطحی (جوی/رودخانه)': { en: 'Surface Water', fa: 'آب‌های سطحی (جوی/رودخانه)' },
  'آب‌های سطحی': { en: 'Surface Water', fa: 'آب‌های سطحی (جوی/رودخانه)' },
  'چاه دهانه باز': { en: 'Dug Well', fa: 'چاه دهانه باز' },
  'سایر موارد': { en: 'Other', fa: 'سایر موارد' },
  'سایر': { en: 'Other', fa: 'سایر موارد' }
};

export default function WaterSourceChart({ data = [] }) {
  const { t, i18n } = useTranslation();

  const currentLang = (i18n.language || 'en').toLowerCase();
  const isFa = currentLang.startsWith('fa');
  const targetLang = isFa ? 'fa' : 'en';

  const { chartData, total } = useMemo(() => {
    const counts = {};

    data.forEach(d => {
      const src = d.water_source || 'Other';
      counts[src] = (counts[src] || 0) + 1;
    });

    const formatted = Object.entries(counts).map(([rawName, count]) => {
      const cleanKey = String(rawName).trim().toLowerCase();
      
      let translatedName;
      if (TRANSLATION_MAP[cleanKey]) {
        translatedName = TRANSLATION_MAP[cleanKey][targetLang];
      } else if (TRANSLATION_MAP[rawName.trim()]) {
        translatedName = TRANSLATION_MAP[rawName.trim()][targetLang];
      } else {
        translatedName = t(rawName, rawName);
      }

      return {
        rawName,
        name: translatedName,
        value: count
      };
    }).sort((a, b) => b.value - a.value);

    return { chartData: formatted, total: data.length };
  }, [data, targetLang, currentLang, t]);

  return (
    <div key={currentLang} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <h3 className="card-title">
          {isFa ? 'منابع اصلی آب' : 'Primary Water Sources'}
        </h3>
        <p className="card-subtitle" style={{ marginBottom: '8px' }}>
          {isFa ? 'توزیع دسته‌بندی منابع آب' : 'Source category distribution'}
        </p>
        
        <div style={{ height: '176px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart key={`pie-${currentLang}`}>
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
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${entry.rawName}-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
                formatter={(value) => [formatNumber(value, currentLang), isFa ? 'تعداد' : 'Count']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-container" style={{ maxHeight: '144px', overflowY: 'auto', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>{isFa ? 'منبع آب' : 'Water Source'}</th>
              <th style={{ textAlign: isFa ? 'left' : 'right' }}>{isFa ? 'تعداد' : 'Count'}</th>
              <th style={{ textAlign: isFa ? 'left' : 'right' }}>%</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item, idx) => {
              const percentage = total ? Math.round((item.value / total) * 100) : 0;
              return (
                <tr key={item.rawName}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="status-dot" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    {item.name}
                  </td>
                  <td style={{ textAlign: isFa ? 'left' : 'right', fontWeight: 500 }}>
                    {formatNumber(item.value, currentLang)}
                  </td>
                  <td style={{ textAlign: isFa ? 'left' : 'right', color: 'var(--text-muted)' }}>
                    {formatNumber(percentage, currentLang)}{isFa ? '٪' : '%'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}