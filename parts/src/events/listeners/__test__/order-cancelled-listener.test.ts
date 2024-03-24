import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCancelledEvent } from "@partsmarket/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Part } from "../../../models/part";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const part = Part.build({
    title: "bolt desc",
    price: 12,
    quantity: 5,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  
  part.set({ orderId });
  await part.save();

  // create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    part: {
      id: part.id,
      quantity: part.quantity,
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, part, data, msg };
};

it("update the part, publsih an event and acks the message", async () => {
  const { listener, part, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a part was updated!
  const updatedPart = await Part.findById(part.id);

  expect(updatedPart).toBeDefined();
  expect(updatedPart!.orderId).not.toBeDefined();

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();

  // write assertions to make sure ack function is called
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
