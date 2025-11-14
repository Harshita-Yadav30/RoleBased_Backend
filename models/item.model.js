import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;