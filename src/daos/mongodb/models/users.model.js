const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  first_name:{
    type:String,
    required:true,
  },
  last_name:{
    type:String,
    required:true,
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  age:{
    type:Number,
    required:true
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type:String,
    default:"user"
  },
  last_connection:{
    type:String
  },
  documents: [
    {
      name: { type: String},
      reference: { type: String } ,
    },
  ],
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  resetToket:String
});


const User = mongoose.model('User', emailSchema);
module.exports = User;