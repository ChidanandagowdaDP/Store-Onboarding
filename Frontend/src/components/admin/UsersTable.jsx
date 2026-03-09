import { Pencil, Trash2 } from "lucide-react";

export default function UsersTable({ users }) {
  return (
    <div className="bg-white rounded-xl shadow mt-4">
      <table className="w-full">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="p-4 text-left">Username</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Created</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-50">
              <td className="p-4">{user.username}</td>

              <td className="p-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {user.role}
                </span>
              </td>

              <td className="p-4">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>

              <td className="p-4 flex justify-end gap-4">
                <button className="text-gray-600 hover:text-black">
                  <Pencil size={18} />
                </button>

                <button className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
