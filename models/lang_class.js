const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
   teacher : {
    type: Array,
    required: true,
  },
  students : {
    type: Array,
    required: false,
  },
   schedule : {
    type : String,
    required :true,
  },

}, { timestamps: true });

const Lang_class = mongoose.model('Lang_class', classSchema);
module.exports = Lang_class;