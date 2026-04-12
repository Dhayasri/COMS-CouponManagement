import { useMemo } from 'react';
import { useCoupon } from '../context/CouponContext';
import KPICard from '../components/KPICard';
import CouponCard from '../components/CouponCard';
import { LineChart, BarChart } from '../components/MiniChart';
import Badge from '../components/Badge';
import { redemptionTrend } from '../data/mockData';
import './Dashboard.css';

function getStatusVariant(status) {
  const m = { Active: 'success', Expired: 'danger', Paused: 'neutral', Expiring: 'warning' };
  return m[status] || 'neutral';
}

export default function Dashboard() {
  const { coupons, usageHistory } = useCoupon();

  const kpis = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter(c => c.status === 'Active').length;
    const totalRedemptions = coupons.reduce((s, c) => s + (c.usageCount || 0), 0);
    const revenueSaved = coupons.reduce((s, c) => {
      if (c.type === 'Flat') return s + c.discountValue * c.usageCount;
      if (c.type === 'Percent') return s + (c.discountValue / 100) * 1000 * c.usageCount; // approx
      return s + 49 * c.usageCount; // shipping avg
    }, 0);
    return { total, active, totalRedemptions, revenueSaved };
  }, [coupons]);

  // Top 5 coupons by usage
  const top5 = useMemo(() => {
    const typeColors = { Flat: '#6366f1', Percent: '#059669', BOGO: '#f59e0b', 'Free Shipping': '#3b82f6' };
    return [...coupons]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 5)
      .map(c => ({ label: c.code, value: c.usageCount, color: typeColors[c.type] }));
  }, [coupons]);

  // Recent redemptions (last 5)
  const recentRedemptions = useMemo(() => usageHistory.slice(0, 5), [usageHistory]);

  // 3 newest coupons
  const newestCoupons = useMemo(() =>
    [...coupons].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3),
    [coupons]
  );

  return (
    <div className="dashboard animate-fadeIn">
      {/* KPI Row */}
      <section className="grid-4" style={{ marginBottom: 28 }}>
        <KPICard
          title="Total Coupons"
          value={kpis.total}
          trend={8.2}
          trendLabel="vs last month"
          color="emerald"
          icon="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
        />
        <KPICard
          title="Active Coupons"
          value={kpis.active}
          trend={3.4}
          trendLabel="currently live"
          color="blue"
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <KPICard
          title="Total Redemptions"
          value={kpis.totalRedemptions.toLocaleString()}
          trend={12.7}
          trendLabel="vs last month"
          color="amber"
          icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
        <KPICard
          title="Revenue Saved"
          value={`₹${Math.round(kpis.revenueSaved / 1000)}K`}
          trend={-2.1}
          trendLabel="vs last month"
          color="rose"
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </section>

      {/* Charts Row */}
      <section className="dashboard-charts">
        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h2 className="section-title" style={{ fontSize: 16 }}>6-Month Redemption Trend</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Monthly coupon usage over the past 6 months</p>
            </div>
            <span className="pill" style={{ background: 'var(--emerald-50)', color: 'var(--emerald-primary)' }}>
              Last 6 Months
            </span>
          </div>
          <div className="card-body" style={{ paddingTop: 12 }}>
            <LineChart data={redemptionTrend} color="var(--emerald-primary)" height={160} width={560} />
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h2 className="section-title" style={{ fontSize: 16 }}>Top 5 Coupons by Usage</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Ranked by total redemption count</p>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 12 }}>
            <BarChart data={top5} height={160} width={360} />
          </div>
        </div>
      </section>

      {/* Bottom Row */}
      <section className="dashboard-bottom">
        {/* Recent Redemptions */}
        <div className="card">
          <div className="card-header">
            <h2 className="section-title" style={{ fontSize: 16 }}>Recent Redemptions</h2>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 5 events</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Discount</th>
                  <th>Redeemed By</th>
                  <th>Date</th>
                  <th>Savings</th>
                </tr>
              </thead>
              <tbody>
                {recentRedemptions.map(r => (
                  <tr key={r.id}>
                    <td><span className="font-mono code-chip">{r.couponCode}</span></td>
                    <td>
                      {coupons.find(c => c.id === r.couponId)?.type
                        ? <span className="type-tag">{coupons.find(c => c.id === r.couponId)?.type}</span>
                        : '—'}
                    </td>
                    <td style={{ color: 'var(--emerald-primary)', fontWeight: 600 }}>
                      ₹{r.discountApplied.toLocaleString()}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.user}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      {new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>₹{r.discountApplied}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>saved</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Coupon Cards */}
        <div className="dash-card-strip">
          <div className="section-header" style={{ marginBottom: 16 }}>
            <h2 className="section-title" style={{ fontSize: 16 }}>Newly Added Coupons</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {newestCoupons.map(c => <CouponCard key={c.id} coupon={c} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
