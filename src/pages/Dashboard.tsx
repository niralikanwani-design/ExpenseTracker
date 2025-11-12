import React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Calendar,
} from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";
import { formatCurrency } from "../utils/dateUtils";

const Dashboard: React.FC = () => {
  const { getExpenseStats, categories } = useExpenses();
  const stats = getExpenseStats();

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
        <div className="p-3 bg-blue-100 rounded-lg">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(stats.totalAmount)}
          icon={<DollarSign className="h-6 w-6 text-blue-600" />}
        />
        <StatCard
          title="Number of Expenses"
          value={stats.totalExpenses.toString()}
          icon={<Receipt className="h-6 w-6 text-purple-600" />}
        />
        <StatCard
          title="Average Expense"
          value={formatCurrency(stats.averageExpense)}
          icon={<TrendingUp className="h-6 w-6 text-emerald-600" />}
        />
        <StatCard
          title="Expense Categories Used"
          value={stats.categoryBreakdown.length.toString()}
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
          <div className="space-y-3">
            {stats.categoryBreakdown.map((category, index) => {
              const categoryData = categories.find(
                (c) => c.name === category.category
              );
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: categoryData?.color || "#64748B",
                      }}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {category.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">
                      {formatCurrency(category.amount)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {category.percentage.toFixed(1)}%
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
          <div className="space-y-3">
            {stats.monthlyTrend.map((month, index) => {
              const maxAmount = Math.max(
                ...stats.monthlyTrend.map((m) => m.amount)
              );
              const percentage =
                maxAmount > 0 ? (month.amount / maxAmount) * 100 : 0;

              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 w-20">
                    {month.month}
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-20 text-right">
                    {formatCurrency(month.amount)}
                  </span>
                </div>
              );
            })}
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
              {stats.categoryBreakdown[0]?.category || "N/A"}
            </p>
            <p className="text-xs text-blue-600">
              {stats.categoryBreakdown[0]
                ? formatCurrency(stats.categoryBreakdown[0].amount)
                : "$0"}
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm text-emerald-700 font-medium">This Month</p>
            <p className="text-lg font-semibold text-emerald-900">
              {formatCurrency(
                stats.monthlyTrend[stats.monthlyTrend.length - 1]?.amount || 0
              )}
            </p>
            <p className="text-xs text-emerald-600">
              {stats.monthlyTrend[stats.monthlyTrend.length - 1]?.month ||
                "N/A"}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700 font-medium">Daily Average</p>
            <p className="text-lg font-semibold text-purple-900">
              {formatCurrency(stats.totalAmount / 30)}
            </p>
            <p className="text-xs text-purple-600">Based on 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
