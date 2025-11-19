import { Expense, Category, Income } from "../types";
import { ExpenseCategoryData } from "./data";

const EXPENSES_KEY = "expenses";
const INCOMES_KEY = "incomes";
const CATEGORIES_KEY = "categories";

export const storage = {
  getExpenses: (): Expense[] => {
    try {
      const data = localStorage.getItem(EXPENSES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading expenses:", error);
      return [];
    }
  },

  saveExpenses: (expenses: Expense[]): void => {
    try {
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error("Error saving expenses:", error);
    }
  },

  getCategories: (): Category[] => {
    try {
      const data = localStorage.getItem(CATEGORIES_KEY);
      return data ? JSON.parse(data) : getDefaultCategories();
    } catch (error) {
      console.error("Error loading categories:", error);
      return getDefaultCategories();
    }
  },

  saveCategories: (categories: Category[]): void => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error("Error saving categories:", error);
    }
  },

  getIncomes: (): Income[] => {
    try {
      const data = localStorage.getItem(INCOMES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading incomes:", error);
      return [];
    }
  },

  saveIncomes: (incomes: Income[]): void => {
    try {
      localStorage.setItem(INCOMES_KEY, JSON.stringify(incomes));
    } catch (error) {
      console.error("Error saving incomes:", error);
    }
  },
};

const getDefaultCategories = (): Category[] => ExpenseCategoryData;
