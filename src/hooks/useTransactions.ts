import { useState, useEffect } from "react";
import { Category, ExpenseFilter, FilterState, Transaction, TransactionFilterPayload } from "../types";
import { AddTransaction, DeleteTransaction, GetCategories, GetTotalTransactionsCount, GetTransactionById, GetTransactions, UpdateTransaction } from "../dataAccess/transactionDAL";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<ExpenseFilter>({});
  const [loading, setLoading] = useState(true);

  const initialTransactionPayload: TransactionFilterPayload = {
    PageNumber: 1,
    PageSize: 10,
    Type: "",
    StartDate: null,
    EndDate: null,
    SortbyColumn: null,
    SortbyOrder: null,
    Filters: {
      title: "",
      description: "",
      categoryName: "",
    } as FilterState
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      let Transactions: Transaction[] = await GetTransactions(initialTransactionPayload);
      setTransactions(Transactions.map(x => {
        return {
          title: x.title,
          amount: x.amount,
          categoryId: x.categoryId,
          categoryName: x.categoryName,
          transactionDate: x.transactionDate,
          type: x.type ?? "",
          description: x.description ?? "",
          createdAt: x.createdAt,
          transactionId: x.transactionId
      } as Transaction}));

      let totalTransactionsCount = await GetTotalTransactionsCount();
      setTotalTransactions(totalTransactionsCount);

      let categories = await GetCategories();
      setCategories(categories);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  const getFilteredTransactions = async (payload: TransactionFilterPayload) => {
      let Transactions: Transaction[] = await GetTransactions(payload);
      setTransactions(Transactions?.map(x => ({ ...x, transactionId: x.transactionId ?? parseInt(Math.random().toString(36).substring(2, 9)) })) ?? []); 
      return Transactions;
  }

  const getTransactionById = async (id: number) => {
      let Transaction: Transaction[] = await GetTransactionById(id);
      return Transaction;
  }

  const addTransaction = async (
    expenseData: Omit<Transaction, "id" | "createdAt" | "updatedAt">
  ) => {
    const newExpense: Transaction = {
      ...expenseData,
      createdAt: new Date().toISOString(),
    };

    const updatedTransactions = [...transactions, newExpense];
    setTransactions(updatedTransactions);
    return await AddTransaction(newExpense);
  };

  const updateTransaction = async (updates: Partial<Transaction>) => {
    const updatedTransaction: Transaction = {
      ... transactions.find(t => t.transactionId === updates.transactionId), 
      ...updates,
      updatedAt: new Date().toISOString()
    } as Transaction;

    const updatedTransactions: Transaction[] = transactions.map((expense) =>
      expense.transactionId === updates.transactionId ? updatedTransaction : expense
    );
    setTransactions(updatedTransactions);
    return await UpdateTransaction(updatedTransaction);
  };

  const deleteTransaction = async (id: number) => {
    const updatedTransactions = transactions.filter((expense) => expense.transactionId !== id);
    setTransactions(updatedTransactions);

    return await DeleteTransaction(id);
  };

  return {
    transactions,
    categories,
    filter,
    loading,
    totalTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getFilteredTransactions
  };
};
