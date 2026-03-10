import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Search from "../../components/Search";
import FormSection from "../../components/user/FormSection";
import InputField from "../../components/user/InputField";
import AmountPendingStoreItem from "../../components/admin/AmountPendingStoreItem";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function AmountPending() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [note, setNote] = useState(""); // ✅ NEW STATE

  const token = Cookies.get("token");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/store/getstores?status=Active&paymentStatus=Pending,Partial`,
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
    setPayAmount("");
    setNote(""); // reset note

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

  const handlePaymentUpdate = async () => {
    if (!payAmount || payAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      const username = Cookies.get("username");

      const res = await axios.patch(
        `${BACKEND_URL}/api/store/updatepayment/${selectedStore._id}`,
        {
          receivedAmount: Number(payAmount),
          updatedBy: username,
          note: note,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(res.data.message);

      closePanel();
      fetchStores();
      setPayAmount("");
      setNote("");
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Payment update failed";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <div className="bg-white border border-gray-300 rounded-md px-3 py-2 mb-1 flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="text-base font-semibold text-blue-900">
          Amount Pending
        </h1>

        <div className="flex gap-2 items-center w-full md:w-auto">
          <div className="w-full md:w-60">
            <Search value={search} onSearch={setSearch} />
          </div>
        </div>
      </div>

      {/* STORE LIST */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-white rounded-md">
        <div className="border border-gray-300 p-3 mb-1 rounded-md text-sm flex items-center font-semibold text-gray-700 w-full">
          <div className="flex-[3]">Store Name</div>
          <div className="flex-[2] text-center">Onboarded By</div>
          <div className="flex-[2] text-center">Status</div>
          <div className="flex-[1] text-center">Action</div>
        </div>

        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <AmountPendingStoreItem
              key={store._id}
              store={store}
              onUpdate={openStorePanel}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm">
            No pending payment stores found
          </p>
        )}
      </div>

      {/* SIDE PANEL */}
      {selectedStore && (
        <>
          {/* BACKDROP */}
          <div
            className={`fixed duration-500 z-40 ${
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
            <div className="px-4 py-3 overflow-y-auto flex-1 space-y-3">
              <FormSection title="Payment Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <InputField
                    label="1 Year Charge"
                    value={`₹ ${selectedStore.oneYearCharges}`}
                    readOnly
                  />
                  <InputField
                    label="Renewal Amount"
                    value={`₹ ${selectedStore.renewalAmount}`}
                    readOnly
                  />
                  <InputField
                    label="System Amount"
                    value={`₹ ${selectedStore.systemAmount}`}
                    readOnly
                  />
                  <InputField
                    label="Received Payment"
                    value={`₹ ${selectedStore.receivedAmount}`}
                    readOnly
                  />
                  <InputField
                    label="Pending Amount"
                    value={`₹ ${selectedStore.pendingAmount}`}
                    readOnly
                  />
                </div>
              </FormSection>

              {/* UPDATE PAYMENT */}
              <FormSection title="Update Payment">
                <InputField
                  label="Enter Paid Amount"
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="Enter amount"
                />

                {/* NOTE FIELD */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Note
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Enter payment note..."
                    rows={3}
                    className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none"
                  />
                </div>
              </FormSection>

              <div className="flex justify-center">
                <button
                  onClick={handlePaymentUpdate}
                  className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Update Payment
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
