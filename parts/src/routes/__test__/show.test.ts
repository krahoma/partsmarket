import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("return a 404 if the part is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/parts/${id}`)
    .send()
    .expect(404);
  //console.log(response);
});

it("return the part if the part is found", async () => {
  const title = "Part description";
  const price = 15

  const respose = await request(app)
    .post("/api/parts")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
      quantity: 2,
      
    })
    .expect(201);

  
  const partResponse = await request(app)
    .get(`/api/parts/${respose.body.id}`)
    .send()
    .expect(200);

  expect(partResponse.body.title).toEqual(title);
  expect(partResponse.body.price).toEqual(price);
});
