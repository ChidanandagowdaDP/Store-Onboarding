import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Store,
  Clock,
  CheckCircle,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StoreItem from "../../components/admin/StoreItem";

const Dashboard = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = Cookies.get("token");
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [openSection, setOpenSection] = useState(null);

  const [stats, setStats] = useState({
    totalStores: 0,
    renewalStores: 0,
    approvalPending: 0,
    amountPending: 0,
    inactiveStores: 0,
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/store/getstores`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.stores || [];
      setStores(data);

      setStats({
        totalStores: data.length,

        renewalStores: data.filter(
          (s) => s.isRenewed === true && s.status === "Active",
        ).length,

        approvalPending: data.filter((s) => s.status === "Pending").length,

        amountPending: data.filter(
          (s) =>
            s.status === "Active" &&
            (s.paymentStatus === "Pending" || s.paymentStatus === "Partial"),
        ).length,

        inactiveStores: data.filter((s) => s.status === "Inactive").length,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  /* -------- STORE LISTS -------- */

  const recentStores = [...stores]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const pendingApprovals = stores
    .filter((s) => s.status === "Pending")
    .slice(0, 5);

  const renewalStores = stores
    .filter((s) => s.isRenewed === true && s.status === "Active")
    .slice(0, 5);

  const pendingPayments = stores
    .filter(
      (s) =>
        s.status === "Active" &&
        (s.paymentStatus === "Pending" || s.paymentStatus === "Partial"),
    )
    .slice(0, 5);

  const inactiveStores = stores
    .filter((s) => s.status === "Inactive")
    .slice(0, 5);

  /* -------- DASHBOARD CARDS -------- */

  const cards = [
    {
      title: "Total Stores",
      value: stats.totalStores,
      icon: <Store size={18} />,
      color: "bg-blue-100 text-blue-700",
      path: "/admin/home/all",
    },
    {
      title: "Renewal Stores",
      value: stats.renewalStores,
      icon: <Clock size={18} />,
      color: "bg-yellow-100 text-yellow-700",
      path: "/admin/home/renewal",
    },
    {
      title: "Approval Pending",
      value: stats.approvalPending,
      icon: <CheckCircle size={18} />,
      color: "bg-purple-100 text-purple-700",
      path: "/admin/home/approval-pending",
    },
    {
      title: "Amount Pending",
      value: stats.amountPending,
      icon: <DollarSign size={18} />,
      color: "bg-red-100 text-red-700",
      path: "/admin/home/amount-pending",
    },
    {
      title: "Inactive Stores",
      value: stats.inactiveStores,
      icon: <Store size={18} />,
      color: "bg-gray-200 text-gray-700",
      path: "/admin/home/inactive",
    },
  ];

  return (
    <div className="min-h-screen p-4 bg-white">
      <h1 className="text-xl font-semibold mb-4 text-blue-900">Dashboard</h1>

      {/* -------- TOP CARDS -------- */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-5 flex items-center justify-between shadow-md cursor-pointer hover:shadow-lg transition"
          >
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <h2 className="text-xl font-semibold text-gray-800">
                {card.value}
              </h2>
            </div>

            <div className={`p-3 rounded-full ${card.color}`}>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* -------- COLLAPSIBLE SECTIONS -------- */}

      <div className="space-y-3">
        {/* Recent Stores */}
        <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg">
          <div
            className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection("recent")}
          >
            <span className="font-medium text-blue-900">Recent Stores</span>
            {openSection === "recent" ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </div>

          {openSection === "recent" && (
            <div className="p-3">
              {recentStores.map((store) => (
                <StoreItem key={store._id} store={store} />
              ))}
            </div>
          )}
        </div>

        {/* Renewal Stores */}
        <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg">
          <div
            className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection("renewal")}
          >
            <span className="font-medium text-blue-900">Renewal Stores</span>
            {openSection === "renewal" ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </div>

          {openSection === "renewal" && (
            <div className="p-3">
              {renewalStores.map((store) => (
                <StoreItem key={store._id} store={store} />
              ))}
            </div>
          )}
        </div>

        {/* Pending Approvals */}
        <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg">
          <div
            className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection("approval")}
          >
            <span className="font-medium text-blue-900">Pending Approvals</span>
            {openSection === "approval" ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </div>

          {openSection === "approval" && (
            <div className="p-3">
              {pendingApprovals.map((store) => (
                <StoreItem key={store._id} store={store} />
              ))}
            </div>
          )}
        </div>

        {/* Pending Payments */}
        <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg">
          <div
            className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection("payment")}
          >
            <span className="font-medium text-blue-900">Pending Payments</span>
            {openSection === "payment" ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </div>

          {openSection === "payment" && (
            <div className="p-3">
              {pendingPayments.map((store) => (
                <StoreItem key={store._id} store={store} />
              ))}
            </div>
          )}
        </div>

        {/* Inactive Stores */}
        <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg">
          <div
            className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection("inactive")}
          >
            <span className="font-medium text-blue-900">Inactive Stores</span>
            {openSection === "inactive" ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </div>

          {openSection === "inactive" && (
            <div className="p-3">
              {inactiveStores.map((store) => (
                <StoreItem key={store._id} store={store} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
