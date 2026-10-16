export const CATEGORIES = [
  "Food & Dining",
  "Groceries",
  "Transport",
  "Bills & Rent",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
];

const STORAGE_KEY = "expense-ledger:v1";

// ---------- storage (browser localStorage) ----------
export function loadExpenses() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveExpenses(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // storage full or blocked: the app still works for this session
  }
}

// ---------- dates and money ----------
const pad = (n) => String(n).padStart(2, "0");

// Date -> "YYYY-MM-DD" in local time
export const toDateString = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const money = (n) =>
  "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);

const parseMonth = (ym) => ym.split("-").map(Number); // "2026-10" -> [2026, 10]

export const monthLabel = (ym) => {
  const [y, m] = parseMonth(ym);
  return new Date(y, m - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

export const monthName = (ym) => {
  const [y, m] = parseMonth(ym);
  return new Date(y, m - 1, 1).toLocaleDateString("en-IN", { month: "long" });
};

export const shiftMonth = (ym, delta) => {
  const [y, m] = parseMonth(ym);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
};

export const daysInMonth = (ym) => {
  const [y, m] = parseMonth(ym);
  return new Date(y, m, 0).getDate();
};

// ---------- example data shown until the first real expense is added ----------
export function sampleExpenses() {
  const rows = [
    [0, 340, "Food & Dining", "Lunch with colleagues"],
    [1, 2450, "Groceries", "Vegetables and milk"],
    [2, 180, "Transport", "Auto to the station"],
    [4, 1299, "Bills & Rent", "Electricity bill"],
    [6, 799, "Entertainment", "Movie tickets"],
    [9, 2100, "Shopping", "Running shoes"],
    [12, 450, "Health", "Pharmacy"],
    [18, 15000, "Bills & Rent", "Room rent"],
  ];
  const now = new Date();
  return rows.map(([daysAgo, amount, category, note], i) => ({
    id: `sample-${i}`,
    date: toDateString(
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo)
    ),
    amount,
    category,
    note,
    sample: true,
  }));
}
