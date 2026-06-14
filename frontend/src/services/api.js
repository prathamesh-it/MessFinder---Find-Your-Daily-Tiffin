const BASE_URL = "http://localhost:8080/api/v1";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(url, options = {}) {
  const res = await fetch(BASE_URL + url, {
    headers: authHeaders(),
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data.data;
}

// ─── Auth ───────────────────────────────────────────────────
export const authApi = {
  signup: (body) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
};

// ─── Public ─────────────────────────────────────────────────
export const publicApi = {
  getAllMesses: () => request("/public/messes"),
  searchMesses: (query) => request(`/public/messes/search?query=${encodeURIComponent(query)}`),
  getFeatured: () => request("/public/messes/featured"),
  getMessById: (id) => request(`/public/messes/${id}`),
  filterByType: (isVeg) => request(`/public/messes/filter?isVeg=${isVeg}`),
  getReviews: (messId) => request(`/public/messes/${messId}/reviews`),
};

// ─── Owner ───────────────────────────────────────────────────
export const ownerApi = {
  createMess: (body) =>
    request("/owner/mess", { method: "POST", body: JSON.stringify(body) }),
  updateMess: (body) =>
    request("/owner/mess", { method: "PUT", body: JSON.stringify(body) }),
  getMyMess: () => request("/owner/mess"),
  uploadImage: (formData) => {
    const token = getToken();
    return fetch(BASE_URL + "/owner/mess/images", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
      .then((r) => r.json())
      .then((d) => d.data);
  },
  deleteImage: (imageId) =>
    request(`/owner/mess/images/${imageId}`, { method: "DELETE" }),
};

// ─── Reviews ─────────────────────────────────────────────────
export const reviewApi = {
  addReview: (messId, body) =>
    request(`/reviews/${messId}`, { method: "POST", body: JSON.stringify(body) }),
};

// ─── Admin ───────────────────────────────────────────────────
export const adminApi = {
  getStats: () => request("/admin/stats"),
  getAllMesses: () => request("/admin/messes"),
  getAllUsers: () => request("/admin/users"),
  getAllOwners: () => request("/admin/owners"),
  toggleActive: (id) => request(`/admin/messes/${id}/toggle-active`, { method: "PATCH" }),
  toggleFeatured: (id) => request(`/admin/messes/${id}/toggle-featured`, { method: "PATCH" }),
  deleteMess: (id) => request(`/admin/messes/${id}`, { method: "DELETE" }),
};

// ─── AI ──────────────────────────────────────────────────────
export const aiApi = {
  summarize: (messId) => request(`/ai/summarize/${messId}`),
};
