import React from "react";
import { Search } from "lucide-react";

export default function StoreSearch({ value, onSearch }) {
  return (
    <div className="flex items-center border border-gray-400 rounded-lg px-3 py-1 w-full">
      <Search size={18} className="text-gray-400" />
      <input
        placeholder="Search..."
        className="ml-2 outline-none w-full"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
