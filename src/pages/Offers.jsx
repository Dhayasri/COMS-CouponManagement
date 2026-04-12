import { useState, useMemo } from 'react';
import { useCoupon } from '../context/CouponContext';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import './Offers.css';

const OFFER_TYPES = ['Seasonal Sale', 'Flash Deal', 'Loyalty Reward', 'Bundle Offer', 'Referral Bonus'];
const STATUS_OPTS = ['Active', 'Draft', 'Ended'];

const today = () => new Date().toISOString().split('T')[0];

const EMPTY_FORM = {
  name: '', type: 'Seasonal Sale', description: '',
  startDate: today(), endDate: '', linkedCoupons: [],
  bannerColor: '#059669', status: 'Active',
};

function getOfferStatusVariant(status) {
  return { Active: 'success', Draft: 'info', Ended: 'danger' }[status] || 'neutral';
}

// ── Offer Card ───────────────────────────────────────────────────────────────

function OfferCardView({ offer, coupons, onEdit, onDelete }) {
  const linked = coupons.filter(c => offer.linkedCoupons.includes(c.id));
  return (
    <div className="offer-card" style={{ '--banner': offer.bannerColor }}>
      <div className="offer-card-banner" />
      <div className="offer-card-body">
        <div className="offer-card-top">
          <Badge label={offer.type} variant="info" />
          <Badge label={offer.status} variant={getOfferStatusVariant(offer.status)} />
        </div>
        <h3 className="offer-card-name">{offer.name}</h3>
        <p className="offer-card-desc">{offer.description}</p>
        <div className="offer-card-meta">
          <span>📅 {new Date(offer.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} — {new Date(offer.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          <span>🎟 {linked.length} coupon{linked.length !== 1 ? 's' : ''} linked</span>
        </div>
        {linked.length > 0 && (
          <div className="offer-card-coupons">
            {linked.slice(0, 3).map(c => (
              <span key={c.id} className="font-mono coupon-chip">{c.code}</span>
            ))}
            {linked.length > 3 && <span className="coupon-chip-more">+{linked.length - 3}</span>}
          </div>
        )}
        <div className="offer-card-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => onEdit(offer)}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(offer)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Offer Form ───────────────────────────────────────────────────────────────

function OfferForm({ form, setForm, errors, activeCoupons }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const toggleLinkedCoupon = (id) => {
    setForm(f => ({
      ...f,
      linkedCoupons: f.linkedCoupons.includes(id)
        ? f.linkedCoupons.filter(c => c !== id)
        : [...f.linkedCoupons, id],
    }));
  };

  return (
    <div className="offer-form">
      <div className="form-group">
        <label className="form-label">Offer Name *</label>
        <input
          name="name"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Summer Sale 2026"
        />
        {errors.name && <p className="form-error">⚠ {errors.name}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Offer Type</label>
          <select name="type" className="form-control" value={form.type} onChange={handleChange}>
            {OFFER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select name="status" className="form-control" value={form.status} onChange={handleChange}>
            {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="Describe this promotional offer..."
        />
      </div>

      <div className="form-row">
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
        <div className="form-group">
          <label className="form-label">End Date *</label>
          <input
            name="endDate"
            type="date"
            className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
            value={form.endDate}
            onChange={handleChange}
          />
          {errors.endDate && <p className="form-error">⚠ {errors.endDate}</p>}
        </div>
      </div>

      {/* Linked Coupons */}
      <div className="form-group">
        <label className="form-label">Linked Coupons (select from active)</label>
        <div className="linked-coupons-grid">
          {activeCoupons.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No active coupons available.</p>
          ) : (
            activeCoupons.map(c => (
              <label key={c.id} className={`linked-coupon-opt ${form.linkedCoupons.includes(c.id) ? 'linked-coupon-opt--checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={form.linkedCoupons.includes(c.id)}
                  onChange={() => toggleLinkedCoupon(c.id)}
                />
                <span className="font-mono">{c.code}</span>
                <span className="link-type">{c.type}</span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Banner Color */}
      <div className="form-group">
        <label className="form-label">Banner Color</label>
        <div className="color-picker-wrap">
          <input
            type="color"
            name="bannerColor"
            className="color-picker"
            value={form.bannerColor}
            onChange={handleChange}
          />
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{form.bannerColor}</span>
          <div className="color-presets">
            {['#059669', '#ef4444', '#6366f1', '#f59e0b', '#3b82f6', '#8b5cf6'].map(c => (
              <button
                key={c}
                type="button"
                className={`color-preset ${form.bannerColor === c ? 'color-preset--active' : ''}`}
                style={{ background: c }}
                onClick={() => setForm(f => ({ ...f, bannerColor: c }))}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Offers() {
  const { offers, coupons, addOffer, updateOffer, deleteOffer } = useCoupon();

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'card'
  const [modalMode, setModalMode] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const activeCoupons = useMemo(() => coupons.filter(c => c.status === 'Active'), [coupons]);

  const openAdd = () => { setForm(EMPTY_FORM); setErrors({}); setModalMode('add'); };

  const openEdit = (offer) => {
    setForm({
      name: offer.name, type: offer.type, description: offer.description || '',
      startDate: offer.startDate, endDate: offer.endDate,
      linkedCoupons: offer.linkedCoupons || [],
      bannerColor: offer.bannerColor || '#059669',
      status: offer.status,
    });
    setErrors({});
    setSelectedOffer(offer);
    setModalMode('edit');
  };

  const openDelete = (offer) => { setSelectedOffer(offer); setModalMode('delete'); };
  const closeModal = () => { setModalMode(null); setSelectedOffer(null); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Offer name is required.';
    if (!form.endDate) e.endDate = 'End date is required.';
    if (form.startDate && form.endDate && form.startDate > form.endDate)
      e.startDate = 'Start date must be before end date.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (modalMode === 'add') addOffer(form);
    else updateOffer({ ...selectedOffer, ...form });
    closeModal();
  };

  const handleDelete = () => { deleteOffer(selectedOffer.id); closeModal(); };

  const columns = useMemo(() => [
    { key: 'name', label: 'Offer Name' },
    {
      key: 'type',
      label: 'Type',
      render: v => <Badge label={v} variant="info" />,
    },
    {
      key: 'startDate',
      label: 'Validity',
      render: (v, row) =>
        `${new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} — ${new Date(row.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
    },
    {
      key: 'linkedCoupons',
      label: 'Linked Coupons',
      render: (v) => v?.length ?? 0,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      render: v => <Badge label={v} variant={getOfferStatusVariant(v)} />,
    },
    {
      key: '_actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="action-btns">
          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(row)}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => openDelete(row)}>Delete</button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="offers-page animate-fadeIn">
      <div className="section-header">
        <div>
          <h2 className="section-title">Promotional Offers</h2>
          <p className="page-sub">Create and manage campaign bundles and special promotions</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'table' ? 'toggle-btn--active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              ☰ Table
            </button>
            <button
              className={`toggle-btn ${viewMode === 'card' ? 'toggle-btn--active' : ''}`}
              onClick={() => setViewMode('card')}
              title="Card View"
            >
              ⊞ Cards
            </button>
          </div>
          <button id="add-offer-btn" className="btn btn-primary" onClick={openAdd}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
            </svg>
            Add Offer
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="card">
          <DataTable
            columns={columns}
            data={offers}
            searchable
            sortable
            pageSize={10}
            emptyMessage="No offers yet. Click 'Add Offer' to create one."
          />
        </div>
      ) : (
        <div className="offers-card-grid">
          {offers.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/>
              </svg>
              <h4>No Offers</h4>
              <p>Create your first promotional offer to get started.</p>
            </div>
          ) : (
            offers.map(offer => (
              <OfferCardView
                key={offer.id}
                offer={offer}
                coupons={coupons}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ))
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <Modal
          title={modalMode === 'add' ? '🎁 Create New Offer' : `✏️ Edit — ${selectedOffer?.name}`}
          onClose={closeModal}
          footer={
            <>
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {modalMode === 'add' ? 'Create Offer' : 'Save Changes'}
              </button>
            </>
          }
        >
          <OfferForm form={form} setForm={setForm} errors={errors} activeCoupons={activeCoupons} />
        </Modal>
      )}

      {/* Delete Confirm */}
      {modalMode === 'delete' && (
        <Modal
          title="🗑️ Delete Offer"
          onClose={closeModal}
          footer={
            <>
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
            </>
          }
        >
          <div className="delete-confirm">
            <p>Are you sure you want to delete the offer</p>
            <span className="delete-code" style={{ fontFamily: 'inherit', fontSize: 16, padding: '8px 20px' }}>
              "{selectedOffer?.name}"
            </span>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8 }}>
              This action cannot be undone.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
