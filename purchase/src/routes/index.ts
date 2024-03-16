import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { requireAuth } from "@partsmarket/common";

const router = express.Router();

router.get("/api/orders/", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("part");
  
  res.send(orders);
});

export { router as indexOrderRouter };
