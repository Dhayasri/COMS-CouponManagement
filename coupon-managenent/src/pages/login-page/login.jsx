import { useState } from "react";

const styles = {
  page: {
    width:"100vw",
    height: "100vh",
    background: "#eef0f4",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "40px 36px 32px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1a1d23",
    margin: "0 0 6px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 28px",
  },
  fieldGroup: {
    marginBottom: "18px",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  },
  label: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#6b7280",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  forgotLink: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#2563eb",
    textDecoration: "none",
    cursor: "pointer",
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    fontSize: "14px",
    color: "#374151",
    background: "#f3f4f6",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
    color: "#9ca3af",
    display: "flex",
    alignItems: "center",
  },
  rememberRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "20px 0 24px",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    accentColor: "#2563eb",
    cursor: "pointer",
    borderRadius: "3px",
  },
  rememberLabel: {
    fontSize: "14px",
    color: "#374151",
    cursor: "pointer",
  },
  signInBtn: {
    width: "100%",
    padding: "13px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#ffffff",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background 0.2s",
    letterSpacing: "0.01em",
  },
  bottomText: {
    textAlign: "center",
    marginTop: "22px",
    fontSize: "14px",
    color: "#6b7280",
  },
  requestLink: {
    color: "#2563eb",
    fontWeight: "600",
    textDecoration: "none",
    cursor: "pointer",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginTop: "28px",
    justifyContent: "center",
  },
  footerItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#9ca3af",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  dot: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "#9ca3af",
  },
};

function EyeIcon({ show }) {
  return show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Coupon Management</h1>
        <p style={styles.subtitle}>Welcome back. Please enter your details.</p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={styles.fieldGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label} htmlFor="email">Email Address</label>
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@offerpro.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              style={{
                ...styles.input,
                borderColor: emailFocus ? "#2563eb" : "#e5e7eb",
              }}
              required
            />
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label} htmlFor="password">Password</label>
              <a style={styles.forgotLink} href="#">Forgot Password?</a>
            </div>
            <div style={styles.inputWrapper}>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                style={{
                  ...styles.input,
                  borderColor: passwordFocus ? "#2563eb" : "#e5e7eb",
                }}
                required
              />
            </div>
          </div>

          {/* Remember me */}
          <div style={styles.rememberRow}>
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={styles.checkbox}
            />
            <label htmlFor="remember" style={styles.rememberLabel}>
              Remember me for 30 days
            </label>
          </div>

          {/* Sign In button */}
          <button
            type="submit"
            style={styles.signInBtn}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
          >
            Sign In
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </form>

        <p style={styles.bottomText}>
          Don't have an account?{" "}
          <a href="#" style={styles.requestLink}>Request Access</a>
        </p>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerItem}>
          <ShieldIcon />
          Secure Auth
        </div>
        <div style={styles.dot} />
        <div style={styles.footerItem}>
          <ShieldIcon />
          SSL Certified
        </div>
      </div>
    </div>
  );
}