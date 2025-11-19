import { useState, useEffect } from "react";
import { Expense, Category, ExpenseFilter, ExpenseStats, Transaction } from "../types";
import { storage } from "../utils/storage";
import { GetTransactions } from "../dataAccess/transactionDAL";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<ExpenseFilter>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // const loadedExpenses = storage.getExpenses();
      const loadedCategories = storage.getCategories();

      let Transactions: Transaction[] = await GetTransactions();
      console.log(Transactions);
      setExpenses(Transactions.map(x => {
        return {
          title: x.description ?? "", 
          amount: x.amount,
          category: String(x.categoryId),
          date: x.transactionDate,
          description: x.description ?? "",
          createdAt: x.createdAt,
          updatedAt: x.createdAt
      } as Expense
    }));

      // setExpenses(loadedExpenses);
      setCategories(loadedCategories);

      // Save categories if they were defaults
      if (loadedCategories.length === 8) {
        storage.saveCategories(loadedCategories);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const addExpense = (
    expenseData: Omit<Expense, "id" | "createdAt" | "updatedAt">
  ) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    storage.saveExpenses(updatedExpenses);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === id
        ? { ...expense, ...updates, updatedAt: new Date().toISOString() }
        : expense
    );
    setExpenses(updatedExpenses);
    storage.saveExpenses(updatedExpenses);
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
    storage.saveExpenses(updatedExpenses);
  };

  const getFilteredExpenses = (): Expense[] => {
    return expenses
      .filter((expense) => {
        // Category filter
        if (filter.category && expense.category !== filter.category) {
          return false;
        }

        // Date range filter
        if (filter.dateRange) {
          const expenseDate = new Date(expense.date);
          const startDate = new Date(filter.dateRange.start);
          const endDate = new Date(filter.dateRange.end);
          if (expenseDate < startDate || expenseDate > endDate) {
            return false;
          }
        }

        // Search filter
        if (filter.searchTerm) {
          const searchTerm = filter.searchTerm.toLowerCase();
          return (
            expense.title.toLowerCase().includes(searchTerm) ||
            expense.description?.toLowerCase().includes(searchTerm) ||
            expense.category.toLowerCase().includes(searchTerm)
          );
        }

        return true;
      })
      .sort((a, b) => {
        const { sortBy = "date", sortOrder = "desc" } = filter;
        let aValue, bValue;

        switch (sortBy) {
          case "amount":
            aValue = a.amount;
            bValue = b.amount;
            break;
          case "title":
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          default:
            aValue = new Date(a.date);
            bValue = new Date(b.date);
        }

        if (sortOrder === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
  };

  const getExpenseStats = (): ExpenseStats => {
    const filteredExpenses = getFilteredExpenses();
    const totalExpenses = filteredExpenses.length;
    const totalAmount = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const averageExpense = totalAmount / totalExpenses || 0;

    // Category breakdown
    const categoryTotals = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const categoryBreakdown = Object.entries(categoryTotals).map(
      ([category, amount]) => ({
        category,
        amount,
        count: filteredExpenses.filter((e) => e.category === category).length,
        percentage: (amount / totalAmount) * 100 || 0,
      })
    );

    // Monthly trend (last 6 months)
    const monthlyTrend = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthExpenses = filteredExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === date.getMonth() &&
          expenseDate.getFullYear() === date.getFullYear()
        );
      });

      monthlyTrend.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        amount: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      });
    }

    return {
      totalExpenses,
      totalAmount,
      averageExpense,
      categoryBreakdown,
      monthlyTrend,
    };
  };

  return {
    expenses,
    categories,
    filter,
    loading,
    setFilter,
    addExpense,
    updateExpense,
    deleteExpense,
    getFilteredExpenses,
    getExpenseStats,
  };
};
