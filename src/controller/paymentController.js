import { Item } from "../schema/itemSchema.js";

export const createItemController = async (req, res, next) => {
  try {
    const data = req.body;
    const newItem = await Item.create(data);
    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
};
