import Badge from './Badge';
import './CouponCard.css';

const typeColors = {
  'Flat': '#6366f1',
  'Percent': '#059669',
  'BOGO': '#f59e0b',
  'Free Shipping': '#3b82f6',
};

function getStatusVariant(status) {
  const map = { Active: 'success', Expired: 'danger', Paused: 'neutral', Expiring: 'warning' };
  return map[status] || 'neutral';
}

function getDaysLeft(expiryDate) {
  const today = new Date();
  const exp = new Date(expiryDate);
  const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function CouponCard({ coupon }) {
  const {
    code, type, discountValue, minOrder, category,
    expiryDate, usageCount, maxUses, status,
  } = coupon;

  const color = typeColors[type] || '#059669';
  const daysLeft = getDaysLeft(expiryDate);
  const isExpiring = daysLeft <= 7 && daysLeft > 0 && status === 'Active';
  const usagePct = maxUses > 0 ? Math.min(100, (usageCount / maxUses) * 100) : null;

  const displayStatus = isExpiring ? 'Expiring' : status;

  const discountLabel =
    type === 'Flat' ? `₹${discountValue} OFF`
    : type === 'Percent' ? `${discountValue}% OFF`
    : type === 'BOGO' ? 'BUY 1 GET 1'
    : 'FREE SHIPPING';

  return (
    <div className="coupon-card" style={{ '--card-color': color }}>
      <div className="coupon-strip" />
      <div className="coupon-scissors">✂</div>
      <div className="coupon-inner">
        <div className="coupon-top">
          <div>
            <div className="coupon-label">COUPON CODE</div>
            <div className="coupon-code font-mono">{code}</div>
          </div>
          <Badge label={displayStatus} variant={getStatusVariant(displayStatus)} />
        </div>

        <div className="coupon-discount">{discountLabel}</div>

        <div className="coupon-meta">
          <div className="coupon-meta-item">
            <span className="meta-label">Min Order</span>
            <span className="meta-value">{minOrder > 0 ? `₹${minOrder}` : 'None'}</span>
          </div>
          <div className="coupon-meta-item">
            <span className="meta-label">Category</span>
            <span className="meta-value">{category || 'All'}</span>
          </div>
          <div className="coupon-meta-item">
            <span className="meta-label">Type</span>
            <span className="meta-value" style={{ color }}>{type}</span>
          </div>
        </div>

        {usagePct !== null && (
          <div className="coupon-usage">
            <div className="usage-header">
              <span className="meta-label">Usage</span>
              <span className="meta-label">{usageCount} / {maxUses}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${usagePct}%`,
                  background: usagePct > 80 ? 'var(--danger)' : color,
                }}
              />
            </div>
          </div>
        )}

        <div className="coupon-footer">
          <span className="expiry-text">
            {daysLeft < 0
              ? `Expired ${Math.abs(daysLeft)}d ago`
              : isExpiring
              ? `⚠ Expires in ${daysLeft}d`
              : `Expires ${new Date(expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
          </span>
          <span className="usage-count">
            <strong>{usageCount}</strong> redeemed
          </span>
        </div>
      </div>
    </div>
  );
}
