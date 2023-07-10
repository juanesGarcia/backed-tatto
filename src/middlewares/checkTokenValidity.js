// utils/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

// Función para verificar la validez de un token
const checkTokenValidity = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        // Si hay un error al verificar el token, se considera inválido
        resolve(false);
      } else {
        // Si el token es válido, se considera válido
        resolve(true);
      }
    });
  });
};

module.exports = {
  checkTokenValidity
};
