import { useState, useEffect } from "react";
import {
  IconX, IconUserCheck, IconPhone, IconMail, IconTruck,
  IconSparkles, IconMessageSquare, IconStar,
} from "../components/Shared";
import { publicApi } from "../services/api";

function generateAISummary(reviews) {
  if (!reviews || reviews.length === 0) return { insights: [], summary: "No reviews yet.", avgRating: 0 };
  const avgRating = Math.round((reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length) * 10) / 10;
  const good = reviews.filter(r => /good|great|excellent|best|love|tasty|delicious|amazing|fresh|recommended|hygienic/i.test(r.comment || r.text || "")).length;
  const expensive = reviews.filter(r => /expensive|costly|price|pricey|overpriced/i.test(r.comment || r.text || "")).length;
  const quality = reviews.filter(r => /quality|hygienic|clean|fresh|homemade|home/i.test(r.comment || r.text || "")).length;
  const delivery = reviews.filter(r => /delivery|late|delay/i.test(r.comment || r.text || "")).length;
  const insights = [];
  if (good > 0) insights.push(`${good} ${good === 1 ? "person" : "people"} say the food tastes great`);
  if (expensive > 0) insights.push(`${expensive} ${expensive === 1 ? "person" : "people"} find it expensive`);
  if (quality > 0) insights.push(`${quality} ${quality === 1 ? "person" : "people"} praise food quality`);
  if (delivery > 0) insights.push(`${delivery} ${delivery === 1 ? "person" : "people"} mention delivery concerns`);
  let summary = "";
  if (good > 0 && expensive > 0) summary = "Food is slightly pricey but customers consistently praise the taste and hygiene.";
  else if (good > reviews.length / 2) summary = "Overwhelmingly positive reviews — food is consistently rated as tasty and satisfying.";
  else summary = "Mixed opinions — most enjoy the food but some concerns around consistency and pricing.";
  return { insights, summary, avgRating };
}

const OWNER_COLORS = ["#F97316", "#F59E0B", "#F87171", "#FB7185"];

