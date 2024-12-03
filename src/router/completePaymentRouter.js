import { Router } from "express";
import { completePaymentController } from "../controller/initializePaymentController.js";

const completePaymentRouter = Router();
completePaymentRouter
  .route("/complete-khalti-payment")
  .get(completePaymentController);

export default completePaymentRouter;
