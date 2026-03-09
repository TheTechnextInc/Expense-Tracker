"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Home,
  UtensilsCrossed,
  Car,
  Gamepad2,
  ShoppingBag,
  Heart,
  Zap,
  GraduationCap,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useStore,
  getBudgetsForMonth,
  getTotalSpentByCategory,
  setBudget,
  deleteBudget,
  CATEGORIES,
  type Category,
  type Budget,
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
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BudgetManager() {
  const { currentMonth } = useStore();
  const budgets = getBudgetsForMonth(currentMonth);
  const spent = getTotalSpentByCategory(currentMonth);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Budget | null>(null);

  // Form state
  const [formCategory, setFormCategory] = useState<Category>("food");
  const [formLimit, setFormLimit] = useState("");
  const [formError, setFormError] = useState("");

  const existingCategories = new Set(budgets.map((b) => b.category));

  function openAddForm() {
    const available = (Object.keys(CATEGORIES) as Category[]).find(
      (c) => !existingCategories.has(c)
    );
    setFormCategory(available || "food");
    setFormLimit("");
    setFormError("");
    setEditingBudget(null);
    setFormOpen(true);
  }

  function openEditForm(budget: Budget) {
    setFormCategory(budget.category);
    setFormLimit(String(budget.limit));
    setFormError("");
    setEditingBudget(budget);
    setFormOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const limit = parseFloat(formLimit);
    if (!formLimit || isNaN(limit) || limit <= 0) {
      setFormError("Enter a valid budget amount greater than 0");
      return;
    }
    setBudget(formCategory, limit, currentMonth);
    toast.success(editingBudget ? "Budget updated" : "Budget added");
    setFormOpen(false);
  }

  function handleDelete(budget: Budget) {
    deleteBudget(budget.id);
    setDeleteDialog(null);
    toast.success("Budget removed");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Budget Goals</h2>
          <p className="text-sm text-muted-foreground">
            Set spending limits for each category
          </p>
        </div>
        <Button onClick={openAddForm} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Budget
        </Button>
      </div>

      {budgets.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-accent p-4 mb-4">
              <AlertTriangle className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No budgets set</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create budget goals to track your spending
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {budgets.map((budget) => {
            const catMeta = CATEGORIES[budget.category];
            const IconComp = ICON_MAP[catMeta.icon] || MoreHorizontal;
            const categorySpent = spent[budget.category] || 0;
            const percent = budget.limit > 0 ? Math.min((categorySpent / budget.limit) * 100, 100) : 0;
            const isOver = categorySpent > budget.limit;
            const isNear = percent >= 80 && !isOver;

            return (
              <Card key={budget.id} className="bg-card border-border group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${catMeta.color}20`, color: catMeta.color }}
                      >
                        <IconComp className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-sm font-medium">{catMeta.label}</CardTitle>
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEditForm(budget)}
                        aria-label={`Edit ${catMeta.label} budget`}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteDialog(budget)}
                        aria-label={`Delete ${catMeta.label} budget`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-xl font-semibold text-foreground font-mono">
                      {formatCurrency(categorySpent)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      of {formatCurrency(budget.limit)}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={percent}
                      className={`h-2 ${
                        isOver
                          ? "[&>[data-slot=progress-indicator]]:bg-destructive"
                          : isNear
                            ? "[&>[data-slot=progress-indicator]]:bg-warning"
                            : "[&>[data-slot=progress-indicator]]:bg-primary"
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`text-xs font-medium ${
                        isOver
                          ? "text-destructive"
                          : isNear
                            ? "text-warning"
                            : "text-primary"
                      }`}
                    >
                      {isOver
                        ? `Over by ${formatCurrency(categorySpent - budget.limit)}`
                        : `${formatCurrency(budget.limit - categorySpent)} remaining`}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {percent.toFixed(0)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Budget Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingBudget ? "Edit Budget" : "Set Budget Goal"}</DialogTitle>
            <DialogDescription>
              {editingBudget
                ? "Update the spending limit for this category."
                : "Set a monthly spending limit for a category."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="budget-category">Category</Label>
              <Select
                value={formCategory}
                onValueChange={(v) => setFormCategory(v as Category)}
                disabled={!!editingBudget}
              >
                <SelectTrigger id="budget-category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      disabled={!editingBudget && existingCategories.has(cat)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: CATEGORIES[cat].color }}
                        />
                        {CATEGORIES[cat].label}
                        {!editingBudget && existingCategories.has(cat) && (
                          <span className="text-muted-foreground">(set)</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="budget-limit">Monthly Limit ($)</Label>
              <Input
                id="budget-limit"
                type="number"
                step="1"
                min="0"
                placeholder="500"
                value={formLimit}
                onChange={(e) => { setFormLimit(e.target.value); setFormError(""); }}
                className="font-mono"
                aria-invalid={!!formError}
                aria-describedby={formError ? "budget-error" : undefined}
              />
              {formError && (
                <p id="budget-error" className="text-xs text-destructive">{formError}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingBudget ? "Update" : "Set Budget"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteDialog} onOpenChange={(o) => { if (!o) setDeleteDialog(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Budget</DialogTitle>
            <DialogDescription>
              Remove the budget for {deleteDialog ? CATEGORIES[deleteDialog.category].label : ""}?
              This won&apos;t delete any expenses.
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
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
