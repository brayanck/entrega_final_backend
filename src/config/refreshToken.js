const crypto = require('crypto')
function generateResetToken() {
    const token = crypto.randomBytes(32).toString('hex'); // Genera un token hexadecimal de 32 bytes
    const expirationTime = Date.now() + 3600000; // 1 hora en milisegundos
    return `${token}:${expirationTime}`;
  }
module.exports = {generateResetToken}