export const storeFormSections = [
  {
    title: "Basic Information",
    fields: [
      { type: "input", label: "Group Name", name: "groupName", required: true },
      { type: "input", label: "Store Name", name: "storeName", required: true },

      {
        type: "select",
        label: "Store Type",
        name: "storeType",
        options: ["CL2", "CL7", "CL9"],
        required: true,
      },

      { type: "input", label: "District", name: "district", required: true },
      { type: "input", label: "Address", name: "address", required: true },

      {
        type: "input",
        label: "Pincode",
        name: "pincode",
        typeInput: "number",
        required: true,
      },

      {
        type: "input",
        label: "Geo Address",
        name: "geoAddress",
        required: true,
      },

      {
        type: "input",
        label: "Go Live Date",
        name: "goLiveDate",
        typeInput: "date",
        required: true,
      },
    ],
  },

  {
    title: "KSBCL Details",
    fields: [
      {
        type: "input",
        label: "KSBCL ID",
        name: "ksbclId",
        required: true,
      },
      {
        type: "input",
        label: "KSBCL Password",
        name: "ksbclPassword",
        typeInput: "text",
        required: true,
      },
    ],
  },

  {
    title: "Lane Details",
    fields: [
      {
        type: "radio",
        label: "Lane Available",
        name: "laneAvailable",
        options: ["Yes", "No"],
        required: true,
      },

      {
        type: "input",
        label: "Name of Lane",
        name: "nameOfLane",
        typeInput: "text",
        required: true,
        showIf: {
          field: "laneAvailable",
          value: "Yes",
        },
      },
    ],
  },

  {
    title: "Owner Details",
    fields: [
      {
        type: "input",
        label: "Owner Name",
        name: "ownerName",
        required: true,
      },
      {
        type: "input",
        label: "Owner Mobile",
        name: "ownerMobile",
        typeInput: "number",
        required: true,
      },
      {
        type: "input",
        label: "Owner Email",
        name: "ownerEmail",
        typeInput: "email",
        required: false, // optional
      },
    ],
  },

  {
    title: "Cashier Details",
    fields: [
      {
        type: "input",
        label: "Cashier Name",
        name: "cashierName",
        required: true,
      },
      {
        type: "input",
        label: "Cashier Mobile",
        name: "cashierMobile",
        typeInput: "number",
        required: true,
      },
    ],
  },

  {
    title: "Financial Details",
    fields: [
      {
        type: "input",
        label: "1 Year Charges (₹)",
        name: "oneYearCharges",
        typeInput: "number",
        required: true,
      },

      {
        type: "input",
        label: "Renewal Amount (₹)",
        name: "renewalAmount",
        typeInput: "number",
        required: true,
      },

      {
        type: "radio",
        label: "System Required",
        name: "systemRequired",
        options: ["Yes", "No"],
        required: true,
      },

      {
        type: "input",
        label: "System Amount (₹)",
        name: "systemAmount",
        typeInput: "number",
        required: true,
        showIf: {
          field: "systemRequired",
          value: "Yes",
        },
      },
    ],
  },
];
