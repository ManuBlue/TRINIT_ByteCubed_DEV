const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doubtSchema = new Schema({
  mydoubt: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: false,
  },
  answer : {
    type: String,
    required: false,
  },

}, { timestamps: true });

const Doubt = mongoose.model('Doubt', doubtSchema);
module.exports = Doubt;