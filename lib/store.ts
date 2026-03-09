import { useSyncExternalStore } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Category =
  | "housing"
  | "food"
  | "transport"
  | "entertainment"
  | "shopping"
  | "health"
  | "utilities"
  | "education"
  | "other";

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO string
  createdAt: string;
}

export interface Budget {
  id: string;
  category: Category;
  limit: number;
  month: string; // YYYY-MM
}

export interface AppState {
  expenses: Expense[];
  budgets: Budget[];
  currentMonth: string; // YYYY-MM
}

// ─── Category Metadata ───────────────────────────────────────────────────────

export const CATEGORIES: Record<
  Category,
  { label: string; color: string; icon: string }
> = {
  housing: { label: "Housing", color: "oklch(0.72 0.19 155)", icon: "Home" },
  food: { label: "Food & Dining", color: "oklch(0.75 0.15 80)", icon: "UtensilsCrossed" },
  transport: { label: "Transport", color: "oklch(0.65 0.15 250)", icon: "Car" },
  entertainment: { label: "Entertainment", color: "oklch(0.68 0.12 300)", icon: "Gamepad2" },
  shopping: { label: "Shopping", color: "oklch(0.70 0.18 340)", icon: "ShoppingBag" },
  health: { label: "Health", color: "oklch(0.60 0.20 25)", icon: "Heart" },
  utilities: { label: "Utilities", color: "oklch(0.60 0.12 200)", icon: "Zap" },
  education: { label: "Education", color: "oklch(0.55 0.15 270)", icon: "GraduationCap" },
  other: { label: "Other", color: "oklch(0.50 0.05 260)", icon: "MoreHorizontal" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

function createSeedData(): AppState {
  const currentMonth = getCurrentMonth();
  const year = parseInt(currentMonth.split("-")[0]);
  const month = parseInt(currentMonth.split("-")[1]);

  const expenses: Expense[] = [];
  const seedEntries = [
    { amount: 1200, category: "housing" as Category, description: "Monthly Rent", dayOffset: -2 },
    { amount: 85.50, category: "food" as Category, description: "Grocery Store", dayOffset: -1 },
    { amount: 42.00, category: "transport" as Category, description: "Gas Station", dayOffset: -3 },
    { amount: 15.99, category: "entertainment" as Category, description: "Streaming Service", dayOffset: -5 },
    { amount: 67.30, category: "shopping" as Category, description: "Online Order", dayOffset: -4 },
    { amount: 120.00, category: "health" as Category, description: "Pharmacy", dayOffset: -6 },
    { amount: 95.00, category: "utilities" as Category, description: "Electric Bill", dayOffset: -7 },
    { amount: 35.00, category: "food" as Category, description: "Restaurant Dinner", dayOffset: -1 },
    { amount: 28.50, category: "transport" as Category, description: "Uber Ride", dayOffset: -2 },
    { amount: 250.00, category: "education" as Category, description: "Online Course", dayOffset: -8 },
    { amount: 45.00, category: "food" as Category, description: "Coffee & Snacks", dayOffset: -10 },
    { amount: 180.00, category: "shopping" as Category, description: "New Headphones", dayOffset: -12 },
    { amount: 55.00, category: "utilities" as Category, description: "Internet Bill", dayOffset: -15 },
    { amount: 22.00, category: "entertainment" as Category, description: "Movie Tickets", dayOffset: -9 },
    { amount: 75.00, category: "health" as Category, description: "Gym Membership", dayOffset: -20 },
    { amount: 130.00, category: "food" as Category, description: "Weekly Groceries", dayOffset: -14 },
    { amount: 60.00, category: "transport" as Category, description: "Metro Pass", dayOffset: -18 },
    { amount: 40.00, category: "entertainment" as Category, description: "Concert Ticket", dayOffset: -22 },
    { amount: 300.00, category: "shopping" as Category, description: "Winter Jacket", dayOffset: -25 },
    { amount: 18.50, category: "food" as Category, description: "Lunch Takeout", dayOffset: -3 },
  ];

  for (const entry of seedEntries) {
    const date = new Date(year, month - 1, 15 + entry.dayOffset);
    expenses.push({
      id: generateId(),
      amount: entry.amount,
      category: entry.category,
      description: entry.description,
      date: date.toISOString(),
      createdAt: date.toISOString(),
    });
  }

  // Also add some expenses for previous month
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevEntries = [
    { amount: 1200, category: "housing" as Category, description: "Monthly Rent", day: 1 },
    { amount: 320, category: "food" as Category, description: "Monthly Groceries", day: 5 },
    { amount: 90, category: "transport" as Category, description: "Gas", day: 8 },
    { amount: 200, category: "shopping" as Category, description: "Clothing", day: 12 },
    { amount: 55, category: "utilities" as Category, description: "Internet", day: 15 },
    { amount: 95, category: "utilities" as Category, description: "Electric", day: 15 },
    { amount: 75, category: "health" as Category, description: "Gym", day: 1 },
    { amount: 45, category: "entertainment" as Category, description: "Games", day: 20 },
    { amount: 150, category: "food" as Category, description: "Dining Out", day: 22 },
    { amount: 60, category: "transport" as Category, description: "Metro", day: 10 },
  ];

  for (const entry of prevEntries) {
    const date = new Date(prevYear, prevMonth - 1, entry.day);
    expenses.push({
      id: generateId(),
      amount: entry.amount,
      category: entry.category,
      description: entry.description,
      date: date.toISOString(),
      createdAt: date.toISOString(),
    });
  }

  const budgets: Budget[] = [
    { id: generateId(), category: "housing", limit: 1500, month: currentMonth },
    { id: generateId(), category: "food", limit: 500, month: currentMonth },
    { id: generateId(), category: "transport", limit: 200, month: currentMonth },
    { id: generateId(), category: "entertainment", limit: 150, month: currentMonth },
    { id: generateId(), category: "shopping", limit: 400, month: currentMonth },
    { id: generateId(), category: "health", limit: 250, month: currentMonth },
    { id: generateId(), category: "utilities", limit: 200, month: currentMonth },
    { id: generateId(), category: "education", limit: 300, month: currentMonth },
  ];

  return { expenses, budgets, currentMonth };
}

// ─── Store ───────────────────────────────────────────────────────────────────

let state: AppState = createSeedData();
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function getSnapshot(): AppState {
  return state;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export function addExpense(
  data: Omit<Expense, "id" | "createdAt">
): Expense {
  const expense: Expense = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  state = { ...state, expenses: [expense, ...state.expenses] };
  emitChange();
  return expense;
}

export function updateExpense(
  id: string,
  data: Partial<Omit<Expense, "id" | "createdAt">>
): void {
  state = {
    ...state,
    expenses: state.expenses.map((e) =>
      e.id === id ? { ...e, ...data } : e
    ),
  };
  emitChange();
}

export function deleteExpense(id: string): void {
  state = {
    ...state,
    expenses: state.expenses.filter((e) => e.id !== id),
  };
  emitChange();
}

export function setBudget(category: Category, limit: number, month: string): void {
  const existing = state.budgets.find(
    (b) => b.category === category && b.month === month
  );
  if (existing) {
    state = {
      ...state,
      budgets: state.budgets.map((b) =>
        b.id === existing.id ? { ...b, limit } : b
      ),
    };
  } else {
    state = {
      ...state,
      budgets: [
        ...state.budgets,
        { id: generateId(), category, limit, month },
      ],
    };
  }
  emitChange();
}

export function deleteBudget(id: string): void {
  state = {
    ...state,
    budgets: state.budgets.filter((b) => b.id !== id),
  };
  emitChange();
}

export function setCurrentMonth(month: string): void {
  state = { ...state, currentMonth: month };
  emitChange();
}

// ─── Selectors ───────────────────────────────────────────────────────────────

export function getExpensesForMonth(month: string): Expense[] {
  return state.expenses
    .filter((e) => {
      const d = new Date(e.date);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return m === month;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBudgetsForMonth(month: string): Budget[] {
  return state.budgets.filter((b) => b.month === month);
}

export function getTotalSpentByCategory(
  month: string
): Record<Category, number> {
  const expenses = getExpensesForMonth(month);
  const totals = {} as Record<Category, number>;
  for (const cat of Object.keys(CATEGORIES) as Category[]) {
    totals[cat] = 0;
  }
  for (const e of expenses) {
    totals[e.category] += e.amount;
  }
  return totals;
}

export function getTotalSpent(month: string): number {
  return getExpensesForMonth(month).reduce((sum, e) => sum + e.amount, 0);
}

export function getTotalBudget(month: string): number {
  return getBudgetsForMonth(month).reduce((sum, b) => sum + b.limit, 0);
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useStore(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
