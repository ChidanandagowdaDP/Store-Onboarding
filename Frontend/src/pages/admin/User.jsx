import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import CreateUserDrawer from "../../components/admin/CreateUserDrawer";
import EditUserDrawer from "../../components/admin/EditUserDrawer";
import DeleteUserModal from "../../components/admin/DeleteUserModal";
import UserTableRow from "../../components/admin/UserTableRow";
import Search from "../../components/Search";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [openDrawer, setOpenDrawer] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const token = Cookies.get("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/users/getusers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${BACKEND_URL}/api/users/deleteuser/${deleteUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(res.data.message);
      setDeleteUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-gray-100 ">
      {/* HEADER */}
      <div className="bg-white border border-gray-300 rounded-md px-3 py-2 mb-2 flex items-center justify-between">
        <h1 className="text-base font-semibold text-blue-900">
          User Management
        </h1>

        <div className="flex items-center gap-2">
          <div className="w-60">
            <Search value={searchQuery} onSearch={setSearchQuery} />
          </div>

          <button
            onClick={() => setOpenDrawer(true)}
            className="bg-blue-900 text-white px-3 py-1.5 text-sm rounded hover:bg-blue-800"
          >
            + Create
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-md border border-gray-300 overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          {/* HEADER */}
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr className="text-gray-600">
              <th className="px-3 py-2 font-medium">Username</th>
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No Users Found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <UserTableRow
                  key={user._id}
                  user={user}
                  onEdit={setEditUser}
                  onDelete={setDeleteUser}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE USER */}
      <CreateUserDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onUserCreated={fetchUsers}
      />

      {/* EDIT USER */}
      <EditUserDrawer
        user={editUser}
        onClose={() => setEditUser(null)}
        onUpdated={fetchUsers}
      />

      {/* DELETE MODAL */}
      <DeleteUserModal
        user={deleteUser}
        onCancel={() => setDeleteUser(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
