import request from 'supertest';
import { app } from '../../app';
import { Part } from '../../models/part';

it('fetches the order', async () => {
  // Create a part
  const part = Part.build({
    title: 'Part description',
    price: 20,
    quantity:5
  });
  await part.save();

  const user = global.signin();
  // make a request to build an order with this part
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ partId: part.id })
    .expect(201);
  
  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  // Create a part
  const part = Part.build({
    title: 'Description',
    price: 13,
    quantity: 2
  });
  await part.save();

  const user = global.signin();
  // make a request to build an order with this part
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ partId: part.id })
    .expect(201);

  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
