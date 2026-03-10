import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

export default function DownloadExcel({ data }) {
  const downloadExcel = () => {
    // Show error if no data
    if (!data || data.length === 0) {
      toast.error("No store data available to download");
      return;
    }

    const formattedData = data.map((store) => ({
      "Group Name": store.groupName || "",
      "Store Name": store.storeName || "",
      "Store Type": store.storeType || "",
      District: store.district || "",
      Address: store.address || "",
      Pincode: store.pincode || "",
      "Geo Address": store.geoAddress || "",

      "Go Live Date": store.goLiveDate
        ? new Date(store.goLiveDate).toLocaleDateString("en-IN")
        : "",

      "Renewal Date": store.renewalDate
        ? new Date(store.renewalDate).toLocaleDateString("en-IN")
        : "",

      "KSBCL ID": store.ksbclId || "",
      "KSBCL Password": store.ksbclPassword || "",

      "Lane Available": store.laneAvailable || "",
      "Name Of Lane": store.nameOfLane || "",

      "Owner Name": store.ownerName || "",
      "Owner Mobile": store.ownerMobile || "",
      "Owner Email": store.ownerEmail || "",

      "Cashier Name": store.cashierName || "",
      "Cashier Mobile": store.cashierMobile || "",

      "1 Year Charges": store.oneYearCharges || "",
      "Renewal Amount": store.renewalAmount || "",

      "System Required": store.systemRequired || "",
      "System Amount": store.systemAmount || "",

      Status: store.status || "",
      "Onboarded By": store.onboardedBy?.username || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    /* -------- AUTO COLUMN WIDTH -------- */

    const columnWidths = Object.keys(formattedData[0]).map((key) => {
      let maxLength = key.length;

      formattedData.forEach((row) => {
        const value = row[key] ? row[key].toString() : "";
        if (value.length > maxLength) {
          maxLength = value.length;
        }
      });

      return { wch: maxLength + 2 };
    });

    worksheet["!cols"] = columnWidths;

    /* ---------------------------------- */

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stores");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "store_list.xlsx");
  };

  return (
    <button
      onClick={downloadExcel}
      className="px-3 py-2 text-xs bg-blue-900 text-white rounded hover:bg-blue-800"
    >
      Download Excel
    </button>
  );
}
