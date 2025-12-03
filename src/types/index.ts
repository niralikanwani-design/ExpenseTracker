// export interface Expense {
//   id: string | null;
//   title: string;
//   amount: number;
//   category: string;
//   date: string;
//   description?: string;
//   createdAt: string;
//   updatedAt: string;
//   type: string | null;
// }

import { ReactNode } from "react";

export interface Transaction {
  userId?: number;
  title: string | null;
  transactionId: number | null;
  categoryId: number;
  categoryName?: string | null | undefined;
  accountTypeId : number;
  accpuntTypeName? : string | null | undefined;
  amount: number;
  type: string | null;
  description: string | null;
  transactionDate: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface FilterState {
  title: string | null;
  description: string | null;
  categoryName: string  | null;
  startDate: string  | null;
  endDate: string  | null;
  amount: number | null | undefined;
  type: string | null;
}

export interface SortState {
  sortByColumn: string | null;
  sortByOrder: string | null;
}

export interface TransactionFilterPayload {
  PageNumber: number
  PageSize:  number
  Type:  string | null
  StartDate:  string  | null
  EndDate: string  | null
  SortbyColumn:  string | null
  SortbyOrder:  string | null
  Filters: FilterState
}

export interface Income {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  categoryId: number;
  name: string;
  type: "Income" | "Expense";
  userId: number;
}

export interface AccountType {
  accountId : number;
  accountName : string;
  accountType : string;
}

export interface ExpenseFilter {
  categoryId?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
  sortBy?: "date" | "amount" | "title";
  sortOrder?: "asc" | "desc";
}

export interface IncomeFilter {
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
  sortBy?: "date" | "amount" | "title";
  sortOrder?: "asc" | "desc";
}

export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  averageExpense: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    count: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
  }>;
}

export interface IncomeStats {
  totalIncomes: number;
  totalAmount: number;
  averageIncome: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    count: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
  }>;
}

export interface LoginModel {
  email : string;
  password : string;
}

export interface RegisterModel {
  fullname : string,
  email : string,
  password : string
}

export interface User {
  userId: string | number;
  fullName: string;
  email: string;
}

export interface UserStore {
  user: User | null;
  setUser: (userData: User) => void;
  logout: () => void;
}

export interface DecodedToken {
  UserId: string | number;
  Email: string;
  FullName: string;
  exp: number;
} 

 export interface DashboardData {
  totalExpenses : number;
  numberofExpenses : number;
  averageExpense : number;
  expenseCategoriesUsed : number;
  last30DaysTotal : number;
  last30DaysAverage : number;
 }

 export interface CategoryData {
  categoryId : number;
  categoryName : string;
  totalAmount : number;
  percentage : number;
 }

 export interface MonthlyData {
  month : string;
  totalAmount : number;
 }

 export interface QuickInsight {
  highestCategory : string;
  hightestCategoryAmount : number;
  totalAmount : number;
  dailyAverage : number;
 }

 export interface CategoryList {
  categoryId : number;
  categoryName : string
 }

 export interface GoogleAuthWrapperProps {
  children: ReactNode;
}