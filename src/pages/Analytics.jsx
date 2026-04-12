import { useState, useMemo } from 'react';
import { useCoupon } from '../context/CouponContext';
import KPICard from '../components/KPICard';
import DataTable from '../components/DataTable';
import { LineChart, BarChart, DonutChart } from '../components/MiniChart';
import './Analytics.css';

// ── CSV Export ────────────────────────────────────────────────────────────────

function exportCSV(data, filename) {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row =>
    Object.values(row).map(v => (typeof v === 'string' && v.includes(',') ? `"${v}"` : v)).join(',')
  );
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Analytics() {
  const { coupons, usageHistory, addToast } = useCoupon();

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [catFilter, setCatFilter] = useState('All');

  const types = ['All', 'Flat', 'Percent', 'BOGO', 'Free Shipping'];
  const cats = ['All', 'Electronics', 'Fashion', 'Food', 'Travel'];

  // ── Filtered usage history ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return usageHistory.filter(h => {
      if (fromDate && h.date < fromDate) return false;
      if (toDate && h.date > toDate) return false;
      const cpn = coupons.find(c => c.id === h.couponId);
      if (typeFilter !== 'All' && cpn?.type !== typeFilter) return false;
      if (catFilter !== 'All' && cpn?.category !== catFilter) return false;
      return true;
    });
  }, [usageHistory, coupons, fromDate, toDate, typeFilter, catFilter]);

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const total = filtered.length;
    const avgDiscount = total > 0
      ? Math.round(filtered.reduce((s, h) => s + h.discountApplied, 0) / total)
      : 0;
    const convRate = coupons.length > 0
      ? ((coupons.filter(c => c.usageCount > 0).length / coupons.length) * 100).toFixed(1)
      : '0.0';

    const usageMap = {};
    filtered.forEach(h => { usageMap[h.couponCode] = (usageMap[h.couponCode] || 0) + 1; });
    const topCode = Object.entries(usageMap).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

    return { total, avgDiscount, convRate, topCode };
  }, [filtered, coupons]);

  // ── Daily Trend (last 14 days) ────────────────────────────────────────────
  const dailyTrend = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      const count = filtered.filter(h => h.date === key).length;
      days.push({ label, value: count });
    }
    return days;
  }, [filtered]);

  // ── By Type ───────────────────────────────────────────────────────────────
  const byType = useMemo(() => {
    const typeColors = { Flat: '#6366f1', Percent: '#059669', BOGO: '#f59e0b', 'Free Shipping': '#3b82f6' };
    const counts = {};
    filtered.forEach(h => {
      const cpn = coupons.find(c => c.id === h.couponId);
      if (cpn) counts[cpn.type] = (counts[cpn.type] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value, color: typeColors[label] }));
  }, [filtered, coupons]);

  // ── Donut by Category ─────────────────────────────────────────────────────
  const byCategory = useMemo(() => {
    const counts = {};
    filtered.forEach(h => {
      const cpn = coupons.find(c => c.id === h.couponId);
      const cat = cpn?.category || 'All';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [filtered, coupons]);

  // ── Table Columns ─────────────────────────────────────────────────────────
  const columns = useMemo(() => [
    { key: 'couponCode', label: 'Coupon Code', render: v => <span className="font-mono code-pill">{v}</span> },
    { key: 'user', label: 'User' },
    { key: 'orderValue', label: 'Order Value', render: v => `₹${v.toLocaleString()}` },
    { key: 'discountApplied', label: 'Discount', render: v => <span style={{ color: 'var(--emerald-primary)', fontWeight: 600 }}>₹{v}</span> },
    { key: 'netPayable', label: 'Net Payable', render: v => `₹${v.toLocaleString()}` },
    { key: 'date', label: 'Date', render: v => new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
  ], []);

  const handleExport = () => {
    const filename = `coupon-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    exportCSV(
      filtered.map(h => ({
        couponCode: h.couponCode,
        user: h.user,
        orderValue: h.orderValue,
        discountApplied: h.discountApplied,
        netPayable: h.netPayable,
        date: h.date,
      })),
      filename
    );
    addToast(`Exported ${filtered.length} records as ${filename}`, 'success');
  };

  return (
    <div className="analytics-page animate-fadeIn">
      {/* Filters */}
      <div className="card analytics-filters">
        <div className="filter-row">
          <div className="form-group" style={{ minWidth: 160 }}>
            <label className="form-label">From Date</label>
            <input type="date" className="form-control" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ minWidth: 160 }}>
            <label className="form-label">To Date</label>
            <input type="date" className="form-control" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ minWidth: 160 }}>
            <label className="form-label">Coupon Type</label>
            <select className="form-control" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ minWidth: 160 }}>
            <label className="form-label">Category</label>
            <select className="form-control" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              {cats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button
            className="btn btn-secondary"
            style={{ alignSelf: 'flex-end' }}
            onClick={() => { setFromDate(''); setToDate(''); setTypeFilter('All'); setCatFilter('All'); }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* KPIs */}
      <section className="grid-4" style={{ margin: '20px 0' }}>
        <KPICard
          title="Total Redemptions"
          value={kpis.total}
          trend={5.2}
          trendLabel="filtered period"
          color="emerald"
          icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
        <KPICard
          title="Avg Discount Given"
          value={`₹${kpis.avgDiscount}`}
          trend={-1.4}
          trendLabel="per transaction"
          color="amber"
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <KPICard
          title="Conversion Rate"
          value={`${kpis.convRate}%`}
          trend={2.3}
          trendLabel="coupons redeemed"
          color="blue"
          icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
        <KPICard
          title="Top Coupon"
          value={kpis.topCode}
          trendLabel="most used in period"
          color="rose"
          icon="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
        />
      </section>

      {/* Charts Row */}
      <section className="analytics-charts">
        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h2 className="section-title" style={{ fontSize: 16 }}>Daily Redemptions (Last 14 Days)</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Based on active filters</p>
            </div>
          </div>
          <div className="card-body">
            <LineChart data={dailyTrend} color="#059669" height={160} width={520} />
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <h2 className="section-title" style={{ fontSize: 16 }}>Redemptions by Type</h2>
          </div>
          <div className="card-body">
            {byType.length > 0
              ? <BarChart data={byType} height={160} width={300} />
              : <div className="empty-state" style={{ padding: '24px' }}>No data for selected filters</div>
            }
          </div>
        </div>
      </section>

      {/* Usage History Table */}
      <div style={{ marginTop: 24 }}>
        <div className="section-header" style={{ marginBottom: 16 }}>
          <h2 className="section-title" style={{ fontSize: 16 }}>Usage History</h2>
          <button
            id="export-csv-btn"
            className="btn btn-secondary"
            onClick={handleExport}
            disabled={filtered.length === 0}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </button>
        </div>
        <div className="card">
          <DataTable
            columns={columns}
            data={filtered}
            searchable
            sortable
            pageSize={10}
            emptyMessage="No usage records match the selected filters."
          />
        </div>
      </div>
    </div>
  );
}
