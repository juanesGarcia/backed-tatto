const admin = require("firebase-admin");
const serviceAccount = require("./credentials.json");
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://tattoproyect"  // Reemplaza con tu nombre de bucket
};



admin.initializeApp(firebaseConfig);
const storage = admin.storage();
const bucket = storage.bucket(firebaseConfig.storageBucket);

const uploadFiles = async (file) => {
    try {
      // Generar un nombre único para el archivo en Firebase Storage
      const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
  
      // Crear una referencia al archivo en Firebase Storage con el nombre único
      const storageRef = bucket.file(uniqueFilename);
  
      // Convertir el buffer del archivo a un stream de lectura
      const fileStream = require('fs').createReadStream(file.path);
  
      // Opciones para la carga del archivo
      const options = {
        destination: uniqueFilename, // Usar el nombre único aquí
        metadata: {
          contentType: file.mimetype,
        },
      };
  
      // Crear un flujo de escritura para cargar el archivo en Storage
      const writeStream = storageRef.createWriteStream(options);
  
      // Pipe (redirigir) el flujo de lectura al flujo de escritura
      fileStream.pipe(writeStream);
  
      // Manejar eventos de finalización y errores
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
  
      console.log('Archivo subido con éxito:', uniqueFilename);
  
      // Obtener la URL del archivo
      const [url] = await storageRef.getSignedUrl({
        action: 'read',
        expires: '01-01-2030', // Definir una fecha de caducidad
      });
  
     
  
      return {
        url:url,
        expires: '01-01-2030',
      }
    } catch (error) {
      console.error("Error al subir el archivo a Firebase Storage:", error);
      throw error;
    }
  };
  
module.exports = {
  uploadFiles
};
