import { Listener, OrderCreatedEvent, Subject } from "@partsmarket/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const orderCheck = await Order.findById(data.part.id);
    if (orderCheck) {
      throw new Error("Dublicate order found");
    }

    const order = Order.build({
      id: data.id,
      version: data.version,
      status: data.status,
      userId: data.userId,
      total: data.part.price * data.part.quantity,
    });
    await order.save();
    msg.ack();
  }
}
