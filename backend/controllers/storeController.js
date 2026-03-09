import Store from "../models/Store.js";

// Create a store (protected)
export const createStore = async (req, res) => {
  try {
    const store = await Store.create({
      ...req.body,
      onboardedBy: req.user.id,
    });

    res.status(201).json({
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStores = async (req, res) => {
  try {
    const { status, paymentStatus, renewal } = req.query;

    let filter = {};

    // 🔹 Filter by store status
    if (status) {
      filter.status = status;
    }

    // 🔹 Filter by payment status
    if (paymentStatus) {
      // Split by comma and use $in for multiple statuses
      const statuses = paymentStatus.split(",").map((s) => s.trim());
      filter.paymentStatus = { $in: statuses };
    }

    // 🔹 Renewal within next 2 months + expired
    if (renewal === "true") {
      const today = new Date();
      const nextTwoMonths = new Date();
      nextTwoMonths.setMonth(today.getMonth() + 2);

      filter.renewalDate = {
        $lte: nextTwoMonths, // include expired + upcoming 2 months
      };
    }

    const stores = await Store.find(filter)
      .populate("onboardedBy", "username role")
      .sort({ renewalDate: 1 }); // soonest renewal first

    res.status(200).json({ stores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyStores = async (req, res) => {
  try {
    const stores = await Store.find({
      onboardedBy: req.user.id,
    }).populate("onboardedBy", "username role");

    res.status(200).json({ stores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    /* ---------------- GO LIVE DATE ---------------- */

    if (updates.goLiveDate) {
      store.goLiveDate = new Date(updates.goLiveDate);
    }

    /* ---------------- BILLING DATE ---------------- */

    if (updates.billingStartDate) {
      const billingDate = new Date(updates.billingStartDate);

      store.billingStartDate = billingDate;

      const renewal = new Date(billingDate);
      renewal.setFullYear(renewal.getFullYear() + 1);

      store.renewalDate = renewal;
    }

    /* ---------------- SYSTEM REQUIRED ---------------- */

    if (updates.systemRequired !== undefined) {
      store.systemRequired = updates.systemRequired;

      if (updates.systemRequired === "No") {
        store.systemAmount = 0;
      }
    }

    // ❗ Throw error if systemAmount update not allowed
    if (updates.systemAmount !== undefined && store.systemRequired === "No") {
      return res.status(400).json({
        message: "System amount cannot be updated because systemRequired is No",
      });
    }

    if (updates.systemAmount !== undefined && store.systemRequired === "Yes") {
      store.systemAmount = updates.systemAmount;
    }

    /* ---------------- LANE AVAILABLE ---------------- */

    if (updates.laneAvailable !== undefined) {
      store.laneAvailable = updates.laneAvailable;

      if (updates.laneAvailable === "No") {
        store.nameOfLane = "";
      }
    }

    // ❗ Throw error if lane name update not allowed
    if (updates.nameOfLane !== undefined && store.laneAvailable === "No") {
      return res.status(400).json({
        message: "Lane name cannot be updated because laneAvailable is No",
      });
    }

    if (updates.nameOfLane !== undefined && store.laneAvailable === "Yes") {
      store.nameOfLane = updates.nameOfLane;
    }

    /* ---------------- OTHER FIELD UPDATES ---------------- */

    const ignoreFields = [
      "goLiveDate",
      "billingStartDate",
      "renewalDate",
      "systemRequired",
      "systemAmount",
      "laneAvailable",
      "nameOfLane",
    ];

    Object.keys(updates).forEach((key) => {
      if (!ignoreFields.includes(key)) {
        store[key] = updates[key];
      }
    });

    /* ---------------- AMOUNT CALCULATION ---------------- */

    let totalAmount = 0;

    if (store.isRenewed) {
      totalAmount = store.renewalAmount || 0;
    } else {
      totalAmount = (store.oneYearCharges || 0) + (store.systemAmount || 0);
    }

    store.pendingAmount = totalAmount - (store.receivedAmount || 0);

    if (store.pendingAmount < 0) {
      store.pendingAmount = 0;
    }

    /* ---------------- PAYMENT STATUS ---------------- */

    if (store.pendingAmount === 0 && totalAmount > 0) {
      store.paymentStatus = "Received";
    } else if ((store.receivedAmount || 0) > 0) {
      store.paymentStatus = "Partial";
    } else {
      store.paymentStatus = "Pending";
    }

    await store.save();

    res.status(200).json({
      message: "Store updated successfully",
      store,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const renewStore = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    if (store.pendingAmount > 0) {
      return res.status(400).json({
        message: `Cannot renew store. Pending payment of ₹${store.pendingAmount} exists.`,
      });
    }

    // 2️⃣ Update renewal date (+1 year)
    const newRenewalDate = store.renewalDate
      ? new Date(store.renewalDate)
      : new Date();
    newRenewalDate.setFullYear(newRenewalDate.getFullYear() + 1);
    store.renewalDate = newRenewalDate;
    store.isRenewed = true;

    await store.save();

    return res.status(200).json({
      message: "Store renewed successfully",
      store,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteStore = async (req, res) => {
  const { id } = req.params;

  try {
    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    await store.deleteOne(); // delete from DB

    return res.status(200).json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error("Delete Store Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { receivedAmount, updatedBy } = req.body;

    if (!receivedAmount || receivedAmount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const paymentAmount = Number(receivedAmount);

    // Update received amount
    store.receivedAmount = (store.receivedAmount || 0) + paymentAmount;

    // Ensure paymentHistory exists
    if (!store.paymentHistory) {
      store.paymentHistory = [];
    }

    // Add history entry
    store.paymentHistory.push({
      amount: paymentAmount,
      updatedBy: updatedBy || req.user?.name || "Admin",
      note: note || "",
      date: new Date(),
    });

    // Calculate total payable amount
    const totalAmount = store.isRenewed
      ? store.renewalAmount || 0
      : (store.oneYearCharges || 0) + (store.systemAmount || 0);

    // Calculate pending
    store.pendingAmount = totalAmount - store.receivedAmount;

    if (store.pendingAmount < 0) {
      store.pendingAmount = 0;
    }

    // Payment status logic
    if (store.pendingAmount === 0 && totalAmount > 0) {
      store.paymentStatus = "Received";
    } else if (store.receivedAmount > 0) {
      store.paymentStatus = "Partial";
    } else {
      store.paymentStatus = "Pending";
    }

    await store.save();

    res.status(200).json({
      message: "Payment updated successfully",
      store,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
