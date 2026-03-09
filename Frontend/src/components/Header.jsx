import { User, LogOut, Key, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../../public/assets/Carture_logo.png";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const profileRef = useRef(null);

  const username = Cookies.get("username") || "User";
  const role = Cookies.get("role") || "User";
  const token = Cookies.get("token");

  const initial = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("role");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/change-password`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);

      setShowPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    }
  };

  return (
    <>
      <header className="h-14 border-2 border-gray-200 rounded flex items-center justify-between px-6 fixed w-full z-50 bg-white">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h-8 object-contain" />
          <span
            className="text-xl font-bold"
            style={{
              background: "linear-gradient(to right, #38bdf8, #1e40af)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Carture
          </span>
        </div>

        {/* Profile Section */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300"
          >
            {/* Avatar */}
            <div className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm font-semibold">
              {initial}
            </div>

            {/* Down Arrow */}
            <ChevronDown size={16} />
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-52 bg-white shadow-2xl border border-gray-200 rounded-lg">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-300">
                <p className="text-sm font-semibold">{username}</p>
                <p className="text-xs text-gray-500">Role : {role}</p>
              </div>

              {/* Change Password */}
              <button
                onClick={() => {
                  setShowPasswordModal(true);
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full"
              >
                <Key size={14} />
                Change Password
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white w-80 rounded-lg shadow-xl p-5">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>

            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="border border-gray-300 w-full p-2 rounded mb-3"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 w-full p-2 rounded mb-3"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 w-full p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleChangePassword}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
