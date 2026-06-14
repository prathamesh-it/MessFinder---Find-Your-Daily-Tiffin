import { useState, useEffect } from "react";
import {
  SiteHeader,
  IconSearch,
  IconMapPin,
  IconFilter,
  IconStar,
  IconChevronRight,
} from "../components/Shared";
import { publicApi } from "../services/api";

const FALLBACK = [
  { id: 1, name: "Shree Annapurna Mess", avgRating: 4.8, area: "Rajapeth", pricePerMonth: 2500, isVeg: true, isFeatured: true, imageUrls: ["https://images.unsplash.com/photo-1589778655375-3e622a9fc91c?w=400&h=260&fit=crop"] },
  { id: 2, name: "Maa ka Tiffin Centre", avgRating: 4.6, area: "Camp", pricePerMonth: 2200, isVeg: false, isFeatured: false, imageUrls: ["https://images.unsplash.com/photo-1542367592-8849eb950fd8?w=400&h=260&fit=crop"] },
  { id: 3, name: "Sudama Bhojanalaym",   avgRating: 4.5, area: "Jaistambh", pricePerMonth: 1800, isVeg: true, isFeatured: false, imageUrls: ["https://images.unsplash.com/photo-1559561724-732dbca7be1e?w=400&h=260&fit=crop"] },
  { id: 4, name: "Satkar Dining Hall",   avgRating: 4.7, area: "Tapadia", pricePerMonth: 3000, isVeg: true, isFeatured: true, imageUrls: ["https://images.unsplash.com/photo-1742281257687-092746ad6021?w=400&h=260&fit=crop"] },
];

const FILTERS = ["All", "Veg Only", "Non-Veg"];

const SORT_OPTIONS = [
  { label: "Default",           value: "default" },
  { label: "Rating High → Low", value: "rating_desc" },
  { label: "Rating Low → High", value: "rating_asc" },
  { label: "Price Low → High",  value: "price_asc" },
  { label: "Price High → Low",  value: "price_desc" },
];

const PRICE_RANGES = [
  { label: "All Budgets", min: 0,    max: Infinity },
  { label: "Under ₹2000", min: 0,    max: 2000 },
  { label: "₹2000–₹3000", min: 2000, max: 3000 },
  { label: "₹3000–₹4000", min: 3000, max: 4000 },
  { label: "Above ₹4000", min: 4000, max: Infinity },
];

