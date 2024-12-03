import express, { json } from "express";
import paymentRouter from "./src/router/paymentRouter.js";
import { connectDB } from "./src/db/connectDatabase.js";
import completePaymentRouter from "./src/router/completePaymentRouter.js";

const app = express();
const port = 5000;
connectDB();
app.use(json());

app.use("/payment", paymentRouter);
app.use("/", completePaymentRouter);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
