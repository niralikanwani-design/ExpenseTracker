import React from "react";
import { PiggyBank } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";


const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-3" onClick={() => navigate("/Dashboard")}>
              <div className="p-2 bg-blue-600 rounded-lg">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                ExpenseTracker
              </h1>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
