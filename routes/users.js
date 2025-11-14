import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET all users (Admin only)
router.get("/", protect, async (req, res) => {
  if (req.user.role !== "Admin") return res.status(403).json({ message: "Forbidden" });

  const roleFilter = req.query.role; // optional role filter
  let filter = {};
  if (roleFilter) filter.role = roleFilter;

  const users = await User.find(filter).select("-password");
  res.json(users);
});

// UPDATE user role (Admin only)
router.post("/:id/role", protect, async (req, res) => {
  if (req.user.role !== "Admin") return res.status(403).json({ message: "Forbidden" });

  const { role } = req.body;
  if (!["Admin", "User"].includes(role)) return res.status(400).json({ message: "Invalid role" });

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
});

export default router;