export default function HomePage({ onNavigate }) {
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("All");
  const [sortBy, setSortBy]         = useState("default");
  const [priceRange, setPriceRange] = useState(0); // index of PRICE_RANGES
  const [messes, setMesses]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    publicApi.getAllMesses()
      .then(data => setMesses(data?.length ? data : FALLBACK))
      .catch(() => setMesses(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (!search.trim()) {
      setLoading(true);
      publicApi.getAllMesses()
        .then(data => setMesses(data?.length ? data : FALLBACK))
        .catch(() => setMesses(FALLBACK))
        .finally(() => setLoading(false));
      return;
    }
    setLoading(true);
    publicApi.searchMesses(search)
      .then(data => setMesses(data?.length ? data : FALLBACK.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
      )))
      .catch(() => setMesses(FALLBACK))
      .finally(() => setLoading(false));
  };

  const handleFilter = (f) => {
    setFilter(f);
    setLoading(true);
    if (f === "Veg Only") {
      publicApi.filterByType(true)
        .then(data => setMesses(data?.length ? data : FALLBACK.filter(m => m.isVeg)))
        .catch(() => setMesses(FALLBACK.filter(m => m.isVeg)))
        .finally(() => setLoading(false));
    } else if (f === "Non-Veg") {
      publicApi.filterByType(false)
        .then(data => setMesses(data?.length ? data : FALLBACK.filter(m => !m.isVeg)))
        .catch(() => setMesses(FALLBACK.filter(m => !m.isVeg)))
        .finally(() => setLoading(false));
    } else {
      publicApi.getAllMesses()
        .then(data => setMesses(data?.length ? data : FALLBACK))
        .catch(() => setMesses(FALLBACK))
        .finally(() => setLoading(false));
    }
  };

  // Apply price filter + sort on frontend
  const getDisplayMesses = () => {
    let result = [...messes];

    // Price filter
    const range = PRICE_RANGES[priceRange];
    result = result.filter(m =>
      m.pricePerMonth >= range.min && m.pricePerMonth <= range.max
    );

    // Sort
    if (sortBy === "rating_desc") result.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    if (sortBy === "rating_asc")  result.sort((a, b) => (a.avgRating || 0) - (b.avgRating || 0));
    if (sortBy === "price_asc")   result.sort((a, b) => (a.pricePerMonth || 0) - (b.pricePerMonth || 0));
    if (sortBy === "price_desc")  result.sort((a, b) => (b.pricePerMonth || 0) - (a.pricePerMonth || 0));

    return result;
  };

  const displayMesses = getDisplayMesses();
  const getImg = (m) => m.imageUrls?.[0] || "https://images.unsplash.com/photo-1589778655375-3e622a9fc91c?w=400&h=260&fit=crop";

  const hasActiveFilters = priceRange !== 0 || sortBy !== "default" || filter !== "All";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <SiteHeader onNavigate={onNavigate} page="home" />

      {/* Hero search */}
      <div className="home-hero-bg">
        <div className="home-hero-inner">
          <h2 className="home-hero-h2 jakarta">Find a Mess Near You</h2>
          <p className="home-hero-p">
            Search from verified tiffin &amp; mess services in Amravati
          </p>
          <div className="search-bar">
            <IconSearch size={18} color="#FB923C" />
            <input
              type="text"
              placeholder="Search mess name, area..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button className="search-bar-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="home-content">

        {/* ── Filter Row ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>

          {/* Veg filter pills */}
          <div className="filter-row" style={{ margin: 0 }}>
            <IconFilter size={14} color="var(--stone-500)" />
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-chip${filter === f ? " active" : ""}`}
                onClick={() => handleFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Advanced filter toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              background: hasActiveFilters ? "var(--orange-500)" : "white",
              color: hasActiveFilters ? "white" : "var(--stone-600)",
              border: `1.5px solid ${hasActiveFilters ? "var(--orange-500)" : "var(--orange-200)"}`,
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            <IconFilter size={13} color={hasActiveFilters ? "white" : "var(--stone-500)"} />
            {hasActiveFilters ? "Filters Active" : "Sort & Filter"}
            {hasActiveFilters && (
              <span style={{
                background: "white",
                color: "var(--orange-500)",
                borderRadius: "50%",
                width: 18,
                height: 18,
                fontSize: 11,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {(priceRange !== 0 ? 1 : 0) + (sortBy !== "default" ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* ── Advanced Filter Panel ── */}
        {showFilters && (
          <div style={{
            background: "white",
            border: "1.5px solid var(--orange-200)",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 20,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            boxShadow: "0 4px 20px rgba(249,115,22,0.08)"
          }}>

            {/* Price Filter */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--stone-600)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Price Range
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PRICE_RANGES.map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPriceRange(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      background: priceRange === idx ? "var(--orange-50)" : "var(--stone-50)",
                      border: `1.5px solid ${priceRange === idx ? "var(--orange-400)" : "var(--stone-200)"}`,
                      borderRadius: 10,
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                      transition: "all 0.15s"
                    }}
                  >
                    {/* Radio circle */}
                    <div style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: `2px solid ${priceRange === idx ? "var(--orange-500)" : "var(--stone-300)"}`,
                      background: priceRange === idx ? "var(--orange-500)" : "white",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {priceRange === idx && (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />
                      )}
                    </div>
                    <span style={{
                      fontSize: 14,
                      fontWeight: priceRange === idx ? 700 : 500,
                      color: priceRange === idx ? "var(--orange-600)" : "var(--stone-600)"
                    }}>
                      {range.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--stone-600)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Sort By
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      background: sortBy === opt.value ? "var(--orange-50)" : "var(--stone-50)",
                      border: `1.5px solid ${sortBy === opt.value ? "var(--orange-400)" : "var(--stone-200)"}`,
                      borderRadius: 10,
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                      transition: "all 0.15s"
                    }}
                  >
                    <div style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: `2px solid ${sortBy === opt.value ? "var(--orange-500)" : "var(--stone-300)"}`,
                      background: sortBy === opt.value ? "var(--orange-500)" : "white",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {sortBy === opt.value && (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />
                      )}
                    </div>
                    <span style={{
                      fontSize: 14,
                      fontWeight: sortBy === opt.value ? 700 : 500,
                      color: sortBy === opt.value ? "var(--orange-600)" : "var(--stone-600)"
                    }}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setPriceRange(0);
                    setSortBy("default");
                    setFilter("All");
                    handleFilter("All");
                  }}
                  style={{
                    marginTop: 16,
                    width: "100%",
                    padding: "10px",
                    background: "none",
                    border: "1.5px dashed var(--stone-300)",
                    borderRadius: 10,
                    color: "var(--stone-500)",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit"
                  }}
                >
                  ✕ Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="results-row">
          <h3 className="jakarta">
            {loading ? "Loading..." : `${displayMesses.length} Mess Found`}
            {priceRange !== 0 && (
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--orange-500)", marginLeft: 8 }}>
                · {PRICE_RANGES[priceRange].label}
              </span>
            )}
            {sortBy !== "default" && (
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--orange-500)", marginLeft: 8 }}>
                · {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
              </span>
            )}
          </h3>
          <span style={{ fontSize: 13, color: "var(--stone-400)" }}>Amravati</span>
        </div>

        {/* Mess Grid */}
        {loading ? (
          <div className="loading-center">
            <div className="spinner" />
            <p>Finding mess near you…</p>
          </div>
        ) : displayMesses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--stone-400)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--stone-600)", marginBottom: 6 }}>
              No messes found
            </div>
            <div style={{ fontSize: 14 }}>Try adjusting your filters</div>
            <button
              onClick={() => { setPriceRange(0); setSortBy("default"); setFilter("All"); }}
              style={{ marginTop: 16, padding: "10px 24px", background: "var(--orange-500)", color: "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="mess-grid">
            {displayMesses.map(mess => (
              <div
                key={mess.id}
                className="mess-card"
                onClick={() => onNavigate(`mess-${mess.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="mess-card-img">
                  <img src={getImg(mess)} alt={mess.name} />
                  {mess.isFeatured && (
                    <span className="mess-tag">⭐ Featured</span>
                  )}
                  <span
                    className="mess-tag"
                    style={{
                      top: mess.isFeatured ? 36 : 10,
                      background: mess.isVeg ? "#16a34a" : "#dc2626"
                    }}
                  >
                    {mess.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
                  </span>
                </div>
                <div className="mess-card-body">
                  <div className="mess-card-name jakarta">{mess.name}</div>

                  {/* Location */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                    <IconMapPin size={12} color="#FB923C" />
                    <span style={{ fontSize: 13, color: "var(--stone-500)" }}>
                      {mess.area || "Amravati"}, Amravati
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="mess-card-meta" style={{ marginTop: 8 }}>
                    <span className="meta-chip bold">
                      <IconStar size={12} filled={true} />
                      {mess.avgRating || "0.0"}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--stone-400)" }}>
                      ({mess.totalReviews || 0} reviews)
                    </span>
                  </div>

                  {/* Price + CTA */}
                  <div className="mess-card-footer">
                    <span className="mess-price">₹{mess.pricePerMonth}/month</span>
                    <button style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--orange-500)",
                      background: "none",
                      border: "none",
                      cursor: "pointer"
                    }}>
                      View Details <IconChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}