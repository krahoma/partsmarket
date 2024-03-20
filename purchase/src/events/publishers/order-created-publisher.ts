import { Publisher, Subject, OrderCreatedEvent } from "@partsmarket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated;
}
