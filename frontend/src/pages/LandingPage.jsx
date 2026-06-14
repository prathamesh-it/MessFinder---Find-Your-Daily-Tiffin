import { useState, useEffect } from "react";
import { TiffinLogo, AnimatedBackground, IconSearch, IconMapPin, IconShield } from "../components/Shared";

const FOOD_IMAGES = [
  { url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=400&fit=crop&auto=format", alt: "Steel tiffin", label: "Fresh Daily Tiffin" },
  { url: "https://images.unsplash.com/photo-1589778655375-3e622a9fc91c?w=500&h=400&fit=crop&auto=format", alt: "Indian thali", label: "Full Thali Meals" },
  { url: "https://images.unsplash.com/photo-1742281257687-092746ad6021?w=500&h=400&fit=crop&auto=format", alt: "Thali with sides", label: "Home-style Cooking" },
  { url: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=400&fit=crop&auto=format", alt: "Rotis", label: "Fresh Rotis Daily" },
];

export default function LandingPage({ onNavigate }) {
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveImg(i => (i + 1) % FOOD_IMAGES.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimatedBackground>
      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <TiffinLogo size={40} />
          <span className="landing-logo-text jakarta">Mess<span className="amber">Finder</span></span>
        </div>
        <div className="landing-nav-actions">
          <button className="btn-ghost-white" onClick={() => onNavigate("login")}>Login</button>
          <button className="btn-white-orange" onClick={() => onNavigate("signup")}>Sign Up Free</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div>
          <div className="hero-badge">
            <IconMapPin size={12} color="white" />
            10+ Mess &amp; Tiffin near you
          </div>
          <h1 className="hero-h1 jakarta">
            Find Your<br />
            <span className="amber">Daily Tiffin</span><br />
            in Minutes
          </h1>
          <p className="hero-p">
            Discover trusted mess halls, tiffin centres, and home kitchens in Amravati.
            Fresh, affordable, home-style food every day.
          </p>
          <div className="hero-btns">
            <button className="btn-white-hero" onClick={() => onNavigate("home")}>
              <IconSearch size={18} color="#F97316" />
              Find Mess Near Me
            </button>
            {/* <button className="btn-glass-hero" onClick={() => onNavigate("map")}>
              <IconMapPin size={18} color="white" />
              View on Map
            </button> */}
          </div>
          <div className="hero-stats">
            {[["10+", "Mess Listed"], ["4.8★", "Avg Rating"], ["100+", "Happy Users"]].map(([n, l]) => (
              <div key={l}>
                <div className="hero-stat-num jakarta">{n}</div>
                <div className="hero-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Slideshow */}
        <div className="hero-img-wrap">
          <div className="hero-slideshow">
            {FOOD_IMAGES.map((img, i) => (
              <div key={i} className="hero-slide" style={{ opacity: i === activeImg ? 1 : 0 }}>
                <img src={img.url} alt={img.alt} />
                <div className="hero-slide-overlay" />
                <div className="hero-slide-label jakarta">{img.label}</div>
              </div>
            ))}
          </div>
          <div className="hero-dots">
            {FOOD_IMAGES.map((_, i) => (
              <button
                key={i}
                className={`hero-dot${i === activeImg ? " active" : ""}`}
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>
          <div className="hero-special-card">
            <div className="title">Today's Special</div>
            <div className="subtitle">Dal Tadka + 3 Roti</div>
            <div className="price">₹70 only</div>
          </div>
        </div>
      </section>

      {/* Admin float
      <button className="admin-float-btn" onClick={() => onNavigate("admin")}>
        <IconShield size={12} /> Admin Panel
      </button> */}
    </AnimatedBackground>
  );
}
