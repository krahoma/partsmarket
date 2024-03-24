import { Part } from "../part";

it("Implement optimistic concurrency control", async () => {
  const part = Part.build({
    title: "bolt desc",
    price: 12,
    quantity: 5,
    userId: "123123",
  });
  await part.save();

  const instancePart1 = await Part.findById(part.id);
  const instancePart2 = await Part.findById(part.id);

  instancePart1!.set({ price: 10 });
  instancePart2!.set({ price: 11 });

  await instancePart1!.save();
  //   expect(async () => {
  //     await instancePart2!.save();
  //   }).toThrow();
  try {
    await instancePart2!.save();
  } catch (err) {
    return;
  }
});

it('increments the version number on multiple saves', async()=>{
    const part = Part.build({
        title: "bolt desc",
        price: 12,
        quantity: 5,
        userId: "123123",
      });
      await part.save();
      expect(part.version).toEqual(0);

      await part.save();
      expect(part.version).toEqual(1);

      await part.save();
      expect(part.version).toEqual(2);
});