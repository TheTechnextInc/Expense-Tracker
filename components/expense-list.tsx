"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  ArrowUpDown,
  Home,
  UtensilsCrossed,
  Car,
  Gamepad2,
  ShoppingBag,
  Heart,
  Zap,
  GraduationCap,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/expense-form";
import {
  useStore,
  getExpensesForMonth,
  deleteExpense,
  CATEGORIES,
  type Category,
  type Expense,
} from "@/lib/store";

const ICON_MAP: Record<string, React.ElementType> = {
  Home,
  UtensilsCrossed,
  Car,
  Gamepad2,
  ShoppingBag,
  Heart,
  Zap,
  GraduationCap,
  MoreHorizontal,
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function ExpenseList() {
  const { currentMonth } = useStore();
  const allExpenses = getExpensesForMonth(currentMonth);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Expense | null>(null);

  const filtered = useMemo(() => {
    let result = allExpenses;

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(lower) ||
          CATEGORIES[e.category].label.toLowerCase().includes(lower)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((e) => e.category === categoryFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "date") {
        return sortDir === "desc"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount;
    });

    return result;
  }, [allExpenses, search, categoryFilter, sortBy, sortDir]);

  function handleDelete(expense: Expense) {
    deleteExpense(expense.id);
    setDeleteDialog(null);
    toast.success("Expense deleted successfully");
  }

  function toggleSort(field: "date" | "amount") {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Expenses</h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length} transaction{filtered.length !== 1 && "s"}
          </p>
        </div>
        <Button
          onClick={() => { setEditingExpense(null); setFormOpen(true); }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Search expenses"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {CATEGORIES[cat].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1">
          <Button
            variant={sortBy === "date" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => toggleSort("date")}
            className="gap-1 text-xs"
          >
            <ArrowUpDown className="h-3 w-3" />
            Date
          </Button>
          <Button
            variant={sortBy === "amount" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => toggleSort("amount")}
            className="gap-1 text-xs"
          >
            <ArrowUpDown className="h-3 w-3" />
            Amount
          </Button>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-accent p-4 mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No expenses found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {search || categoryFilter !== "all"
              ? "Try adjusting your filters"
              : "Add your first expense to get started"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {filtered.map((expense) => {
            const catMeta = CATEGORIES[expense.category];
            const IconComp = ICON_MAP[catMeta.icon] || MoreHorizontal;
            return (
              <div
                key={expense.id}
                className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-accent/30"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${catMeta.color}20`, color: catMeta.color }}
                >
                  <IconComp className="h-4 w-4" />
                </div>
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {expense.description}
                    </span>
                    <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex">
                      {catMeta.label}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(expense.date), "MMM d, yyyy")}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground font-mono tabular-nums">
                  {formatCurrency(expense.amount)}
                </span>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => { setEditingExpense(expense); setFormOpen(true); }}
                    aria-label={`Edit ${expense.description}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => setDeleteDialog(expense)}
                    aria-label={`Delete ${expense.description}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Form Dialog */}
      <ExpenseForm
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditingExpense(null);
        }}
        editingExpense={editingExpense}
      />

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteDialog}
        onOpenChange={(o) => { if (!o) setDeleteDialog(null); }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteDialog?.description}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
