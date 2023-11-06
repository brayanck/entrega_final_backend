const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
    }

}) 
ProductSchema.pre('findOne', function (next) {
    this.populate('owner');
    next();
  });
ProductSchema.plugin(mongoosePaginate)
const Product =mongoose.model("Product",ProductSchema)
module.exports = Product