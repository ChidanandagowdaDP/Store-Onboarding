import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <main
        className={`pt-13 transition-all duration-300 ${
          open ? "ml-55" : "ml-13"
        }`}
      >
        <div className="p-3">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
