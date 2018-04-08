import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', require: true },
  type: { type: 'String', require: true },
  coin: { type: 'String', require: true },
  price: { type: 'number', require: true },
  amount: { type: 'number', require: true },
  amountRemain: { type: 'number', require: true },
  stage: { type: 'String', default: 'open' },
  exchanges: { type: Schema.Types.ObjectId, ref: 'Exchange' },
  dateCreated: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);
