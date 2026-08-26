import React from 'react';
import {
  MapPin,
  Home,
  ShieldCheck,
  AlertTriangle,
  Network,
  Droplet
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatNumber, formatPercent } from '../utils/numberFormatter';

export default function KPICards({ data = [] }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // ============================================
  // BASIC TOTALS
  // ============================================
  const totalPoints = data.length;

  // ============================================
  // SAFE WATER ACCESS
  // ============================================
  const safeCount = data.filter(
    (item) => item.perceived_safety === 'سالم' || item.perceived_safety === 'Safe'
  ).length;

  const safePercentage = totalPoints
    ? Math.round((safeCount / totalPoints) * 100)
    : 0;

  // ============================================
  // UNSAFE / AT RISK
  // ============================================
  const atRiskCount = data.filter(
    (item) =>
      item.perceived_safety === 'تا حدی' ||
      item.perceived_safety === 'سالم نیست' ||
      item.perceived_safety === 'Moderate' ||
      item.perceived_safety === 'Unsafe'
  ).length;

  const atRiskPercentage = totalPoints
    ? Math.round((atRiskCount / totalPoints) * 100)
    : 0;

  // ============================================
  // ACTIVE NETWORK CONNECTION
  // ============================================
  const networkActiveCount = data.filter(
    (item) => item.network_connection === 'وصل و فعال' || item.network_connection === 'Active'
  ).length;

  const networkPercentage = totalPoints
    ? Math.round((networkActiveCount / totalPoints) * 100)
    : 0;

  // ============================================
  // WATER AVAILABILITY
  // ============================================
  const availableCount = data.filter(
    (item) =>
      item.water_sufficiency === 'همیشه کافی' ||
      item.water_sufficiency === 'اکثرا کافی' ||
      item.water_sufficiency === 'Sufficient'
  ).length;

  const availablePercentage = totalPoints
    ? Math.round((availableCount / totalPoints) * 100)
    : 0;

  // ============================================
  // KPI CARDS CONFIG
  // ============================================
  const cards = [
    {
      title: t('kpi.totalPoints', 'Total Survey Points'),
      value: formatNumber(totalPoints, currentLang),
      subtext: currentLang === 'fa' ? 'موقعیت‌های سروی' : 'Survey locations',
      icon: MapPin,
      themeClass: 'kpi-blue'
    },
    {
      title: t('kpi.safeWater', 'Safe Water Access'),
      value: formatPercent(safePercentage, currentLang),
      subtext: currentLang === 'fa' 
        ? `${formatNumber(safeCount, currentLang)} نقطه مصئون ارزیابی شد`
        : `${formatNumber(safeCount, currentLang)} points rated safe`,
      icon: ShieldCheck,
      themeClass: 'kpi-emerald'
    },
    {
      title: t('kpi.unsafeWater', 'Unsafe / At Risk'),
      value: formatPercent(atRiskPercentage, currentLang),
      subtext: currentLang === 'fa' 
        ? `${formatNumber(atRiskCount, currentLang)} نقطه نیازمند رسیدگی`
        : `${formatNumber(atRiskCount, currentLang)} points requiring action`,
      icon: AlertTriangle,
      themeClass: 'kpi-amber'
    },
    {
      title: currentLang === 'fa' ? 'اتصال شبکه' : 'Network Connection',
      value: formatPercent(networkPercentage, currentLang),
      subtext: currentLang === 'fa' 
        ? `${formatNumber(networkActiveCount, currentLang)} اتصال فعال`
        : `${formatNumber(networkActiveCount, currentLang)} active connections`,
      icon: Network,
      themeClass: 'kpi-indigo'
    },
    {
      title: t('kpi.waterAvail', 'Water Available'),
      value: formatPercent(availablePercentage, currentLang),
      subtext: currentLang === 'fa' 
        ? `${formatNumber(availableCount, currentLang)} با موجودیت کافی`
        : `${formatNumber(availableCount, currentLang)} with adequate availability`,
      icon: Droplet,
      themeClass: 'kpi-cyan'
    }
  ];

  return (
    <div className="grid-kpi">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div key={index} className={`kpi-card ${card.themeClass}`}>
            <div className="kpi-header">
              <span className="kpi-title">{card.title}</span>
              <div className="kpi-icon-box">
                <Icon size={16} />
              </div>
            </div>

            <div className="kpi-value">{card.value}</div>
            <div className="kpi-subtext">{card.subtext}</div>
          </div>
        );
      })}
    </div>
  );
}