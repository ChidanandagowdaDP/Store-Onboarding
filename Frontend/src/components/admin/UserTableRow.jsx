import { Pencil, Trash2 } from "lucide-react";

export default function UserTableRow({ user, onEdit, onDelete }) {
  return (
    <tr className="bg-white border border-gray-300 hover:bg-gray-50">
      <td className="p-3">{user.username}</td>

      <td className="p-3">
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs capitalize">
          {user.role}
        </span>
      </td>

      <td className="p-3 flex justify-end gap-3">
        <button
          onClick={() => onEdit(user)}
          className="text-gray-600 hover:text-black"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() => onDelete(user)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}
