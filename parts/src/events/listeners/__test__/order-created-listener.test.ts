import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCreatedEvent,  OrderStatus, } from "@partsmarket/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Part } from "../../../models/part";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  const part = Part.build({
    title: "bolt desc",
    price: 12,
    quantity: 5,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await part.save();

  // create a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: "asdfs",
    part: {
      id: part.id,
      price: part.price,
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

it("creates and saves a order", async () => {
  const { listener, part, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a part was updated!
  const updatedPart = await Part.findById(part.id);

  expect(updatedPart).toBeDefined();
  expect(updatedPart!.orderId).toEqual(data.id);
  
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a part update event", async () => {
  const { data, part, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const partUpdateDate = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(partUpdateDate.orderId).toEqual(data.id);
});
