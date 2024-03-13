import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { PartCreatedEvent } from "./part-created-event";
import { Subject } from "./subjects";

export class PartCreatedListener extends Listener<PartCreatedEvent> {
  readonly subject = Subject.PartCreated;
  queueGroupName = "payments-service";
  onMessage(data: PartCreatedEvent["data"], msg: Message): void {
    console.log(`Event #${msg.getSequence()}`, data);
    msg.ack();
  }
}
