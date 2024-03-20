import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Part } from "../../models/part";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the part does not exist", async () => {
  const partId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ partId })
    .expect(404);
});

it("returns an error if the part is already reserved", async () => {
  const part = Part.build({
    title: "Part Description",
    price: 20,
    quantity: 2,
  });

  await part.save();

  const order = Order.build({
    part,
    userId: "laskdflkajsdf",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ partId: part.id })
    .expect(400);
});

it("reserves a part", async () => {
  const part = Part.build({
    title: "descr",
    price: 20,
    quantity: 2,
  });
  await part.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ partId: part.id, quantity: part.quantity })
    .expect(201);
});

it("emits an order created event", async () => {
  const part = Part.build({
    title: "descr",
    price: 20,
    quantity: 2,
  });
  await part.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ partId: part.id, quantity: part.quantity })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
