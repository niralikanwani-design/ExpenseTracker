import React from "react";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { ExpenseFilter } from "../../types";
import { useExpenses } from "../../hooks/useExpenses";
import { getDateRange } from "../../utils/dateUtils";

interface ExpenseFiltersProps {
  filter: ExpenseFilter;
  onFilterChange: (filter: ExpenseFilter) => void;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filter,
  onFilterChange,
}) => {
  const { categories } = useExpenses();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, searchTerm: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filter, category: e.target.value || undefined });
  };

  const handleDateRangeChange = (range: string) => {
    if (range === "all") {
      onFilterChange({ ...filter, dateRange: undefined });
    } else {
      onFilterChange({ ...filter, dateRange: getDateRange(range) });
    }
  };

  const handleSortChange = (sortBy: "date" | "amount" | "title") => {
    const newSortOrder =
      filter.sortBy === sortBy && filter.sortOrder === "desc" ? "asc" : "desc";
    onFilterChange({ ...filter, sortBy, sortOrder: newSortOrder });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        <button
          onClick={() => onFilterChange({})}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="search"
              value={filter.searchTerm || ""}
              onChange={handleSearchChange}
              placeholder="Search expenses..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            value={filter.category || ""}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label
            htmlFor="dateRange"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Date Range
          </label>
          <select
            id="dateRange"
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Sort By
          </label>
          <div className="flex space-x-2">
            {(["date", "amount", "title"] as const).map((sortOption) => (
              <button
                key={sortOption}
                onClick={() => handleSortChange(sortOption)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter.sortBy === sortOption
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span className="capitalize">{sortOption}</span>
                {filter.sortBy === sortOption &&
                  (filter.sortOrder === "desc" ? (
                    <SortDesc className="h-3 w-3" />
                  ) : (
                    <SortAsc className="h-3 w-3" />
                  ))}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilters;
