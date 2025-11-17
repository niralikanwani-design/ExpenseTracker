import React from "react";
import { Trash2, Edit2 } from "lucide-react";
import { Expense } from "../../types";

interface ExpenseTableProps {
  expenses: Expense[];
}

const ExpenseCard: React.FC<ExpenseTableProps> = ({
  expenses
}) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Description</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Category</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-900">Amount</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-gray-900">{expense.description}</p>
                        <p className="text-sm text-gray-500">{expense.category}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{expense.date}</td>
                    <td className={`py-4 px-4 text-right font-semibold ${expense.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center space-x-2">
                        <button className="text-blue-600 hover:bg-blue-100 p-2 rounded transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete()}
                          className="text-red-600 hover:bg-red-100 p-2 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  );
};

export default ExpenseCard;
