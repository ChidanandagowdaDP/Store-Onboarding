import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Search from "../../components/Search";
import StoreItem from "../../components/admin/StoreItem";
import StoreSidePanel from "../../components/admin/StoreSidePanel";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function All() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const token = Cookies.get("token");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/store/getstores`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.stores || [];
      setStores(data);

      // ⭐ update selected store if panel is open
      if (selectedStore) {
        const updated = data.find((s) => s._id === selectedStore._id);
        if (updated) {
          setSelectedStore(updated);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStores = stores.filter((store) =>
    store.storeName?.toLowerCase().includes(search.toLowerCase()),
  );

  const openPanel = (store) => {
    setSelectedStore(store);
    setTimeout(() => setPanelOpen(true), 10);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setTimeout(() => setSelectedStore(null), 400);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <div className="bg-white border border-gray-300 rounded-md px-3 py-2 mb-1 flex justify-between items-center">
        <h1 className="text-base font-semibold text-blue-900">All Stores</h1>

        <div className="w-60">
          <Search value={search} onSearch={setSearch} />
        </div>
      </div>

      {/* STORE LIST */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-white rounded-md">
        {/* TABLE HEADER */}
        <div className="border border-gray-300 p-3 rounded-md text-sm flex font-semibold">
          <div className="flex-[3]">Store Name</div>
          <div className="flex-[2] text-center">Onboarded By</div>
          <div className="flex-[2] text-center">Status</div>
          <div className="flex-[1] text-center">Action</div>
        </div>

        {/* STORE ROWS */}
        {filteredStores.map((store) => (
          <StoreItem key={store._id} store={store}>
            <button
              onClick={() => openPanel(store)}
              className="px-3 py-1.5 text-xs bg-blue-900 text-white rounded hover:bg-blue-800"
            >
              View
            </button>
          </StoreItem>
        ))}

        {/* EMPTY STATE */}
        {filteredStores.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-10">
            No stores found
          </div>
        )}
      </div>

      {/* SIDE PANEL */}
      <StoreSidePanel
        store={selectedStore}
        open={panelOpen}
        onClose={closePanel}
        refresh={fetchStores}
      />
    </div>
  );
}
