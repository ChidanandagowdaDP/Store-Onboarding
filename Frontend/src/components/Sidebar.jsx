import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import {
  User,
  Store,
  PlusSquare,
  LayoutDashboard,
  Users,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const role = Cookies.get("role");

  const [storesOpen, setStoresOpen] = useState(false);

  useEffect(() => {
    if (role === "admin" && location.pathname.startsWith("/admin/home")) {
      setStoresOpen(true);
    }
  }, [location.pathname, role]);

  const isActiveParent = (item) => {
    if (!item.subMenu) return location.pathname === item.path;
    return item.subMenu.some((sub) => location.pathname === sub.path);
  };

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/admin/home/dashboard",
      icon: <LayoutDashboard size={16} />,
    },
    {
      name: "Stores",
      path: "/admin/home",
      icon: <Store size={16} />,
      subMenu: [
        {
          name: "All Stores",
          path: "/admin/home/all",
          icon: <Store size={14} />,
        },
        {
          name: "Approval Pending",
          path: "/admin/home/approval-pending",
          icon: <Clock size={14} />,
        },
        {
          name: "Renewal",
          path: "/admin/home/renewal",
          icon: <Clock size={14} />,
        },
        {
          name: "Amount Pending",
          path: "/admin/home/amount-pending",
          icon: <DollarSign size={14} />,
        },

        {
          name: "Inactive Stores",
          path: "/admin/home/inactive",
          icon: <Store size={14} />,
        },
      ],
    },
    {
      name: "Users",
      path: "/admin/home/users",
      icon: <Users size={16} />,
    },
  ];

  const userMenu = [
    { name: "Profile", path: "/user/home/profile", icon: <User size={16} /> },
    {
      name: "Create Store",
      path: "/user/home/create-store",
      icon: <PlusSquare size={16} />,
    },
    {
      name: "View Stores",
      path: "/user/home/view-stores",
      icon: <Store size={16} />,
    },
  ];

  const menu = role === "admin" ? adminMenu : userMenu;

  return (
    <aside
      className={`fixed top-14 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300
      ${open ? "w-56" : "w-14"}`}
    >
      {/* Header with Settings + Toggle */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-gray-200 ">
        <div className="flex items-center gap-2 text-gray-700">
          <Settings size={16} />
          {open && <span className="text-sm font-medium">Settings</span>}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="hover:bg-gray-200 p-1 rounded"
        >
          {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col text-sm">
        {menu.map((item) => (
          <div key={item.name} className="flex flex-col">
            {/* Parent Item */}
            {item.subMenu ? (
              <div
                onClick={() => setStoresOpen(!storesOpen)}
                className={`flex items-center gap-3 px-3 py-2 mx-2 my-1 rounded-md cursor-pointer transition
                ${
                  isActiveParent(item)
                    ? "bg-blue-900 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {item.icon}
                {open && <span className="font-medium">{item.name}</span>}
              </div>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 mx-2 my-1 rounded-md transition
                ${
                  location.pathname === item.path
                    ? "bg-blue-900 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {item.icon}
                {open && <span className="font-medium">{item.name}</span>}
              </Link>
            )}

            {/* Submenu */}
            {item.subMenu && storesOpen && open && (
              <div className="flex flex-col ml-5">
                {item.subMenu.map((sub) => (
                  <Link
                    key={sub.name}
                    to={sub.path}
                    className={`flex items-center gap-2 px-3 py-1.5 my-1 rounded-md transition
                    ${
                      location.pathname === sub.path
                        ? "bg-blue-800 text-white"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    {sub.icon}
                    <span className="text-xs">{sub.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
