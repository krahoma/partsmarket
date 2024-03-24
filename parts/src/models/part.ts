import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PartAttrs {
  title: string;
  price: number;
  quantity: number;
  userId: string;
}

interface PartDoc extends mongoose.Document {
  version: number;
  title: string;
  price: number;
  quantity: number;
  userId: string;
  orderId?: string;
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
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

partSchema.set("versionKey", "version");
partSchema.plugin(updateIfCurrentPlugin);
partSchema.statics.build = (attrs: PartAttrs) => new Part(attrs);

const Part = mongoose.model<PartDoc, PartMode>("Part", partSchema);

export { Part };
