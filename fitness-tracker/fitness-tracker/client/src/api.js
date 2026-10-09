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
  getEntries: (date) => request(`/api/entries?date=${date}`),
  addEntry: (entry) => request("/api/entries", { method: "POST", body: JSON.stringify(entry) }),
  deleteEntry: (id) => request(`/api/entries/${id}`, { method: "DELETE" }),
  getSummary: (end, days = 7) => request(`/api/summary?end=${end}&days=${days}`),
  getGoals: () => request("/api/goals"),
  saveGoals: (goals) => request("/api/goals", { method: "PUT", body: JSON.stringify(goals) }),
  getLatestWeight: () => request("/api/weight/latest"),
};
