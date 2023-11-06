const sendMail = require("./email.controler");
const {
  cartServices,
  userServices,
  productServices,
  ticketServices,
} = require("../daos/repositorys/index");
const buscarCarroIdController = async (req, res) => {
  try {
    const usuarioEmail = req.user.email;
    const usuario = await userServices.getUserByEmail(usuarioEmail);
    req.logger.info(usuario);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    req.logger.info(usuario.cartId);
    res.json(usuario.cartId);
  } catch (error) {
    req.logger.warn("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const obtenerCarroController = async (req, res) => {
  try {
    let carrito = req.params.cid;
    let carro = await cartServices.getCartById(carrito);
    res.render("cart", { carro });
  } catch (err) {
    req.logger.warn(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const eliminarProductoController = async (req, res) => {
  try {
    let carrito = req.params.cid;
    let producto = req.params.pid;
    const cart = await cartServices.getCartById(carrito);
    if (cart) {
      const updatedCart = await cartServices.eliminarProductDelCart(
        carrito,
        producto
      );
      res.json(updatedCart);
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
const eliminarCarroController = async (req, res) => {
  try {
    let carrito = req.params.cid;
    const result = await cartServices.vaciarCarro(carrito);
    res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
const actualizarCarroController = async (req, res) => {
  try {
    const count = parseInt(req.body.count);
    const carrito = req.params.cid;
    const producto = req.params.pid;
    const carro = await cartServices.getCartById(carrito);
    const product = await productServices.getProductById(producto);
    const user = await userServices.getUserByEmail(req.user.email)
    if (user._id.equals(product.owner)) {
      return res.json("No puedes agregar tu propio producto al carrito");
    }
    if (carro && product ) {
      const cartItem = carro.cart.find((item) => {
        if (item.product._id.toString() === producto.toString()) {
          return true;
        }
      });
      if (cartItem ) {
        if(cartItem.count+count<product.stock){
          const updatedCart = await cartServices.actualizarCantidadCart(
          carrito,
          product,
          count
        );
        return res.json({"message":"se actualizo la cantidad del carrito","peyload":updatedCart});
        }else{
          return res.json({"message":"no hay suficiente stock para el producto"})
        }
        
      } else {
        const updatedCart = await cartServices.pushProductToCart(
          carrito,
          product._id,
          count
        );
        return res.json({"message":"se introdujo el producto al carrito","peyload":updatedCart});
      }
    } else {
      res.json("El producto o el carrito no existen");
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const comprar = async (req, res) => {
  const carritoId = req.params.cid;
  try {
    const carro = await cartServices.getCartById(carritoId);
    if (!carro) {
      return res.json("El carrito no existe");
    }
    let descarte = [];
    let total = 0;
    for (const product of carro.cart) {
      const producto = await productServices.getProductById(
        product.product._id
      );
      if (product.count <= producto.stock) {
        producto.stock -= product.count;
        const updatedProduct = await productServices.restaProduct(
          product.product._id,
          producto
        ); // Llamada corregida
        if (!updatedProduct) {
          return res.status(500).json("Error al actualizar el producto");
        }
        await cartServices.eliminarProductDelCart(carritoId, product.id);
        total += product.product.price*product.count;
      } else {
        descarte.push(product);
      }
    }
    let tiket = {
      amount: total,
      purcharser: req.user.email,
    };
    let compradoTicket = await ticketServices.saveTiket(tiket);
    let email = {
      to: req.user.email,
      subject: "compra",
      text: "gracias por la compra",
      html: `<div class="container">
            <h1>ticket de compra</h1>
              <div class="row">
                      <h2 class="product-name"> codigo de compra: ${compradoTicket.code}</h2>
                      <div class="product-meta">
                          <p class="product-price">Precio: ${compradoTicket.amount}</p>
                          <p class="product-category">email: ${compradoTicket.purcharser}</p>
                      </div>
                  </div>
              </div>
          </div>`,
    };
    sendMail(email);

    res.render("ticket", compradoTicket);
    // Resto de tu código
  } catch (error) {
    req.logger.warn("Error:", error);
    return res.status(500).json("Error en el servidor");
  }
};

module.exports = {
  buscarCarroIdController,
  obtenerCarroController,
  eliminarProductoController,
  eliminarCarroController,
  actualizarCarroController,
  comprar,
};
