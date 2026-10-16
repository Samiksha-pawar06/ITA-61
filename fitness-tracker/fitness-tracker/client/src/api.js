// All calls to the backend live here. Vite proxies /api -> http://localhost:5000
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  // tracker
  getEntries: (date) => request(`/api/entries?date=${date}`),
  addEntry: (entry) => request("/api/entries", { method: "POST", body: JSON.stringify(entry) }),
  deleteEntry: (id) => request(`/api/entries/${id}`, { method: "DELETE" }),
  getSummary: (end, days = 7) => request(`/api/summary?end=${end}&days=${days}`),
  getGoals: () => request("/api/goals"),
  saveGoals: (goals) => request("/api/goals", { method: "PUT", body: JSON.stringify(goals) }),
  getLatestWeight: () => request("/api/weight/latest"),

  // health library
  searchResources: ({ q = "", type = "", category = "", favorites = false, page = 1, limit = 12 }) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    if (category) params.set("category", category);
    if (favorites) params.set("favorites", "true");
    params.set("page", page);
    params.set("limit", limit);
    return request(`/api/resources?${params.toString()}`);
  },
  getResourceMeta: () => request("/api/resources/meta"),
  addResource: (data) => request("/api/resources", { method: "POST", body: JSON.stringify(data) }),
  toggleFavorite: (id) => request(`/api/resources/${id}/favorite`, { method: "PATCH" }),
  deleteResource: (id) => request(`/api/resources/${id}`, { method: "DELETE" }),
};
