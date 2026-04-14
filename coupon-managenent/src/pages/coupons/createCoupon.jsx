import { useState } from "react";

function generateCode() {
  const prefixes = ["SUMMER", "FLASH", "SAVE", "DEAL", "PROMO"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(Math.random() * 90 + 10);
  return `${prefix}${num}_FLASH`;
}

export default function CreateCoupon({ onNavigate }) {
  const [promoCode, setPromoCode] = useState("");
  const [discountValue, setDiscountValue] = useState("20");
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("0");
  const [minPurchase, setMinPurchase] = useState(false);
  const [activeNav, setActiveNav] = useState("Coupons");

  const usageLimitNum = parseInt(usageLimit, 10);
  const usageLimitInvalid = isNaN(usageLimitNum) || usageLimitNum < 0;

  const discountNum = parseFloat(discountValue) || 0;
  const projectedLift = (discountNum * 0.62).toFixed(1);
  const newUsers = Math.round(discountNum * 22.5);
  const revForecast = (discountNum * 625).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 1 }).replace(".0", "");

  return (
    <div style={{
      display: "flex", height: "100vh",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#F1F5F9", color: "#0F172A"
    }}>

      {/* Sidebar */}
      <aside style={{
        width: 192, background: "#fff", borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column", padding: "24px 0",
        boxShadow: "2px 0 8px rgba(0,0,0,0.04)"
      }}>
        <div style={{ padding: "0 18px 24px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7,
              background: "#1D4ED8", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13
            }}>C</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: "#0F172A", lineHeight: 1.2 }}>Coupon</div>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: "#0F172A", lineHeight: 1.2 }}>Management</div>
              <div style={{ fontSize: 8.5, color: "#94A3B8", letterSpacing: "0.07em", marginTop: 2 }}>ENTERPRISE ADMIN</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: "14px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
          {["Dashboard", "Coupons"].map(label => (
            <button key={label} onClick={() => onNavigate && onNavigate(label.toLowerCase())} style={{
              display: "flex", alignItems: "center", gap: 9, padding: "8px 11px",
              borderRadius: 8, border: "none", cursor: "pointer",
              background: activeNav === label ? "#EFF6FF" : "transparent",
              color: activeNav === label ? "#1D4ED8" : "#64748B",
              fontWeight: activeNav === label ? 700 : 500,
              fontSize: 12, letterSpacing: "0.05em",
            }}>
              <span style={{ fontSize: 14 }}>{label === "Dashboard" ? "⊞" : "◈"}</span>
              {label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: "auto", padding: "14px 14px", borderTop: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg,#3B82F6,#1D4ED8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0
          }}>A</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 11.5, color: "#0F172A" }}>Admin User</div>
            <div style={{ fontSize: 10, color: "#94A3B8" }}>Manage Store</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>

        {/* Top search bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
          <div style={{
            flex: 1, maxWidth: 400, background: "#fff", border: "1px solid #E2E8F0",
            borderRadius: 9, display: "flex", alignItems: "center", gap: 8, padding: "7px 13px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}>
            <span style={{ color: "#CBD5E1", fontSize: 13 }}>🔍</span>
            <span style={{ color: "#CBD5E1", fontSize: 12.5 }}>Search promotions, analytics, or settings...</span>
          </div>

        </div>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
              Create New Coupon
            </h1>
            <p style={{ margin: "5px 0 0", color: "#64748B", fontSize: 12.5, maxWidth: 360 }}>
              Define your promotion's parameters to drive customer engagement and maximize seasonal revenue.
            </p>
          </div>

        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18 }}>

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Section 01 – Coupon Identity */}
            <Section label="SECTION 01" title="Coupon Identity">
              <FieldLabel>PROMOTIONAL CODE</FieldLabel>
              <div style={{ position: "relative" }}>
                <input
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  placeholder="e.g.  SUMMER24_FLASH"
                  style={inputStyle()}
                />
                <button
                  onClick={() => setPromoCode(generateCode())}
                  style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "#1D4ED8", fontSize: 11.5,
                    fontWeight: 700, cursor: "pointer", letterSpacing: "0.03em"
                  }}
                >Generate Random</button>
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 5 }}>
                This is the code customers will enter at checkout.
              </div>
            </Section>

            {/* Section 02 – Value & Reach */}
            <Section label="SECTION 02" title="Value & Reach">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <FieldLabel>DISCOUNT VALUE (%)</FieldLabel>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={e => setDiscountValue(e.target.value)}
                      style={{ ...inputStyle(), paddingRight: 32 }}
                    />
                    <span style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      color: "#94A3B8", fontSize: 13, fontWeight: 600
                    }}>%</span>
                  </div>
                </div>
                <div>
                  <FieldLabel>EXPIRY DATE</FieldLabel>
                  <div style={{ position: "relative" }}>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={e => setExpiryDate(e.target.value)}
                      placeholder="mm/dd/yyyy"
                      style={{ ...inputStyle(), paddingRight: 36, color: expiryDate ? "#0F172A" : "#94A3B8" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <FieldLabel>USAGE LIMIT (GLOBAL)</FieldLabel>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    min="0"
                    value={usageLimit}
                    onChange={e => setUsageLimit(e.target.value)}
                    style={{
                      ...inputStyle(),
                      borderColor: usageLimitInvalid ? "#EF4444" : "#E2E8F0",
                      paddingRight: 36,
                    }}
                  />
                  {usageLimitInvalid && (
                    <div style={{
                      position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                      width: 20, height: 20, borderRadius: "50%",
                      background: "#EF4444", display: "flex", alignItems: "center",
                      justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700
                    }}>!</div>
                  )}
                </div>
                {usageLimitInvalid && (
                  <div style={{ color: "#EF4444", fontSize: 11, marginTop: 5 }}>
                    Usage limit cannot be negative. Please enter a valid number.
                  </div>
                )}
              </div>
            </Section>


          </div>

        </div>

        {/* Form Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 24, borderTop: "1px solid #E2E8F0" }}>
          <button onClick={() => onNavigate && onNavigate("coupons")} style={{
            padding: "10px 22px", borderRadius: 9, border: "1px solid #E2E8F0",
            background: "#fff", color: "#64748B", fontWeight: 600, fontSize: 13, cursor: "pointer",
            transition: "background 0.15s"
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
            Cancel
          </button>
          <button onClick={() => onNavigate && onNavigate("coupons")} style={{
            padding: "10px 24px", borderRadius: 9, border: "none",
            background: "#1D4ED8", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
            boxShadow: "0 4px 14px rgba(29,78,216,0.32)",
            transition: "background 0.15s"
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1e40af")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1D4ED8")}>
            Save Coupon
          </button>
        </div>
      </main>
    </div>
  );
}

function Section({ label, title, children }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 13, border: "1px solid #E2E8F0",
      padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
    }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.09em", color: "#94A3B8", marginBottom: 4 }}>{label}</div>
      <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: "#0F172A" }}>{title}</h2>
      {children}
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#94A3B8", marginBottom: 6 }}>
      {children}
    </div>
  );
}

function inputStyle(extra = {}) {
  return {
    width: "100%", boxSizing: "border-box",
    padding: "10px 14px", borderRadius: 9,
    border: "1px solid #E2E8F0", background: "#F8FAFC",
    fontSize: 13, color: "#0F172A", outline: "none",
    fontFamily: "inherit",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
    ...extra
  };
}

function Toggle({ on, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 40, height: 22, borderRadius: 99, cursor: "pointer",
        background: on ? "#1D4ED8" : "#CBD5E1",
        position: "relative", transition: "background 0.2s", flexShrink: 0
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: on ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%", background: "#fff",
        transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
      }} />
    </div>
  );
}
