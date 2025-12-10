import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginWithGoogle, RegisterUser } from "../dataAccess/loginDAL";
import { toast } from "react-toastify";
import useUserStore from "../store/useUserStore";
import { DecodedToken } from "../types";
import { GoogleLogin } from "@react-oauth/google";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let newErrors: any = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

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

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const data = {
        fullname: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const result = await RegisterUser(data);

      if (result.islogin) {
        const token = result.token;
        const decoded = jwtDecode<DecodedToken>(token);

        setUser({
          userId: decoded.UserId,
          fullName: decoded.FullName,
          email: decoded.Email,
        });

        toast.success(result.message);
        navigate("/Dashboard");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Registration failed");
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
    <div className="max-w-lg mx-auto">
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
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="
                w-full px-4 py-3 rounded-lg border outline-none
                bg-white dark:bg-slate-800
                text-slate-900 dark:text-white
                border-slate-300 dark:border-slate-600 
                focus:border-blue-500 dark:focus:border-blue-400
                focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700
                transition
              "
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="
                w-full px-4 py-3 rounded-lg border outline-none
                bg-white dark:bg-slate-800
                text-slate-900 dark:text-white
                border-slate-300 dark:border-slate-600 
                focus:border-blue-500 dark:focus:border-blue-400
                focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700
                transition
              "
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="
                w-full px-4 py-3 rounded-lg border outline-none
                bg-white dark:bg-slate-800
                text-slate-900 dark:text-white
                border-slate-300 dark:border-slate-600 
                focus:border-blue-500 dark:focus:border-blue-400
                focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700
                transition
              "
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="
                w-full px-4 py-3 rounded-lg border outline-none
                bg-white dark:bg-slate-800
                text-slate-900 dark:text-white
                border-slate-300 dark:border-slate-600 
                focus:border-blue-500 dark:focus:border-blue-400
                focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700
                transition
              "
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-center space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                px-6 py-3 
                bg-blue-600 text-white 
                rounded-lg 
                hover:bg-blue-700 
                disabled:opacity-50
                transition
              "
            >
              {isSubmitting ? "Saving..." : "Sign Up"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/SignIn")}
              className="
                px-6 py-3 
                border-2 rounded-lg 
                bg-white dark:bg-slate-800
                border-gray-300 dark:border-slate-500
                text-slate-700 dark:text-white
                hover:bg-gray-200 dark:hover:bg-slate-700
                transition
              "
            >
              Login
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

export default SignUp;