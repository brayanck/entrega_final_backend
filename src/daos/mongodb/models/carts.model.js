const mongoose = require('mongoose');


const CartsSchema = new mongoose.Schema({
    cart: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        count: {
          type: Number,
          required: true
        }
      }
    ],
    default: []
  }

});

CartsSchema.pre('findOne', function (next) {

  this.populate('cart.product');
  next();
});

const Cart = mongoose.model('Cart', CartsSchema);
module.exports = Cart;