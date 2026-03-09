import React from "react";
import { Eye } from "lucide-react";

export default function StoreRow({ store, onView, onDelete }) {
  // Map status to Tailwind colors
  const statusColors = {
    pending: "text-yellow-500",
    active: "text-green-500",
    inactive: "text-gray-500",
    rejected: "text-red-500",
  };

  // Normalize status safely: trim and lowercase
  const statusKey = store.status ? store.status.trim().toLowerCase() : "";

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      {/* Store Name & Address */}
      <td className="p-3 font-medium">
        {store.storeName}
        <div className="text-gray-500 text-xs">{store.address}</div>
      </td>

      {/* Status with color */}
      <td
        className={`p-3 font-semibold ${statusColors[statusKey] || "text-gray-500"}`}
      >
        {store.status
          ? store.status.charAt(0).toUpperCase() + store.status.slice(1)
          : "-"}
      </td>

      {/* Go Live Date (only date) */}
      <td className="p-3">
        {store.goLiveDate
          ? new Date(store.goLiveDate).toLocaleDateString()
          : "-"}
      </td>

      {/* Action icons */}
      <td className="py-3  flex justify-end items-center ">
        {/* View Icon */}
        <button
          onClick={() => onView(store)}
          className="p-2 bg-blue-900 text-white rounded hover:bg-sky-600 transition-colors flex items-center gap-1"
          title="View Store"
        >
          <span className="mx-1">View</span>
          <Eye size={14} />
        </button>
      </td>
    </tr>
  );
}
