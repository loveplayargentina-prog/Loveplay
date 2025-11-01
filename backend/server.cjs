const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT && process.env.FIREBASE_SERVICE_ACCOUNT.trim() !== "") {
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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
console.log("✅ Firebase inicializado correctamente en Render");

const app = express();
app.use(bodyParser.json());

// Función para asegurar que un documento exista
async function asegurarDocumento(collection, docId, datosIniciales = {}) {
  const ref = db.collection(collection).doc(docId);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set(datosIniciales);
    return datosIniciales;
  }
  return snap.data();
}

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
    const nuevoSaldo = (creadorData.saldo || 0) + precio * 0.8; // 80% para creador
    await db.collection('usuarios').doc(creadorId).set({ saldo: nuevoSaldo }, { merge: true });

    res.json({ success: true, mensaje: 'Compra registrada correctamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`💻 Backend LovePlay (Demo) corriendo en puerto ${PORT}`));
