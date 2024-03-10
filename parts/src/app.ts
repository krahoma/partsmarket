import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import cookieSession from "cookie-session";
import { errorHandler,NotFoundError } from "@partsmarket/common";
import { currentUser } from '@partsmarket/common';
import { createPartRouter } from "./routes/create";
import { showPartRouter } from "./routes/show";
import { indexPartRouter } from "./routes/index";
import { updatePartRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.use(createPartRouter);
app.use(showPartRouter);
app.use(indexPartRouter);
app.use(updatePartRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };