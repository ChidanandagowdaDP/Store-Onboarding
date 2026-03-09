import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (token && role) {
      if (role === "admin") navigate("/admin/home", { replace: true });
      else navigate("/user/home", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        username,
        password,
      });

      const data = res.data;

      Cookies.set("token", data.token, { expires: 1 });
      Cookies.set("username", data.user.username, { expires: 1 });
      Cookies.set("role", data.user.role, { expires: 1 });

      toast.success(data.message || "Login successful!");

      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin/home", { replace: true });
        } else {
          navigate("/user/home", { replace: true });
        }
      }, 1000);
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* MAIN CARD */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* LEFT SIDE */}
        <div className="hidden md:flex md:w-1/2 relative bg-gray-50 items-center justify-center p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative text-center z-10">
            <img
              src="/assets/Carture_logo.png"
              alt="Carture Logo"
              className="h-9 mx-auto mb-3"
            />

            <h1 className="text-lg font-bold text-blue-900 tracking-wide">
              CARTURE
            </h1>

            <p className="text-xs text-gray-600 mt-3 max-w-xs mx-auto">
              Powering the future of alcohol retail through intelligent billing,
              consumer loyalty, and data-driven insights.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-8">
          {/* Mobile Logo */}
          <img
            src="/assets/Carture_logo.png"
            alt="Carture Logo"
            className="h-8 mb-5 md:hidden mx-auto"
          />

          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-1 text-center md:text-left">
            Welcome Back
          </h2>

          <p className="text-gray-500 text-xs mb-6 text-center md:text-left">
            Your gateway to retail intelligence.
          </p>

          {/* USERNAME */}
          <div className="mb-4">
            <label className="text-xs text-gray-600">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-5">
            <label className="text-xs text-gray-600">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />

              {showPassword ? (
                <EyeOff
                  className="absolute right-3 top-3 text-gray-400 w-4 h-4 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  className="absolute right-3 top-3 text-gray-400 w-4 h-4 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-900 text-white py-2.5 rounded-lg text-sm hover:bg-blue-800 transition"
          >
            Sign in
          </button>

          {/* FORGOT PASSWORD */}
          <p className="text-teal-500 text-xs mt-5 cursor-pointer hover:underline text-center md:text-left">
            Forgot password?
          </p>
        </div>
      </div>
      {/* Toast container must be inside your component */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
        toastStyle={{
          fontSize: "12px",
          minHeight: "35px",
          padding: "6px 10px",
        }}
      />
    </div>
  );
}
