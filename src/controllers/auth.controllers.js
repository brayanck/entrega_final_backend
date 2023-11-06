const { generateResetToken } = require("../config/refreshToken");
const sendEmail = require("./email.controler");
const { createHash, isValidPassword } = require("../utils/bcrypts");
const { userServices } = require("../daos/repositorys/index");
const Front = require('../daos/dto/front.dto')
const fs = require("fs");
const path = require('path')
const {SERVER_URL} =require('../config/config')
const renderRegisterControllers = (req, res) => {
  res.render("register", {});
};
const renderLoginControllers = (req, res) => {
  res.render("login", {});
};
const logoutControllers = async (req, res) => {
  const usuarioEmail = req.user.email;
  const usuario = await userServices.getUserByEmail(usuarioEmail);
  await userServices.updateUser((usuario._id, { last_connection: new Date() }));
  req.logOut(() => { });
  res.clearCookie("connect.sid");
  res.redirect("/api/users/login");
};
const resetPaawordRender = (req, res) => {
  res.render("password", {});
};
const resetPaawordFormRender = (req, res) => {
  res.render("formpass", {});
};

const resetPaaword = async (req, res) => {
  try {
    // Genera un token de cambio de contraseña y almacénalo en la sesión
    const token = generateResetToken();
    req.session.resetPasswordToken = token;

    // Envía el correo electrónico con el enlace de cambio de contraseña
    const email = req.body.email; // El correo del usuario al que enviar el enlace
    const user = await userServices.getUserByEmail(email);
    const pass = {
      resetToket: token,
    };
    const update = await userServices.updateUser({ _id: user._id }, pass);
    const resetLink = `${SERVER_URL}/api/users/cambiar-password?token=${token}`;
    const toData = {
      to: email,
      Text: "hey user",
      subject: "Restablecer contraseña",
      html: `Haz clic en este enlace para restablecer tu contraseña: ${resetLink}`,
    };
    sendEmail(toData);
    res.redirect("/api/users/login");
  } catch (err) {
    res.json(err);
  }
};
const cambioContraseña = async (req, res) => {
  const newPassword = req.body.newPassword;
  const tokenWithTimestamp = req.body.token;
  const [token, expirationTime] = tokenWithTimestamp.split(":");
  const currentTime = Date.now();
  const user = await userServices.getUserByToken(tokenWithTimestamp);
  const isMatch = isValidPassword(user, newPassword);
  if (isMatch) {
    return res.redirect(
      `${SERVER_URL}/api/users/cambiar-password?token=${tokenWithTimestamp}`
    );
  }
  if (currentTime <= Number(expirationTime)) {
    // El token no ha expirado, puedes permitir el cambio de contraseña aquí
    // Actualiza la contraseña del usuario en tu base de datos

    const passwordHas = createHash(newPassword);
    const pass = {
      password: passwordHas,
    };
    const update = await userServices.updateUser({ _id: user._id }, pass);
    // Luego, elimina el token de la sesión
    delete req.session.resetPasswordToken;

    res.status(200).json({ message: "Contraseña cambiada con éxito" });
  } else {
    res
      .status(400)
      .json({ message: "Token de restablecimiento de contraseña expirado" });
  }
};
const cambiarRole = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    if (req.user.role === "premium") {
      // Si el usuario ya es "premium," cambiarlo a "user" y redirigir
      const update = await userServices.updateUser(id, { role: "user" });
      return res.redirect("/api/users/logout");
    }

    const userDocumentPath = `src/archivos/users/${id}/`;

    // Obtener la lista de archivos en la carpeta de documentos
    const files = fs.readdirSync(userDocumentPath);
    // Verificar la existencia de los tres archivos
    const dniExists = files.some((file) => file.startsWith("dni-"));
    const addressProofExists = files.some((file) =>
      file.startsWith("addressProof-")
    );
    const bankStatementExists = files.some((file) =>
      file.startsWith("bankStatement-")
    );
    if (dniExists && addressProofExists && bankStatementExists) {
      // Cambiar el rol a "premium" si se cumplen todos los requisitos
      const update = await userServices.updateUser(id, { role: "premium" });
      res.redirect("/api/users/logout");
    } else {
      res.status(400).json({ error: "Faltan archivos requeridos" });
    }
  } catch (err) {
    res.status(500).json({ error: "no se pudo cambiar de rol" });
  }
};

const buscarUserIdController = async (req, res) => {
  try {
    const usuarioEmail = req.user.email;
    const usuario = await userServices.getUserByEmail(usuarioEmail);
    req.logger.info(usuario);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    req.logger.info(usuario._id);
    res.json(usuario._id);
  } catch (error) {
    req.logger.warn("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getAllUsersController = async (req, res) => {
  try {
    const users = await userServices.getAllUsers();
    const allUsers = users.map((objeto) => new Front(objeto));
    res.render("users", { allUsers });
  } catch (error) {
    req.logger.warn("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const eliminarUsuario = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userServices.deleteUser(email);
    res.json(user);
  } catch (error) {
    req.logger.warn("Error al eliminar el usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const asignarRole = async (req, res) => {
  try {
    const { email, role } = req.body;
    const user = await userServices.getUserByEmail(email);
    const update = await userServices.updateUser(user._id, { role: role });
    res.json("update");
  } catch (error) {
    req.logger.warn("Error al cambiar rol:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const limpiarUsuarios = async (req, res) => {
  try {
    const users = await userServices.getAllUsers();
    users.forEach(async (user) => {
      const fechaActual = new Date();
      const fechaLimite = new Date(fechaActual - 1000 * 60 * 60 * 24 * 2);
      if (new Date(user.last_connection) < fechaLimite) {
        await userServices.deleteUser(user.email);
        const toData = {
          to: user.email,
          Text: "cuenta eliminada",
          subject: "eliminamos tu cuenta",
          html: `usuario lo sentimos por temas de inactividad eliminamos su cuenta`,
        };
        sendEmail(toData);
      }
    });
    res.json("realizado");
  } catch (error) {
    req.logger.warn("Error al limpiar:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const obtenerUser =(req,res)=>{
  res.json(req.user);
}
const carpetaExist =(req, res) => {
  // Verificar si la carpeta del usuario existe antes de cargar la vista
  const userId = req.params.id;
  const userDir = path.join(__dirname, '..', 'archivos', 'users', userId); // Usa path.join para construir rutas
  const folderExists = fs.existsSync(userDir);

  res.render('uploadArchivos', { userId, folderExists });
}
module.exports = {
  renderRegisterControllers,
  renderLoginControllers,
  logoutControllers,
  resetPaaword,
  cambioContraseña,
  resetPaawordRender,
  resetPaawordFormRender,
  cambiarRole,
  buscarUserIdController,
  getAllUsersController,
  eliminarUsuario,
  asignarRole,
  limpiarUsuarios,
  obtenerUser,
  carpetaExist
};
