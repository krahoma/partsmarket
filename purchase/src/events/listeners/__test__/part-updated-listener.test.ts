import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { PartUpdatedEvent } from "@partsmarket/common";
import { PartUpdatedListener } from "../part-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Part } from "../../../models/part";

const setup = async () => {
  // Create a listener
  const listener = new PartUpdatedListener(natsWrapper.client);

  // Create and save a part
  const part = Part.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Description",
    price: 12,
    quantity: 3,
  });

  await part.save();

  // Create a fake data object
  const data: PartUpdatedEvent["data"] = {
    id: part.id,
    version: part.version + 1,
    title: "new bolt",
    price: 11,
    quantity: 2,
    userId: "ablskdjf",
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, part, listener };
};

it("finds, updates, and saves a part", async () => {
  const { msg, data, part, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedPart = await Part.findById(part.id);

  expect(updatedPart!.title).toEqual(data.title);
  expect(updatedPart!.price).toEqual(data.price);
  expect(updatedPart!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
  const { msg, data, listener, part } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
