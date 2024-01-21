const admin = require("firebase-admin");
const serviceAccount = require("./credentials.json");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const sharp = require('sharp');  // Agregado sharp
const { parse } = require('url');

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://tattoproyect",  // Reemplaza con tu nombre de bucket
};

admin.initializeApp(firebaseConfig);
const storage = admin.storage();
const bucket = storage.bucket(firebaseConfig.storageBucket);

const uploadFiles = async (file) => {
  try {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;

    // Crear una referencia al archivo en Firebase Storage con el nombre único
    const storageRef = bucket.file(uniqueFilename);

    // Redimensionar la imagen usando sharp antes de subirla
    const resizedBuffer = await sharp(file.path)
      .resize({ width: 800, height: 1000, fit: 'cover' })  // Ajusta los tamaños según tus necesidades
      .toBuffer();

    // Crear un flujo de escritura para cargar el archivo redimensionado en Storage
    const writeStream = storageRef.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Pipe (redirigir) el flujo de lectura al flujo de escritura
    const readableStream = require('stream').Readable.from(resizedBuffer);
    readableStream.pipe(writeStream);

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
      uniqueFilename,
      url: url,
      expires: '01-01-2030',
    };
  } catch (error) {
    console.error("Error al subir el archivo a Firebase Storage:", error);
    throw error;
  }
};

const deleteFileByName = async (filename) => {
  try {
    await storage.bucket(bucketName).file(filename).delete();
    console.log(`Archivo eliminado con éxito: ${filename}`);
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
    throw error;
  }
};
const getFileNameFromUrl = (imageUrl) => {
  const parsedUrl = parse(imageUrl);
  const pathnameSegments = parsedUrl.pathname.split('/');
  const fileName = pathnameSegments[pathnameSegments.length - 1];
  return fileName;
};
const deleteFileByNamepro = async (filename) => {
  try {
    await bucket.file(filename).delete();
    console.log(`Archivo eliminado con éxito: ${filename}`);
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
    throw error;
  }
};


module.exports = {
  uploadFiles,
  deleteFileByName,
  getFileNameFromUrl,
  deleteFileByNamepro

};



