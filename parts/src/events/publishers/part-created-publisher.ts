import { Publisher, Subject, PartCreatedEvent } from "@partsmarket/common";

export class PartCreatedPublisher extends Publisher<PartCreatedEvent> {
  readonly subject = Subject.PartCreated;
}
