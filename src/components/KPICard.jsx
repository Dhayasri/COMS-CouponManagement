import './KPICard.css';

export default function KPICard({ title, value, trend, trendLabel, color = 'emerald', icon }) {
  const isPositive = trend >= 0;

  return (
    <div className={`kpi-card kpi-${color} animate-fadeIn`}>
      <div className="kpi-content">
        <p className="kpi-title">{title}</p>
        <h3 className="kpi-value">{value}</h3>
        {trend !== undefined && (
          <div className={`kpi-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {isPositive
                ? <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round"/>
                : <path d="M7 7l10 10M17 17H7m10 0V7" strokeLinecap="round" strokeLinejoin="round"/>
              }
            </svg>
            <span>{Math.abs(trend)}% {trendLabel}</span>
          </div>
        )}
      </div>
      {icon && (
        <div className={`kpi-icon-wrap kpi-icon-${color}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={icon} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}
