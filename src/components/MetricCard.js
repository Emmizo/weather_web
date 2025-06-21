import React from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, unit, icon, children }) => {
  return (
    <div className="metric-card">
      <div className="metric-info">
        <p className="metric-title">{title}</p>
        {children || (
          <p className="metric-value">
            {value}
            <span className="metric-unit">{unit}</span>
          </p>
        )}
      </div>
      <div className="metric-icon">{icon}</div>
    </div>
  );
};

export default MetricCard; 