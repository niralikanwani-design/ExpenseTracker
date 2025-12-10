import React, { useEffect, useState } from "react";
import { Moon, PiggyBank, Sun } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthLayout: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">

      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* LEFT: Logo */}
            <button
              className="flex items-center space-x-3"
              onClick={() => navigate("/Dashboard")}
            >
              <div className="p-2 bg-blue-600 rounded-lg">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                ExpenseTracker
              </h1>
            </button>

            {/* RIGHT: Dark Mode Button – Moved here */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 
                         text-slate-700 dark:text-slate-200 
                         hover:bg-slate-300 dark:hover:bg-slate-600 
                         transition"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 dark:text-white">
        <Outlet />
      </main>

    </div>
  );
};

export default AuthLayout;
