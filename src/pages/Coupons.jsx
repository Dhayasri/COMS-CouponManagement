import { useState, useMemo } from 'react';
import { useCoupon } from '../context/CouponContext';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import './Coupons.css';

// ── Helpers ──────────────────────────────────────────────────────────────────

const today = () => new Date().toISOString().split('T')[0];

function daysLeft(expiryDate) {
  return Math.ceil((new Date(expiryDate) - new Date()) / 86400000);
}

function getStatusVariant(status, expiry) {
  if (status === 'Expired') return 'danger';
  if (status === 'Paused') return 'neutral';
  const d = daysLeft(expiry);
  if (status === 'Active' && d >= 0 && d <= 7) return 'warning';
  return 'success';
}

function getStatusLabel(status, expiry) {
  if (status === 'Expired') return 'Expired';
  if (status === 'Paused') return 'Paused';
  const d = daysLeft(expiry);
  if (status === 'Active' && d >= 0 && d <= 7) return `Expiring (${d}d)`;
  return 'Active';
}

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const EMPTY_FORM = {
  code: '', type: 'Flat', discountValue: '', minOrder: 0,
  maxUses: 0, category: 'All', startDate: today(), expiryDate: '',
  description: '', status: 'Active',
};

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Food', 'Travel'];
const TYPES = ['Flat', 'Percent', 'BOGO', 'Free Shipping'];

// ── Coupon Form ───────────────────────────────────────────────────────────────

