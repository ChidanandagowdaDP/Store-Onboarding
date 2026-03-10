import React from "react";

export default function AmountPendingStoreItem({ store, onUpdate }) {
  const getStatusColor = (status) => {
    if (status === "Pending") return "text-red-600";
    if (status === "Partial") return "text-yellow-600";
    if (status === "Recived") return "text-green-600";
    return "text-gray-600";
  };

  return (
    <div className="border border-gray-300 p-3 mb-1 rounded-md text-sm flex w-full">
      <div className="flex w-full items-center">
        {/* Store Name + Address */}
        <div className="flex-[3]">
          <div className="font-semibold text-gray-800">{store.storeName}</div>
          <div className="text-xs text-gray-500">{store.address}</div>
        </div>

        {/* Onboarded By */}
        <div className="flex-[2] text-center text-xs text-gray-500">
          {store.onboardedBy?.username || "Unknown"}
        </div>

        {/* Payment Status */}
        <div
          className={`flex-[2] text-center text-xs font-semibold ${getStatusColor(
            store.paymentStatus,
          )}`}
        >
          {store.paymentStatus}
        </div>

        {/* Action */}
        <div className="flex-[1] text-center">
          <button
            onClick={() => onUpdate(store)}
            className="px-3 py-2 text-xs bg-blue-900 text-white rounded hover:bg-blue-800 transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
