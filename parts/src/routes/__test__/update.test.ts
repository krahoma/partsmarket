import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";


it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/parts/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "Part description",
      price: 20,
      quantity: 2
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/parts/${id}`)
    .send({
      title: "Part description",
      price: 20,
      quantity: 2
    })
    .expect(401);
});

it("returns a 401 if the user does not own the parts", async () => {
  const response = await request(app)
    .post("/api/parts")
    .set("Cookie", global.signin())
    .send({
      title: "Part description",
      price: 20,
      quantity: 2
    });

  await request(app)
    .put(`/api/parts/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "Part description",
      price: 10,
      quantity: 2
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price or quantity", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/parts")
    .set("Cookie", cookie)
    .send({
      title: "Part description",
      price: 20,
      quantity: 2
    });

  await request(app)
    .put(`/api/parts/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
      quantity: 2
    })
    .expect(400);

  await request(app)
    .put(`/api/parts/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Part description",
      price: -10,
      quantity: 2
    })
    .expect(400);

    await request(app)
    .put(`/api/parts/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Part description",
      price: 10,
      quantity: -2
    })
    .expect(400);
});

it("updates the part provided valid inputs", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/parts")
    .set("Cookie", cookie)
    .send({
      title: "Part description",
      price: 20,
      quantity: 2
    });

  await request(app)
    .put(`/api/parts/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Part description new",
      price: 25,
      quantity: 4
    })
    .expect(200);

  const partResponse = await request(app)
    .get(`/api/parts/${response.body.id}`)
    .send();

  expect(partResponse.body.title).toEqual("Part description new");
  expect(partResponse.body.price).toEqual(25);
  expect(partResponse.body.quantity).toEqual(4);
});
