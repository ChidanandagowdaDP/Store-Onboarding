import React, { useEffect, useState } from "react";
import { X, Trash2, CheckCircle } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function StoreDetailPanel({
  store,
  open,
  onClose,
  onDelete,
  onActivated,
}) {
  const [visible, setVisible] = useState(false);
  const [storeIdInput, setStoreIdInput] = useState("");

  const token = Cookies.get("token");
  const role = Cookies.get("role"); // get role from cookies
  const isAdmin = role?.toLowerCase() === "admin";

  useEffect(() => {
    if (open) {
      setTimeout(() => setVisible(true), 10);
      setStoreIdInput("");
    } else {
      setVisible(false);
    }
  }, [open]);

  if (!store && !open) return null;

  const sections = [
    {
      title: "Store Info",
      fields: [
        "groupName",
        "storeName",
        "address",
        "district",
        "geoAddress",
        "pincode",
        "storeType",
        "goLiveDate",
      ],
    },
    {
      title: "Owner Info",
      fields: ["ownerName", "ownerMobile", "ownerEmail"],
    },
    {
      title: "Store Credentials",
      fields: ["ksbclId", "ksbclPassword"],
    },
    {
      title: "Charges & Lead",
      fields: [
        "oneYearCharges",
        "renewalAmount",
        "systemRequired",
        "systemAmount",
        "leadGivenBy",
        "laneAvailable",
        "lanes",
      ],
    },
  ];

  const formatValue = (key, value) => {
    if (value === null || value === undefined || value === "") return "-";

    if (["oneYearCharges", "renewalAmount", "systemAmount"].includes(key))
      return `₹ ${value}`;

    if (key === "goLiveDate") return new Date(value).toLocaleDateString();

    if (typeof value === "object")
      return value.username || JSON.stringify(value);

    return value;
  };

  const activateStore = async () => {
    if (!storeIdInput) {
      toast.error("Please enter Store ID");
      return;
    }

    try {
      const res = await axios.patch(
        `${BACKEND_URL}/api/store/updatestore/${store._id}`,
        {
          storeId: storeIdInput,
          status: "Active",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(res.data.message);

      if (onActivated) onActivated();
      onClose();
    } catch (error) {
      console.error(error);
      const msg = err.response?.data?.message || "Failed to Activate store";
      toast.error(msg);
    }
  };

  return (
    <>
      {/* Overlay */}
      {open && <div className="fixed  z-40" onClick={onClose} />}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-xl border border-gray-300
        transform transition-transform duration-500 ease-in-out z-50 flex flex-col
        ${visible ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-gray-300 px-4 py-3">
          <h2 className="font-semibold text-blue-900 text-base">
            Store Details
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="px-4 py-3 overflow-y-auto flex-1 space-y-4">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-blue-900 mb-2 border-b border-gray-300 pb-1">
                {section.title}
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {section.fields.map((key) => {
                  const value = store[key];

                  if (value === undefined || value === null || value === "")
                    return null;

                  return (
                    <div
                      key={key}
                      className="flex flex-col bg-gray-50 border border-gray-300 rounded px-2 py-1"
                    >
                      <span className="text-[11px] text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>

                      <span className="text-xs font-medium text-gray-800">
                        {formatValue(key, value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* STORE ID VISIBLE TO USER WHEN ACTIVE */}
          {store?.status?.toLowerCase() === "active" && store?.storeId && (
            <div className="pt-2 border-t border-gray-300">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Store ID
              </h3>

              <div className="bg-green-50 border border-green-300 text-green-800 rounded px-3 py-2 text-sm font-semibold">
                {store.storeId}
              </div>
            </div>
          )}

          {/* ADMIN CONTROLS */}
          {isAdmin && store?.status?.toLowerCase() === "pending" && (
            <div className="pt-3 border-t border-gray-300">
              <label className="text-sm font-medium text-gray-700">
                Assign Store ID
              </label>

              <input
                type="text"
                value={storeIdInput}
                onChange={(e) => setStoreIdInput(e.target.value)}
                placeholder="Enter Store ID"
                className="w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
              />

              <button
                onClick={activateStore}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm"
              >
                <CheckCircle size={16} />
                Activate Store
              </button>
            </div>
          )}

          {/* DELETE BUTTON (ADMIN ONLY) */}
          {isAdmin &&
            store?.status?.toLowerCase() === "pending" &&
            typeof onDelete === "function" && (
              <div className="pt-2 flex justify-end">
                <button
                  className="px-3 py-1.5 bg-red-500 text-white rounded text-xs flex items-center gap-1 hover:bg-red-600 transition"
                  onClick={() => onDelete(store)}
                >
                  <Trash2 size={14} />
                  Reject
                </button>
              </div>
            )}
        </div>
      </div>
    </>
  );
}
