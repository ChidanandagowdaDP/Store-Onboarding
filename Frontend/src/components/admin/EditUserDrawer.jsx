import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { X } from "lucide-react";

export default function EditUserDrawer({ user, onClose, onUpdated }) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    username: "",
    role: "",
  });

  const token = Cookies.get("token");
  const isOpen = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.patch(
        `${BACKEND_URL}/api/users/updateuser/${user._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success(res.data.message);
      onUpdated();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      {/* Background overlay */}
      <div
        className={`fixed inset-0 bg-black/30  duration-300 z-40 ${
          isOpen ? "opacity-0" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-xl
        transform transition-transform duration-500 ease-in-out z-50 flex flex-col
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold text-blue-900">Edit User</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 flex-1 overflow-y-auto">
          <form onSubmit={handleUpdate} className="space-y-5">
            {/* Username */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Username
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="border border-gray-300 w-full p-2 rounded mt-1"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium text-gray-600">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="border border-gray-300 w-full p-2 rounded mt-1"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="bg-blue-900 text-white px-4 py-2 rounded w-full hover:bg-blue-800"
            >
              Update User
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
