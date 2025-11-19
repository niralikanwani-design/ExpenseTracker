import React from "react";
import { PiggyBank, BarChart3, List, LogIn, User } from "lucide-react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useExpenses } from "../hooks/useExpenses";
import useUserStore from "../store/useUserStore";

const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "expenses", label: "Expenses", icon: List },
    { id: "", label: "Hello", icon: User },
    { id: "signIn", label: "Log out", icon: LogIn },
  ];

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { loading } = useExpenses();
  const user = useUserStore((state) => state.user);

  const handleLogout = () => {
    useUserStore.getState().logout();
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button>
                <div className="p-2 bg-blue-600 rounded-lg">
                  <PiggyBank className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">
                  ExpenseTracker
                </h1>
              </button>
            </div>

            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.label === "Log out" ? handleLogout() : '';
                      navigate(`/${item.id}`);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname.includes(`${item.id}`)
                        ? "bg-blue-100 text-blue-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label == "Hello" ? <span>{user && user.fullName ? user.fullName : ""}</span> : <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-50">
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(`/${item.id}`)}
                className={`flex-1 flex flex-col items-center justify-center py-2 text-xs font-medium transition-all duration-200 ${location.pathname.includes(`${item.id}`)
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                {item.label == "Hello" ? <span>{user && user.fullName ? user.fullName : ""}</span> : <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
