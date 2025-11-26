import React, { lazy, useEffect, useState } from "react";
import { Plus, Download, FileText } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";
import { useNavigate } from "react-router-dom";
import { Transaction } from "../types";

const AddExpense = lazy(() => import("../components/Expense/AddExpense"));
const ExpenseTable = lazy(() => import("../components/Expense/ExpenseTable"));

const ExpenseList: React.FC = () => {
  const { expenses, getFilteredTransactions } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Transaction | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const handleCloseForm = () => {
    setEditingExpense(null);
    setShowAddForm(false);
  };

  const handleExport = () => {
    const csvContent = [
      ["Title", "Amount", "Category", "Date", "Description"],
      ...expenses.map((expense) => [
        expense.title,
        expense.amount.toString(),
        expense.categoryId,
        expense.transactionDate,
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
            onClick={() => { navigate("addExpense")}}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </button>
          <button
            onClick={() => { navigate("addIncome")}}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Income</span>
          </button>
        </div>
      </div>
          <ExpenseTable expenses={expenses} onSearchChange={getFilteredTransactions} onFilterModelChange={getFilteredTransactions} onSortModelChange={getFilteredTransactions}/>
    </div>
  );
};

export default ExpenseList;
