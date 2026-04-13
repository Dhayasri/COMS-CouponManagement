import { useState } from "react";

const S = {
  app: {
    display: "flex",
    height: "100vh",
    background: "#f0f2f5",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "14px",
    color: "#1a1d23",
  },
  // ── Sidebar ──
  sidebar: {
    width: "160px",
    minWidth: "160px",
    background: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
  },
  logo: {
    padding: "0 18px 24px",
    borderBottom: "1px solid #e5e7eb",
  },
  logoIcon: {
    width: "28px",
    height: "28px",
    background: "#2563eb",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "6px",
  },
  logoTitle: { fontSize: "15px", fontWeight: "700", color: "#1a1d23", lineHeight: 1.2 },
  logoSub: { fontSize: "9px", fontWeight: "600", color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "2px" },
  nav: { padding: "16px 0", flex: 1 },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 18px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: active ? "700" : "500",
    color: active ? "#2563eb" : "#6b7280",
    background: active ? "#eff6ff" : "transparent",
    borderLeft: active ? "3px solid #2563eb" : "3px solid transparent",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    transition: "all 0.15s",
  }),
  profile: {
    padding: "16px 18px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#f97316",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    color: "#fff",
    flexShrink: 0,
  },
  profileName: { fontSize: "12px", fontWeight: "600", color: "#1a1d23" },
  profileRole: { fontSize: "10px", color: "#9ca3af" },

  // ── Main ──
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar: {
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    padding: "10px 28px",
    display: "flex",
    alignItems: "center",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "7px 14px",
    flex: 1,
    maxWidth: "420px",
  },
  searchInput: {
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: "13px",
    color: "#374151",
    width: "100%",
  },
  content: { flex: 1, overflowY: "auto", padding: "28px 28px" },

  // ── Header ──
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px" },
  pageTitle: { fontSize: "24px", fontWeight: "700", color: "#1a1d23", margin: 0 },
  pageSubtitle: { fontSize: "13px", color: "#6b7280", marginTop: "4px" },
  headerBtns: { display: "flex", gap: "10px" },
  btnOutline: {
    padding: "8px 16px", fontSize: "13px", fontWeight: "500",
    background: "#fff", border: "1.5px solid #d1d5db", borderRadius: "8px",
    cursor: "pointer", color: "#374151",
  },
  btnPrimary: {
    padding: "8px 16px", fontSize: "13px", fontWeight: "600",
    background: "#2563eb", border: "none", borderRadius: "8px",
    cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: "6px",
  },

  // ── Stat Cards ──
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "22px" },
  statCard: (accent) => ({
    background: "#fff",
    borderRadius: "12px",
    padding: "20px 22px",
    borderTop: `3px solid ${accent}`,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  }),
  statLabel: { fontSize: "10px", fontWeight: "600", color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  statValue: { fontSize: "30px", fontWeight: "800", color: "#1a1d23", lineHeight: 1 },
  statBadge: (color) => ({
    fontSize: "11px", fontWeight: "700", color,
    background: color === "#16a34a" ? "#dcfce7" : color === "#dc2626" ? "#fee2e2" : "#dbeafe",
    padding: "2px 6px", borderRadius: "4px", marginLeft: "8px",
  }),
  statSub: { fontSize: "12px", color: "#9ca3af", marginTop: "6px" },
  archiveBadge: {
    fontSize: "10px", fontWeight: "600", color: "#dc2626",
    background: "#fee2e2", padding: "2px 7px", borderRadius: "4px", marginLeft: "8px",
  },

  // ── Chart ──
  chartCard: {
    background: "#fff", borderRadius: "12px", padding: "22px 24px",
    marginBottom: "22px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  chartHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
  chartTitle: { fontSize: "15px", fontWeight: "700", color: "#1a1d23" },
  chartSub: { fontSize: "12px", color: "#9ca3af", marginTop: "3px" },
  toggleGroup: { display: "flex", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" },
  toggleBtn: (active) => ({
    padding: "6px 14px", fontSize: "12px", fontWeight: "600",
    background: active ? "#1a1d23" : "#fff",
    color: active ? "#fff" : "#6b7280",
    border: "none", cursor: "pointer", transition: "all 0.15s",
  }),
  chartArea: { display: "flex", alignItems: "flex-end", gap: "14px", height: "160px", padding: "0 8px" },
  bar: (isPeak, isSelected, height) => ({
    width: "100%", height: `${height}%`,
    background: isSelected ? "#7c3aed" : isPeak ? "#2563eb" : "#c7d2fe",
    borderRadius: "6px 6px 0 0",
    transition: "background 0.2s, transform 0.15s",
    transform: isSelected ? "scaleX(0.85)" : "scaleX(1)",
    boxShadow: isSelected ? "0 0 0 2px #7c3aed44" : "none",
  }),
  barLabel: { fontSize: "11px", color: "#9ca3af", textAlign: "center", marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.04em" },
  tooltip: {
    position: "absolute",
    bottom: "calc(100% + 8px)",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#1a1d23",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "600",
    padding: "5px 9px",
    borderRadius: "6px",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
    zIndex: 10,
  },
  tooltipArrow: {
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderTop: "5px solid #1a1d23",
  },

  // ── Offers ──
  offersCard: { background: "#fff", borderRadius: "12px", padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" },
  offersHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  offersTitle: { fontSize: "11px", fontWeight: "700", color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase" },
  viewAll: { fontSize: "13px", fontWeight: "600", color: "#2563eb", cursor: "pointer", textDecoration: "none" },
  offerRow: {
    display: "flex", alignItems: "center", gap: "14px",
    padding: "12px 0", borderBottom: "1px solid #f3f4f6",
  },
  offerIcon: (bg) => ({
    width: "38px", height: "38px", borderRadius: "10px",
    background: bg, display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px", flexShrink: 0,
  }),
  offerName: { fontSize: "13px", fontWeight: "700", color: "#1a1d23" },
  offerMeta: { fontSize: "11px", color: "#9ca3af", marginTop: "2px" },
  offerRev: { marginLeft: "auto", textAlign: "right" },
  offerRevAmt: { fontSize: "13px", fontWeight: "700", color: "#1a1d23" },
  offerRevLabel: { fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" },
  statusBadge: (type) => {
    const map = {
      LIVE: { bg: "#dcfce7", color: "#15803d" },
      ENDED: { bg: "#fee2e2", color: "#dc2626" },
      SCHEDULED: { bg: "#dbeafe", color: "#2563eb" },
    };
    const s = map[type] || map.LIVE;
    return {
      fontSize: "10px", fontWeight: "700", padding: "3px 10px",
      borderRadius: "20px", background: s.bg, color: s.color,
      letterSpacing: "0.04em", marginLeft: "12px", whiteSpace: "nowrap",
    };
  },
};

const weekData = [
  { day: "MON", val: 52 },
  { day: "TUE", val: 74 },
  { day: "WED", val: 43 },
  { day: "THU", val: 68 },
  { day: "FRI", val: 95 },
  { day: "SAT", val: 60 },
  { day: "SUN", val: 30 },
];

const monthData = [
  { day: "W1", val: 45 }, { day: "W2", val: 62 }, { day: "W3", val: 78 }, { day: "W4", val: 55 },
];

const yearData = [
  { day: "JAN", val: 56 }, { day: "FEB", val: 82 }, { day: "MAR", val: 65 }, { day: "APR", val: 90 }, { day: "MAY", val: 50 }, { day: "JUN", val: 76 },
];

const offers = [
  { icon: "🔥", bg: "#fff7ed", name: "FLASHSALE2024", meta: "Expires in 2 days • Global", rev: "$12,400", status: "LIVE" },
  { icon: "☕", bg: "#fef3c7", name: "COFFEELOVER_OFF", meta: "Expired yesterday • UK Only", rev: "$4,290", status: "ENDED" },
  { icon: "🎁", bg: "#eff6ff", name: "WELCOME_BACK_50", meta: "Never expires • Personalized", rev: "$8,122", status: "LIVE" },
  { icon: "✈️", bg: "#f0fdf4", name: "TRAVEL_SPRING_24", meta: "Starts in 3 days • Pending", rev: "$0", status: "SCHEDULED" },
];

export default function Dashboard({ onNavigate }) {
  const [chartMode, setChartMode] = useState("Weekly");
  const [hoveredBar, setHoveredBar] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);
  const chartData = chartMode === "Weekly" ? weekData : chartMode === "Monthly" ? monthData : yearData;
  const peakIdx = chartData.reduce((p, c, i) => c.val > chartData[p].val ? i : p, 0);
  const selectedData = selectedBar !== null ? chartData[selectedBar] : null;

  return (
    <div style={S.app}>
      {/* Sidebar */}
      <aside style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </div>
          <div style={S.logoTitle}>Coupon<br/>Management</div>
          <div style={S.logoSub}>Enterprise Admin</div>
        </div>
        <nav style={S.nav}>
          {[
            { id: "dashboard", label: "DASHBOARD", icon: "▦" },
            { id: "coupons",   label: "COUPONS",   icon: "⊡" },
          ].map(({ id, label, icon }) => (
            <div key={id} style={S.navItem(id === "dashboard")} onClick={() => onNavigate && onNavigate(id)}>
              <span style={{ fontSize: "13px" }}>{icon}</span>
              {label}
            </div>
          ))}
        </nav>
        <div style={S.profile}>
          <div style={S.avatar}>A</div>
          <div>
            <div style={S.profileName}>Alex Rivera</div>
            <div style={S.profileRole}>System Manager</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={S.main}>
        {/* Topbar */}
        <div style={S.topbar}>
          <div style={S.searchWrap}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input style={S.searchInput} placeholder="Search promotions, users, or trends..." />
          </div>
        </div>

        {/* Content */}
        <div style={S.content}>
          {/* Page Header */}
          <div style={S.pageHeader}>
            <div>
              <div style={S.pageTitle}>Performance Overview</div>
              <div style={S.pageSubtitle}>Real-time tracking of active promotion campaigns.</div>
            </div>

          </div>

          {/* Stat Cards */}
          <div style={S.statsRow}>
            <div style={S.statCard("#2563eb")}>
              <div style={S.statLabel}>
                Total Active Coupons
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              </div>
              <div style={S.statValue}>
                1,284
                <span style={S.statBadge("#16a34a")}>+12%</span>
              </div>
              <div style={S.statSub}>Across 14 regional markets</div>
            </div>

            <div style={S.statCard("#dc2626")}>
              <div style={S.statLabel}>
                Total Expired
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              </div>
              <div style={S.statValue}>
                452
                <span style={S.archiveBadge}>Archive</span>
              </div>
              <div style={S.statSub}>Past 30 days cycle</div>
            </div>

            <div style={S.statCard("#7c3aed")}>
              <div style={S.statLabel}>
                Total Times Used
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div style={S.statValue}>
                24.8k
                <span style={S.statBadge("#2563eb")}>+5.2k</span>
              </div>
              <div style={S.statSub}>Average redemption rate: 64%</div>
            </div>
          </div>

          {/* Chart */}
          <div style={S.chartCard}>
            <div style={S.chartHeader}>
              <div>
                <div style={S.chartTitle}>Usage Trend</div>
                <div style={S.chartSub}>Volume analysis for the current period</div>
              </div>
              <div style={S.toggleGroup}>
                {["Weekly", "Monthly", "Yearly"].map((m) => (
                  <button key={m} style={S.toggleBtn(chartMode === m)} onClick={() => setChartMode(m)}>{m}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={S.chartArea}>
                {chartData.map((d, i) => (
                  <div
                    key={d.day}
                    style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", position: "relative", cursor: "pointer" }}
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                    onClick={() => setSelectedBar(selectedBar === i ? null : i)}
                  >
                    {hoveredBar === i && selectedBar !== i && (
                      <div style={S.tooltip}>
                        <span style={{ opacity: 0.65, marginRight: "4px" }}>{d.day}</span>{d.val} uses
                        <div style={S.tooltipArrow} />
                      </div>
                    )}
                    <div style={S.bar(i === peakIdx, selectedBar === i, d.val)} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "14px", padding: "0 8px" }}>
                {chartData.map((d, i) => (
                  <div key={d.day} style={{ flex: 1, ...S.barLabel, color: selectedBar === i ? "#7c3aed" : "#9ca3af", fontWeight: selectedBar === i ? "700" : "400" }}>{d.day}</div>
                ))}
              </div>

              {/* Selected bar detail strip */}
              {selectedData && (
                <div style={{ marginTop: "16px", background: "#f5f3ff", border: "1.5px solid #ede9fe", borderRadius: "10px", padding: "12px 18px", display: "flex", alignItems: "center", gap: "24px", animation: "fadeIn 0.2s ease" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#7c3aed", letterSpacing: "0.06em", textTransform: "uppercase", minWidth: "40px" }}>{selectedData.day}</div>
                  <div style={{ width: "1px", height: "28px", background: "#ede9fe" }} />
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: "800", color: "#1a1d23" }}>{selectedData.val} <span style={{ fontSize: "13px", fontWeight: "500", color: "#9ca3af" }}>uses</span></div>
                    <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>Usage volume for this period</div>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: "20px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#1a1d23" }}>{Math.round(selectedData.val * 1.3)}%</div>
                      <div style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Redemption</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#1a1d23" }}>${(selectedData.val * 128).toLocaleString()}</div>
                      <div style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Revenue</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: selectedData.val >= chartData[peakIdx].val ? "#16a34a" : "#dc2626" }}>{selectedData.val >= chartData[peakIdx].val ? "▲ Peak" : `${Math.round((selectedData.val / chartData[peakIdx].val) * 100)}%`}</div>
                      <div style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>vs Peak</div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedBar(null)} style={{ marginLeft: "8px", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "16px", lineHeight: 1, padding: "4px" }}>✕</button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Offers */}
          <div style={S.offersCard}>
            <div style={S.offersHeader}>
              <div style={S.offersTitle}>Recent Offers</div>
              <a style={S.viewAll} href="#">View All</a>
            </div>
            {offers.map((o, i) => (
              <div key={o.name} style={{ ...S.offerRow, borderBottom: i === offers.length - 1 ? "none" : "1px solid #f3f4f6" }}>
                <div style={S.offerIcon(o.bg)}>{o.icon}</div>
                <div>
                  <div style={S.offerName}>{o.name}</div>
                  <div style={S.offerMeta}>{o.meta}</div>
                </div>
                <div style={S.offerRev}>
                  <div style={S.offerRevAmt}>{o.rev}</div>
                  <div style={S.offerRevLabel}>Attributed Rev</div>
                </div>
                <span style={S.statusBadge(o.status)}>{o.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}