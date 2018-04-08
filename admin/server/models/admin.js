import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  salt: { type: 'String', default: '' },
  userName: { type: 'String', required: true, unique: true },
  password: { type: 'String', required: true },
  role: { type: 'String', required: true },
  disabled: { type: 'Boolean', default: false },

  dateCreated: { type: Date, default: Date.now },
});

export default mongoose.model('Admin', adminSchema);