export default function MessDetailPanel({ mess, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [delivery, setDelivery] = useState({ option: "twice" });

  useEffect(() => {
    if (mess?.id) {
      publicApi.getReviews(mess.id)
        .then(setReviews)
        .catch(() => setReviews([]));
    }
  }, [mess?.id]);

  if (!mess) return null;
  const { insights, summary, avgRating } = generateAISummary(reviews);
  const owner = mess.owner || mess.ownerInfo || {};
  const ownerInitials = (owner.name || "O").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const ownerColor = OWNER_COLORS[mess.id % OWNER_COLORS.length];
  const statusActive = mess.active !== false && mess.status !== "pending";
  const img = mess.imageUrls?.[0] || mess.img || "https://images.unsplash.com/photo-1589778655375-3e622a9fc91c?w=400&h=260&fit=crop";

  return (
    <div className="detail-panel-overlay">
      <div className="detail-panel-backdrop" onClick={onClose} />
      <div className="detail-panel">
        {/* Header */}
        <div className="detail-panel-header">
          <h2 className="jakarta">{mess.name}</h2>
          <button className="close-btn" onClick={onClose}>
            <IconX size={16} />
          </button>
        </div>

        <div className="detail-body">
          {/* Image + stats */}
          <div>
            <div className="detail-img-wrap">
              <img src={img} alt={mess.name} />
              <div className="detail-img-overlay" />
              <span className="detail-status-badge" style={{
                background: statusActive ? "#22C55E" : "#F59E0B", color: "white"
              }}>
                {statusActive ? "✓ Active" : "⏳ Pending"}
              </span>
            </div>
            <div className="detail-stats-grid">
              {[
                { label: "Daily Price", value: `₹${mess.dailyPrice || mess.pricePerDay || "—"}` },
                { label: "Monthly", value: `₹${mess.monthlyPrice || mess.pricePerMonth || "—"}` },
                { label: "Rating", value: `${mess.rating || avgRating || "—"} ★` },
              ].map(({ label, value }) => (
                <div key={label} className="detail-stat">
                  <div className="val jakarta">{value}</div>
                  <div className="lbl">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Owner info */}
          {owner.name && (
            <div className="detail-section">
              <div className="detail-section-title">
                <IconUserCheck size={14} color="var(--orange-500)" /> Mess Owner
              </div>
              <div className="owner-info-row">
                <div className="owner-avatar-lg" style={{ background: ownerColor }}>{ownerInitials}</div>
                <div>
                  <div className="owner-name jakarta">{owner.name}</div>
                  <div className="owner-since">Owner since {owner.joinDate || "2024"}</div>
                  <span className="status-badge" style={{ marginTop: 4, display: "inline-block", background: "#DCFCE7", color: "#15803D" }}>✓ Verified</span>
                </div>
              </div>
              <div className="owner-links">
                {owner.phone && (
                  <a href={`tel:${owner.phone}`} className="owner-link">
                    <div className="owner-link-icon"><IconPhone size={12} color="var(--orange-500)" /></div>
                    {owner.phone}
                  </a>
                )}
                {owner.email && (
                  <a href={`mailto:${owner.email}`} className="owner-link">
                    <div className="owner-link-icon"><IconMail size={12} color="var(--orange-500)" /></div>
                    {owner.email}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Delivery */}
          <div className="delivery-section">
            <div className="detail-section-title">
              <IconTruck size={14} color="var(--orange-500)" /> Home Delivery Option
            </div>
            <div className="delivery-opts">
              {[
                { key: "none", label: "🚫 No Delivery" },
                { key: "once", label: "1× Daily" },
                { key: "twice", label: "2× Daily" },
              ].map(opt => (
                <button
                  key={opt.key}
                  className={`delivery-opt${delivery.option === opt.key ? " active" : ""}`}
                  onClick={() => setDelivery({ option: opt.key, slot: opt.key === "once" ? "lunch" : undefined })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {delivery.option === "once" && (
              <div>
                <p style={{ fontSize: 12, color: "var(--stone-500)", marginBottom: 8, fontWeight: 600 }}>Select delivery slot:</p>
                <div className="slot-row">
                  {[{ key: "lunch", label: "🌤 Lunch (12–2pm)" }, { key: "dinner", label: "🌙 Dinner (7–9pm)" }].map(s => (
                    <button
                      key={s.key}
                      className={`slot-btn${delivery.slot === s.key ? " active" : ""}`}
                      onClick={() => setDelivery({ ...delivery, slot: s.key })}
                    >{s.label}</button>
                  ))}
                </div>
              </div>
            )}
            {delivery.option === "twice" && (
              <div className="both-slots">
                <div className="both-slot">🌤 Lunch (12–2pm)</div>
                <div className="both-slot">🌙 Dinner (7–9pm)</div>
              </div>
            )}
            {delivery.option === "none" && (
              <div className="no-delivery-msg">This mess does not offer home delivery</div>
            )}
          </div>

          {/* AI Summary */}
          <div className="ai-section">
            <div className="ai-header">
              <div className="ai-icon"><IconSparkles size={13} /></div>
              <span className="ai-label">AI Review Insight</span>
              <span className="ai-count">{reviews.length} reviews · {avgRating}★</span>
            </div>
            <div className="ai-insights">
              {insights.map((ins, i) => (
                <div key={i} className="ai-insight-row">
                  <div className="ai-dot" /> {ins}
                </div>
              ))}
              {insights.length === 0 && <p style={{ fontSize: 12, color: "var(--stone-400)" }}>No review data yet.</p>}
            </div>
            <div className="ai-summary-card">
              <p>"{summary}"</p>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div className="detail-section-title">
              <IconMessageSquare size={14} color="var(--orange-500)" /> Customer Reviews
            </div>
            {reviews.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--stone-400)", textAlign: "center", padding: "24px 0" }}>No reviews yet for this mess.</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((r, idx) => (
                  <div key={r.id || idx} className="review-card">
                    <div className="review-header">
                      <div className="review-user">
                        <div className="review-avatar">{(r.userName || r.user || "U")[0].toUpperCase()}</div>
                        <span className="review-name">{r.userName || r.user}</span>
                      </div>
                      <div className="review-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <IconStar key={i} size={10} filled={i < (r.rating || 0)} />
                        ))}
                      </div>
                    </div>
                    <p className="review-text">{r.comment || r.text}</p>
                    <p className="review-date">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : r.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
