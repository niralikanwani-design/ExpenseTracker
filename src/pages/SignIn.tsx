import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../dataAccess/loginDAL";
import { DecodedToken, LoginModel } from "../types";
import { toast } from "react-toastify";
import useUserStore from "../store/useUserStore";

const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginModel>({
    email : "",
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
      newErrors.email = "email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "password must be at least 6 characters";
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
      // console.log("Submitted:", formData);
      // API call 
      const result = await LoginUser(formData)
      if(result.success){
        const token = result.token;
        const decoded = jwtDecode<DecodedToken>(token);
        setUser({
          userId: decoded.UserId,
          fullName: decoded.FullName,
          email: decoded.Email
        });
        navigate("/Dashboard");
        toast.success(result.message);
      }else{
        toast.error(result.message);
        setFormData({
          email : "",
          password: "",
        })
      }
    } catch (error) {
      toast.error("Invalid credential!");
      console.error(error);
      setFormData({
        email : "",
        password: "",
      })
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Log In</h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email
            </label>

            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 focus:border-blue-500"
              } focus:ring-2 focus:ring-blue-200 outline-none`}
              placeholder="Enter your email"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
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
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 focus:border-blue-500"
              } focus:ring-2 focus:ring-blue-200 outline-none`}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              {isSubmitting ? "Saving..." : "Log In"}
            </button>

            <button
              type="button"
              className="px-6 py-3 border-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              onClick={() => navigate("/SignUp")}
            >
              Sign Up
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SignIn;