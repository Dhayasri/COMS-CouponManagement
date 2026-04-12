import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  coupons as initialCoupons,
  offers as initialOffers,
  categories as initialCategories,
  usageHistory as initialUsageHistory,
  defaultSettings,
} from '../data/mockData';

const CouponContext = createContext(null);

// ── Reducer ──────────────────────────────────────────────────────────────────
const initialState = {
  coupons: [], // Initially empty, load from API
  offers: [], // Initially empty, load from API
  categories: initialCategories,
  usageHistory: initialUsageHistory,
  settings: defaultSettings,
  toasts: [],
};

let toastId = 1;

function reducer(state, action) {
  switch (action.type) {

    /* ── COUPONS ── */
    case 'SET_COUPONS':
      return { ...state, coupons: action.payload };

    case 'ADD_COUPON':
      return { ...state, coupons: [action.payload, ...state.coupons] };

    case 'UPDATE_COUPON':
      return {
        ...state,
        coupons: state.coupons.map(c =>
          (c.id === action.payload.id || c._id === action.payload._id) ? { ...c, ...action.payload } : c
        ),
      };

    case 'DELETE_COUPON':
      return {
        ...state,
        coupons: state.coupons.filter(c => c.id !== action.payload && c._id !== action.payload),
      };

    case 'AUTO_EXPIRE_COUPONS': {
      const today = new Date().toISOString().split('T')[0];
      let expiredCount = 0;
      const coupons = state.coupons.map(c => {
        if (c.status !== 'Expired' && c.expiryDate < today) {
          expiredCount++;
          return { ...c, status: 'Expired' };
        }
        return c;
      });
      return { ...state, coupons, _autoExpiredCount: expiredCount };
    }

    /* ── OFFERS ── */
    case 'SET_OFFERS':
      return { ...state, offers: action.payload };

    case 'ADD_OFFER':
      return { ...state, offers: [action.payload, ...state.offers] };

    case 'UPDATE_OFFER':
      return {
        ...state,
        offers: state.offers.map(o =>
          (o.id === action.payload.id || o._id === action.payload._id) ? { ...o, ...action.payload } : o
        ),
      };

    case 'DELETE_OFFER':
      return {
        ...state,
        offers: state.offers.filter(o => o.id !== action.payload && o._id !== action.payload),
      };

    /* ── CATEGORIES ── */
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };

    /* ── REDEEM ── */
    case 'REDEEM_COUPON': {
      const { couponId, historyEntry } = action.payload;
      return {
        ...state,
        coupons: state.coupons.map(c =>
          c.id === couponId ? { ...c, usageCount: c.usageCount + 1 } : c
        ),
        usageHistory: [historyEntry, ...state.usageHistory],
      };
    }

    /* ── TOASTS ── */
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, { id: toastId++, ...action.payload }],
      };

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload),
      };

    /* ── SETTINGS ── */
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    default:
      return state;
  }
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function CouponProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch coupons from backend on mount
  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success) {
        dispatch({ type: 'SET_COUPONS', payload: data.data });
      } else {
        dispatch({ type: 'ADD_TOAST', payload: { message: 'Failed to fetch coupons', variant: 'error' } });
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
      dispatch({ type: 'ADD_TOAST', payload: { message: 'Network error fetching coupons', variant: 'error' } });
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // Fetch offers from backend on mount
  const fetchOffers = useCallback(async () => {
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      if (data.success) {
        dispatch({ type: 'SET_OFFERS', payload: data.data });
      } else {
        dispatch({ type: 'ADD_TOAST', payload: { message: 'Failed to fetch offers', variant: 'error' } });
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
      dispatch({ type: 'ADD_TOAST', payload: { message: 'Network error fetching offers', variant: 'error' } });
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // ── CRUD helpers ────────────────────────────────────────────────────────────
  const addCoupon = useCallback(async (coupon) => {
    try {
      const res = await fetch('/api/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon),
      });
      const data = await res.json();
      
      if (data.success) {
        dispatch({ type: 'ADD_COUPON', payload: data.data });
        dispatch({ type: 'ADD_TOAST', payload: { message: `Coupon "${data.data.code}" created!`, variant: 'success' } });
      } else {
        dispatch({ type: 'ADD_TOAST', payload: { message: data.error || 'Failed to create coupon', variant: 'error' } });
      }
    } catch (err) {
      dispatch({ type: 'ADD_TOAST', payload: { message: 'Network error', variant: 'error' } });
    }
  }, []);

  const updateCoupon = useCallback(async (coupon) => {
    try {
      // Use the correct id for the update URL; fallback to _id if needed
      const couponId = coupon.id || coupon._id;
      const res = await fetch(`/api/coupons/${couponId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon),
      });
      const data = await res.json();
      
      if (data.success) {
        dispatch({ type: 'UPDATE_COUPON', payload: data.data });
        dispatch({ type: 'ADD_TOAST', payload: { message: `Coupon "${data.data.code}" updated.`, variant: 'success' } });
      } else {
        dispatch({ type: 'ADD_TOAST', payload: { message: data.error || 'Failed to update coupon', variant: 'error' } });
      }
    } catch (err) {
      dispatch({ type: 'ADD_TOAST', payload: { message: 'Network error', variant: 'error' } });
    }
  }, []);

  const deleteCoupon = useCallback(async (id) => {
    const cpn = state.coupons.find(c => c.id === id || c._id === id);
    try {
      const res = await fetch(`/api/coupon/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        dispatch({ type: 'DELETE_COUPON', payload: id });
        dispatch({ type: 'ADD_TOAST', payload: { message: `Coupon "${cpn?.code || 'deleted'}" deleted.`, variant: 'error' } });
      } else {
        dispatch({ type: 'ADD_TOAST', payload: { message: data.error || 'Failed to delete coupon', variant: 'error' } });
      }
    } catch (err) {
      dispatch({ type: 'ADD_TOAST', payload: { message: 'Network error', variant: 'error' } });
    }
  }, [state.coupons]);

  const addOffer = useCallback(async (offer) => {
    try {
      const res = await fetch('/api/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offer),
      });
      const data = await res.json();
      
      if (data.success) {
        dispatch({ type: 'ADD_OFFER', payload: data.data });
        dispatch({ type: 'ADD_TOAST', payload: { message: `Offer "${data.data.name}" created!`, variant: 'success' } });
      } else {
        dispatch({ type: 'ADD_TOAST', payload: { message: data.error || 'Failed to create offer', variant: 'error' } });
      }
    } catch (err) {
      dispatch({ type: 'ADD_TOAST', payload: { message: 'Network error', variant: 'error' } });
    }
  }, []);

  const updateOffer = useCallback(async (offer) => {
    try {
      const offerId = offer.id || offer._id;
      const res = await fetch(`/api/offers/${offerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offer),
      });
      const data = await res.json();
      
      if (data.success) {
        dispatch({ type: 'UPDATE_OFFER', payload: data.data });
        dispatch({ type: 'ADD_TOAST', payload: { message: `Offer "${data.data.name}" updated.`, variant: 'success' } });
      } else {
        dispatch({ type: 'ADD_TOAST', payload: { message: data.error || 'Failed to update offer', variant: 'error' } });
      }
    } catch (err) {
      dispatch({ type: 'ADD_TOAST', payload: { message: 'Network error', variant: 'error' } });
    }
  }, []);

  const deleteOffer = useCallback(async (id) => {
    const off = state.offers.find(o => o.id === id || o._id === id);
    try {
      const res = await fetch(`/api/offer/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        dispatch({ type: 'DELETE_OFFER', payload: id });
        dispatch({ type: 'ADD_TOAST', payload: { message: `Offer "${off?.name || 'deleted'}" deleted.`, variant: 'error' } });
      } else {
        dispatch({ type: 'ADD_TOAST', payload: { message: data.error || 'Failed to delete offer', variant: 'error' } });
      }
    } catch (err) {
      dispatch({ type: 'ADD_TOAST', payload: { message: 'Network error', variant: 'error' } });
    }
  }, [state.offers]);

  const addCategory = useCallback((cat) => {
    const newCat = { ...cat, id: `cat-${Date.now()}` };
    dispatch({ type: 'ADD_CATEGORY', payload: newCat });
  }, []);

  const redeemCoupon = useCallback((couponId, historyEntry) => {
    dispatch({ type: 'REDEEM_COUPON', payload: { couponId, historyEntry } });
    dispatch({ type: 'ADD_TOAST', payload: { message: `Coupon redeemed successfully!`, variant: 'success' } });
  }, []);

  const addToast = useCallback((message, variant = 'info') => {
    dispatch({ type: 'ADD_TOAST', payload: { message, variant } });
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const updateSettings = useCallback((settings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    dispatch({ type: 'ADD_TOAST', payload: { message: 'Settings saved successfully.', variant: 'success' } });
  }, []);

  const value = {
    coupons: state.coupons,
    offers: state.offers,
    categories: state.categories,
    usageHistory: state.usageHistory,
    settings: state.settings,
    toasts: state.toasts,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    addOffer,
    updateOffer,
    deleteOffer,
    addCategory,
    redeemCoupon,
    addToast,
    removeToast,
    updateSettings,
  };

  return (
    <CouponContext.Provider value={value}>
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupon() {
  const ctx = useContext(CouponContext);
  if (!ctx) throw new Error('useCoupon must be used within CouponProvider');
  return ctx;
}
