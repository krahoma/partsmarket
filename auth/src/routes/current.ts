import express from "express";
import { currentUser } from "@partsmarket/common";

const router = express.Router();

router.get("/api/users/current", currentUser, (req, res) => {
  res.status(200).send({ currentUser: req.currentUser || null });
});

export { router as currentRouter };
