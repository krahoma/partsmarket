import express, { Request, Response } from "express";
import { Order } from "../models/order";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@partsmarket/common";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("part");
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
