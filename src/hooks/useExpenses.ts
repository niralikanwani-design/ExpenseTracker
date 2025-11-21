import { useState, useEffect } from "react";
import { storage } from "../utils/storage";
import { Category, ExpenseFilter, FilterState, Transaction, TransactionFilterPayload } from "../types";
import { AddTransaction, GetTransactions, UpdateTransaction } from "../dataAccess/transactionDAL";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<ExpenseFilter>({});
  const [loading, setLoading] = useState(true);

  const initialTransactionPayload: TransactionFilterPayload = {
    PageNumber: 1,
    PageSize: 10,
    Type: "Expense",
    StartDate: null,
    EndDate: null,
    SortbyColumn: null,
    SortbyOrder: null,
    Filters: {
      title: "",
      description: "",
      categoryId: "",
    } as FilterState
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      // const loadedExpenses = storage.getExpenses();
      const loadedCategories = storage.getCategories();

      let Transactions: Transaction[] = await GetTransactions(initialTransactionPayload);
      console.log(Transactions);
      setExpenses(Transactions.map(x => {
        return {
          title: x.title,
          amount: x.amount,
          categoryId: x.categoryId,
          transactionDate: x.transactionDate,
          description: x.description ?? "",
          createdAt: x.createdAt,
          transactionId: x.transactionId
      } as Transaction
      setTotalExpenses(Transactions.length);
    }));

      // setExpenses(loadedExpenses);
      setCategories(loadedCategories);

      // Save categories if they were defaults
      if (loadedCategories.length === 8) {
        storage.saveCategories(loadedCategories);
      }

      setLoading(false);
    };

    loadInitialData();
  }, []);

  const getFilteredTransactions = async (payload: TransactionFilterPayload) => {
      let Transactions: Transaction[] = await GetTransactions(payload);
      setExpenses(Transactions?.map(x => ({ ...x, transactionId: x.transactionId ?? parseInt(Math.random().toString(36).substring(2, 9)) })) ?? []); 
      console.log(Transactions);
      return Transactions;
  }

  const addExpense = async (
    expenseData: Omit<Transaction, "id" | "createdAt" | "updatedAt">
  ) => {
    const newExpense: Transaction = {
      ...expenseData,
      createdAt: new Date().toISOString(),
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    // storage.saveExpenses(updatedExpenses);
    await AddTransaction(newExpense);
  };

  const updateExpense = async (id: number, updates: Partial<Transaction>) => {
    let updatedExpense: Transaction | undefined;

    const updatedExpenses = expenses.map(expense => {
      if ((expense.transactionId ?? 0) === id) {
        updatedExpense = { ...expense, ...updates };
        return updatedExpense;
      }
      return expense;
    });

    setExpenses(updatedExpenses);
    // storage.saveExpenses(updatedExpenses);
    await UpdateTransaction(updatedExpense);
  };

  const deleteExpense = (id: number) => {
    const updatedExpenses = expenses.filter((expense) => expense.transactionId !== id);
    setExpenses(updatedExpenses);
    storage.saveExpenses(updatedExpenses);
  };

  return {
    expenses,
    categories,
    filter,
    loading,
    totalExpenses,
    setFilter,
    addExpense,
    updateExpense,
    deleteExpense, // Keep deleteExpense as it might be client-side or call a specific delete API
    getFilteredTransactions
  };
};
