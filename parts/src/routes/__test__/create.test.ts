import request from "supertest";
import { app } from "../../app";
import { Part } from "../../models/part";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/parts for post requests", async () => {
  const response = await request(app).post("/api/parts").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/parts").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/parts")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid descrition is provided", async () => {
  const response = await request(app)
    .post("/api/parts")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
      quantity: 3,
    });
  //console.log(response);
  expect(response.status).toEqual(400);
  //.expect(400);

  await request(app)
    .post("/api/parts")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
      quantity: 3,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/parts")
    .set("Cookie", global.signin())
    .send({
      title: "Part description",
      price: 0,
      quantity: 3,
    })
    .expect(400);

  await request(app)
    .post("/api/parts")
    .set("Cookie", global.signin())
    .send({
      title: "Part description",
      quantity: 3,
    })
    .expect(400);
});

it("returns an error if an invalid quantity is provided", async () => {
  await request(app)
    .post("/api/parts")
    .set("Cookie", global.signin())
    .send({
      title: "Part description",
      price: 10,
      quantity: 0,
    })
    .expect(400);

  await request(app)
    .post("/api/parts")
    .set("Cookie", global.signin())
    .send({
      title: "Part description",
      price: 10,
    })
    .expect(400);
});

it("creates a part with valid inputs", async () => {
  let parts = await Part.find({});
  const title = "Part description";

  await request(app)
    .post("/api/parts")
    .set("Cookie", global.signin())
    .send({
      title,
      price: 15,
      quantity: 2,
    })
    .expect(201);
  parts = await Part.find({});
  expect(parts.length).toEqual(1);
  expect(parts[0].price).toEqual(15);
  expect(parts[0].title).toEqual(title);
});

it("publishes an event", async () => {
  const title = "Part description";

  await request(app)
    .post("/api/parts")
    .set("Cookie", global.signin())
    .send({
      title,
      price: 15,
      quantity: 2,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
