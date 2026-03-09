import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true },
    storeName: { type: String, required: true },
    address: String,
    geoAddress: String,
    pincode: String,
    district: String,
    storeType: String,
    ksbclId: String,
    ksbclPassword: String,

    laneAvailable: { type: String, enum: ["Yes", "No"], default: "No" },
    nameOfLane: String,

    ownerName: String,
    ownerMobile: String,
    ownerEmail: String,

    cashierName: String,
    cashierMobile: String,

    goLiveDate: Date,
    renewalDate: Date,
    billingStartDate: { type: Date, sparse: true },

    oneYearCharges: { type: Number, default: 0 },
    renewalAmount: { type: Number, default: 0 },
    isRenewed: { type: Boolean, default: false },

    systemRequired: { type: String, enum: ["Yes", "No"], default: "No" },
    systemAmount: { type: Number, default: 0 },

    leadGivenBy: String,

    onboardedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Active", "Inactive"],
      default: "Pending",
    },

    storeId: { type: String, unique: true, sparse: true },

    receivedAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Partial", "Received"],
      default: "Pending",
    },

    paymentHistory: [
      {
        updatedBy: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

// =========================================================
// Assign billingStartDate and renewalDate when store is created
// =========================================================
storeSchema.pre("save", function (next) {
  // Run only when creating store
  if (this.isNew && this.goLiveDate) {
    const goLive = new Date(this.goLiveDate);

    // billingStartDate = goLiveDate
    this.billingStartDate = goLive;

    // renewalDate = goLiveDate + 1 year
    const renewal = new Date(goLive);
    renewal.setFullYear(renewal.getFullYear() + 1);

    this.renewalDate = renewal;
  }

  next();
});

export default mongoose.model("Store", storeSchema);
