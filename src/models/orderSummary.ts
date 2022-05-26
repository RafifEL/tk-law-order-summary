/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';

export interface IOrderSummary {
  orderId: string;
  downloadLink: string;
}

interface OrderDoc extends IOrderSummary, mongoose.Document {}

const orderSummarySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  downloadLink: {
    type: String,
    required: true,
  },
});

orderSummarySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const OrderSummary = mongoose.model<OrderDoc>(
  'OrderSummary',
  orderSummarySchema
);
