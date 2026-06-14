import { useState, useEffect } from "react";
import LandingPage     from "./src/pages/LandingPage";
import AuthPage        from "./src/pages/AuthPage";
import HomePage        from "./src/pages/HomePage";
// import MapPage         from "./src/pages/MapPage";
import OwnerDashboard  from "./src/pages/OwnerDashboard";
import AdminDashboard  from "./src/pages/AdminDashboard";

export default function App() {
  const [page, setPage] = useState("landing");

  // On app load — check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role  = localStorage.getItem("role");
    if (token && role === "SUPER_ADMIN") setPage("admin");
    else if (token && role === "MESS_OWNER") setPage("owner");
  }, []);

  const onNavigate = (p) => {
    // If trying to access protected pages without login
    if (p === "owner" && !localStorage.getItem("token")) {
      setPage("login"); return;
    }
    if (p === "admin" && localStorage.getItem("role") !== "SUPER_ADMIN") {
      setPage("login"); return;
    }
    setPage(p);
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      {page === "landing" && <LandingPage   onNavigate={onNavigate} />}
      {page === "login"   && <AuthPage type="login"  onNavigate={onNavigate} />}
      {page === "signup"  && <AuthPage type="signup" onNavigate={onNavigate} />}
      {page === "home"    && <HomePage      onNavigate={onNavigate} />}
      {/* {page === "map"     && <MapPage       onNavigate={onNavigate} />} */}
      {page === "owner"   && <OwnerDashboard onNavigate={onNavigate} />}
      {page === "admin"   && <AdminDashboard onNavigate={onNavigate} />}

      {/* Mess detail page — handle mess-{id} navigation */}
      {page.startsWith("mess-") && (
        <MessDetailPage
          messId={parseInt(page.split("-")[1])}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

// Simple Mess Detail Page
function MessDetailPage({ messId, onNavigate }) {
  const [mess, setMess]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [reviews, setReviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
    const [aiSummary, setAiSummary]     = useState("");
  const [aiLoading, setAiLoading]     = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  const handleAiSummary = async () => {
  setAiLoading(true);
  try {
    const { aiApi } = await import("./src/services/api");
    const summary = await aiApi.summarize(messId);
    setAiSummary(summary);
    setAiGenerated(true);
  } catch (err) {
    setAiSummary("Could not generate summary. Please try again.");
    setAiGenerated(true);
  } finally {
    setAiLoading(false);
  }
};

  useEffect(() => {
    import("./src/services/api").then(({ publicApi }) => {
      Promise.all([
        publicApi.getMessById(messId),
        publicApi.getReviews(messId),
      ]).then(([m, r]) => {
        setMess(m);
        setReviews(r || []);
      }).catch(() => {}).finally(() => setLoading(false));
    });
  }, [messId]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) { onNavigate("login"); return; }
    setSubmitting(true);
    try {
      const { reviewApi } = await import("./src/services/api");
      const newReview = await reviewApi.addReview(messId, review);
      setReviews(prev => [newReview, ...prev]);
      setReview({ rating: 5, comment: "" });
      setSuccess("Review submitted!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      alert(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}><div className="spinner" /></div>;
  if (!mess)   return <div style={{ textAlign: "center", padding: 40 }}>Mess not found. <button onClick={() => onNavigate("home")} style={{ color: "var(--orange-500)", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Go back</button></div>;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Simple back header */}
      <header style={{ background: "white", borderBottom: "1px solid var(--orange-100)", padding: "12px 24px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 50 }}>
        <button onClick={() => onNavigate("home")} style={{ background: "none", border: "1px solid var(--orange-200)", borderRadius: 8, padding: "6px 14px", color: "var(--orange-500)", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          ← Back
        </button>
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 18, color: "var(--orange-500)" }}>Mess Details</span>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        {/* Images */}
        {mess.imageUrls?.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: mess.imageUrls.length > 1 ? "1fr 1fr" : "1fr", gap: 12, marginBottom: 24, borderRadius: 16, overflow: "hidden" }}>
            {mess.imageUrls.map((url, i) => (
              <img key={i} src={url} alt={mess.name} style={{ width: "100%", height: 240, objectFit: "cover" }} />
            ))}
          </div>
        )}

        {/* Main Info */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 16, border: "1px solid var(--orange-100)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 900, color: "var(--stone-800)", margin: "0 0 4px" }}>
                {mess.name}
              </h1>
              <p style={{ color: "var(--stone-500)", fontSize: 14 }}>
                📍 {mess.area}, Amravati
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--orange-500)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                ₹{mess.pricePerMonth}
              </div>
              <div style={{ fontSize: 13, color: "var(--stone-400)" }}>per month</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginTop: 20 }}>
            {[
              { icon: "📞", label: "Phone",     value: mess.phone },
              { icon: "📍", label: "Address",   value: mess.address },
              { icon: "🏠", label: "Landmark",  value: mess.nearbyLandmark || "—" },
              { icon: "🥗", label: "Food Type", value: mess.isVeg ? "🟢 Veg Only" : "🔴 Non-Veg" },
              { icon: "☀️", label: "Breakfast", value: mess.breakfast ? "Included" : "Not included" },
              { icon: "⭐", label: "Rating",    value: `${mess.avgRating || 0} (${mess.totalReviews || 0} reviews)` },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ background: "var(--orange-50)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--stone-400)", marginBottom: 4, textTransform: "uppercase" }}>{icon} {label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--stone-700)" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Meals */}
        {(mess.lunch || mess.dinner) && (
          <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 16, border: "1px solid var(--orange-100)" }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 800, color: "var(--stone-800)", marginBottom: 16 }}>🍽️ Meals Provided</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mess.breakfast && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--amber-50)", borderRadius: 10 }}>
                  <span style={{ fontSize: 22 }}>☀️</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--stone-400)", textTransform: "uppercase" }}>Breakfast</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--stone-700)" }}>Included</div>
                  </div>
                </div>
              )}
              {mess.lunch && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--orange-50)", borderRadius: 10 }}>
                  <span style={{ fontSize: 22 }}>🌞</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--stone-400)", textTransform: "uppercase" }}>Lunch</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--stone-700)" }}>{mess.lunch}</div>
                  </div>
                </div>
              )}
              {mess.dinner && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--orange-50)", borderRadius: 10 }}>
                  <span style={{ fontSize: 22 }}>🌙</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--stone-400)", textTransform: "uppercase" }}>Dinner</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--stone-700)" }}>{mess.dinner}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        

        {/* Reviews */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid var(--orange-100)" }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 800, color: "var(--stone-800)", marginBottom: 16 }}>💬 Reviews</h3>

          {/* AI Summary Box */}
          {reviews.length > 0 && (
            <div style={{
              background: "linear-gradient(135deg, #FFF7ED, #FEF3C7)",
              border: "1.5px solid var(--orange-300)",
              borderRadius: 14,
              padding: "16px 20px",
              marginBottom: 20
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: aiGenerated ? 12 : 0
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>🤖</span>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: 15,
                    color: "var(--orange-600)"
                  }}>
                    AI Review Summary
                  </span>
                </div>

                {!aiGenerated && (
                  <button
                    onClick={handleAiSummary}
                    disabled={aiLoading}
                    style={{
                      padding: "8px 18px",
                      background: aiLoading ? "var(--stone-300)" : "var(--orange-500)",
                      color: "white",
                      border: "none",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: aiLoading ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    {aiLoading ? (
                      <>
                        <div style={{
                          width: 14, height: 14,
                          border: "2px solid white",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite"
                        }} />
                        Generating...
                      </>
                    ) : (
                      "✨ Summarize Reviews"
                    )}
                  </button>
                )}
              </div>

              {/* Summary text */}
              {aiGenerated && (
                <p style={{
                  fontSize: 14,
                  color: "var(--stone-700)",
                  lineHeight: 1.7,
                  margin: 0,
                  fontStyle: "italic"
                }}>
                  "{aiSummary}"
                </p>
              )}

              {/* Not generated yet message */}
              {!aiGenerated && (
                <p style={{
                  fontSize: 13,
                  color: "var(--stone-400)",
                  margin: "8px 0 0",
                  fontStyle: "italic"
                }}>
                  Click the button to get an AI-powered summary of all {reviews.length} reviews
                </p>
              )}
            </div>
          )}

          {/* Add Review */}
          {success && <div style={{ padding: "10px 14px", background: "var(--green-100)", color: "var(--green-700)", borderRadius: 8, marginBottom: 12, fontWeight: 700, fontSize: 14 }}>✓ {success}</div>}
          <form onSubmit={handleReview} style={{ marginBottom: 24, padding: 16, background: "var(--orange-50)", borderRadius: 12 }}>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "var(--stone-600)", display: "block", marginBottom: 6 }}>Rating</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setReview(r => ({ ...r, rating: n }))}
                    style={{ fontSize: 22, background: "none", border: "none", cursor: "pointer", opacity: n <= review.rating ? 1 : 0.3 }}>
                    ⭐
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={review.comment}
              onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
              placeholder="Share your experience about this mess..."
              required
              rows={3}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--orange-200)", fontFamily: "inherit", fontSize: 14, resize: "vertical", outline: "none", boxSizing: "border-box" }}
            />
            <button type="submit" disabled={submitting} style={{ marginTop: 10, padding: "10px 24px", background: "var(--orange-500)", color: "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
            {!localStorage.getItem("token") && (
              <p style={{ fontSize: 13, color: "var(--stone-400)", marginTop: 8 }}>
                <button type="button" onClick={() => onNavigate("login")} style={{ color: "var(--orange-500)", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Login</button> to submit a review
              </p>
            )}
          </form>

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <p style={{ color: "var(--stone-400)", textAlign: "center", padding: "20px 0" }}>No reviews yet. Be the first to review!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {reviews.map((r, i) => (
                <div key={i} style={{ padding: "14px 16px", background: "var(--stone-50)", borderRadius: 12, border: "1px solid var(--stone-200)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: "var(--stone-800)" }}>{r.reviewerName}</span>
                    <span style={{ fontSize: 13 }}>{"⭐".repeat(r.rating)}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--stone-600)", margin: 0 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}