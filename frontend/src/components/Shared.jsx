import { useState } from "react";

// ── SVG Tiffin Logo
export function TiffinLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect x="6" y="24" width="24" height="6" rx="3" fill="#F97316" />
      <rect x="8" y="16" width="20" height="8" rx="2" fill="#FB923C" />
      <rect x="10" y="9" width="16" height="7" rx="2" fill="#FBBF24" />
      <rect x="14" y="6" width="8" height="4" rx="2" fill="#F97316" />
      <rect x="7" y="23" width="22" height="2" rx="1" fill="#EA580C" />
      <rect x="9" y="15" width="18" height="2" rx="1" fill="#EA580C" />
      <rect x="11" y="8" width="14" height="2" rx="1" fill="#D97706" />
    </svg>
  );
}

// ── Animated gradient background wrapper
export function AnimatedBackground({ children }) {
  return <div className="animated-bg">{children}</div>;
}

// ── Site Header (auth-aware)
export function SiteHeader({ onNavigate, page, user, onLogout }) {
  const [open, setOpen] = useState(false);
  const token = user?.token || localStorage.getItem("token");
  const role  = (user?.role  || localStorage.getItem("role") || "").toUpperCase();
  const isLoggedIn = !!token;

  const doLogout = () => {
    localStorage.clear();
    if (onLogout) onLogout();
    onNavigate("landing");
    setOpen(false);
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button className="logo-btn" onClick={() => onNavigate("home")}>
          <TiffinLogo size={38} />
          <span className="logo-text jakarta">
            <span className="orange">Mess</span><span className="amber">Finder</span>
          </span>
        </button>

        <nav className="header-nav">
          <button className={page === "home"  ? "active" : ""} onClick={() => onNavigate("home")}>Browse Mess</button>
          {role === "OWNER" && <button className={page === "owner" ? "active" : ""} onClick={() => onNavigate("owner")}>My Mess</button>}
          {role === "ADMIN" && <button className={page === "admin" ? "active" : ""} onClick={() => onNavigate("admin")}>Admin</button>}
        </nav>

        <div className="header-actions">
          {isLoggedIn ? (
            <>
              <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,var(--orange-500),var(--amber-400))", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:800, fontSize:12 }}>{role[0]||"U"}</div>
              <button className="btn-outline-sm" onClick={doLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn-outline-sm" onClick={() => onNavigate("login")}>Login</button>
              <button className="btn-solid-sm"   onClick={() => onNavigate("signup")}>Sign Up</button>
              <button className="btn-admin-sm"   onClick={() => onNavigate("admin")}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Admin
              </button>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setOpen(!open)}>
          {open
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </div>

      <div className={`mobile-menu${open ? " open" : ""}`}>
        <button onClick={() => { onNavigate("home"); setOpen(false); }}>Browse Mess</button>
        <button onClick={() => { onNavigate("map");  setOpen(false); }}>Map View</button>
        {role === "OWNER" && <button className="orange" onClick={() => { onNavigate("owner"); setOpen(false); }}>My Mess</button>}
        {role === "ADMIN" && <button className="orange" onClick={() => { onNavigate("admin"); setOpen(false); }}>Admin Dashboard</button>}
        {!isLoggedIn && <>
          <button className="orange" onClick={() => { onNavigate("admin");  setOpen(false); }}>Admin Demo</button>
          <button className="orange" onClick={() => { onNavigate("login");  setOpen(false); }}>Login</button>
          <button className="signup-mobile" onClick={() => { onNavigate("signup"); setOpen(false); }}>Sign Up</button>
        </>}
        {isLoggedIn && <button className="orange" onClick={doLogout}>Logout</button>}
      </div>
    </header>
  );
}

// ── Stars
export function Stars({ rating, size = 10 }) {
  return (
    <span style={{ display:"flex", alignItems:"center", gap:2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            fill={i < Math.round(rating) ? "#FBBF24" : "#E7E5E4"}
            stroke={i < Math.round(rating) ? "#FBBF24" : "#E7E5E4"} strokeWidth="1" />
        </svg>
      ))}
    </span>
  );
}

// ── Icons (all SVG, no external deps)
export const IconSearch        = ({ size=18, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
export const IconMapPin        = ({ size=16, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
export const IconClock         = ({ size=11, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
export const IconPhone         = ({ size=12, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>;
export const IconMail          = ({ size=12, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
export const IconX             = ({ size=16, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
export const IconStar          = ({ size=12, filled=false })         => <svg width={size} height={size} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={filled?"#FBBF24":"#E7E5E4"} stroke={filled?"#FBBF24":"#E7E5E4"} strokeWidth="1"/></svg>;
export const IconNavigation    = ({ size=12 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>;
export const IconSparkles      = ({ size=13 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15z"/><path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75L5 3z"/></svg>;
export const IconTruck         = ({ size=14 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
export const IconMessageSquare = ({ size=14 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
export const IconUserCheck     = ({ size=14 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>;
export const IconLayoutDashboard = ({ size=17 })                     => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
export const IconStore         = ({ size=17 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
export const IconUsers         = ({ size=17 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
export const IconBell          = ({ size=16 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
export const IconHome          = ({ size=17 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
export const IconLogOut        = ({ size=17 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
export const IconMenu          = ({ size=20 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
export const IconEye           = ({ size=16 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
export const IconEyeOff        = ({ size=16 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
export const IconFilter        = ({ size=14 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
export const IconArrowLeft     = ({ size=14 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
export const IconShield        = ({ size=12 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
export const IconChevronRight  = ({ size=12 })                       => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
