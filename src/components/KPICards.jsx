import React from 'react';
import {
  MapPin,
  Home,
  ShieldCheck,
  AlertTriangle,
  Network,
  Droplet
} from 'lucide-react';

export default function KPICards({ data = [] }) {
  // ============================================
  // BASIC TOTALS
  // ============================================
  const totalPoints = data.length;
  const totalHouseholds = data.length;

  // ============================================
  // SAFE WATER ACCESS
  // ============================================
  const safeCount = data.filter(
    (item) => item.perceived_safety === 'سالم'
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
      item.perceived_safety === 'سالم نیست'
  ).length;

  const atRiskPercentage = totalPoints
    ? Math.round((atRiskCount / totalPoints) * 100)
    : 0;

  // ============================================
  // ACTIVE NETWORK CONNECTION
  // ============================================
  const networkActiveCount = data.filter(
    (item) => item.network_connection === 'وصل و فعال'
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
      item.water_sufficiency === 'اکثرا کافی'
  ).length;

  const availablePercentage = totalPoints
    ? Math.round((availableCount / totalPoints) * 100)
    : 0;

  // ============================================
  // KPI CARDS CONFIG
  // ============================================
  const cards = [
    {
      title: 'Total Survey Points',
      value: totalPoints.toLocaleString(),
      subtext: 'Survey locations',
      icon: MapPin,
      themeClass: 'kpi-blue'
    },
    {
      title: 'Safe Water Access',
      value: `${safePercentage}%`,
      subtext: `${safeCount} points rated safe`,
      icon: ShieldCheck,
      themeClass: 'kpi-emerald'
    },
    {
      title: 'Unsafe / At Risk',
      value: `${atRiskPercentage}%`,
      subtext: `${atRiskCount} points requiring action`,
      icon: AlertTriangle,
      themeClass: 'kpi-amber'
    },
    {
      title: 'Network Connection',
      value: `${networkPercentage}%`,
      subtext: `${networkActiveCount} active connections`,
      icon: Network,
      themeClass: 'kpi-indigo'
    },
    {
      title: 'Water Available',
      value: `${availablePercentage}%`,
      subtext: `${availableCount} with adequate availability`,
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