import request from 'supertest';
import { app } from '../../app';
import { Part } from '../../models/part';
import mongoose from 'mongoose';

const buildPart = async () => {
  const part = Part.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Part Description',
    price: 11,
    quantity: 2
  });
  await part.save();

  return part;
};

it('fetches orders for an particular user', async () => {
  // Create three parts
  const partOne = await buildPart();
  const partTwo = await buildPart();
  const partThree = await buildPart();

  const userOne = global.signin();
  const userTwo = global.signin();
  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ partId: partOne.id })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ partId: partTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ partId: partThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].part.id).toEqual(partTwo.id);
  expect(response.body[1].part.id).toEqual(partThree.id);
});
