import {
  Listener,
  ExpirationCompleteEvent,
  Subject,
  OrderStatus,
} from "@partsmarket/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  queueGroupName = queueGroupName;
  readonly subject = Subject.ExpirationComplete;
  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("part");
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    await new OrderCancelledublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      part: {
        id: order.part.id,
        quantity: order.part.quantity,
      },
    });
    msg.ack();
  }
}
