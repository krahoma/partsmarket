import request from "supertest";
import { app } from "../../app";

const createPart = () => {
  return request(app).post("/api/parts").set("Cookie", global.signin()).send({
    title: "Part description",
    price: 5,
    quantity: 2,
  });
};

it("can fetch a list of parts", async () => {
  await createPart();
  await createPart();
  await createPart();

  const response = await request(app).get("/api/parts").send().expect(200);

  expect(response.body.length).toEqual(3);
});
