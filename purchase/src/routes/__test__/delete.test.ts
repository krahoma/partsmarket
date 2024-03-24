import request from "supertest";
import { app } from "../../app";
import { Part } from "../../models/part";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("marks an order as cancelled", async () => {
  // create a part with Part Model
  const part = Part.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Descr",
    price: 20,
    quantity: 12,
  });
  await part.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ partId: part.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
  // create a part with Part Model
  const part = Part.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Descr",
    price: 20,
    quantity: 12,
  });
  await part.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ partId: part.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  
});
