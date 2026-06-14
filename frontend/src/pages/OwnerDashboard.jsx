import { useState, useEffect, useRef } from "react";
import { SiteHeader, TiffinLogo, IconStore, IconHome, IconLogOut, IconMenu, IconBell, IconX } from "../components/Shared";
import { ownerApi } from "../services/api";

export default function OwnerDashboard({ onNavigate }) {
  const [mess, setMess]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [section, setSection]   = useState("view"); // view | edit | create
  const [form, setForm]         = useState({});
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    ownerApi.getMyMess()
      .then(data => { setMess(data); setForm(data); setSection("view"); })
      .catch(() => { setMess(null); setSection("create"); })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    try {
      const created = await ownerApi.createMess(form);
      setMess(created); setSection("view");
      setSuccess("Mess created successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to create mess");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    try {
      const updated = await ownerApi.updateMess(form);
      setMess(updated); setSection("view");
      setSuccess("Mess updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if ((mess?.imageUrls?.length || 0) >= 2) {
      setError("Maximum 2 photos allowed!"); return;
    }
    setUploading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const url = await ownerApi.uploadImage(fd);
      setMess(prev => ({ ...prev, imageUrls: [...(prev.imageUrls || []), url] }));
      setSuccess("Image uploaded!"); setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId, index) => {
    if (!window.confirm("Remove this image?")) return;
    try {
      await ownerApi.deleteImage(imageId);
    } catch {}
    setMess(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) }));
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  // Form fields for create/edit
  const formFields = [
    { key: "name",            label: "Mess Name *",        type: "text",   placeholder: "e.g. Shree Ram Tiffin Centre" },
    { key: "area",            label: "Area / Locality *",  type: "text",   placeholder: "e.g. Rajapeth, Camp, Jaistambh" },
    { key: "phone",           label: "Phone Number *",     type: "tel",    placeholder: "+91 98765 43210" },
    { key: "pricePerMonth",   label: "Monthly Price (₹) *",type: "number", placeholder: "e.g. 2500" },
    { key: "nearbyLandmark",  label: "Nearby Landmark",    type: "text",   placeholder: "e.g. Near SBI Bank" },
    { key: "lunch",           label: "Lunch Menu",         type: "text",   placeholder: "e.g. Dal, Rice, Roti, Sabzi" },
    { key: "dinner",          label: "Dinner Menu",        type: "text",   placeholder: "e.g. Roti, Sabzi, Dal Tadka" },
  ];

  return (
    <div className="admin-layout">
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="admin-logo-area">
          <TiffinLogo size={32} />
          <div className="admin-logo-txt">
            <span className="orange">Mess</span><span className="amber">Finder</span>
            <div className="sub">Owner Panel</div>
          </div>
        </div>
        <nav className="admin-nav">
          <button
            className={`admin-nav-btn${section === "view" || section === "edit" ? " active" : ""}`}
            onClick={() => { setSection(mess ? "view" : "create"); setSidebarOpen(false); }}
          >
            <IconStore size={17} /> My Mess
          </button>
          {mess && (
            <button
              className={`admin-nav-btn${section === "edit" ? " active" : ""}`}
              onClick={() => { setSection("edit"); setForm(mess); setSidebarOpen(false); }}
            >
              ✏️ Edit Details
            </button>
          )}
          {!mess && (
            <button
              className={`admin-nav-btn${section === "create" ? " active" : ""}`}
              onClick={() => { setSection("create"); setSidebarOpen(false); }}
            >
              ➕ Add My Mess
            </button>
          )}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-sidebar-footer-btn" onClick={() => onNavigate("home")}>
            <IconHome size={17} /> Browse Mess
          </button>
          <button className="admin-sidebar-footer-btn danger" onClick={() => { localStorage.clear(); onNavigate("login"); }}>
            <IconLogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => setSidebarOpen(true)} className="hamburger-admin">
              <IconMenu size={20} />
            </button>
            <h1 className="admin-topbar-title jakarta">
              {section === "create" ? "Add Your Mess" : section === "edit" ? "Edit Mess" : "My Mess"}
            </h1>
          </div>
          <div className="admin-topbar-right">
            <button className="notif-btn"><IconBell size={16} color="var(--orange-500)" /></button>
            <div className="admin-avatar-area">
              <div className="admin-avatar jakarta">OW</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "var(--stone-700)" }}>
                  {localStorage.getItem("name") || "Owner"}
                </span>
                <span style={{ fontSize: 11, color: "var(--stone-400)" }}>Mess Owner</span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          {loading ? (
            <div className="loading-center"><div className="spinner" /><p>Loading…</p></div>
          ) : (
            <div style={{ maxWidth: 760, display: "flex", flexDirection: "column", gap: 24 }}>

              {success && (
                <div style={{ padding: "12px 16px", background: "var(--green-100)", color: "var(--green-700)", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "1px solid var(--green-400)" }}>
                  ✓ {success}
                </div>
              )}
              {error && (
                <div style={{ padding: "12px 16px", background: "var(--red-50)", color: "var(--red-500)", borderRadius: 12, fontSize: 14, fontWeight: 700 }}>
                  ✗ {error}
                </div>
              )}

              {/* ── CREATE MESS ── */}
              {section === "create" && (
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3 className="jakarta">➕ Add Your Mess</h3>
                  </div>
                  <div style={{ padding: 20 }}>
                    <p style={{ fontSize: 14, color: "var(--stone-500)", marginBottom: 20 }}>
                      Fill in your mess details. Students in Amravati will discover your mess!
                    </p>
                    <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        {formFields.map(({ key, label, type, placeholder }) => (
                          <div key={key} className="form-group" style={{ gridColumn: key === "address" || key === "lunch" || key === "dinner" ? "1 / -1" : "auto" }}>
                            <label>{label}</label>
                            <input
                              className="form-input"
                              type={type}
                              placeholder={placeholder}
                              value={form[key] || ""}
                              onChange={set(key)}
                              required={label.includes("*")}
                            />
                          </div>
                        ))}

                        {/* Address full width */}
                        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                          <label>Full Address *</label>
                          <input
                            className="form-input"
                            type="text"
                            placeholder="Shop 5, Main Road, Rajapeth, Amravati"
                            value={form.address || ""}
                            onChange={set("address")}
                            required
                          />
                        </div>

                        {/* Veg toggle */}
                        <div className="form-group">
                          <label>Food Type *</label>
                          <select
                            className="form-input"
                            value={form.isVeg === false ? "false" : "true"}
                            onChange={e => setForm(f => ({ ...f, isVeg: e.target.value === "true" }))}
                          >
                            <option value="true">🟢 Veg Only</option>
                            <option value="false">🔴 Non-Veg Available</option>
                          </select>
                        </div>

                        {/* Breakfast checkbox */}
                        <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 24 }}>
                          <input
                            type="checkbox"
                            id="breakfast"
                            checked={!!form.breakfast}
                            onChange={e => setForm(f => ({ ...f, breakfast: e.target.checked }))}
                            style={{ width: 18, height: 18, accentColor: "var(--orange-500)" }}
                          />
                          <label htmlFor="breakfast" style={{ fontSize: 14, fontWeight: 700, color: "var(--stone-700)", cursor: "pointer" }}>
                            ☀️ Breakfast Included
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn-auth"
                        style={{ maxWidth: 220 }}
                        disabled={saving}
                      >
                        {saving ? "Creating…" : "🍱 Create Mess"}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* ── VIEW MESS ── */}
              {section === "view" && mess && (
                <>
                  {/* Images */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <h3 className="jakarta">Mess Photos</h3>
                      {(mess.imageUrls?.length || 0) < 2 && (
                        <button
                          onClick={() => fileRef.current?.click()}
                          style={{ padding: "6px 14px", background: "var(--orange-500)", color: "white", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}
                        >
                          {uploading ? "Uploading…" : "+ Add Photo"}
                        </button>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                    </div>
                    <div style={{ padding: 20 }}>
                      {mess.imageUrls?.length ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                          {mess.imageUrls.map((url, i) => (
                            <div key={i} style={{ position: "relative", borderRadius: 12, overflow: "hidden", height: 120 }}>
                              <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              <button
                                onClick={() => handleDeleteImage(i + 1, i)}
                                style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                              >
                                <IconX size={12} color="white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ padding: "32px 0", textAlign: "center", color: "var(--stone-400)", fontSize: 14 }}>
                          No photos yet. Upload up to 2 photos of your mess!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <h3 className="jakarta">Mess Details</h3>
                      <button
                        onClick={() => { setSection("edit"); setForm(mess); }}
                        style={{ padding: "6px 14px", background: "var(--orange-50)", color: "var(--orange-600)", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "1px solid var(--orange-200)", cursor: "pointer" }}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                    <div style={{ padding: 20 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        {[
                          { label: "Mess Name",      value: mess.name },
                          { label: "Area",           value: mess.area },
                          { label: "Monthly Price",  value: mess.pricePerMonth ? `₹${mess.pricePerMonth}/month` : "—" },
                          { label: "Phone",          value: mess.phone },
                          { label: "Nearby Landmark",value: mess.nearbyLandmark || "—" },
                          { label: "Food Type",      value: mess.isVeg ? "🟢 Veg Only" : "🔴 Non-Veg" },
                          { label: "Breakfast",      value: mess.breakfast ? "☀️ Included" : "❌ Not included" },
                          { label: "Rating",         value: mess.avgRating ? `${mess.avgRating} ⭐ (${mess.totalReviews} reviews)` : "No reviews yet" },
                        ].map(({ label, value }) => (
                          <div key={label} style={{ gridColumn: label === "Address" ? "1 / -1" : "auto" }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--stone-500)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--stone-800)" }}>{value || "—"}</div>
                          </div>
                        ))}
                        <div style={{ gridColumn: "1 / -1" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--stone-500)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Address</div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--stone-800)" }}>{mess.address || "—"}</div>
                        </div>
                        {mess.lunch && (
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--stone-500)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Lunch</div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--stone-800)" }}>{mess.lunch}</div>
                          </div>
                        )}
                        {mess.dinner && (
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--stone-500)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Dinner</div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--stone-800)" }}>{mess.dinner}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── EDIT MESS ── */}
              {section === "edit" && (
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3 className="jakarta">✏️ Edit Mess Details</h3>
                  </div>
                  <div style={{ padding: 20 }}>
                    <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        {formFields.map(({ key, label, type, placeholder }) => (
                          <div key={key} className="form-group" style={{ gridColumn: key === "lunch" || key === "dinner" ? "1 / -1" : "auto" }}>
                            <label>{label}</label>
                            <input
                              className="form-input"
                              type={type}
                              placeholder={placeholder}
                              value={form[key] || ""}
                              onChange={set(key)}
                            />
                          </div>
                        ))}
                        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                          <label>Full Address</label>
                          <input className="form-input" type="text" placeholder="Shop 5, Main Road, Amravati" value={form.address || ""} onChange={set("address")} />
                        </div>
                        <div className="form-group">
                          <label>Food Type</label>
                          <select className="form-input" value={form.isVeg === false ? "false" : "true"} onChange={e => setForm(f => ({ ...f, isVeg: e.target.value === "true" }))}>
                            <option value="true">🟢 Veg Only</option>
                            <option value="false">🔴 Non-Veg Available</option>
                          </select>
                        </div>
                        <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 24 }}>
                          <input type="checkbox" id="breakfast-edit" checked={!!form.breakfast} onChange={e => setForm(f => ({ ...f, breakfast: e.target.checked }))} style={{ width: 18, height: 18, accentColor: "var(--orange-500)" }} />
                          <label htmlFor="breakfast-edit" style={{ fontSize: 14, fontWeight: 700, color: "var(--stone-700)", cursor: "pointer" }}>☀️ Breakfast Included</label>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
                        <button type="submit" className="btn-auth" style={{ maxWidth: 200 }} disabled={saving}>
                          {saving ? "Saving…" : "Save Changes"}
                        </button>
                        <button type="button" onClick={() => setSection("view")} style={{ padding: "14px 24px", background: "var(--stone-100)", color: "var(--stone-600)", borderRadius: 12, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}