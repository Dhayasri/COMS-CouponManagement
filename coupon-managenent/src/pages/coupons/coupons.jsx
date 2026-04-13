import { useState } from "react";

const initialCoupons = [
  {
    id: 1,
    code: "SUMMER24",
    offer: "25% OFF SITEWIDE",
    sub: "Min. order $50.00",
    expiry: "Sep 15, 2024",
    usage: "1,240",
    status: "Active",
    color: "#2563EB",
  },
  {
    id: 2,
    code: "WELCOME50",
    offer: "$50 First Order",
    sub: "New users only",
    expiry: "Aug 01, 2024",
    usage: "8,902",
    status: "Expired",
    color: "#94A3B8",
  },
  {
    id: 3,
    code: "FLASH10",
    offer: "10% Extra Discount",
    sub: "48-hour flash sale",
    expiry: "Oct 22, 2024",
    usage: "452",
    status: "Active",
    color: "#2563EB",
  },
  {
    id: 4,
    code: "BOGO_FREE",
    offer: "Buy One Get One",
    sub: "Select categories only",
    expiry: "Dec 31, 2024",
    usage: "2,110",
    status: "Active",
    color: "#2563EB",
  },
];

const emptyForm = { code: "", offer: "", sub: "", expiry: "" };

export default function CouponManagement({ onNavigate }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.offer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateModal = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setEditId(coupon.id);
    setForm({ code: coupon.code, offer: coupon.offer, sub: coupon.sub, expiry: coupon.expiry });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId !== null) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editId
            ? { ...c, ...form, color: "#2563EB", status: "Active" }
            : c
        )
      );
    } else {
      const newCoupon = {
        id: Date.now(),
        ...form,
        usage: "0",
        status: "Active",
        color: "#2563EB",
      };
      setCoupons((prev) => [newCoupon, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
  };

  const activeCoupons = coupons.filter((c) => c.status === "Active").length;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: "#F1F5F9",
        color: "#0F172A",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 200,
          background: "#fff",
          borderRight: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          gap: 0,
          boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "0 20px 28px 20px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#1D4ED8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              C
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2, color: "#0F172A" }}>Coupon</div>
              <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2, color: "#0F172A" }}>Management</div>
              <div style={{ fontSize: 9, color: "#64748B", letterSpacing: "0.06em", marginTop: 2 }}>ENTERPRISE ADMIN</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { id: "dashboard", label: "DASHBOARD", icon: "⊞" },
            { id: "coupons", label: "COUPONS", icon: "◈" },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => onNavigate && onNavigate(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: id === "coupons" ? "#EFF6FF" : "transparent",
                color: id === "coupons" ? "#1D4ED8" : "#64748B",
                fontWeight: id === "coupons" ? 700 : 500,
                fontSize: 12,
                letterSpacing: "0.06em",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 15 }}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div
          style={{
            marginTop: "auto",
            padding: "16px 16px",
            borderTop: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            A
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "#0F172A" }}>Alex Rivera</div>
            <div
              style={{
                fontSize: 10,
                color: "#94A3B8",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              alex.r@couponmanage...
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>
        {/* Search bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div
            style={{
              flex: 1,
              maxWidth: 420,
              background: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <span style={{ color: "#94A3B8", fontSize: 14 }}>🔍</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coupons, codes, or status..."
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 13,
                color: "#374151",
                width: "100%",
              }}
            />
          </div>
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
              Active Coupons
            </h1>
            <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: 13 }}>
              Monitor performance and manage your discount inventory.
            </p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate("create-coupon")}
            style={{
              background: "#1D4ED8",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "11px 20px",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 4px 14px rgba(29,78,216,0.35)",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1e40af")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1D4ED8")}
          >
            <span style={{ fontSize: 16, fontWeight: 400 }}>+</span> Create New Coupon
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "TOTAL SAVINGS", value: "$124.8k", badge: "+12%", color: "#10B981" },
            { label: "ACTIVE COUPONS", value: String(activeCoupons), badge: "Units", color: "#3B82F6", subtle: true },
            { label: "AVG. CONVERSION", value: "18.4%", badge: "+3.1%", color: "#10B981" },
          ].map(({ label, value, badge, color, subtle }) => (
            <div
              key={label}
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "20px 22px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontSize: 10, letterSpacing: "0.08em", color: "#94A3B8", fontWeight: 600, marginBottom: 8 }}>
                {label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                  {value}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: subtle ? "#64748B" : color,
                    background: subtle ? "#F1F5F9" : color + "18",
                    padding: "2px 7px",
                    borderRadius: 20,
                  }}
                >
                  {badge}
                </span>
              </div>
              <div style={{ marginTop: 14, height: 4, borderRadius: 4, background: "#F1F5F9", overflow: "hidden" }}>
                <div
                  style={{
                    width: "65%",
                    height: "100%",
                    background: "linear-gradient(90deg, #2563EB, #3B82F6)",
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Table */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 2fr 1.2fr 1fr 0.8fr 0.8fr",
              padding: "12px 24px",
              background: "#F8FAFC",
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            {["COUPON CODE", "DISCOUNT OFFER", "EXPIRY DATE", "USAGE COUNT", "STATUS", "ACTIONS"].map((h) => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", color: "#94A3B8" }}>
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {filteredCoupons.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>
              No coupons match your search.
            </div>
          ) : (
            filteredCoupons.map((c, i) => (
              <div
                key={c.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 2fr 1.2fr 1fr 0.8fr 0.8fr",
                  padding: "16px 24px",
                  borderBottom: i < filteredCoupons.length - 1 ? "1px solid #F1F5F9" : "none",
                  alignItems: "center",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFF")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {/* Code */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{ width: 3, height: 28, borderRadius: 2, background: c.color, flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: 12,
                      fontWeight: 700,
                      background: "#F1F5F9",
                      padding: "4px 9px",
                      borderRadius: 6,
                      color: "#1E293B",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {c.code}
                  </span>
                </div>

                {/* Offer */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#0F172A" }}>{c.offer}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{c.sub}</div>
                </div>

                {/* Expiry */}
                <div style={{ fontSize: 13, color: "#475569" }}>{c.expiry}</div>

                {/* Usage */}
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{c.usage}</div>

                {/* Status */}
                <div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 20,
                      background: c.status === "Active" ? "#DCFCE7" : "#FEE2E2",
                      color: c.status === "Active" ? "#16A34A" : "#DC2626",
                    }}
                  >
                    {c.status}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    title="Edit"
                    onClick={() => openEditModal(c)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      border: "1px solid #E2E8F0",
                      background: "#fff",
                      cursor: "pointer",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    title="Delete"
                    onClick={() => setDeleteConfirmId(c.id)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      border: "1px solid #E2E8F0",
                      background: "#fff",
                      cursor: "pointer",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Pagination */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 24px",
              background: "#F8FAFC",
              borderTop: "1px solid #E2E8F0",
            }}
          >
            <span style={{ fontSize: 12, color: "#64748B" }}>
              Showing <b>1–{filteredCoupons.length}</b> of <b>{coupons.length}</b> coupons
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <PagBtn label="Previous" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} />
              {[1, 2, 3].map((n) => (
                <PagBtn key={n} label={n} active={currentPage === n} onClick={() => setCurrentPage(n)} />
              ))}
              <PagBtn label="Next" onClick={() => setCurrentPage((p) => Math.min(3, p + 1))} />
            </div>
          </div>
        </div>
      </main>

      {/* Create / Edit Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(2px)",
          }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: "32px 36px",
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              animation: "fadeIn 0.2s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0F172A" }}>
                  {editId !== null ? "Edit Coupon" : "Create New Coupon"}
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
                  {editId !== null ? "Update the coupon details below." : "Fill in the details for your new coupon."}
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: "#F1F5F9",
                  border: "none",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  fontSize: 16,
                  color: "#64748B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {[
                { name: "code", label: "Coupon Code", placeholder: "e.g. SUMMER25", required: true },
                { name: "offer", label: "Discount Offer", placeholder: "e.g. 25% OFF Sitewide", required: true },
                { name: "sub", label: "Conditions", placeholder: "e.g. Min. order $50.00", required: false },
                { name: "expiry", label: "Expiry Date", placeholder: "e.g. Dec 31, 2025", required: true },
              ].map(({ name, label, placeholder, required }) => (
                <div key={name} style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#64748B",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    {label}
                  </label>
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleFormChange}
                    placeholder={placeholder}
                    required={required}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: 13,
                      color: "#374151",
                      background: "#F8FAFC",
                      border: "1.5px solid #E2E8F0",
                      borderRadius: 9,
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                    onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
                  />
                </div>
              ))}

              <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    padding: "11px",
                    fontSize: 13,
                    fontWeight: 600,
                    background: "#F1F5F9",
                    border: "1.5px solid #E2E8F0",
                    borderRadius: 9,
                    cursor: "pointer",
                    color: "#475569",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "11px",
                    fontSize: 13,
                    fontWeight: 700,
                    background: "#1D4ED8",
                    border: "none",
                    borderRadius: 9,
                    cursor: "pointer",
                    color: "#fff",
                    boxShadow: "0 4px 14px rgba(29,78,216,0.35)",
                  }}
                >
                  {editId !== null ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "32px 36px",
              width: 360,
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>Delete Coupon?</h3>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "#64748B" }}>
              This action cannot be undone. Are you sure you want to delete this coupon?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  fontSize: 13,
                  fontWeight: 600,
                  background: "#F1F5F9",
                  border: "1.5px solid #E2E8F0",
                  borderRadius: 9,
                  cursor: "pointer",
                  color: "#475569",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                style={{
                  flex: 1,
                  padding: "10px",
                  fontSize: 13,
                  fontWeight: 700,
                  background: "#DC2626",
                  border: "none",
                  borderRadius: 9,
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PagBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        minWidth: 32,
        height: 32,
        borderRadius: 8,
        border: "1px solid #E2E8F0",
        background: active ? "#1D4ED8" : "#fff",
        color: active ? "#fff" : "#475569",
        fontWeight: active ? 700 : 500,
        fontSize: 12,
        cursor: "pointer",
        padding: "0 10px",
        boxShadow: active ? "0 2px 8px rgba(29,78,216,0.3)" : "none",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}
