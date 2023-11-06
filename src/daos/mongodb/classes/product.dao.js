const ProductModel = require("../models/products.model");
class Product {
    getProduct = async (idProducto) => {
        try {
            return await ProductModel.findOne({ _id: idProducto });
        } catch (err) {
            return null;
        }
    };
    deleteProduct = async (idProducto) => {
        try {
            return await ProductModel.findByIdAndDelete(idProducto)
        } catch (err) {
            return null;
        }
    };
    saveProduct = async (Data) => {
        try {
            return await ProductModel.create(Data);
        } catch (err) {
            return null;
        }
    };
    paginacion = async (query, limit = 10, page = 1, sort) => {
        try {
            return await ProductModel.paginate(query, {
                limit: limit,
                page: page,
                sort: sort,
            });
        } catch (err) {
            return null;
        }
    };
    restaProduct = async (id, data) => {
        try {
            const updateProduct = await ProductModel.findByIdAndUpdate(
                id, // Solo necesitas pasar el ID aquí
                data,
                {
                    new: true,
                }
            );
            return updateProduct; // Devuelve el producto actualizado en lugar de usar res.json()
        } catch (err) {
            return null;
        }
    };

}

module.exports = Product;