function CouponForm({ form, setForm, errors, settings }) {
  const needsValue = form.type === 'Flat' || form.type === 'Percent';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleCodeBlur = () => {
    setForm(f => ({ ...f, code: f.code.trim().toUpperCase().replace(/\s+/g, '') }));
  };

  return (
    <div className="cpn-form">
      {/* Code + Generator */}
      <div className="form-group">
        <label className="form-label">Coupon Code *</label>
        <div className="code-input-wrap">
          <input
            id="coupon-code"
            name="code"
            className={`form-control font-mono ${errors.code ? 'is-invalid' : ''}`}
            value={form.code}
            onChange={handleChange}
            onBlur={handleCodeBlur}
            placeholder="e.g. SUMMER30"
            maxLength={20}
          />
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setForm(f => ({ ...f, code: generateCode() }))}
          >
            🎲 Generate
          </button>
        </div>
        {errors.code && <p className="form-error">⚠ {errors.code}</p>}
      </div>

      {/* Type */}
      <div className="form-group">
        <label className="form-label">Discount Type *</label>
        <select
          name="type"
          className="form-control"
          value={form.type}
          onChange={handleChange}
        >
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Discount Value */}
      <div className="form-group">
        <label className="form-label">
          Discount Value {needsValue ? '*' : '(N/A)'}
        </label>
        <input
          name="discountValue"
          type="number"
          min="0"
          max={form.type === 'Percent' ? 100 : undefined}
          className={`form-control ${errors.discountValue ? 'is-invalid' : ''}`}
          value={form.discountValue}
          onChange={handleChange}
          disabled={!needsValue}
          placeholder={form.type === 'Percent' ? 'Max 100' : '₹ amount'}
        />
        {errors.discountValue && <p className="form-error">⚠ {errors.discountValue}</p>}
      </div>

      <div className="form-row">
        {/* Min Order */}
        <div className="form-group">
          <label className="form-label">Minimum Order (₹)</label>
          <input
            name="minOrder"
            type="number"
            min="0"
            className={`form-control ${errors.minOrder ? 'is-invalid' : ''}`}
            value={form.minOrder}
            onChange={handleChange}
          />
          {errors.minOrder && <p className="form-error">⚠ {errors.minOrder}</p>}
        </div>

        {/* Max Uses */}
        <div className="form-group">
          <label className="form-label">Max Uses (0 = unlimited)</label>
          <input
            name="maxUses"
            type="number"
            min="0"
            className="form-control"
            value={form.maxUses}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Category */}
      <div className="form-group">
        <label className="form-label">Applicable Category</label>
        <select name="category" className="form-control" value={form.category} onChange={handleChange}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="form-row">
        {/* Start Date */}
        <div className="form-group">
          <label className="form-label">Start Date *</label>
          <input
            name="startDate"
            type="date"
            className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
            value={form.startDate}
            onChange={handleChange}
          />
          {errors.startDate && <p className="form-error">⚠ {errors.startDate}</p>}
        </div>

        {/* Expiry Date */}
        <div className="form-group">
          <label className="form-label">Expiry Date *</label>
          <input
            name="expiryDate"
            type="date"
            min={today()}
            className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
            value={form.expiryDate}
            onChange={handleChange}
          />
          {errors.expiryDate && <p className="form-error">⚠ {errors.expiryDate}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description / Terms</label>
        <textarea
          name="description"
          className="form-control"
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="Optional terms and conditions..."
        />
      </div>

      {/* Status Toggle */}
      <div className="form-group">
        <label className="form-label">Status</label>
        <div className="status-toggle">
          {['Active', 'Paused'].map(s => (
            <button
              key={s}
              type="button"
              className={`status-opt ${form.status === s ? 'status-opt--active' : ''}`}
              onClick={() => setForm(f => ({ ...f, status: s }))}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {settings && !settings.allowStacking && (
        <div className="stacking-warn">
          ⚠ <strong>Stacking Disabled:</strong> Only one coupon can be applied per order (per Settings).
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Coupons() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, addToast, settings } = useCoupon();

  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | 'delete'
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setModalMode('add');
  };

  const openEdit = (coupon) => {
    setForm({
      code: coupon.code,
      type: coupon.type,
      discountValue: coupon.discountValue,
      minOrder: coupon.minOrder,
      maxUses: coupon.maxUses,
      category: coupon.category || 'All',
      startDate: coupon.startDate,
      expiryDate: coupon.expiryDate,
      description: coupon.description || '',
      status: coupon.status,
    });
    setErrors({});
    setSelectedCoupon(coupon);
    setModalMode('edit');
  };

  const openDelete = (coupon) => {
    setSelectedCoupon(coupon);
    setModalMode('delete');
  };

  const closeModal = () => { setModalMode(null); setSelectedCoupon(null); };

  const validate = () => {
    const e = {};
    const code = form.code.trim();
    if (!code) e.code = 'Coupon code is required.';
    else if (code.length < 4) e.code = 'Code must be at least 4 characters.';
    else if (/\s/.test(code)) e.code = 'Code cannot contain spaces.';

    if ((form.type === 'Flat' || form.type === 'Percent') && (!form.discountValue || Number(form.discountValue) <= 0))
      e.discountValue = 'Discount value must be greater than 0.';
    if (form.type === 'Percent' && Number(form.discountValue) > 100)
      e.discountValue = 'Percent discount cannot exceed 100.';

    if (Number(form.minOrder) < 0) e.minOrder = 'Minimum order cannot be negative.';
    if (!form.expiryDate) e.expiryDate = 'Expiry date is required.';
    else if (form.expiryDate < today()) e.expiryDate = 'Expiry date must be today or in the future.';
    if (form.startDate && form.expiryDate && form.startDate > form.expiryDate)
      e.startDate = 'Start date must be before expiry date.';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const data = {
      ...form,
      code: form.code.trim().toUpperCase(),
      discountValue: Number(form.discountValue) || 0,
      minOrder: Number(form.minOrder) || 0,
      maxUses: Number(form.maxUses) || 0,
    };
    if (modalMode === 'add') addCoupon(data);
    else updateCoupon({ ...selectedCoupon, ...data });
    closeModal();
  };

  const handleDelete = () => {
    deleteCoupon(selectedCoupon.id);
    closeModal();
  };

  const handleTogglePause = (coupon) => {
    const newStatus = coupon.status === 'Active' ? 'Paused' : 'Active';
    updateCoupon({ ...coupon, status: newStatus });
    addToast(`Coupon "${coupon.code}" ${newStatus === 'Active' ? 'resumed' : 'paused'}.`, 'info');
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      addToast(`Code "${code}" copied to clipboard!`, 'success');
    }).catch(() => {
      addToast('Failed to copy code.', 'error');
    });
  };

  const columns = useMemo(() => [
    {
      key: 'code',
      label: 'Code',
      render: (v) => <span className="font-mono code-pill">{v}</span>,
    },
    { key: 'type', label: 'Type' },
    {
      key: 'discountValue',
      label: 'Discount',
      render: (v, row) =>
        row.type === 'Flat' ? `₹${v}`
        : row.type === 'Percent' ? `${v}%`
        : row.type === 'BOGO' ? 'Buy 1 Get 1'
        : 'Free Ship',
    },
    { key: 'minOrder', label: 'Min Order', render: v => v > 0 ? `₹${v}` : 'None' },
    { key: 'maxUses', label: 'Max Uses', render: v => v === 0 ? '∞' : v },
    { key: 'usageCount', label: 'Used' },
    { key: 'expiryDate', label: 'Expiry', render: v => new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      render: (v, row) => (
        <Badge
          label={getStatusLabel(v, row.expiryDate)}
          variant={getStatusVariant(v, row.expiryDate)}
        />
      ),
    },
    {
      key: '_actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="action-btns">
          <button
            className="btn btn-ghost btn-sm action-btn"
            title="Copy Code"
            onClick={() => handleCopyCode(row.code)}
          >📋</button>
          <button
            className={`btn btn-sm action-btn ${row.status === 'Active' ? 'btn-pause' : 'btn-resume'}`}
            onClick={() => handleTogglePause(row)}
            disabled={row.status === 'Expired'}
          >
            {row.status === 'Active' ? 'Pause' : row.status === 'Paused' ? 'Resume' : '—'}
          </button>
          <button className="btn btn-secondary btn-sm action-btn" onClick={() => openEdit(row)}>Edit</button>
          <button className="btn btn-danger btn-sm action-btn" onClick={() => openDelete(row)}>Del</button>
        </div>
      ),
    },
  ], [coupons]);

  const tableData = useMemo(() => coupons.map(c => ({ ...c })), [coupons]);

  return (
    <div className="coupons-page animate-fadeIn">
      <div className="section-header">
        <div>
          <h2 className="section-title">Coupon Directory</h2>
          <p className="page-sub">Manage all discount coupons and their lifecycle</p>
        </div>
        <button id="add-coupon-btn" className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
          </svg>
          Add Coupon
        </button>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={tableData}
          searchable
          sortable
          pageSize={10}
          emptyMessage="No coupons yet. Click 'Add Coupon' to create one."
        />
      </div>

      {/* Add / Edit Modal */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <Modal
          title={modalMode === 'add' ? '✨ Add New Coupon' : `✏️ Edit — ${selectedCoupon?.code}`}
          onClose={closeModal}
          footer={
            <>
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {modalMode === 'add' ? 'Create Coupon' : 'Save Changes'}
              </button>
            </>
          }
        >
          <CouponForm form={form} setForm={setForm} errors={errors} settings={settings} />
        </Modal>
      )}

      {/* Delete Confirm */}
      {modalMode === 'delete' && (
        <Modal
          title="🗑️ Delete Coupon"
          onClose={closeModal}
          footer={
            <>
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
            </>
          }
        >
          <div className="delete-confirm">
            <p>Are you sure you want to delete coupon</p>
            <span className="font-mono delete-code">{selectedCoupon?.code}</span>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8 }}>
              This action cannot be undone. The coupon will be permanently removed.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
