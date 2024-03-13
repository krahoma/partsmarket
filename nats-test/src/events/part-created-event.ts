import { Subject } from "./subjects";

export interface PartCreatedEvent {
  subject: Subject.PartCreated;
  data: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  };
}
