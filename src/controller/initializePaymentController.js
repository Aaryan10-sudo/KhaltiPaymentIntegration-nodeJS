import { Item } from "../schema/itemSchema.js";
import { Payment } from "../schema/paymentSchema.js";
import { PurchasedItem } from "../schema/purchasedSchema.js";
import {
  initializeKhaltiPayment,
  verifyKhaltiController,
} from "./khaltiController.js";

export const initializePaymentController = async (req, res, next) => {
  try {
    const { itemId, itemName, quantity, price, website_url } = req.body;
    const totalPrice = Number(price) * Number(quantity);

    const itemData = await Item.find({
      _id: itemId,
      name: itemName,
    });

    if (!itemData) {
      return res.status(404).json({ message: "Item not found" });
    }

    const purchasedData = await PurchasedItem.create({
      itemId: itemId,
      itemName: itemName,
      price: price,
      quantity: quantity,
      totalPrice: totalPrice,
    });

    const paymentInitiate = await initializeKhaltiPayment({
      purchase_order_id: purchasedData._id,
      purchase_order_name: itemName,
      amount: totalPrice * 100,
      return_url: `${process.env.BACKEND_URI}/complete-khalti-payment`,
      website_url,
    });

    res.status(200).json({
      message: "Purchase successful",
      paymentInitiate: paymentInitiate,
      purchasedData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const completePaymentController = async (req, res, next) => {
  const {
    pidx,
    txnId,
    amount,
    mobile,
    purchase_order_id,
    purchase_order_name,
    transaction_id,
  } = req.query; //This are the essential information which is carried out after a succesfull khalti transaction

  try {
    const paymentInfo = await verifyKhaltiController(pidx);
    if (
      paymentInfo?.status !== "Completed" ||
      paymentInfo.transaction_id !== transaction_id ||
      Number(paymentInfo.total_amount) !== Number(amount)
    ) {
      return res.status(400).json({ message: "Payment failed" });
    }

    const purchasedItem = await PurchasedItem.find({
      _id: purchase_order_id,
      itemName: purchase_order_name,
      totalPrice: Number(amount),
    });
    if (!purchasedItem) {
      return res.status(404).json({ message: "Purchased item not found" });
    }
    await PurchasedItem.findByIdAndUpdate(
      purchase_order_id,
      { paymentStatus: "Completed" },
      { new: true }
    );

    const createPayment = await Payment.create({
      transactionId: transaction_id,
      pidx: pidx,
      productId: purchase_order_id,
      amount: Number(amount),
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      status: "completed",
    });
    res.status(200).json({
      message: "Payment successful",
      paymentData: createPayment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
