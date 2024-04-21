import { Publisher, Subject, PaymentCreatedEvent } from "@partsmarket/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subject.PaymentCreated;
}
