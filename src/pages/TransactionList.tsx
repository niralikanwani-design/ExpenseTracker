import React, { lazy } from "react";
import { Plus, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TransactionTable = lazy(() => import("../components/Transaction/TransactionTable"));

const TransactionList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">Transactions</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => { }}
            className="flex items-center space-x-2 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => { navigate("Add", { state: { type: "Expense" } }) }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </button>
          <button
            onClick={() => { navigate("Add", { state: { type: "Income" } }) }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Income</span>
          </button>
        </div>
      </div>
          <TransactionTable />
    </div>
  );
};

export default TransactionList;
