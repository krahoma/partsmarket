import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

interface PartAttrs {
  title: string;
  price: number;
  quantity?: number;
}

export interface PartDoc extends mongoose.Document {
  title: string;
  price: number;
  quantity: number;
  isReserved(): Promise<boolean>;
}

interface PartMode extends mongoose.Model<PartDoc> {
  build(attrs: PartAttrs): PartDoc;
}

const partSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    quantity: {
      type: Number,
      require: false,
      default: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

partSchema.statics.build = (attrs: PartAttrs) => new Part(attrs);

partSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    part: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.InProcess, OrderStatus.Complete],
    },
  });
  return !!existingOrder;
};

const Part = mongoose.model<PartDoc, PartMode>("Part", partSchema);

export { Part };
