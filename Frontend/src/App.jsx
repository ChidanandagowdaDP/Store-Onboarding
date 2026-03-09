import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./pages/login";
import ProtectedRoute from "./routes/ProtectedRoute";

import DashboardLayout from "./layout/DashboardLayout";

// User Pages
import Profile from "./pages/user/Profile";
import CreateStore from "./pages/user/CreateStore";
import ViewStores from "./pages/user/ViewStores";

// Admin Pages
import All from "./pages/admin/All";
import Renewal from "./pages/admin/Renewal";
import ApprovalPending from "./pages/admin/ApprovalPending";
import AmountPending from "./pages/admin/AmountPending";
import Users from "./pages/admin/User";
import Dashboard from "./pages/admin/Dashboard";
import InactiveStore from "./pages/admin/InactiveStore";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
        toastStyle={{
          fontSize: "12px",
          minHeight: "35px",
          padding: "6px 10px",
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* USER ROUTES */}
        <Route
          path="/user/home"
          element={
            <ProtectedRoute role="user">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="create-store" element={<CreateStore />} />
          <Route path="view-stores" element={<ViewStores />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/home"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default Dashboard */}
          <Route index element={<Navigate to="all" replace />} />
          {/* Admin Pages */}
          <Route path="all" element={<All />} />
          <Route path="users" element={<Users />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="approval-pending" element={<ApprovalPending />} />
          <Route path="renewal" element={<Renewal />} />
          <Route path="amount-pending" element={<AmountPending />} />
          <Route path="inactive" element={<InactiveStore />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
