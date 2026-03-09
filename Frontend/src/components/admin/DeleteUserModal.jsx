export default function DeleteUserModal({ user, onCancel, onConfirm }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0  bg-black/40 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Delete User</h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <b>{user.username}</b> ?
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
