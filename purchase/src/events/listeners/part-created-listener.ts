import { Subject, Listener, PartCreatedEvent } from "@partsmarket/common";
import { Part } from "../../models/part";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

export class PartCreatedListener extends Listener<PartCreatedEvent> {
  subject: Subject.PartCreated = Subject.PartCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: PartCreatedEvent["data"], msg: Message) {
    const { id, title, price, quantity } = data;
    const part = Part.build({ id, title, price, quantity });
    await part.save();
    msg.ack();
  }
}
