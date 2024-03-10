import express, { Request, Response } from "express";
import { Part } from "../models/part";
import { NotFoundError } from "@partsmarket/common";

const router = express.Router();

router.get("/api/parts/:id", async (req: Request, res: Response) => {
  const part = await Part.findById(req.params.id);
  if (!part) {
    throw new NotFoundError();
  }

  res.send(part);
});

export { router as showPartRouter };
