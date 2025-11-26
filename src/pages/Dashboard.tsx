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
import { GetDashboardData } from "../dataAccess/dashboardDAL";
import useUserStore from "../store/useUserStore";
import { formatCurrency } from "../utils/dateUtils";
import { CategoryData, DashboardData, MonthlyData, QuickInsight } from "../types";

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
    getDashboardData()
  }, [selectedMonth]);

  const getDashboardData = async () => {
    try {
      // const currentMonth = new Date().getMonth() + 1;
      await dashboardDataAPI("Expense");
    } catch (error) {

    }
  }

  const dashboardDataAPI = async (type : string) => {
    const result = await GetDashboardData(user?.userId ?? 0,selectedMonth,type);
      setDashboardData(result.summary);

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
      console.log(quickInsight);
  }

  const radioButtonChange = async (e : any) => {
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
      className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {trend && (
            <div
              className={`flex items-center mt-2 text-sm ${trend.isPositive ? "text-green-600" : "text-red-600"
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
        <div className="p-3 bg-blue-100 rounded-lg">{icon}</div>
      </div>
    </div>
  );

  console.log(selectedType, "selectedType")

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <div className="flex items-center space-x-3">
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
            className="border border-slate-300 rounded-md px-2 py-1 text-sm"
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
          icon={<DollarSign className="h-6 w-6 text-blue-600" />}
        />
        <StatCard
          title="Number of Expenses"
          value={dashboardData?.numberofExpenses.toString() ?? ''}
          icon={<Receipt className="h-6 w-6 text-purple-600" />}
        />
        <StatCard
          title="Average Expense"
          value={formatCurrency(dashboardData?.averageExpense ?? 0)}
          icon={<TrendingUp className="h-6 w-6 text-emerald-600" />}
        />
        <StatCard
          title="Expense Categories Used"
          value={dashboardData?.expenseCategoriesUsed.toString() ?? ''}
          icon={<TrendingDown className="h-6 w-6 text-orange-600" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
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
                      style={{
                        backgroundColor: color,
                      }}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {category.categoryName}
                    </span>
                  </div>
            
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">
                      {formatCurrency(category.totalAmount)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {category.percentage?.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Monthly Spending Trend
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Quick Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">
              Highest Category
            </p>
            <p className="text-lg font-semibold text-blue-900">
              {quickInsight?.highestCategory ?? "N/A"}
            </p>
            <p className="text-xs text-blue-600">
              {formatCurrency(quickInsight?.hightestCategoryAmount ?? 0)}
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm text-emerald-700 font-medium">This Month</p>
            <p className="text-lg font-semibold text-emerald-900">
              {formatCurrency(
                quickInsight?.totalAmount || 0
              )}
            </p>
            <p className="text-xs text-emerald-600">
              {/* {stats.monthlyTrend[stats.monthlyTrend.length - 1]?.month ||
                "N/A"} */}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700 font-medium">Daily Average</p>
            <p className="text-lg font-semibold text-purple-900">
              {formatCurrency(quickInsight?.dailyAverage || 0)}
            </p>
            <p className="text-xs text-purple-600">Based on 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
