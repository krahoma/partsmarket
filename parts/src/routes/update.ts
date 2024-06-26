import express, { Request, Response } from "express";
import { Part } from "../models/part";
import { PartUpdatedPublisher } from "../events/publishers/part-updated-publisher";
import { natsWrapper } from "../nats-wrapper";
import { body } from "express-validator";

import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from "@partsmarket/common";

const router = express.Router();

router.put(
  "/api/parts/:id",
  requireAuth,
  [
    body("title").trim().not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
    body("quantity").isInt({ gt: 0 }).withMessage("Quantity must be correct"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const part = await Part.findById(req.params.id);

    if (!part) {
      throw new NotFoundError();
    }

    if (part.orderId) {
      throw new BadRequestError('Cannot edit a purchasing part');
    }

    if (part.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    part.set({
      title: req.body.title,
      price: req.body.price,
      quantity: req.body.quantity,
    });
    await part.save();
    new PartUpdatedPublisher(natsWrapper.client).publish({
      id: part.id,
      version: part.version,
      title: part.title,
      price: part.price,
      quantity: part.quantity,
      userId: part.userId,
    });

    res.send(part);
  }
);

export { router as updatePartRouter };
