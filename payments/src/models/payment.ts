import mongoose from "mongoose";

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
  amount: number;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
  amount: number;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  buidl(atts: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      require: true,
      type: String,
    },
    stripeId: {
      require: true,
      type: String,
    },
    amount: {
      require: true,
      type: Number,
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

paymentSchema.statics.buidl = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);

export { Payment };
