// ================================
// 🌐 Backend LovePlay (Render + Firebase)
// ================================

const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

let serviceAccount;

// Cargar credenciales de Firebase
if (process.env.FIREBASE_SERVICE_ACCOUNT && process.env.FIREBASE_SERVICE_ACCOUNT !== "") {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (e) {
    console.error("❌ No se pudo leer la variable FIREBASE_SERVICE_ACCOUNT:", e);
    process.exit(1);
  }
} else {
  try {
    serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));
  } catch (e) {
    console.error("❌ No se pudo leer el archivo serviceAccountKey.json:", e);
    process.exit(1);
  }
}

// Inicializar Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
console.log("✅ Firebase inicializado correctamente en Render.");

// Inicializar Express
const app = express();
app.use(bodyParser.json());

// ----------------------
// 🔹 Función auxiliar
// ----------------------
async function asegurarDocumento(collection, docId, datosIniciales) {
  const ref = db.collection(collection).doc(docId);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set(datosIniciales);
    return datosIniciales;
  }
  return snap.data();
}

// ----------------------
// 💳 Endpoint demo-payment
// ----------------------
app.post('/api/demo-payment', async (req, res) => {
  try {
    const { usuarioId, creadorId, postId, precio } = req.body;

    // Asegurar que los documentos de usuario y creador existan
    await asegurarDocumento('usuarios', usuarioId, { saldo: 0 });
    const creadorData = await asegurarDocumento('usuarios', creadorId, { saldo: 0 });

    // Guardar la compra
    await db.collection('compras').add({
      usuarioId,
      creadorId,
      postId,
      precio,
      fecha: new Date().toISOString(),
      estado: 'simulado'
    });

    // Actualizar saldo del creador
    const nuevoSaldo = (creadorData.saldo || 0) + precio;
    await db.collection('usuarios').doc(creadorId).set({ saldo: nuevoSaldo }, { merge: true });

    res.json({ success: true, mensaje: 'Compra registrada correctamente (modo demo)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------
// 📦 Servir frontend
// ----------------------
app.use(express.static(path.join(__dirname, "../dist")));

// Middleware comodín: redirige cualquier ruta desconocida a index.html
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// ----------------------
// 🚀 Iniciar servidor
// ----------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`💻 Backend LovePlay (Deploy Render) corriendo en puerto ${PORT}`));
