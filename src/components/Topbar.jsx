import { useState } from 'react';
import { useCoupon } from '../context/CouponContext';
import './Topbar.css';

export default function Topbar({ pageTitle }) {
  const { coupons, addToast } = useCoupon();
  const [bellOpen, setBellOpen] = useState(false);

  const expiringSoon = coupons.filter(c => {
    if (c.status !== 'Active') return false;
    const days = Math.ceil((new Date(c.expiryDate) - new Date()) / 86400000);
    return days >= 0 && days <= 7;
  });

  const handleBell = () => {
    setBellOpen(v => !v);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{pageTitle}</h1>
        <span className="topbar-date">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div className="topbar-right">
        {/* Notification Bell */}
        <div className="topbar-bell-wrap">
          <button
            id="notification-bell"
            className="topbar-icon-btn"
            onClick={handleBell}
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round"/>
            </svg>
            {expiringSoon.length > 0 && (
              <span className="bell-badge">{expiringSoon.length}</span>
            )}
          </button>

          {bellOpen && (
            <div className="notifications-dropdown">
              <div className="notif-header">
                <span>Notifications</span>
                <button className="btn btn-ghost btn-sm" onClick={() => setBellOpen(false)}>✕</button>
              </div>
              {expiringSoon.length === 0 ? (
                <div className="notif-empty">No alerts right now 🎉</div>
              ) : (
                expiringSoon.map(c => {
                  const days = Math.ceil((new Date(c.expiryDate) - new Date()) / 86400000);
                  return (
                    <div key={c.id} className="notif-item">
                      <span className="notif-icon">⚠️</span>
                      <div>
                        <div className="notif-title">{c.code} expiring soon</div>
                        <div className="notif-sub">Expires in {days} day{days !== 1 ? 's' : ''}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="topbar-user">
          <div className="topbar-avatar">AK</div>
          <div className="topbar-user-info">
            <div className="topbar-user-name">Admin Kumar</div>
            <div className="topbar-user-role">Marketing Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
}
