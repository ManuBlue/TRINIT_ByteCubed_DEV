const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema1 = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email : {
    type: String,
    required: true,
  },
  phno : {
    type: String,
    required: true,
  },
  classes : {
    type : Object,
    required :false,
  },

}, { timestamps: true });

const StudentAccount = mongoose.model('StudentAccount', accountSchema1);
module.exports = StudentAccount;