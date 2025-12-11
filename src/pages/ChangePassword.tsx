import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { SetPassword } from "../dataAccess/loginDAL";
import useUserStore from "../store/useUserStore";

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const params = new URLSearchParams(location.search);
  const email = params.get("email") ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!email) {
      toast.error("Invalid reset link.");
      navigate("/");
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await SetPassword(email, password);
      if (result) {
        toast.success("Password changed successfully!");
        navigate(`/EditProfile/${user?.userId}`);
      }
    } catch (err) {
      toast.error("Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Set New Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              New Password
            </label>

            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors outline-none 
                ${
                  error
                    ? "border-red-500 dark:border-red-400"
                    : "border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                }
                focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/40
              `}
              placeholder="Enter new password"
            />

            {error && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg 
                hover:bg-blue-700 dark:hover:bg-blue-600 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? "Saving..." : "Submit"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ChangePassword;