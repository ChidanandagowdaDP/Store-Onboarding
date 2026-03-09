import Cookies from "js-cookie";
import { UserCircle, Shield, Calendar, Activity } from "lucide-react";

export default function Profile() {
  const username = Cookies.get("username");
  const role = Cookies.get("role");

  const firstLetter = username ? username.charAt(0).toUpperCase() : "U";

  return (
    <div className="w-full px-1">
      {/* Profile Card */}
      <div className="bg-white rounded-md shadow-xl overflow-hidden">
        {/* Smaller Top Gradient Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-600 h-20"></div>

        {/* Avatar */}
        <div className="flex justify-center -mt-10">
          <div className="w-20 h-20 rounded-full bg-blue-900 text-white flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-white">
            {firstLetter}
          </div>
        </div>

        {/* Content */}
        <div className="text-center mt-4 px-6 pb-8">
          {/* Role Badge */}
          <div className="mt-2 mb-6">
            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">
              {role?.toUpperCase()}
            </span>
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-gray-300"></div>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-xl mx-auto">
            <div className="flex items-center gap-3">
              <UserCircle size={18} className="text-blue-900" />
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium text-gray-800">{username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield size={18} className="text-blue-900" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium text-gray-800">{role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-blue-900" />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium text-gray-800">2025</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Activity size={18} className="text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-gray-300"></div>

          {/* Motivational Section */}
          <div className="text-gray-600 text-sm space-y-2">
            <p>🚀 Stay consistent and keep improving every day.</p>
            <p>💡 Small progress today leads to big achievements tomorrow.</p>
            <p>🔥 Your dedication is building something great.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
