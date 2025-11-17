import React, { lazy, useEffect, useState } from "react";
import { Plus, Download, FileText } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";
import { Expense } from "../types";
import { formatCurrency } from "../utils/dateUtils";
import ExpenseTable from "../components/Expense/ExpenseTable";

const ExpenseFilters = lazy(() => import("../components/Expense/ExpenseFilters"));
const AddExpense = lazy(() => import("../components/Expense/AddExpense"));

const ExpenseList: React.FC = () => {
  const {
    expenses,
    getFilteredExpenses,
    filter,
    setFilter,
  } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const filteredExpenses = getFilteredExpenses();

  useEffect(() => {
    console.log(getFilteredExpenses(), expenses, filteredExpenses);
  }, [filteredExpenses]);

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleCloseForm = () => {
    setEditingExpense(null);
    setShowAddForm(false);
  };

  const handleExport = () => {
    const csvContent = [
      ["Title", "Amount", "Category", "Date", "Description"],
      ...filteredExpenses.map((expense) => [
        expense.title,
        expense.amount.toString(),
        expense.category,
        expense.date,
        expense.description || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (showAddForm) {
    return (
      <AddExpense
        editingExpense={editingExpense || undefined}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">Expenses</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      <ExpenseFilters filter={filter} onFilterChange={setFilter} />

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">
              Showing {filteredExpenses.length} expenses
            </p>
            <p className="text-2xl font-bold text-slate-900">
              Total: {formatCurrency(totalAmount)}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Expense Cards */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No expenses found
          </h3>
          <p className="text-slate-600 mb-6">
            {filter.searchTerm || filter.category || filter.dateRange
              ? "Try adjusting your filters or search terms."
              : "Start by adding your first expense."}
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Add First Expense</span>
          </button>
        </div>
      ) : (
          <ExpenseTable expenses={expenses} />
      )}
    </div>
  );
};

export default ExpenseList;
