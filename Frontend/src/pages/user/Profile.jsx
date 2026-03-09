import Cookies from "js-cookie";
import { UserCircle, Mail, Shield } from "lucide-react";

export default function Profile() {
  const username = Cookies.get("username");
  const role = Cookies.get("role");
  const email = Cookies.get("email");

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Top Banner */}
        <div className="bg-blue-900 h-32 flex items-center justify-center">
          <UserCircle size={80} className="text-white" />
        </div>

        {/* User Info */}
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {username?.toUpperCase()}
          </h2>

          <p className="text-gray-500 mb-6">{role?.toUpperCase()}</p>

          {/* Details */}
          <div className="space-y-4 text-left max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <UserCircle size={18} className="text-blue-900" />
              <span className="font-medium text-gray-700">Username:</span>
              <span className="text-gray-600">{username}</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} className="text-blue-900" />
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-600">{email || "Not Available"}</span>
            </div>

            <div className="flex items-center gap-3">
              <Shield size={18} className="text-blue-900" />
              <span className="font-medium text-gray-700">Role:</span>
              <span className="text-gray-600">{role}</span>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-8">
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
