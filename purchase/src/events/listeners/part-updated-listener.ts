import { Subject, Listener, PartUpdatedEvent } from "@partsmarket/common";
import { Part } from "../../models/part";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

export class PartUpdatedListener extends Listener<PartUpdatedEvent> {
  readonly subject = Subject.PartUpdated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: PartUpdatedEvent["data"], msg: Message) {
    const part = await Part.findByEvent(data);
    if (!part) {
      throw new Error("Part not found");
    }

    const { title, price, quantity } = data;
    part.set({ title, price, quantity });
    await part.save();
    console.log(part);
    msg.ack();
  }
}
