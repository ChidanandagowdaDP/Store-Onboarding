import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StoreSearch from "../../components/Search";
import StoreTable from "../../components/StoreTable";
import StoreDetailPanel from "../../components/StoreDetailPanel";

export default function ViewStores() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStore, setSelectedStore] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = Cookies.get("token");

        const response = await axios.get(`${BACKEND_URL}/api/store/my-stores`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStores(response.data.stores);
        setFilteredStores(response.data.stores);

        if (response.data.message) {
          toast.success(response.data.message);
        }
      } catch (error) {
        const msg = error.response?.data?.message || error.message;
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);

    const filtered = stores.filter((store) =>
      store.storeName?.toLowerCase().includes(term.toLowerCase()),
    );

    setFilteredStores(filtered);
  };

  const viewDetail = (store) => {
    setSelectedStore(store);
    setOpenDetail(true);
  };

  const closeDetail = () => {
    setOpenDetail(false);

    setTimeout(() => {
      setSelectedStore(null);
    }, 500);
  };

  const handleDelete = async (store) => {
    try {
      const token = Cookies.get("token");

      const response = await axios.delete(
        `${BACKEND_URL}/api/store/deletestore/${store._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setStores((prev) => prev.filter((s) => s._id !== store._id));
      setFilteredStores((prev) => prev.filter((s) => s._id !== store._id));

      closeDetail();

      toast.success(response.data.message || "Store deleted successfully!");
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    }
  };

  if (loading) return <div className="p-6">Loading stores...</div>;

  return (
    <div className="flex h-full relative bg-gray-100">
      {/* LEFT SIDE */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-2 sticky top-0 bg-white z-10 p-4 shadow-sm rounded">
          <h2 className="text-xl font-medium text-blue-900">YOUR STORES</h2>

          <div className="w-1/3">
            <StoreSearch value={searchTerm} onSearch={handleSearch} />
          </div>
        </div>

        <StoreTable stores={filteredStores} onView={viewDetail} />
      </div>

      {/* RIGHT SIDE PANEL */}
      <StoreDetailPanel
        store={selectedStore}
        open={openDetail}
        onClose={closeDetail}
        onDelete={handleDelete}
      />

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}
