import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Search from "../../components/Search";
import FormSection from "../../components/user/FormSection";
import InputField from "../../components/user/InputField";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const formatDateTime = (isoString) =>
  isoString ? new Date(isoString).toLocaleDateString("en-GB") : "N/A";

export default function RenewalStores() {
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
        `${BACKEND_URL}/api/store/getstores?status=Active&renewal=true`,
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

  const handleRenewNow = async () => {
    try {
      await axios.patch(
        `${BACKEND_URL}/api/store/renewstore/${selectedStore._id}`,
        { renewalAmount: selectedStore.renewalAmount },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Store renewed successfully");

      closePanel();
      fetchStores();
    } catch (error) {
      const message = error.response?.data?.message || "Renewal failed";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <div className="bg-white border border-gray-300 rounded-md px-3 py-2 mb-1 flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="text-base font-semibold text-blue-900">
          Store Renewals
        </h1>

        <div className="flex gap-2 items-center w-full md:w-auto">
          <div className="w-full md:w-60">
            <Search value={search} onSearch={setSearch} />
          </div>
        </div>
      </div>

      {/* STORE LIST */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-white rounded-md">
        {/* TABLE HEADER */}
        <div className="border border-gray-300 p-3 mb-1 rounded-md text-sm flex items-center font-semibold text-gray-700 w-full">
          <div className="flex-[3]">Store Name</div>
          <div className="flex-[2] text-center">Onboarded By</div>
          <div className="flex-[2] text-center">Renewal Amount</div>
          <div className="flex-[2] text-center">Renewal Date</div>
          <div className="flex-[1] text-center">Update</div>
        </div>

        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <div
              key={store._id}
              className="border border-gray-300 p-3 mb-1 rounded-md text-sm flex w-full hover:bg-gray-50"
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

                {/* RENEWAL AMOUNT */}
                <div className="flex-[2] text-center text-sm font-semibold text-red-500">
                  ₹ {store.renewalAmount}
                </div>

                {/* RENEWAL DATE */}
                <div className="flex-[2] text-center text-xs text-gray-600">
                  {formatDateTime(store.renewalDate)}
                </div>

                {/* UPDATE BUTTON */}
                <div className="flex-[1] flex justify-center">
                  <button
                    onClick={() => openStorePanel(store)}
                    className="px-3 py-2 bg-blue-900 text-white rounded text-xs hover:bg-blue-800"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm mt-10">
            No renewal stores found
          </p>
        )}
      </div>

      {/* SIDE PANEL */}
      {selectedStore && (
        <>
          {/* BACKDROP */}
          <div
            className={`fixed  duration-500 z-40 ${
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
            {/* PANEL HEADER */}
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

            {/* PANEL CONTENT */}
            <div className="px-4 py-3 overflow-y-auto flex-1 space-y-4">
              {/* BASIC INFORMATION */}
              <FormSection title="Basic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <InputField
                    label="Group Name"
                    value={selectedStore.groupName}
                    readOnly
                  />

                  <InputField
                    label="Store Name"
                    value={selectedStore.storeName}
                    readOnly
                  />

                  <InputField
                    label="Store Type"
                    value={selectedStore.storeType}
                    readOnly
                  />

                  <InputField
                    label="District"
                    value={selectedStore.district}
                    readOnly
                  />

                  <InputField
                    label="Address"
                    value={selectedStore.address}
                    readOnly
                  />

                  <InputField
                    label="Pincode"
                    value={selectedStore.pincode}
                    readOnly
                  />

                  <InputField
                    label="Geo Address"
                    value={selectedStore.geoAddress}
                    readOnly
                  />

                  <InputField
                    label="Go Live Date"
                    value={formatDateTime(selectedStore.goLiveDate)}
                    readOnly
                  />

                  <InputField
                    label="Renewal Date"
                    value={formatDateTime(selectedStore.renewalDate)}
                    readOnly
                  />
                  <InputField
                    label="Billing Start Date"
                    value={formatDateTime(selectedStore.billingStartDate)}
                    readOnly
                  />

                  <InputField
                    label="Renewal Amount"
                    value={`₹ ${selectedStore.renewalAmount}`}
                    readOnly
                  />
                </div>
              </FormSection>

              {/* OWNER DETAILS */}
              <FormSection title="Owner Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <InputField
                    label="Owner Name"
                    value={selectedStore.ownerName}
                    readOnly
                  />

                  <InputField
                    label="Owner Mobile"
                    value={selectedStore.ownerMobile}
                    readOnly
                  />
                </div>
              </FormSection>

              {/* CASHIER DETAILS */}
              <FormSection title="Cashier Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <InputField
                    label="Cashier Name"
                    value={selectedStore.cashierName}
                    readOnly
                  />

                  <InputField
                    label="Cashier Mobile"
                    value={selectedStore.cashierMobile}
                    readOnly
                  />
                </div>
              </FormSection>

              {/* RENEW BUTTON */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleRenewNow}
                  className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-green-700 transition"
                >
                  Renew Now
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
