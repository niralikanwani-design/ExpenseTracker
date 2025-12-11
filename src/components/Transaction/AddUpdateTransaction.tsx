import React, { useEffect, useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { useTransactions } from "../../hooks/useTransactions";
import { Transaction } from "../../types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "../../store/useUserStore";

const AddUpdateTransaction: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { id } = useParams();

  const type = location.state?.type || "Expense";
  const userId = parseInt(user?.userId.toString() ?? "0");

  userId || navigate("/SignIn");

  const editingTransactionId = id ? parseInt(id) : null;
  const isNewTransaction = !editingTransactionId;

  const {
    addTransaction,
    updateTransaction,
    categories,
    accountType,
    transactions,
  } = useTransactions();

  const editingTransaction = isNewTransaction
    ? null
    : transactions.find((t) => t.transactionId === editingTransactionId);

  const [formData, setFormData] = useState({
    title: "",
    amount: 0,
    category: 0,
    date: new Date().toISOString().split("T")[0],
    accountType: 0,
    description: "",
    type: type,
    useId: userId,
  });

  const onClose = () => {
    navigate(`/transactions`);
  };

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        title: editingTransaction?.title || "",
        amount: editingTransaction?.amount ?? 0,
        category: editingTransaction?.categoryId ?? 0,
        accountType: editingTransaction?.accountTypeId ?? 0,
        date: editingTransaction?.transactionDate
          ? new Date(editingTransaction.transactionDate)
              .toISOString()
              .split("T")[0]
          : new Date().toISOString().split("T")[0],
        description: editingTransaction?.description || "",
        type: type,
        useId: userId,
      });
    }
  }, [editingTransaction]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";

    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Amount must be greater than 0";

    if (!formData.category || formData.category === 0)
      newErrors.category = "Category is required";

    if (!formData.date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const expenseData: Transaction = {
        transactionId: editingTransaction ? editingTransaction.transactionId : null,
        title: formData.title,
        amount: parseFloat(formData.amount.toString()),
        categoryId: formData.category,
        transactionDate: formData.date,
        description: formData.description.trim(),
        createdAt: Date.UTC.toString(),
        type: formData.type as "Expense" | "Income",
        userId: userId,
        accountTypeId: formData.accountType,
      };

      const result = editingTransaction
        ? await updateTransaction(expenseData)
        : await addTransaction(expenseData);

      if (result === true) toast.success("Transaction saved successfully!");

      onClose();
    } catch (error) {
      console.error("Error saving transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {editingTransaction ? `Edit ${type}` : `Add New ${type}`}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 dark:text-slate-300 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors 
                ${
                  errors.title
                    ? "border-red-300 dark:border-red-500"
                    : "border-slate-300 dark:border-slate-600"
                }
              `}
              placeholder="Enter title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors 
                  ${
                    errors.amount
                      ? "border-red-300 dark:border-red-500"
                      : "border-slate-300 dark:border-slate-600"
                  }
                `}
                placeholder="0.00"
                step="0.01"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    category: parseInt(e.target.value),
                  }));
                  handleChange(e);
                }}
                className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors 
                  ${
                    errors.category
                      ? "border-red-300 dark:border-red-500"
                      : "border-slate-300 dark:border-slate-600"
                  }
                `}
              >
                <option value="0">Select a category</option>
                {categories
                  .filter((x) => x.type === type)
                  .map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors 
                  ${
                    errors.date
                      ? "border-red-300 dark:border-red-500"
                      : "border-slate-300 dark:border-slate-600"
                  }
                `}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* ACCOUNT TYPE */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Type
              </label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors 
                  ${
                    errors.type
                      ? "border-red-300 dark:border-red-500"
                      : "border-slate-300 dark:border-slate-600"
                  }
                `}
              >
                <option value="0">Select a Type</option>
                {accountType
                  .filter((x) => x.accountType === type)
                  .map((account) => (
                    <option key={account.accountId} value={account.accountId}>
                      {account.accountName}
                    </option>
                  ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-200 dark:focus:ring-blue-800/40 focus:outline-none focus:ring-2 transition-colors"
              placeholder="Add additional details..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  {editingTransaction ? (
                    <Save className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  <span>{editingTransaction ? `Update ${type}` : `Add ${type}`}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUpdateTransaction;