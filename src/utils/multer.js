const multer = require('multer');
const fs = require('fs');
const path = require('path')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';

    if (file.fieldname === 'profileImage') {
      uploadPath = 'src/archivos/profiles/';
    } else if (file.fieldname === 'productImage') {
      uploadPath = 'src/archivos/products/';
    } else if (file.fieldname === 'document') {
      uploadPath = 'src/archivos/documents/';
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
// Configuración de multer para subir documentos
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.id; // Obtén el ID de usuario de los parámetros
    const userDir = `src/archivos/users/${userId}/`;

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const userDir = `src/archivos/users/${req.params.id}/`;
    const existingFiles = fs.readdirSync(userDir);

    // Verificar si ya existe un archivo con el mismo nombre de campo
    const fieldName = file.fieldname;
    const existingFile = existingFiles.find((existingFileName) => {
      return existingFileName.startsWith(fieldName + '-');
    });

    if (existingFile) {
      fs.unlinkSync(path.join(userDir, existingFile)); // Eliminar el archivo existente con el mismo nombre de campo
    }

    cb(null, fieldName + '-' + Date.now() + path.extname(file.originalname));
  },
});

const documentUpload = multer({ storage: documentStorage });
  module.exports={
    upload,
    documentUpload,
  }