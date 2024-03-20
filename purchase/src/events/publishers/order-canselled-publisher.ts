import { Publisher, Subject, OrderCancelledEvent } from "@partsmarket/common";

export class OrderCancelledublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subject.OrderCancelled;
}