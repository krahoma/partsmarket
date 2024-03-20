import express, { Request, Response } from "express";
import { Order } from "../models/order";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@partsmarket/common";
import { OrderCancelledublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
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
    order.status = OrderStatus.Cancelled;
    await order.save();

    await new OrderCancelledublisher(natsWrapper.client).publish({
      id: order.id,
      part: {
        id: order.part.id,
        quantity: order.part.quantity,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
