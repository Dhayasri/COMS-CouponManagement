import { useState } from 'react';
import { useCoupon } from '../context/CouponContext';
import './Settings.css';

const SUB_TABS = ['Store Profile', 'Coupon Config', 'Notifications'];

// ── Code Preview ──────────────────────────────────────────────────────────────

function generatePreviewCode(prefix, length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const random = Array.from({ length: Math.max(1, length) }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  return `${prefix || 'DEAL'}${random}`;
}

// ── Store Profile Tab ─────────────────────────────────────────────────────────

function StoreProfile({ settings, onChange }) {
  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-icon" style={{ background: 'var(--emerald-50)', color: 'var(--emerald-primary)' }}>
          🏪
        </div>
        <div>
          <h3 className="settings-section-title">Company / Store Profile</h3>
          <p className="settings-section-sub">Basic information about your store displayed across the platform</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="form-group">
          <label className="form-label">Store Name</label>
          <input
            className="form-control"
            value={settings.storeName}
            onChange={e => onChange('storeName', e.target.value)}
            placeholder="ShopEase India"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Store URL</label>
          <input
            className="form-control"
            value={settings.storeUrl}
            onChange={e => onChange('storeUrl', e.target.value)}
            placeholder="https://yourstore.com"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Currency</label>
          <select
            className="form-control"
            value={settings.currency}
            onChange={e => onChange('currency', e.target.value)}
          >
            <option value="₹">₹  Indian Rupee (INR)</option>
            <option value="$">$  US Dollar (USD)</option>
            <option value="€">€  Euro (EUR)</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Contact Email</label>
          <input
            type="email"
            className="form-control"
            value={settings.contactEmail}
            onChange={e => onChange('contactEmail', e.target.value)}
            placeholder="admin@yourstore.com"
          />
        </div>
        <div className="form-group settings-full-width">
          <label className="form-label">Logo URL</label>
          <input
            className="form-control"
            value={settings.logoUrl}
            onChange={e => onChange('logoUrl', e.target.value)}
            placeholder="https://yourstore.com/logo.png"
          />
          {settings.logoUrl && (
            <div className="logo-preview">
              <img src={settings.logoUrl} alt="Logo preview" onError={e => e.target.style.display = 'none'} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Coupon Config Tab ─────────────────────────────────────────────────────────

function CouponConfig({ settings, onChange }) {
  const [previewCode, setPreviewCode] = useState(
    generatePreviewCode(settings.codePrefix, settings.codeLength)
  );

  const refreshPreview = () => {
    setPreviewCode(generatePreviewCode(settings.codePrefix, settings.codeLength));
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
          ⚙️
        </div>
        <div>
          <h3 className="settings-section-title">Coupon Configuration</h3>
          <p className="settings-section-sub">Default rules and behaviour for all coupons</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="form-group">
          <label className="form-label">Default Expiry Duration (days)</label>
          <input
            type="number"
            min="1"
            className="form-control"
            value={settings.defaultExpiryDays}
            onChange={e => onChange('defaultExpiryDays', Number(e.target.value))}
          />
          <span className="form-hint">Applied from creation date when no date is specified</span>
        </div>

        <div className="form-group">
          <label className="form-label">Max Coupons per User per Day</label>
          <input
            type="number"
            min="1"
            className="form-control"
            value={settings.maxCouponsPerDay}
            onChange={e => onChange('maxCouponsPerDay', Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Auto-Expiry Check Interval (minutes)</label>
          <input
            type="number"
            min="1"
            max="60"
            className="form-control"
            value={settings.autoExpiryInterval}
            onChange={e => onChange('autoExpiryInterval', Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Allow Coupon Stacking</label>
          <div className="toggle-wrap">
            <button
              className={`big-toggle ${settings.allowStacking ? 'big-toggle--on' : ''}`}
              onClick={() => onChange('allowStacking', !settings.allowStacking)}
            >
              <span className="big-toggle-thumb" />
            </button>
            <div>
              <div className="toggle-label">{settings.allowStacking ? 'Enabled' : 'Disabled'}</div>
              <div className="toggle-sub">
                {settings.allowStacking
                  ? 'Multiple coupons can be applied to one order.'
                  : 'Only one coupon allowed per order.'}
              </div>
            </div>
          </div>
        </div>

        {/* Code Format */}
        <div className="form-group settings-full-width">
          <label className="form-label">Code Format</label>
          <div className="code-format-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ fontSize: 11 }}>Prefix</label>
              <input
                className="form-control font-mono"
                value={settings.codePrefix}
                onChange={e => onChange('codePrefix', e.target.value.toUpperCase())}
                placeholder="DEAL"
                maxLength={8}
              />
            </div>
            <div className="code-format-plus">+</div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ fontSize: 11 }}>Random Chars</label>
              <input
                type="number"
                min="2"
                max="12"
                className="form-control"
                value={settings.codeLength}
                onChange={e => onChange('codeLength', Number(e.target.value))}
              />
            </div>
          </div>
          <div className="code-preview-wrap">
            <span className="form-label" style={{ fontSize: 11 }}>Preview:</span>
            <span className="font-mono code-preview">{previewCode}</span>
            <button className="btn btn-ghost btn-sm" onClick={refreshPreview}>🔄 Regenerate</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Notification Settings Tab ─────────────────────────────────────────────────

function NotificationSettings({ settings, onChange }) {
  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
          🔔
        </div>
        <div>
          <h3 className="settings-section-title">Notification Settings</h3>
          <p className="settings-section-sub">Control alerts and when you get notified</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="form-group">
          <label className="form-label">Alert when usage exceeds (% of max uses)</label>
          <div className="slider-wrap">
            <input
              type="range"
              min="50"
              max="90"
              step="5"
              className="slider"
              value={settings.usageAlertThreshold}
              onChange={e => onChange('usageAlertThreshold', Number(e.target.value))}
            />
            <span className="slider-value">{settings.usageAlertThreshold}%</span>
          </div>
          <span className="form-hint">Alert when a coupon's usage reaches this percentage</span>
        </div>

        <div className="form-group">
          <label className="form-label">Alert when coupon expires in (days)</label>
          <input
            type="number"
            min="1"
            max="30"
            className="form-control"
            value={settings.expiryAlertDays}
            onChange={e => onChange('expiryAlertDays', Number(e.target.value))}
          />
        </div>

        <div className="form-group settings-full-width">
          <label className="form-label">Notification Channels</label>
          <div className="notif-channels">
            <div
              className={`notif-channel ${settings.emailNotifications ? 'notif-channel--on' : ''}`}
              onClick={() => onChange('emailNotifications', !settings.emailNotifications)}
            >
              <span className="channel-icon">📧</span>
              <div>
                <div className="channel-name">Email Notifications</div>
                <div className="channel-sub">Receive alerts via email</div>
              </div>
              <div className={`channel-toggle ${settings.emailNotifications ? 'channel-toggle--on' : ''}`}>
                {settings.emailNotifications ? 'ON' : 'OFF'}
              </div>
            </div>

            <div
              className={`notif-channel ${settings.inAppToasts ? 'notif-channel--on' : ''}`}
              onClick={() => onChange('inAppToasts', !settings.inAppToasts)}
            >
              <span className="channel-icon">🔔</span>
              <div>
                <div className="channel-name">In-App Toast Notifications</div>
                <div className="channel-sub">Show toast messages inside the dashboard</div>
              </div>
              <div className={`channel-toggle ${settings.inAppToasts ? 'channel-toggle--on' : ''}`}>
                {settings.inAppToasts ? 'ON' : 'OFF'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Settings() {
  const { settings, updateSettings } = useCoupon();
  const [activeSubTab, setActiveSubTab] = useState('Store Profile');
  const [local, setLocal] = useState({ ...settings });

  const handleChange = (key, val) => {
    setLocal(s => ({ ...s, [key]: val }));
  };

  const handleSave = () => {
    updateSettings(local);
  };

  const handleReset = () => {
    setLocal({ ...settings });
  };

  return (
    <div className="settings-page animate-fadeIn">
      <div className="section-header">
        <div>
          <h2 className="section-title">Settings</h2>
          <p className="page-sub">Configure platform behaviour, branding, and notifications</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={handleReset}>Reset</button>
          <button id="save-settings-btn" className="btn btn-primary" onClick={handleSave}>
            💾 Save Settings
          </button>
        </div>
      </div>

      <div className="settings-layout">
        {/* Sub Tabs */}
        <nav className="settings-nav">
          {SUB_TABS.map(tab => (
            <button
              key={tab}
              className={`settings-nav-btn ${activeSubTab === tab ? 'settings-nav-btn--active' : ''}`}
              onClick={() => setActiveSubTab(tab)}
            >
              {tab === 'Store Profile' && '🏪 '}
              {tab === 'Coupon Config' && '⚙️ '}
              {tab === 'Notifications' && '🔔 '}
              {tab}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="settings-content card">
          {activeSubTab === 'Store Profile' && (
            <StoreProfile settings={local} onChange={handleChange} />
          )}
          {activeSubTab === 'Coupon Config' && (
            <CouponConfig settings={local} onChange={handleChange} />
          )}
          {activeSubTab === 'Notifications' && (
            <NotificationSettings settings={local} onChange={handleChange} />
          )}
        </div>
      </div>
    </div>
  );
}
