import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { PartCreatedEvent } from '@partsmarket/common';
import { PartCreatedListener } from '../part-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Part } from '../../../models/part';

const setup = async () => {
  // create an instance of the listener
  const listener = new PartCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: PartCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'bolt desc',
    price: 12,
    quantity: 5,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a part', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a part was created!
  const part = await Part.findById(data.id);

  expect(part).toBeDefined();
  expect(part!.title).toEqual(data.title);
  expect(part!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
