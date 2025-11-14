import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";
import userRoutes from "./routes/users.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/items", itemRoutes);
app.use("/users", userRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT}`));