import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import StoreItem from "../../components/admin/StoreItem";
import Search from "../../components/Search";
import StoreDetailPanel from "../../components/StoreDetailPanel";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ApprovalPending() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [openPanel, setOpenPanel] = useState(false);

  const token = Cookies.get("token");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/store/getstores?status=Pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setStores(res.data.stores || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStores = stores.filter((store) =>
    store.storeName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (store) => {
    if (!window.confirm("Reject and delete this store?")) return;

    try {
      const res = await axios.delete(
        `${BACKEND_URL}/api/store/deletestore/${store._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success(res.data.message);
      fetchStores();
      setOpenPanel(false);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to delete store";
      toast.error(msg);
    }
  };

  const openStorePanel = (store) => {
    setSelectedStore(store);
    setOpenPanel(true);
  };

  return (
    <div className="min-h-screen flex flex-col ">
      {/* HEADER */}
      <div className="bg-white border border-gray-300 rounded-md px-3 py-2 mb-1 flex items-center justify-between">
        <h1 className="text-base font-semibold text-blue-900">
          Approval Pending
        </h1>

        <div className="flex items-center">
          <div className="w-60">
            <Search value={search} onSearch={setSearch} />
          </div>
        </div>
      </div>
      {/* HEADER ROW */}

      {/* STORE LIST */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-white rounded-md">
        <div className="border border-gray-300 p-3 mb-1 rounded-md text-sm flex items-center font-semibold text-gray-700 w-full">
          {/* Store Info */}
          <div className="flex-[3]">Store Name</div>

          {/* Onboarded By */}
          <div className="flex-[2] text-center">Onboarded By</div>

          {/* Status */}
          <div className="flex-[2] text-center">Status</div>

          {/* Action */}
          <div className="flex-[1] text-center">Action</div>
        </div>
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <StoreItem key={store._id} store={store}>
              <button
                onClick={() => openStorePanel(store)}
                className="px-3 py-1 text-xs bg-blue-900 text-white rounded hover:bg-blue-800"
              >
                View
              </button>
            </StoreItem>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm">
            No pending stores found
          </p>
        )}
      </div>

      {/* STORE DETAIL DRAWER */}
      <StoreDetailPanel
        store={selectedStore}
        open={openPanel}
        onClose={() => setOpenPanel(false)}
        onDelete={handleDelete}
        onActivated={fetchStores}
      />
    </div>
  );
}
