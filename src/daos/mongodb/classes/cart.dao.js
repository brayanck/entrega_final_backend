const cartModel = require("../models/carts.model");

class Cart {
    saveCart = async () => {
        try {
            const newCart = new cartModel();
            await newCart.save();
            return newCart;
        } catch (err) {
            return null;
        }
    };
    getCart = async (id) => {
        try {
            return await cartModel.findOne({ _id: id });
        } catch (err) {
            return null;
        }
    };
    eliminarProduct = async (idCart, idProducto) => {
        try {
            return await cartModel.findOneAndUpdate(
                { _id: idCart },
                { $pull: { cart: { _id: idProducto } } },
                { new: true }
            );
        } catch (err) {
            return null;
        }
    };
    vaciar = async (idCarrito) => {
        try {
            return await cartModel.updateOne(
                { _id: idCarrito },
                { $set: { cart: [] } }
            );
        } catch (err) {
            return null;
        }
    };
    actualizarCantidad = async (idCarrito, idProducto, count) => {
        try {
            return await cartModel.findOneAndUpdate(
                { _id: idCarrito, "cart.product": idProducto },
                { $inc: { "cart.$.count": count } },
                { new: true }
            );
        } catch (err) {
            return null;
        }
    };
    pushProduct = async (idCarrito, idProducto, count) => {
        try {
            return await cartModel.findByIdAndUpdate(
                { _id: idCarrito },
                { $push: { cart: { product: idProducto, count } } },
                { new: true }
            );
        } catch (err) {
            return null;
        }
    };
}
module.exports = Cart;
