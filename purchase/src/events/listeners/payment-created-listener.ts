import {
  Subject,
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
} from "@partsmarket/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subject.PaymentCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const { id, orderId, stripeId } = data;
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.set({
      status: OrderStatus.Complete,
      paymentId: stripeId,
    });

    await order.save();

    msg.ack();
  }
}
