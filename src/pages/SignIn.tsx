import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser, LoginWithGoogle } from "../dataAccess/loginDAL";
import { DecodedToken, LoginModel } from "../types";
import { toast } from "react-toastify";
import useUserStore from "../store/useUserStore";
import { GoogleLogin } from "@react-oauth/google";

const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginModel>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const validate = () => {
    let newErrors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const result = await LoginUser(formData);

      if (result.success) {
        const token = result.token;
        localStorage.setItem("__AUTH_TOKEN__", token);

        const decoded = jwtDecode<DecodedToken>(token);
        setUser({
          userId: decoded.UserId,
          fullName: decoded.FullName,
          email: decoded.Email,
        });

        navigate("/Dashboard");
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setFormData({ email: "", password: "" });
      }
    } catch (error) {
      toast.error("Invalid credentials!");
      console.error(error);
      setFormData({ email: "", password: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;

      const result = await LoginWithGoogle(idToken);

      toast.success("Logged in with Google!");

      if (result.token) {
        const decodedToken = jwtDecode<DecodedToken>(result.token);

        setUser({
          userId: decodedToken.UserId,
          fullName: decodedToken.FullName,
          email: decodedToken.Email,
        });
      }

      navigate("/Dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Google Login failed!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="
          bg-white dark:bg-slate-900
          rounded-xl shadow-sm 
          border border-slate-200 dark:border-slate-700 
          p-6 
          transition-colors
        "
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Log In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Email
            </label>

            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`
                w-full px-4 py-3 rounded-lg border outline-none
                bg-white dark:bg-slate-800
                text-slate-900 dark:text-white
                ${errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 dark:border-slate-600 focus:border-blue-500"
                }
                focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700
                transition-colors
              `}
              placeholder="Enter your email"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`
                w-full px-4 py-3 rounded-lg border outline-none
                bg-white dark:bg-slate-800
                text-slate-900 dark:text-white
                ${errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 dark:border-slate-600 focus:border-blue-500"
                }
                focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700
                transition-colors
              `}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                px-6 py-3 
                bg-blue-600 hover:bg-blue-700 
                text-white rounded-lg 
                disabled:opacity-50 
                transition-colors font-medium
              "
            >
              {isSubmitting ? "Saving..." : "Log In"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/signUp")}
              className="
                px-6 py-3 
                border-2 
                rounded-lg 
                transition-colors font-medium
                border-gray-300 dark:border-slate-500
                bg-white dark:bg-slate-800
                text-slate-700 dark:text-white
                hover:bg-gray-200 dark:hover:bg-slate-700
              "
            >
              Sign Up
            </button>
          </div>

          {/* Google Login */}
          <div className="pt-4 flex items-center justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google Login Failed")}
              width="310"
            />
          </div>

        </form>
      </div>
    </div>
  );
};

export default SignIn;
