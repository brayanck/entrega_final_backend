const router = require("express").Router();
const {isAuthenticated,isAuthenticatedUser} = require('../utils/auth')
const {actualizarCarroController,obtenerCarroController,buscarCarroIdController,eliminarProductoController,eliminarCarroController,comprar}=require('../controllers/carts.controllers')

router.use(isAuthenticated)
router.use(isAuthenticatedUser)

router.get('/',buscarCarroIdController);
router.get("/:cid",obtenerCarroController);
router.delete("/:cid/products/:pid",eliminarProductoController);
router.delete("/:cid",eliminarCarroController);
router.put("/:cid/products/:pid", actualizarCarroController);
router.get("/:cid/purchase",comprar)

module.exports = router;
