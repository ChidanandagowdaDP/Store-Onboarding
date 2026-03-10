import React, { useEffect, useState } from "react";
import { X, Pencil } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function SideStorePanel({ store, open, onClose, refresh }) {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("store");
  const [editingField, setEditingField] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [storeData, setStoreData] = useState(store);

  const token = Cookies.get("token");

  const dateFields = ["goLiveDate", "billingStartDate", "renewalDate"];

  const amountFields = [
    "oneYearCharges",
    "renewalAmount",
    "systemAmount",
    "receivedAmount",
  ];

  const fieldTypes = {
    storeType: {
      type: "select",
      options: ["CL2", "CL7", "CL9"],
    },
    laneAvailable: {
      type: "select",
      options: ["Yes", "No"],
    },
    systemRequired: {
      type: "select",
      options: ["Yes", "No"],
    },
    paymentStatus: {
      type: "select",
      options: ["Pending", "Partial", "Received"],
    },
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => setVisible(true), 10);
      setActiveTab("store");
    } else {
      setVisible(false);
    }
  }, [open]);

  useEffect(() => {
    setStoreData(store);
  }, [store]);

  if (!store && !open) return null;

  const editableFields = [
    "groupName",
    "storeName",
    "address",
    "district",
    "geoAddress",
    "pincode",
    "storeType",
    "ownerName",
    "ownerMobile",
    "ownerEmail",
    "cashierName",
    "cashierMobile",
    "oneYearCharges",
    "renewalAmount",
    "systemAmount",
    "leadGivenBy",
    "ksbclId",
    "ksbclPassword",
    "goLiveDate",
    "billingStartDate",
    "receivedAmount",
    "systemRequired",
  ];

  const tabs = {
    store: {
      label: "Store Info",
      fields: [
        "groupName",
        "storeName",
        "address",
        "district",
        "geoAddress",
        "pincode",
        "storeType",
        "goLiveDate",
        "billingStartDate",
        "renewalDate",
      ],
    },
    owner: {
      label: "Owner & Credentials",
      fields: [
        "ownerName",
        "ownerMobile",
        "ownerEmail",
        "cashierName",
        "cashierMobile",
        "ksbclId",
        "ksbclPassword",
      ],
    },
    charges: {
      label: "Charges",
      fields: [
        "oneYearCharges",
        "renewalAmount",
        "systemRequired",
        "systemAmount",
        "paymentStatus",
        "receivedAmount",
        "pendingAmount",
        "leadGivenBy",
      ],
    },
  };

  const formatValue = (key, value) => {
    if (!value) return "-";

    if (
      [
        "oneYearCharges",
        "renewalAmount",
        "systemAmount",
        "receivedAmount",
        "pendingAmount",
      ].includes(key)
    )
      return `₹ ${value}`;

    if (dateFields.includes(key)) {
      return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    return value;
  };

  const startEdit = (key, value) => {
    if (dateFields.includes(key)) {
      setEditedValue(value ? value.slice(0, 10) : "");
    } else {
      setEditedValue(value || "");
    }
    setEditingField(key);
  };

  const saveField = async (key) => {
    try {
      let res;

      if (key === "receivedAmount") {
        const payAmount = Number(editedValue);

        if (!payAmount || payAmount <= 0) {
          return toast.error("Enter valid amount");
        }

        if (payAmount > storeData.pendingAmount) {
          return toast.error(
            `Amount cannot exceed pending amount ₹${storeData.pendingAmount}`,
          );
        }

        res = await axios.patch(
          `${BACKEND_URL}/api/store/updatepayment/${storeData._id}`,
          { receivedAmount: payAmount },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        res = await axios.patch(
          `${BACKEND_URL}/api/store/updatestore/${storeData._id}`,
          { [key]: editedValue },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }

      toast.success(res.data.message || "Updated successfully");

      if (res.data.store) {
        setStoreData(res.data.store);
      }

      setEditingField(null);

      if (refresh) refresh();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  const deactivateStore = async () => {
    try {
      const confirmDeactivate = window.confirm(
        "Are you sure you want to deactivate this store?",
      );

      if (!confirmDeactivate) return;

      const res = await axios.patch(
        `${BACKEND_URL}/api/store/updatestore/${storeData._id}`,
        { status: "Inactive" },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(res.data.message || "Store deactivated");

      if (res.data.store) {
        setStoreData(res.data.store);
      }

      if (refresh) refresh();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to deactivate");
    }
  };

  const renderField = (key) => {
    const value = storeData?.[key];

    if (value === undefined || value === null || value === "") return null;

    const isEditable = editableFields.includes(key);
    const isChanged = editedValue !== value;

    return (
      <div
        key={key}
        className="bg-gray-50 border border-gray-300 rounded-md p-3 flex flex-col gap-1"
      >
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-gray-500 capitalize">
            {key.replace(/([A-Z])/g, " $1")}
          </span>

          {isEditable && editingField !== key && (
            <Pencil
              size={14}
              className="cursor-pointer text-gray-400 hover:text-blue-900"
              onClick={() => startEdit(key, value)}
            />
          )}
        </div>

        {editingField === key ? (
          <div className="flex gap-2 mt-1 items-center">
            {fieldTypes[key]?.type === "select" ? (
              <select
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
              >
                {fieldTypes[key].options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={
                  dateFields.includes(key)
                    ? "date"
                    : amountFields.includes(key)
                      ? "number"
                      : "text"
                }
                value={
                  dateFields.includes(key)
                    ? editedValue?.slice(0, 10)
                    : editedValue
                }
                onChange={(e) => setEditedValue(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:border-blue-900"
              />
            )}

            {isChanged && (
              <button
                onClick={() => saveField(key)}
                className="px-2 py-1 text-xs border border-gray-300 bg-blue-900 text-white rounded"
              >
                Save
              </button>
            )}
          </div>
        ) : (
          <span className="text-sm font-medium text-gray-800">
            {formatValue(key, value)}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[520px] bg-white shadow-xl border-l border-gray-300
      transform transition-transform duration-500 z-50 flex flex-col
      ${visible ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex justify-between items-center border-b border-gray-300 px-4 py-3">
        <h2 className="font-semibold text-blue-900 text-base">Store Details</h2>

        <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>

      <div className="flex border-b border-gray-300">
        {Object.entries(tabs).map(([key, tab]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === key
                ? "text-blue-900 border-b-2 border-blue-900 bg-gray-50"
                : "text-gray-500 hover:text-blue-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-3 overflow-y-auto flex-1">
        <div className="grid grid-cols-2 gap-3">
          {tabs[activeTab].fields.map((key) => renderField(key))}
        </div>
      </div>

      {/* Deactivate Button */}
      <div className=" border-gray-300 p-4">
        {storeData?.status !== "Inactive" &&
          storeData?.status !== "Pending" && (
            <button
              onClick={deactivateStore}
              className="w-fit p-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm font-medium transition"
            >
              Deactivate Store
            </button>
          )}
      </div>
    </div>
  );
}
