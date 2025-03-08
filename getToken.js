const admin = require('firebase-admin');

// Cargar las credenciales de Firebase
const serviceAccount = require('./config/firebase-admin.json'); // Ajusta la ruta si es necesario

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Generar un token de autenticación para un usuario
const uid = "usuario_de_prueba"; // Usa un UID real de Firebase Authentication

admin.auth().createCustomToken(uid)
  .then((customToken) => {
    console.log("🔑 Token generado:");
    console.log(customToken);
  })
  .catch((error) => {
    console.error("🚨 Error generando token:", error);
  });
