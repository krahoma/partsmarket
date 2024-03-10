import express, { Request, Response } from "express";
import { Part } from "../models/part";

const router = express.Router();

router.get("/api/parts/", async (req: Request, res: Response) => {
    const parts = await Part.find({});
    res.send(parts);
});

export {router as indexPartRouter};
