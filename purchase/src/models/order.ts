import { OrderStatus } from "@partsmarket/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { PartDoc } from "./part";

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  part: PartDoc;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  part: PartDoc;
}

interface OrderMode extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    part: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Part",
      require: true,
    },
  },
  {
    toJSON: {
      //versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => new Order(attrs);

const Order = mongoose.model<OrderDoc, OrderMode>("Order", orderSchema);

export { Order };
export { OrderStatus };
