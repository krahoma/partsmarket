import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";

const port = 3000;

const starUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (
    !process.env.NATS_CLUSTER_ID ||
    !process.env.NATS_CLIENT_ID ||
    !process.env.NATS_URI
  ) {
    throw new Error("NATS config must be defined");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }

  app.listen(port, () => {
    console.log("Parts app version 5");
    console.log(`Part app listening on port ${port}!`);
  });
};

starUp();
