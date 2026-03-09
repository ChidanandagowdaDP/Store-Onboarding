import React from "react";

const StoreItem = ({ store, children }) => {
  const getStatusColor = (status) => {
    if (status === "Active") return "text-green-600";
    if (status === "Pending") return "text-yellow-600";
    if (status === "Inactive") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="border border-gray-300 p-3 mb-1 rounded-md text-sm flex w-full">
      {/* Main row container */}
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

        {/* Status */}
        <div
          className={`flex-[2] text-center text-xs font-semibold ${getStatusColor(
            store.status,
          )}`}
        >
          {store.status}
        </div>

        {/* Action */}
        {children && <div className="flex-[1] text-center">{children}</div>}
      </div>
    </div>
  );
};

export default StoreItem;
