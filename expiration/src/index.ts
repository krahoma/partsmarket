import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const starUp = async () => {
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
    
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log("Error:" + err);
  }
  console.log("Expiration app version 1");
};

starUp();
