import mongoose from "mongoose";

export const purchasedSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Item id is required"],
    },
    itemName: {
      type: String,
      ref: "Item",
      required: [true, "Product name is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [100, "Price must be at least 100rs"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
      required: [true, "Payment status is required"],
    },
    purchasedDate: {
      type: Date,
      default: new Date().toDateString(),
      required: [true, "Purchase date is required"],
    },
  },
  { timestamps: true }
);

export const PurchasedItem = mongoose.model("PurchasedItem", purchasedSchema);
