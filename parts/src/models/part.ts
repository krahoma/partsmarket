import mongoose from "mongoose";

interface PartAttrs {
  title: string;
  price: number;
  quantity: number;
  userId: string;
}

interface PartDoc extends mongoose.Document {
  title: string;
  price: number;
  quantity: number;
  userId: String;
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

partSchema.statics.build = (attrs: PartAttrs) => new Part(attrs);

const Part = mongoose.model<PartDoc, PartMode>("Part", partSchema);

export { Part };
