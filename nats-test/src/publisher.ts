import nats from "node-nats-streaming";
import { PartCreatedPublisher } from "./events/part-created-publisher";

console.clear();
const stan = nats.connect("partsmarketing", "abc", {
  url: "http://localhost:4222",
});
stan.on("connect", async () => {
  console.log("Publisher connected to NATS");
  const publisher = new PartCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "123123",
      title: "Part description bla-bla-bla",
      price: 13,
      quantity: 5,
    });
  } catch (err) {
    console.error(err);
  }
});
