import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  const [formData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        email: "",
        password: "",
      };
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Log In</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.email}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${"border-slate-300 focus:border-blue-500 focus:ring-blue-200"} focus:outline-none focus:ring-2`}
              placeholder="Enter income title"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${"border-slate-300 focus:border-blue-500 focus:ring-blue-200"} focus:outline-none focus:ring-2`}
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Log In</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="flex items-center space-x-2 px-6 py-3 border-2 border-black-50 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              onClick={() => {navigate("/Auth/SignUp")}}
            >
                <span>Sign Up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
