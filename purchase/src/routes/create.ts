import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@partsmarket/common";
import { Part } from "../models/part";
import { Order } from "../models/order";

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15*60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("partId")
      .trim()
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Part id must be provided"),
    //body("quantity").isInt({ gt: 0 }).withMessage("Quantity must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { partId } = req.body;

    const part = await Part.findById(partId);
    if (!part) {
      throw new NotFoundError();
    }

    const existingOrder = await part.isReserved();
    if (existingOrder) {
      throw new BadRequestError("This part is already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds()+EXPIRATION_WINDOW_SECONDS)
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      part
    });

    await order.save();

    // await new PartCreatedPublisher(natsWrapper.client).publish({
    //   id: part.id,
    //   title: part.title,
    //   price: part.price,
    //   quantity: part.quantity,
    //   userId: part.userId,
    // });
    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
