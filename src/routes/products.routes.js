const router = require("express").Router();
const { eliminarProductoController,paginateAdmin, actualizarProductController,  buscarProductController, guardarProductController, mokingProductController,paginateController } = require('../controllers/products.controller');

const { isAuthenticatedAorP, isAuthenticated } = require('../utils/auth');
const errorHadler = require('../middlewares/index.js');
router.get('/admin',isAuthenticatedAorP,paginateAdmin);
// Las rutas que requieren autenticación pero no están relacionadas con administradores
router.use(isAuthenticated);
// Rutas públicas
router.get('/mockingproducts', mokingProductController);
router.get('/:pid', buscarProductController);
router.get("/", paginateController);
// Rutas que requieren autenticación de administrador

router.use(isAuthenticatedAorP);
router.post('/', guardarProductController);
router.delete('/:pid', eliminarProductoController);
router.put('/:pid', actualizarProductController);


// Middleware para manejar errores
router.use(errorHadler)

module.exports = router;




