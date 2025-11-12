import { useState } from "react";

import { useExpenses } from "./hooks/useExpenses";
import Layout from "./components/Layout";
import ExpenseList from "./pages/ExpenseList";
import AddExpense from "./components/Expense/AddExpense";
import Dashboard from "./pages/Dashboard";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const { loading } = useExpenses();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your expenses...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "expenses":
        return <ExpenseList />;
      case "addExpense":
        return <AddExpense />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderCurrentView()}
    </Layout>
  );
}

export default App;
