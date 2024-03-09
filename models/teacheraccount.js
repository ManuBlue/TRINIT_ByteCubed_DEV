const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema2 = new Schema({
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
  qualification : {
    type : String,
    required: true,
  },
  schedule : {
    type : String,
    required: true,
  },
  price : {
    type: String,
    required : true,
  },
  language : {
    type: String,
    required : true,
  },
  classes_taught : {
    type : Array,
    required : false,
  },
  students : {
    type : Array,
    required : false,
  },
  question : {
    type : Array,
    required : false,
  },


}, { timestamps: true });

const TeacherAccount = mongoose.model('TeacherAccount', accountSchema2);
module.exports = TeacherAccount;