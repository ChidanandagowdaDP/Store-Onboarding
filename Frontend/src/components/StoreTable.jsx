import React from "react";
import StoreRow from "./StoreRow";

export default function StoreTable({ stores, onView }) {
  if (stores.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">No stores found.</div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-200">
            <th className="p-3 font-medium">Store Name</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium">Go Live Date</th>
            <th className="p-3 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <StoreRow key={store._id} store={store} onView={onView} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
