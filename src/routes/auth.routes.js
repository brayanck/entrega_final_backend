const router = require("express").Router();
const passport = require("passport");
const{isAuthenticatedAdmin,isAuthenticatedAorP}=require('../utils/auth')
const {carpetaExist,obtenerUser,limpiarUsuarios, renderRegisterControllers,asignarRole,eliminarUsuario, renderLoginControllers,getAllUsersController, logoutControllers,resetPaaword,cambioContraseña,resetPaawordRender,resetPaawordFormRender, cambiarRole,buscarUserIdController} = require('../controllers/auth.controllers')
const { documentUpload,upload } = require('../utils/multer');


router.get("/cambiar-password",resetPaawordFormRender)
router.get("/password-reset",resetPaawordRender)
router.post('/enviar-correo-cambio-contrasena',resetPaaword);

router.post('/cambiar-contrasena', cambioContraseña);


router.get("/register", renderRegisterControllers);
router.get('/login', renderLoginControllers);
router.get("/logout", logoutControllers);
router.post("/register/crear", passport.authenticate("local-register", {
    failureRedirect: "/api/users/register",
    successRedirect: "/api/users/login",
    passReqToCallback: true 
}));
router.post("/login/crear", passport.authenticate("local-login", {
    failureRedirect: "/api/users/login",
    successRedirect: "/api/perfil",
    passReqToCallback: true
}))
router.get("/github", passport.authenticate("github", {
    scope: ["user:email"],
    session: false
}))
router.get('/github/callback', passport.authenticate('github', {
    successRedirect: "/api/perfil",
    failureRedirect: '/'
}));
router.get('/user', obtenerUser)

router.get("/premium/:id", cambiarRole)
router.get("/buscarId",buscarUserIdController)

router.get('/:id/documents', carpetaExist);

// Ruta para cargar documentos del usuario por su ID
router.post('/:id/documents', documentUpload.fields([
  { name: 'dni', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'bankStatement', maxCount: 1 },
]), (req, res) => {
  res.send('Documentos subidos y reemplazados con éxito.');
});


router.post('/subida', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'productImage', maxCount: 1 },
  { name: 'document', maxCount: 1 },
]), (req, res) => {
  // El middleware de Multer ya habrá guardado los archivos en las carpetas correspondientes
  res.send("imagen subida"); // Renderiza la vista upload.hbs
});

router.get('/subida',isAuthenticatedAorP, (req, res) => {
  res.render('subida');
});


router.get("/",isAuthenticatedAdmin,getAllUsersController)
router.delete("/eliminar",isAuthenticatedAdmin,eliminarUsuario)
router.put("/asignar",isAuthenticatedAdmin,asignarRole)
router.delete("/limpiar",isAuthenticatedAdmin,limpiarUsuarios)
module.exports = router