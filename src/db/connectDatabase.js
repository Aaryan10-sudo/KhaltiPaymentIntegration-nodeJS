import { config } from "dotenv";
import mongoose from "mongoose";
config();
export const connectDB = async () => {
  mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected To database");
};
