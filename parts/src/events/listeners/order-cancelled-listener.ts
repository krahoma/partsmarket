import { Listener, OrderCancelledEvent, Subject } from "@partsmarket/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Part } from "../../models/part";
import { PartUpdatedPublisher } from "../publishers/part-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subject.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const part = await Part.findById(data.part.id);
    if (!part) {
      throw new Error("Part not found");
    }

    part.set({ orderId: undefined });

    await part.save();
    await new PartUpdatedPublisher(this.client).publish({
      id: part.id,
      version: part.version,
      title: part.title,
      price: part.price,
      quantity: part.quantity,
      userId: part.userId,
      orderId: part.orderId,
    });

    msg.ack();
  }
}
