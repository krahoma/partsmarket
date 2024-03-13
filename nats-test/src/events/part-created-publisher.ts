import { Publisher } from "./base-publisher";
import { PartCreatedEvent } from "./part-created-event";
import { Subject } from "./subjects";

export class PartCreatedPublisher extends Publisher<PartCreatedEvent>{
    readonly subject = Subject.PartCreated;
}