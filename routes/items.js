import express from "express";
import Item from "../models/item.model.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET all items (admin only)
router.get("/all", auth, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const items = await Item.find()
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(items);
});

// CREATE ITEM
router.post("/", auth, async (req, res) => {
  try {
    const item = await Item.create({
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ITEMS WITH SEARCH + PAGINATION
router.get("/", auth, async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const search = req.query.search || "";

  const filter = {
    userId: req.user.id,
    title: { $regex: search, $options: "i" },
  };

  const items = await Item.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Item.countDocuments(filter);

  res.json({
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});

// GET SINGLE ITEM
router.get("/:id", auth, async (req, res) => {
  const item = await Item.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!item) return res.status(404).json({ message: "Not found" });

  res.json(item);
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  const item = await Item.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );

  res.json(item);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  await Item.deleteOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  res.json({ message: "Deleted" });
});

export default router;