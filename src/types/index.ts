export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  type: string | null;
}

export interface Transaction {
  categoryId: number;
  amount: number;
  type: string | null;
  description: string | null;
  transactionDate: string;
  createdAt: string;
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
  id: string;
  name: string;
  color: string;
  icon: string;
  subCategory: SubCategory[];
}

export interface ExpenseFilter {
  category?: string;
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