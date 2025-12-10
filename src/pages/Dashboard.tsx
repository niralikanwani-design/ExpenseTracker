import {
  Calendar,
  DollarSign,
  Receipt,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GetDashboardData, addUserLimit } from "../dataAccess/dashboardDAL";
import useUserStore from "../store/useUserStore";
import { formatCurrency } from "../utils/dateUtils";
import { CategoryData, DashboardData, DashboardMessageProps, LimitPayload, MonthlyData, QuickInsight, SummaryCardProps } from "../types";
import { Card, CardContent, Typography } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { toast } from "react-toastify";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  user == null ? navigate(`/signIn`) : "";
  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [quickInsight, setQuickInsight] = useState<QuickInsight | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedType, setSelectedType] = useState("expense");
  const [openLimitModal, setOpenLimitModal] = useState<boolean>(false);
  const [balance, setBalance] = useState<number | string>("");
  const [maxExpenseLimit, setMaxExpenseLimit] = useState<number | string>("");
  const [MaxLimitMessage, setmaxLimitMessage] = useState<{ type: string; text: string } | null>(null);
  const isDark = document.documentElement.classList.contains("dark");
  const categoryColors: Record<string, string> = {
    Food: "#10B981",
    Transport: "#3B82F6",
    Rent: "#F59E0B",
    Salary: "#6366F1",
    Freelance: "#8B5CF6",
    Groceries: "#22C55E",
    Shopping: "#EC4899",
    "Investment Return": "#14B8A6",
    Bonus: "#F97316",
    Entertainment: "#EF4444",
  };
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  useEffect(() => {
    getDashboardData();
  }, [selectedMonth]);

  const getDashboardData = async () => {
    await dashboardDataAPI("Expense");
  };

  const dashboardDataAPI = async (type: string) => {
    const result = await GetDashboardData(
      user?.userId ?? 0,
      selectedMonth,
      type
    );

    setDashboardData(result.summary);

    if(result.summary.maxLimit || result.summary.totalBalance){
      setBalance(result.summary.totalBalance)
      setMaxExpenseLimit(result.summary.maxLimit)
    }

    const radioButtonName = document.querySelector('input[name="type"]:checked') as HTMLInputElement;
    if((result.summary.maxLimit < result.summary.totalExpenses) && radioButtonName.value == 'Expense'){
      setmaxLimitMessage({
        type: "error",
        text: "You have exceeded your budget! Try reducing expenses.",
      });
    }else{
      setmaxLimitMessage(null);
    }

    // For category
    let categoryList: CategoryData[] = result.categoryExpenses;

    categoryList = categoryList.sort(
      (a, b) => b.totalAmount - a.totalAmount
    );

    const topFive = categoryList.slice(0, 5);

    const totalAmount = topFive.reduce(
      (sum: number, c: CategoryData) => sum + c.totalAmount,
      0
    );

    const highestCategory =
      categoryList.length > 0 ? categoryList[0] : null;

    const formatted = topFive.map((c: CategoryData) => ({
      ...c,
      percentage: totalAmount > 0 ? (c.totalAmount / totalAmount) * 100 : 0,
    }));

    setCategoryData(formatted);

    const formattedMonthly = result.monthlyTrend.map((m: any) => ({
      month: m.month,
      amount: m.totalAmount,
    }));

    // For Monthly Data
    setMonthlyData(formattedMonthly);

    const quickInsightData: QuickInsight = {
      highestCategory: highestCategory ? highestCategory.categoryName : "",
      hightestCategoryAmount: highestCategory ? highestCategory.totalAmount : 0,
      totalAmount: totalAmount,
      dailyAverage: result.summary.averageExpense,
    };

    setQuickInsight(quickInsightData);
    
  }

  const radioButtonChange = async (e: any) => {
    setSelectedType(e.target.value);
    dashboardDataAPI(e.target.value);
  }

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: { value: number; isPositive: boolean };
    className?: string;
  }> = ({ title, value, icon, trend, className = "" }) => (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm 
      border border-slate-200 dark:border-slate-700 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {value}
          </p>
          {trend && (
            <div
              className={`flex items-center mt-2 text-sm ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(trend.value)}% from last month
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );

  const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, color }) => {
    return (
      <Card
        sx={{
          borderLeft: `6px solid ${color || "#0ea5e9"}`,
          boxShadow: 1,
          backgroundColor: "var(--card-bg)",
          color: "var(--text-color)",
        }}
        className="dark:bg-slate-900 dark:text-white"
      >
        <CardContent>
          <Typography
            variant="subtitle2"
            className="dark:text-slate-300"
          >
            {label}
          </Typography>

          <Typography variant="h6" fontWeight={700}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const DashboardMessage: React.FC<DashboardMessageProps> = ({ type, message }) => {
    const colors = {
      success: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700",
      warning: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
      error: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700",
      info: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700",
    };
  
    return (
      <div className={`border rounded-md px-4 py-3 mb-4 ${colors[type]}`}>
        {message}
      </div>
    );
  };

  const handleAddLimit = () => setOpenLimitModal(true);
  const handleCloseLimitModal = () => setOpenLimitModal(false);

  const handleSaveLimit = async () => {
    const payload: LimitPayload = {
      userId: Number(user?.userId),
      totalBalance: Number(balance),
      maxLimit: Number(maxExpenseLimit),
    };

    try {
      const response = await addUserLimit(payload);
      const radioButtonName = document.querySelector(
        'input[name="type"]:checked'
      ) as HTMLInputElement;
      dashboardDataAPI(
        radioButtonName ? radioButtonName.value : "Expense"
      );

      if (response.status === 200) {
        toast.success("Limit updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update limit");
    }

    setOpenLimitModal(false);
  };

  return (
    <div className="space-y-8">
      {MaxLimitMessage && (
        <DashboardMessage
          type={MaxLimitMessage.type as any}
          message={MaxLimitMessage.text}
        />
      )}


      <div className="bg-white dark:bg-slate-900 shadow rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
          <div className="flex justify-center md:justify-start">
            <button
              onClick={handleAddLimit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
            >
              Add Limit
            </button>
          </div>

          {/* Total Expense */}
          <SummaryCard label="Total Expense" value={formatCurrency(dashboardData?.totalExpenses ?? 0)} color="#ef4444" />

          {/* Total Income */}
          <SummaryCard label="Total Income" value={formatCurrency(dashboardData?.totalIncome ?? 0)} color="#22c55e" />

          {/* Total Balance */}
          <SummaryCard label="Total Balance" value={formatCurrency(dashboardData?.totalBalance ?? 0)} color="#0ea5e9" />
          
          {/* Max Limit */}
          <SummaryCard label="Max Limit" value={formatCurrency(dashboardData?.maxLimit ?? 0)} color="#8b5cf6" />

          {/* Net Balance */}
          <SummaryCard label="Net balance" value={formatCurrency((dashboardData?.totalBalance ?? 0) - (dashboardData?.totalExpenses ?? 0))} color="#f97316" />

        </div>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h2>

        <div className="flex items-center space-x-3 dark:text-white">
          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="Expense"
              checked={selectedType.toLowerCase() === "expense"}
              onChange={(e) => radioButtonChange(e)}
              className="h-4 w-4"
            />
            <span>Expense</span>
          </label>

          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="Income"
              checked={selectedType.toLowerCase() === "income"}
              onChange={(e) => radioButtonChange(e)}
              className="h-4 w-4"
            />
            <span>Income</span>
          </label>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4" />
          <select
            className="border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-2 py-1 text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(dashboardData?.totalExpenses ?? 0)}
          icon={<DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        />
        <StatCard
          title="Number of Expenses"
          value={dashboardData?.numberofExpenses.toString() ?? ""}
          icon={<Receipt className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
        />
        <StatCard
          title="Average Expense"
          value={formatCurrency(dashboardData?.averageExpense ?? 0)}
          icon={<TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Expense Categories Used"
          value={dashboardData?.expenseCategoriesUsed.toString() ?? ""}
          icon={<TrendingDown className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CATEGORY BREAKDOWN */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Expenses by Category
          </h3>
          <div className="space-y-3 py-4">
            {categoryData.map((category, index) => {
              const color = categoryColors[category.categoryName] || "#64748B";
              // const categoryItem = categories.find(
              //   (c) => c.name === category.categoryName
              // );
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {category.categoryName}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(category.totalAmount)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {category.percentage?.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MONTHLY TREND */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Monthly Spending Trend
          </h3>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip />
                <Bar dataKey="amount" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Quick Insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Highest Category
            </p>
            <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              {quickInsight?.highestCategory ?? "N/A"}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {formatCurrency(quickInsight?.hightestCategoryAmount ?? 0)}
            </p>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-900 rounded-lg">
            <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
              This Month
            </p>
            <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
              {formatCurrency(quickInsight?.totalAmount || 0)}
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
            <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
              Daily Average
            </p>
            <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              {formatCurrency(quickInsight?.dailyAverage || 0)}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Based on 30 days
            </p>
          </div>
        </div>
      </div>

      <Dialog open={openLimitModal} onClose={handleCloseLimitModal} maxWidth="xs" fullWidth>
        <DialogTitle
          className="bg-white dark:bg-slate-900"
          sx={{ color: isDark ? "white" : "black" }}
        >
          Add Limit
        </DialogTitle>

        <DialogContent
          className="bg-white dark:bg-slate-900"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            color: isDark ? "white" : "black",
          }}
        >
          {/* BALANCE FIELD */}
          <TextField
            label="Balance"
            type="number"
            fullWidth
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            sx={{
              mt: 2,
              "& .MuiInputBase-input": {
                color: isDark ? "white" : "black",
              },
              "& .MuiInputLabel-root": {
                color: isDark ? "#cbd5e1" : "#475569",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? "#64748b" : "#94a3b8",
              },
            }}
          />

          {/* LIMIT FIELD */}
          <TextField
            label="Max Expense Limit"
            type="number"
            fullWidth
            value={maxExpenseLimit}
            onChange={(e) => setMaxExpenseLimit(e.target.value)}
            sx={{
              "& .MuiInputBase-input": {
                color: isDark ? "white" : "black",
              },
              "& .MuiInputLabel-root": {
                color: isDark ? "#cbd5e1" : "#475569",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? "#64748b" : "#94a3b8",
              },
            }}
          />
        </DialogContent>

        <DialogActions
          className="bg-white dark:bg-slate-900"
        >
          <Button
            variant="outlined"
            onClick={handleCloseLimitModal}
            sx={{
              borderColor: isDark ? "#e2e8f0" : "#475569",
              color: isDark ? "#f8fafc" : "#334155",
              m: 1
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveLimit}
            sx={{ m: 1 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default Dashboard;
