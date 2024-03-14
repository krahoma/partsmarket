import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@partsmarket/common";
import { Part } from "../models/part";
import { PartCreatedPublisher } from "../events/publishers/part-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/parts",
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
    const { title, price, quantity } = req.body;
    const part = Part.build({
      title,
      price,
      quantity,
      userId: req.currentUser!.id,
    });

    await part.save();
    await new PartCreatedPublisher(natsWrapper.client).publish({
      id: part.id,
      title: part.title,
      price: part.price,
      quantity: part.quantity,
      userId: part.userId,
    });
    res.status(201).send(part);
  }
);

export { router as createPartRouter };
