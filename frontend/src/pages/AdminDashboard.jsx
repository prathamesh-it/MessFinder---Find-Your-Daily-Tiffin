import { useState, useEffect } from "react";
import {
  TiffinLogo, IconLayoutDashboard, IconStore, IconUserCheck,
  IconBell, IconHome, IconLogOut, IconMenu, IconSearch,
} from "../components/Shared";
import { adminApi } from "../services/api";
import MessDetailPanel from "../components/MessDetailPanel";

const OWNER_COLORS = ["#F97316", "#F59E0B", "#F87171", "#FB7185", "#FB923C", "#FBBF24"];

export default function AdminDashboard({ onNavigate }) {
  const [section, setSection]         = useState("overview");
  const [selectedMessId, setSelectedMessId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch]           = useState("");
  const [stats, setStats]             = useState(null);
  const [messes, setMesses]           = useState([]);
  const [owners, setOwners]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      adminApi.getStats(),
      adminApi.getAllMesses(),
      adminApi.getAllOwners(),
    ])
      .then(([s, m, o]) => {
        setStats(s);
        setMesses(m || []);
        setOwners(o || []);
      })
      .catch((err) => {
        setError("Failed to load dashboard data. Is the backend running?");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Actions ──────────────────────────────────────────────
  const handleToggleActive = async (id) => {
    try {
      await adminApi.toggleActive(id);
      setMesses(prev =>
        prev.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m)
      );
    } catch (e) {
      alert(e.message || "Failed to update status");
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await adminApi.toggleFeatured(id);
      setMesses(prev =>
        prev.map(m => m.id === id ? { ...m, isFeatured: !m.isFeatured } : m)
      );
    } catch (e) {
      alert(e.message || "Failed to update featured");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this mess permanently?")) return;
    try {
      await adminApi.deleteMess(id);
      setMesses(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  };

  // ── Helpers ──────────────────────────────────────────────
  const selectedMess    = messes.find(m => m.id === selectedMessId);
  const filteredMesses  = messes.filter(m =>
    !search || m.name?.toLowerCase().includes(search.toLowerCase())
  );
  const getImg = (m) =>
    m.imageUrls?.[0] ||
    "https://images.unsplash.com/photo-1589778655375-3e622a9fc91c?w=400&h=260&fit=crop";
  const initials = (name) =>
    (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  // ── Stat Cards ───────────────────────────────────────────
  const statCards = [
    {
      label: "Total Mess",
      value: stats?.totalMesses ?? messes.length,
      sub: `${messes.filter(m => m.isActive).length} active`,
      iconColor: "var(--orange-500)",
      bg: "var(--orange-50)",
      border: "var(--orange-200)"
    },
    {
      label: "Total Owners",
      value: stats?.totalOwners ?? owners.length,
      sub: "Mess owners registered",
      iconColor: "var(--amber-500)",
      bg: "var(--amber-50)",
      border: "var(--amber-200)"
    },
    {
      label: "Total Users",
      value: stats?.totalUsers ?? "—",
      sub: "Registered students",
      iconColor: "#F87171",
      bg: "#FFF1F2",
      border: "#FECDD3"
    },
    {
      label: "Avg Rating",
      value: stats?.avgRating ? `${stats.avgRating}★` : "—",
      sub: "Across all mess",
      iconColor: "#EAB308",
      bg: "#FEFCE8",
      border: "#FEF08A"
    },
  ];

  // ── Nav Items (removed Users) ─────────────────────────────
  const navItems = [
    { id: "overview", icon: <IconLayoutDashboard size={17} />, label: "Overview" },
    { id: "mess",     icon: <IconStore size={17} />,           label: "Mess Listings" },
    { id: "owners",   icon: <IconUserCheck size={17} />,       label: "Mess Owners" },
  ];

  const sectionTitle = {
    overview: "Dashboard Overview",
    mess:     "Mess Listings",
    owners:   "Mess Owners",
  }[section];

  return (
    <div className="admin-layout">
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="admin-logo-area">
          <TiffinLogo size={32} />
          <div className="admin-logo-txt">
            <span className="orange">Mess</span>
            <span className="amber">Finder</span>
            <div className="sub">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`admin-nav-btn${section === item.id ? " active" : ""}`}
              onClick={() => { setSection(item.id); setSidebarOpen(false); }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="admin-sidebar-footer-btn"
            onClick={() => onNavigate("home")}
          >
            <IconHome size={17} /> Back to Site
          </button>
          <button
            className="admin-sidebar-footer-btn danger"
            onClick={() => { localStorage.clear(); onNavigate("login"); }}
          >
            <IconLogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              style={{ background: "none", border: "none", cursor: "pointer" }}
              className="hamburger-admin"
              onClick={() => setSidebarOpen(true)}
            >
              <IconMenu size={20} />
            </button>
            <h1 className="admin-topbar-title jakarta">{sectionTitle}</h1>
          </div>
          <div className="admin-topbar-right">
            <button className="notif-btn">
              <IconBell size={16} color="var(--orange-500)" />
            </button>
            <div className="admin-avatar-area">
              <div className="admin-avatar jakarta">AD</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "var(--stone-700)" }}>
                  {localStorage.getItem("name") || "Admin"}
                </span>
                <span style={{ fontSize: 11, color: "var(--stone-400)" }}>Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          {/* Error */}
          {error && (
            <div style={{ padding: "12px 16px", background: "#FEF2F2", color: "#DC2626", borderRadius: 12, marginBottom: 20, fontSize: 14, fontWeight: 600, border: "1px solid #FECACA" }}>
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="loading-center">
              <div className="spinner" />
              <p>Loading dashboard…</p>
            </div>
          ) : (
            <>
              {/* ── OVERVIEW ── */}
              {section === "overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                  {/* Stats */}
                  <div className="stats-grid">
                    {statCards.map(s => (
                      <div key={s.label} className="stat-card" style={{ borderColor: s.border }}>
                        <div className="stat-icon-wrap" style={{ background: s.bg }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke={s.iconColor} strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        </div>
                        <div className="stat-value jakarta">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-sub">{s.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Mess + Recent Owners */}
                  <div className="overview-grid">

                    {/* Recent Mess — from DB */}
                    <div className="admin-card">
                      <div className="admin-card-header">
                        <h3 className="jakarta">Recent Mess</h3>
                        <button onClick={() => setSection("mess")}>View all →</button>
                      </div>
                      <div className="admin-card-list">
                        {messes.length === 0 ? (
                          <div style={{ padding: "24px", textAlign: "center", color: "var(--stone-400)", fontSize: 14 }}>
                            No messes added yet
                          </div>
                        ) : messes.slice(0, 4).map(m => (
                          <div
                            key={m.id}
                            className="admin-card-row"
                            onClick={() => setSelectedMessId(m.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <img src={getImg(m)} alt={m.name} />
                            <div className="admin-card-row-info">
                              <div className="name">{m.name}</div>
                              <div className="sub">
                                {m.area || "Amravati"} · ₹{m.pricePerMonth}/month
                              </div>
                            </div>
                            <span className={`status-badge ${m.isActive ? "status-active" : "status-pending"}`}>
                              {m.isActive ? "active" : "inactive"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Owners — from DB */}
                    <div className="admin-card">
                      <div className="admin-card-header">
                        <h3 className="jakarta">Recent Owners</h3>
                        <button onClick={() => setSection("owners")}>View all →</button>
                      </div>
                      <div className="admin-card-list">
                        {owners.length === 0 ? (
                          <div style={{ padding: "24px", textAlign: "center", color: "var(--stone-400)", fontSize: 14 }}>
                            No owners registered yet
                          </div>
                        ) : owners.slice(0, 4).map((o, idx) => (
                          <div key={o.id} className="admin-card-row" style={{ cursor: "default" }}>
                            <div
                              className="user-initials-sm"
                              style={{ background: OWNER_COLORS[idx % OWNER_COLORS.length], color: "white", fontWeight: 700 }}
                            >
                              {initials(o.name)}
                            </div>
                            <div className="admin-card-row-info">
                              <div className="name">{o.name}</div>
                              <div className="sub">{o.email}</div>
                            </div>
                            {/* Green dot = has a mess */}
                            <span
                              className="user-dot-sm"
                              style={{ background: o.messName ? "var(--green-400)" : "var(--stone-300)" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ── MESS LISTINGS ── */}
              {section === "mess" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="mess-toolbar">
                    <div className="admin-search">
                      <IconSearch size={14} color="var(--orange-400)" />
                      <input
                        placeholder="Search mess..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  {filteredMesses.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px", color: "var(--stone-400)" }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>🍱</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--stone-600)" }}>
                        No messes found
                      </div>
                      <div style={{ fontSize: 14, marginTop: 6 }}>
                        Mess owners need to add their mess after signup
                      </div>
                    </div>
                  ) : (
                    <div className="admin-table-wrap">
                      <div style={{ overflowX: "auto" }}>
                        <table>
                          <thead>
                            <tr>
                              {["Mess", "Owner", "Monthly Price", "Rating", "Featured", "Status", "Actions"].map(h => (
                                <th key={h}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredMesses.map(m => (
                              <tr key={m.id}>
                                {/* Mess Info */}
                                <td>
                                  <div className="td-mess">
                                    <img src={getImg(m)} alt={m.name} />
                                    <div>
                                      <div className="td-mess-name">{m.name}</div>
                                      <div className="td-mess-cuisine">
                                        {m.area || "Amravati"} · {m.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Owner */}
                                <td>
                                  <div className="td-owner">
                                    <div
                                      className="owner-avatar"
                                      style={{ background: OWNER_COLORS[m.id % OWNER_COLORS.length] }}
                                    >
                                      {initials(m.ownerName || "O")}
                                    </div>
                                    <span style={{ fontSize: 14, color: "var(--stone-700)", fontWeight: 600 }}>
                                      {m.ownerName || "—"}
                                    </span>
                                  </div>
                                </td>

                                {/* Monthly Price */}
                                <td>
                                  <span className="td-price">₹{m.pricePerMonth}/mo</span>
                                </td>

                                {/* Rating */}
                                <td>
                                  <span className="td-rating">
                                    <svg width="12" height="12" viewBox="0 0 24 24">
                                      <polygon
                                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                                        fill="#FBBF24"
                                      />
                                    </svg>
                                    {m.avgRating || "0.0"}
                                    <span style={{ fontSize: 11, color: "var(--stone-400)", fontWeight: 400 }}>
                                      ({m.totalReviews || 0})
                                    </span>
                                  </span>
                                </td>

                                {/* Featured Toggle */}
                                <td>
                                  <button
                                    onClick={() => handleToggleFeatured(m.id)}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      fontSize: 18
                                    }}
                                    title="Toggle featured"
                                  >
                                    {m.isFeatured ? "⭐" : "☆"}
                                  </button>
                                </td>

                                {/* Status */}
                                <td>
                                  <span className={`status-badge ${m.isActive ? "status-active" : "status-pending"}`}>
                                    {m.isActive ? "✓ Active" : "⏳ Inactive"}
                                  </span>
                                </td>

                                {/* Actions */}
                                <td>
                                  <div style={{ display: "flex", gap: 4 }}>
                                    <button
                                      className="btn-view"
                                      onClick={() => setSelectedMessId(m.id)}
                                    >
                                      View
                                    </button>
                                    <button
                                      className={`btn-toggle ${m.isActive ? "btn-toggle-active" : "btn-toggle-inactive"}`}
                                      onClick={() => handleToggleActive(m.id)}
                                    >
                                      {m.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                    <button
                                      className="btn-delete"
                                      onClick={() => handleDelete(m.id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── OWNERS ── */}
              {section === "owners" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <p style={{ fontSize: 14, color: "var(--stone-500)" }}>
                    {owners.length} mess owners registered
                  </p>

                  {owners.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px", color: "var(--stone-400)" }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--stone-600)" }}>
                        No owners registered yet
                      </div>
                      <div style={{ fontSize: 14, marginTop: 6 }}>
                        Owners will appear here after they signup as Mess Owner
                      </div>
                    </div>
                  ) : (
                    <div className="owners-grid">
                      {owners.map((owner, idx) => {
                        // Find this owner's mess
                        const ownerMess = messes.find(m =>
                          m.ownerName === owner.name ||
                          owner.messName === m.name
                        );
                        return (
                          <div key={owner.id} className="owner-card">
                            <div className="owner-card-head">
                              <div
                                className="owner-initials"
                                style={{ background: OWNER_COLORS[idx % OWNER_COLORS.length] }}
                              >
                                {initials(owner.name)}
                              </div>
                              <div className="owner-card-info">
                                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                                  <div>
                                    <h3 className="jakarta">{owner.name}</h3>
                                    <p className="join">
                                      {owner.createdAt
                                        ? new Date(owner.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                                        : "—"
                                      }
                                    </p>
                                  </div>
                                  <span className={`status-badge ${owner.isActive ? "status-active" : "status-pending"}`}>
                                    {owner.isActive ? "✓ Active" : "⏳ Inactive"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="owner-contact">
                              <div className="owner-contact-row">
                                <div className="owner-contact-icon">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    stroke="var(--orange-400)" strokeWidth="2" strokeLinecap="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                  </svg>
                                </div>
                                {owner.email}
                              </div>
                            </div>

                            {/* Owner's mess */}
                            {(ownerMess || owner.messName) && (
                              <div className="owner-mess-row">
                                {ownerMess && (
                                  <img src={getImg(ownerMess)} alt={ownerMess.name} />
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div className="owner-mess-name jakarta">
                                    {ownerMess?.name || owner.messName}
                                  </div>
                                  <div className="owner-mess-price">
                                    ₹{ownerMess?.pricePerMonth || "—"}/month
                                    {ownerMess?.avgRating ? ` · ${ownerMess.avgRating}★` : ""}
                                  </div>
                                </div>
                                {ownerMess && (
                                  <button
                                    className="btn-view-sm"
                                    onClick={() => setSelectedMessId(ownerMess.id)}
                                  >
                                    View →
                                  </button>
                                )}
                              </div>
                            )}

                            {/* No mess yet */}
                            {!ownerMess && !owner.messName && (
                              <div style={{
                                padding: "10px 14px",
                                background: "var(--amber-50)",
                                borderRadius: 8,
                                fontSize: 13,
                                color: "var(--amber-700)",
                                marginTop: 8
                              }}>
                                ⚠️ No mess added yet
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mess Detail Slide Panel */}
      {selectedMess && (
        <MessDetailPanel
          mess={selectedMess}
          onClose={() => setSelectedMessId(null)}
        />
      )}
    </div>
  );
}