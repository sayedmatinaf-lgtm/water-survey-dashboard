import React from 'react';

export default function AnalysisCard({ title, badgeText, badgeType = 'info', children, footerText }) {
  return (
    <div className="analysis-card">
      <div className="analysis-card-header">
        <h3 className="analysis-card-title">{title}</h3>
        {badgeText && (
          <span className={`analysis-badge badge-${badgeType}`}>
            {badgeText}
          </span>
        )}
      </div>
      <div className="analysis-chart-container">
        {children}
      </div>
      {footerText && (
        <div className="analysis-card-footer">
          {footerText}
        </div>
      )}
    </div>
  );
}