import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { ExpirationCompleteEvent, OrderStatus } from "@partsmarket/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Part } from "../../../models/part";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // Create and save a part
  const part = Part.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Description",
    price: 12,
    quantity: 3,
  });
  await part.save();

  // Create and save a order
  const order = Order.build({
    userId: "laskdflkajsdf",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    part,
  });
  await order.save();

  // create a fake data event
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, part, data, msg };
};

it("Update the order status to cancelled", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a part was created!
  const updatedOrder = await Order.findById(data.orderId);

  expect(updatedOrder).toBeDefined();
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Emit an OrderCancelled event", async () => {
  const { listener, order, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
