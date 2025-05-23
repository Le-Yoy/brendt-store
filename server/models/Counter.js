// server/models/Counter.js

const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
});

counterSchema.statics.getNextSequence = async function(sequenceName) {
  const counter = await this.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequence_value;
};

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;