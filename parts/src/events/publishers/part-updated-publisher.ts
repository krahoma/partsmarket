import { PartUpdatedEvent, Publisher, Subject,  } from "@partsmarket/common";

export class PartUpdatedPublisher extends Publisher<PartUpdatedEvent> {
  readonly subject = Subject.PartUpdated;
}
