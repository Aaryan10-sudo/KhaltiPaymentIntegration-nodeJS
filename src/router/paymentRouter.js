import { Router } from "express";
import { createItemController } from "../controller/paymentController.js";
import {
  completePaymentController,
  initializePaymentController,
} from "../controller/initializePaymentController.js";

const paymentRouter = Router();
paymentRouter.route("/create-items").post(createItemController);
paymentRouter.route("/initialize").post(initializePaymentController);
paymentRouter.route("/complete-khalti-payment").get(completePaymentController);

export default paymentRouter;
