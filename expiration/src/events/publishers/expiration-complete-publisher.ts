import {
  Subject,
  Publisher,
  ExpirationCompleteEvent,
} from "@partsmarket/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
}
