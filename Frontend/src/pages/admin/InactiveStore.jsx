import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Search from "../../components/Search";
import FormSection from "../../components/user/FormSection";
import InputField from "../../components/user/InputField";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function InactiveStores() {
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
      const res = await axios.get(
        `${BACKEND_URL}/api/store/getstores?status=Inactive`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setStores(res.data.stores || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStores = stores.filter((store) =>
    store.storeName.toLowerCase().includes(search.toLowerCase()),
  );

  const getStatusColor = (status) => {
    if (status === "Active") return "text-green-600";
    if (status === "Pending") return "text-yellow-600";
    if (status === "Inactive") return "text-red-600";
    return "text-gray-600";
  };

  const openStorePanel = (store) => {
    setSelectedStore(store);

    setTimeout(() => {
      setPanelOpen(true);
    }, 10);
  };

  const closePanel = () => {
    setPanelOpen(false);

    setTimeout(() => {
      setSelectedStore(null);
    }, 500);
  };

  const handleReactivate = async () => {
    try {
      const payload = {
        status: "Active",
      };

      await axios.patch(
        `${BACKEND_URL}/api/store/updatestore/${selectedStore._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Store reactivated successfully");

      closePanel();
      fetchStores();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reactivate store");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <div className="bg-white border border-gray-300 rounded-md px-3 py-2 mb-1 flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="text-base font-semibold text-blue-900">
          Inactive Stores
        </h1>

        <div className="flex gap-2 items-center w-full md:w-auto">
          <div className="w-full md:w-60">
            <Search value={search} onSearch={setSearch} />
          </div>
        </div>
      </div>

      {/* STORE LIST */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-white rounded-md">
        {/* HEADER */}
        <div className="border border-gray-300 p-3 mb-1 rounded-md text-sm flex items-center font-semibold text-gray-700 w-full">
          <div className="flex-[3]">Store Name</div>
          <div className="flex-[2] text-center">Onboarded By</div>
          <div className="flex-[2] text-center">Status</div>
        </div>

        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <div
              key={store._id}
              onClick={() => openStorePanel(store)}
              className="border border-gray-300 p-3 mb-1 rounded-md text-sm flex w-full cursor-pointer hover:bg-gray-50"
            >
              <div className="flex w-full items-center">
                {/* STORE NAME */}
                <div className="flex-[3]">
                  <div className="font-semibold text-gray-800">
                    {store.storeName}
                  </div>
                  <div className="text-xs text-gray-500">{store.address}</div>
                </div>

                {/* ONBOARDED BY */}
                <div className="flex-[2] text-center text-xs text-gray-500">
                  {store.onboardedBy?.username || "Unknown"}
                </div>

                {/* STATUS */}
                <div
                  className={`flex-[2] text-center text-xs font-semibold ${getStatusColor(
                    store.status,
                  )}`}
                >
                  {store.status}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm mt-10">
            No inactive stores found
          </p>
        )}
      </div>

      {/* SIDE PANEL */}
      {selectedStore && (
        <>
          {/* BACKDROP */}
          <div
            className={`fixed inset-0 bg-black/30 transition-opacity duration-500 z-40 ${
              panelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={closePanel}
          />

          {/* PANEL */}
          <div
            className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-xl border-l border-gray-300 z-50 transform transition-transform duration-500 ease-in-out flex flex-col ${
              panelOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center border-b border-gray-300 px-4 py-3">
              <h2 className="font-semibold text-blue-900 text-lg">
                {selectedStore.storeName}
              </h2>

              <button
                onClick={closePanel}
                className="text-gray-500 font-bold hover:text-gray-700"
              >
                X
              </button>
            </div>

            {/* CONTENT */}
            <div className="px-4 py-3 overflow-y-auto flex-1 space-y-4">
              <FormSection title="Store Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <InputField
                    label="Store Name"
                    value={selectedStore.storeName}
                    readOnly
                  />
                  <InputField
                    label="Store Address"
                    value={selectedStore.address}
                    readOnly
                  />

                  <InputField
                    label="Owner Name"
                    value={selectedStore.ownerName}
                    readOnly
                  />

                  <InputField
                    label=" Owner Contact"
                    value={selectedStore.ownerMobile}
                    readOnly
                  />

                  <InputField
                    label="Cashier Name"
                    value={selectedStore.cashierName}
                    readOnly
                  />

                  <InputField
                    label=" Cashier Contact"
                    value={selectedStore.cashierMobile}
                    readOnly
                  />

                  <InputField
                    label="Status"
                    value={selectedStore.status}
                    readOnly
                  />
                </div>
              </FormSection>

              {/* REACTIVATE BUTTON */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleReactivate}
                  className="px-6 py-2  bg-blue-900 text-white rounded-md hover:bg-green-700 transition"
                >
                  Reactivate Store
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
