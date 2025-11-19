import React from "react";
import { Edit, Trash2, Calendar } from "lucide-react";
import { Expense, Category } from "../../types";
import {
  formatCurrency,
  formatDate,
  getRelativeTime,
} from "../../utils/dateUtils";

interface ExpenseCardProps {
  expense: Expense;
  category: Category | undefined;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  category,
  onEdit,
  onDelete,
}) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      onDelete(expense.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: category?.color || "#64748B" }}
          />
          <div>
            <h3 className="font-semibold text-slate-900">{expense.title}</h3>
            <p className="text-sm text-slate-500">{expense.category}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit expense"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete expense"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-2xl font-bold text-slate-900">
          {formatCurrency(expense.amount)}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(expense.date)}</span>
        </div>
        <span>{getRelativeTime(expense.date)}</span>
      </div>

      {expense.description && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-600">{expense.description}</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;
