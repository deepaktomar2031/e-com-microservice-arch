import mongoose from 'mongoose';

interface OrderAttrs {
  productId: string;
  quantity: number;
  userId: string;
}

interface OrderModel extends mongoose.Model<any> {
  build(attrs: OrderAttrs): any;
}

const orderSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  userId: { type: String, required: true },
});

const Order = mongoose.model<any, OrderModel>('Order', orderSchema);

export { Order };