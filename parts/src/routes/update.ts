import express, { Request, Response } from "express";
import { Part } from "../models/part";

import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
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

    if (part.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    part.set({
      title: req.body.title,
      price: req.body.price,
      quantity: req.body.quantity,
    });

    await part.save();

    res.send(part);
  }
);

export { router as updatePartRouter };
