// import { useState, useEffect } from "react";
// import { SiteHeader, IconSearch, IconStar, IconNavigation } from "../components/Shared";
// import { publicApi } from "../services/api";

// const FALLBACK = [
//   { id: 1, name: "Shree Annapurna Mess", rating: 4.8, cuisine: "Gujarati · Rajasthani", dailyPrice: 80, imageUrls: ["https://images.unsplash.com/photo-1589778655375-3e622a9fc91c?w=400&h=260&fit=crop"] },
//   { id: 2, name: "Maa ka Tiffin Centre", rating: 4.6, cuisine: "North Indian · Punjabi", dailyPrice: 70, imageUrls: ["https://images.unsplash.com/photo-1542367592-8849eb950fd8?w=400&h=260&fit=crop"] },
//   { id: 3, name: "Sudama Bhojanalaym", rating: 4.5, cuisine: "South Indian · Thali", dailyPrice: 65, imageUrls: ["https://images.unsplash.com/photo-1559561724-732dbca7be1e?w=400&h=260&fit=crop"] },
//   { id: 4, name: "Satkar Dining Hall", rating: 4.7, cuisine: "Mixed · Veg Only", dailyPrice: 90, imageUrls: ["https://images.unsplash.com/photo-1742281257687-092746ad6021?w=400&h=260&fit=crop"] },
// ];

// const PINS = [
//   { top: "38%", left: "45%" },
//   { top: "25%", left: "62%" },
//   { top: "58%", left: "35%" },
//   { top: "42%", left: "70%" },
// ];

// export default function MapPage({ onNavigate }) {
//   const [selected, setSelected] = useState(null);
//   const [messes, setMesses] = useState([]);
//   const [mapSearch, setMapSearch] = useState("");

//   useEffect(() => {
//     publicApi.getAllMesses().then(setMesses).catch(() => setMesses(FALLBACK));
//   }, []);

//   const displayed = messes.filter(m =>
//     !mapSearch || m.name?.toLowerCase().includes(mapSearch.toLowerCase())
//   );

//   const selectedMess = messes.find(m => m.id === selected);
//   const getImg = (m) => m.imageUrls?.[0] || m.img || "https://images.unsplash.com/photo-1589778655375-3e622a9fc91c?w=400&h=260&fit=crop";

//   return (
//     <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
//       <SiteHeader onNavigate={onNavigate} page="map" />
//       <div className="map-layout">
//         {/* Sidebar */}
//         <div className="map-sidebar">
//           <div className="map-search-area">
//             <div className="map-search-inner">
//               <IconSearch size={14} color="#FB923C" />
//               <input
//                 placeholder="Search on map..."
//                 value={mapSearch}
//                 onChange={e => setMapSearch(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="map-cards">
//             {displayed.map(mess => (
//               <button
//                 key={mess.id}
//                 className={`map-card${selected === mess.id ? " active" : ""}`}
//                 onClick={() => setSelected(selected === mess.id ? null : mess.id)}
//               >
//                 <div className="map-card-inner">
//                   <img className="map-card-thumb" src={getImg(mess)} alt={mess.name} />
//                   <div className="map-card-info">
//                     <h4 className="jakarta">{mess.name}</h4>
//                     <p>{mess.cuisine}</p>
//                     <div className="map-card-chips">
//                       <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, fontWeight: 800, color: "#D97706" }}>
//                         <IconStar size={10} filled={true} />{mess.rating}
//                       </span>
//                       <span style={{ fontSize: 12, fontWeight: 700, color: "var(--orange-500)" }}>₹{mess.dailyPrice}</span>
//                     </div>
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Map area */}
//         <div className="map-area">
//           <div className="map-grid-bg" />
//           <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 800 600" preserveAspectRatio="none">
//             <path d="M0 300 Q200 280 400 300 Q600 320 800 300" stroke="#FED7AA" strokeWidth="12" fill="none" />
//             <path d="M400 0 Q390 150 400 300 Q410 450 400 600" stroke="#FED7AA" strokeWidth="10" fill="none" />
//             <path d="M200 0 L180 600" stroke="#FEF3C7" strokeWidth="6" fill="none" />
//             <path d="M600 0 L620 600" stroke="#FEF3C7" strokeWidth="6" fill="none" />
//             <rect x="50" y="50" width="120" height="80" rx="8" fill="#FEF9EE" stroke="#FDDBA3" strokeWidth="1" />
//             <rect x="220" y="30" width="140" height="90" rx="8" fill="#FEF9EE" stroke="#FDDBA3" strokeWidth="1" />
//             <rect x="450" y="40" width="100" height="70" rx="8" fill="#FEF9EE" stroke="#FDDBA3" strokeWidth="1" />
//             <rect x="620" y="60" width="130" height="85" rx="8" fill="#FEF9EE" stroke="#FDDBA3" strokeWidth="1" />
//             <ellipse cx="300" cy="480" rx="70" ry="50" fill="#D1FAE5" stroke="#6EE7B7" strokeWidth="1" />
//           </svg>

//           {messes.map((mess, i) => (
//             <button
//               key={mess.id}
//               className="map-pin-btn"
//               style={{ top: PINS[i % PINS.length]?.top, left: PINS[i % PINS.length]?.left }}
//               onClick={() => setSelected(selected === mess.id ? null : mess.id)}
//             >
//               <div className={`map-pin-label${selected === mess.id ? " active" : ""}`}>₹{mess.dailyPrice}</div>
//               <div className={`map-pin-arrow${selected === mess.id ? " active" : ""}`} />
//             </button>
//           ))}

//           {/* User location dot */}
//           <div style={{ position: "absolute", top: "50%", left: "50%" }}>
//             <div className="user-dot" />
//             <div className="user-ping" />
//           </div>

//           {/* Selected detail card */}
//           {selectedMess && (
//             <div className="map-detail-card">
//               <img src={getImg(selectedMess)} alt={selectedMess.name} />
//               <h4 className="jakarta">{selectedMess.name}</h4>
//               <p>{selectedMess.cuisine}</p>
//               <div className="map-detail-chips">
//                 <span style={{ fontSize: 12, fontWeight: 800, color: "var(--orange-500)" }}>₹{selectedMess.dailyPrice}/meal</span>
//                 <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, fontWeight: 800, color: "#D97706" }}>
//                   <IconStar size={10} filled={true} />{selectedMess.rating}
//                 </span>
//               </div>
//               <button className="btn-directions">
//                 <IconNavigation size={12} /> Get Directions
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
