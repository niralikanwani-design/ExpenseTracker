import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChangePasswordAPI, EditUserData, GetUserData } from "../dataAccess/loginDAL";
import { toast } from "react-toastify";

const EditProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    totalbalance: "",
    maxlimit: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    totalbalance: "",
    maxlimit: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const result = await GetUserData(id ?? "");
    setEmail(result.email);
    setFormData({
      name: result.fullName,
      email: result.email,
      totalbalance: result.totalBalance,
      maxlimit: result.maxLimit,
    });
  };

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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const data = {
        userId: id ? Number(id) : 0,
        fullname: formData.name,
        email: formData.email,
        totalbalance: Number(formData.totalbalance),
        maxlimit: Number(formData.maxlimit),
      };

      const result = await EditUserData(data);
      toast.success(result);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendPasswordMail = async () => {
    const result = await ChangePasswordAPI(email);
    if (result) {
      toast.success("Password reset email sent");
    }
    setShowModal(false);
  };

  return (
    <div className="max-w-lg mx-auto">

      {/* MAIN CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 
              bg-white dark:bg-slate-800 text-slate-900 dark:text-white
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none"
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 
              bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Total Balance
            </label>
            <input
              type="text"
              name="totalbalance"
              value={formData.totalbalance}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 
              bg-white dark:bg-slate-800 text-slate-900 dark:text-white
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Max Limit
            </label>
            <input
              type="text"
              name="maxlimit"
              value={formData.maxlimit}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 
              bg-white dark:bg-slate-800 text-slate-900 dark:text-white
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none"
            />
          </div>

          <div
            className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-slate-800 
            border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer 
            hover:bg-gray-200 dark:hover:bg-slate-700 transition"
            onClick={() => setShowModal(true)}
          >
            <span className="text-yellow-500 text-xl">🔒</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Change Password
            </span>
          </div>

          <div className="flex justify-center space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 
              text-slate-700 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">

            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Change Password
            </h2>

            <p className="text-gray-600 dark:text-slate-300 mb-6">
              A password reset link will be sent to {email}. Please check your inbox.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 
                text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={handleSendPasswordMail}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                OK
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default EditProfile;