const { productServices, userServices } = require('../daos/repositorys/index')
const CustomError = require('../services/errors/CustomError')
const { generateProductErrorInfo } = require('../services/errors/CreationErrorMessage/ProductMessage')
const EErrors = require('../services/errors/enums')
const { ADMIN_EMAIL } = require('../config/config')
const sendEmail = require('./email.controler')
const buscarProductController = async (req, res) => {
  try {
    let producto = req.params.pid;
    let produc = await productServices.getProductById(producto)
    req.logger.info(produc);
    if (produc) {
      res.render("detalle", produc);
    } else {

      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (err) {
    req.logger.warn(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const guardarProductController = async (req, res, next) => {
  req.logger.info(req.body);
  try {
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        // Verifica si la propiedad es una cadena vacía
        if (req.body[key] === '') {

          CustomError.createError({
            name: "Product creation error",
            cause: generateProductErrorInfo(req.body),
            message: "Error to create product - TEST",
            code: EErrors.INVALID_TYPES_ERROR
          })

        }
      }
    }
    let data = req.body
    if (req.user) {
      const usuario = await userServices.getUserByEmail(req.user.email)
      data.owner = usuario._id
    } else {
      const admin = await userServices.getUserByEmail(ADMIN_EMAIL)
      data.owner = admin._id
    }


    const savedProduct = await productServices.createProduct(data);
    res.redirect("/api/product/admin");
  } catch (err) {
    // Maneja el error personalizado aquí
    req.logger.warn(err); // Asegúrate de que estás viendo los detalles del error en la consola
    res.status(500).send({ error: err.code, message: err.message });
  }
};
const eliminarProductoController = async (req, res) => {
  try {
    let id = req.params.pid
    const product = await productServices.getProductById(id);
    const user = await userServices.getUserByEmail(req.user.email);
    if(product.owner.role =="premium"){
      const toData = {
      to: product.owner.email,
      Text: "hey user",
      subject: "eliminacion de tu producto",
      html: `lo sentimos un administrador a eliminado tu producto`,
    };
      sendEmail(toData)
    }
    if (req.user.role === "admin") { // Corregido el uso de ===
      const deletedProduct = await productServices.deleteProduct(id);
      res.json(deletedProduct);
    }else{
      if (req.user.role === "premium") { // Corregido el uso de ===
        if (product && product.owner.equals(user._id)) { // Verificar si product no es nulo
          const deletedProduct = await productServices.deleteProduct(id);
          res.json(deletedProduct);
        }
        else {
          res.json("No tienes permisos");
        }
      }
    }
    

  } catch (err) {
    res.json(err)
  }

}
const actualizarProductController = async (req, res) => {
  let id = req.params.pid
  let data = req.body
  const savedProduct = await productServices.restaProduct(id, data)
  res.redirect("/api/product/admin")
}
const { generateProduct } = require('../utils/mock')
const mokingProductController = async (req, res) => {
  try {
    let products = [];
    for (let i = 0; i < 100; i++) {
      products.push(generateProduct())
    }
    res.send(products)
  } catch (err) {
    req.logger.warn(err);
    return res.status(500).json({ error: "Internal server error" });
  }


}

const paginateController = async (req, res) => {
  try {
      let limit = parseInt(req.query.limit, 10) || 10
      let page = parseInt(req.query.page, 10) || 1
      let order
      if (req.query.order === 'desc') {
          order = -1
      }
      if (req.query.order === 'asc') {
          order = 1
      }
      let query = {};
      if (req.query.category) {
          query.category = req.query.category;
      }
      let sortOptions = {};
      if (req.query.order) {
          sortOptions.price = order;
      }
      let products = await productServices.paginacion(query,limit,page,sortOptions);
      // Agregar las propiedades nextLink y prevLink a products
      products.nextLink = `/api/product/?page=${products.nextPage}`;
      products.prevLink = `/api/product/?page=${products.prevPage}`;
      if (req.query.category) {
          products.nextLink = products.nextLink + `&category=${req.query.category}`;
          products.prevLink = products.prevLink + `&category=${req.query.category}`;
      }
      if (req.query.limit) {
          products.nextLink = products.nextLink + `&limit=${req.query.limit}`;
          products.prevLink = products.prevLink + `&limit=${req.query.limit}`;
      }
      if (req.query.order) {
          products.nextLink = products.nextLink + `&order=${req.query.order}`;
          products.prevLink = products.prevLink + `&order=${req.query.order}`;
      }
      res.render("paginate", { products });
  } catch (err) {
      req.logger.warn(err);
      return res.status(500).json({ error: 'Internal server error' });
  }
}

const paginateAdmin = async (req, res) => {
  try {
      let limit = parseInt(req.query.limit, 10) || 10
      let page = parseInt(req.query.page, 10) || 1
      let order
      if (req.query.order === 'desc') {
          order = -1
      }
      if (req.query.order === 'asc') {
          order = 1
      }
      let query = {};
      if (req.query.category) {
          query.category = req.query.category;
      }
      let sortOptions = {};
      if (req.query.order) {
          sortOptions.price = order;
      }
      let products = await productServices.paginacion(query,limit,page,sortOptions);
      // Agregar las propiedades nextLink y prevLink a products
      products.nextLink = `/api/product/admin?page=${products.nextPage}`;
      products.prevLink = `/api/product/admin?page=${products.prevPage}`;
      if (req.query.category) {
          products.nextLink = products.nextLink + `&category=${req.query.category}`;
          products.prevLink = products.prevLink + `&category=${req.query.category}`;
      }
      if (req.query.limit) {
          products.nextLink = products.nextLink + `&limit=${req.query.limit}`;
          products.prevLink = products.prevLink + `&limit=${req.query.limit}`;
      }
      if (req.query.order) {
          products.nextLink = products.nextLink + `&order=${req.query.order}`;
          products.prevLink = products.prevLink + `&order=${req.query.order}`;
      }
      res.render("products", { products });
  } catch (err) {
      req.logger.warn(err);
      return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  buscarProductController,
  guardarProductController,
  eliminarProductoController,
  actualizarProductController,
  mokingProductController,
  paginateController,
  paginateAdmin
};
