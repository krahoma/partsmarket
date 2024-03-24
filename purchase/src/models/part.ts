import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { verify } from "jsonwebtoken";

interface PartAttrs {
  id: string;
  title: string;
  price: number;
  quantity?: number;
}

export interface PartDoc extends mongoose.Document {
  version: number;
  title: string;
  price: number;
  quantity: number;
  isReserved(): Promise<boolean>;
}

interface PartMode extends mongoose.Model<PartDoc> {
  build(attrs: PartAttrs): PartDoc;
  findByEvent(event: { id: string; version: number }): Promise<PartDoc | null>;
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

partSchema.set("versionKey", "version");
partSchema.plugin(updateIfCurrentPlugin);
// partSchema.pre('save', function(done){
//   //@ts-ignore
//   this.$where={
//     version: this.get('version') -1
//   };
// });

partSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Part.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
partSchema.statics.build = (attrs: PartAttrs) => {
  return new Part({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
    quantity: attrs.quantity,
  });
};
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
