"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  addExpense,
  updateExpense,
  CATEGORIES,
  type Category,
  type Expense,
} from "@/lib/store";

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingExpense?: Expense | null;
}

export function ExpenseForm({ open, onOpenChange, editingExpense }: ExpenseFormProps) {
  const [amount, setAmount] = useState(editingExpense ? String(editingExpense.amount) : "");
  const [category, setCategory] = useState<Category>(editingExpense?.category ?? "food");
  const [description, setDescription] = useState(editingExpense?.description ?? "");
  const [date, setDate] = useState(
    editingExpense ? new Date(editingExpense.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!editingExpense;

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Enter a valid amount greater than 0";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!date) {
      newErrors.date = "Date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const expenseData = {
      amount: parseFloat(amount),
      category,
      description: description.trim(),
      date: new Date(date).toISOString(),
    };

    if (isEditing && editingExpense) {
      updateExpense(editingExpense.id, expenseData);
      toast.success("Expense updated successfully");
    } else {
      addExpense(expenseData);
      toast.success("Expense added successfully");
    }

    onOpenChange(false);
    resetForm();
  }

  function resetForm() {
    setAmount("");
    setCategory("food");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setErrors({});
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) resetForm(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Expense" : "Add New Expense"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details for this expense."
              : "Record a new expense with its details below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setErrors((p) => ({ ...p, amount: "" })); }}
              className="font-mono"
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? "amount-error" : undefined}
            />
            {errors.amount && (
              <p id="amount-error" className="text-xs text-destructive">{errors.amount}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: CATEGORIES[cat].color }}
                      />
                      {CATEGORIES[cat].label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What was this expense for?"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: "" })); }}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "description-error" : undefined}
            />
            {errors.description && (
              <p id="description-error" className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setErrors((p) => ({ ...p, date: "" })); }}
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? "date-error" : undefined}
            />
            {errors.date && (
              <p id="date-error" className="text-xs text-destructive">{errors.date}</p>
            )}
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="ghost" onClick={() => { onOpenChange(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
