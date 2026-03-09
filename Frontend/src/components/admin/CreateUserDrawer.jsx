import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import FormSection from "../../components/user/FormSection";
import InputField from "../../components/user/InputField";
import SelectField from "../../components/user/SelectField";

export default function CreateUserDrawer({ open, onClose, onUserCreated }) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const initialState = {
    username: "",
    password: "",
    confirmPassword: "",
    role: "user",
  };

  const [formData, setFormData] = useState(initialState);
  const [modalVisible, setModalVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const token = Cookies.get("token");

      const response = await axios.post(
        `${BACKEND_URL}/api/auth/user/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(response.data?.message || "User created successfully");

      if (response.status === 201) {
        setModalVisible(true);
        setFormData(initialState);

        if (onUserCreated) {
          onUserCreated();
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div
        className="fixed top-0 right-0 h-full w-2/5 bg-white shadow-xl transform transition-transform duration-500 ease-in-out z-50 flex flex-col"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="font-semibold text-lg text-blue-900">Create User</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection title="Account Details">
              <div className="grid grid-cols-1 gap-4">
                <InputField
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <SelectField
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={["user", "admin"]}
                />
              </div>
            </FormSection>

            {/* Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
