const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());


// 💳 RUTA DEMO: Simulación de pago
app.post('/api/demo-payment', async (req, res) => {
  try {
    const { usuarioId, creadorId, postId, precio } = req.body;

    // Guardamos la compra en Firestore
    await db.collection('compras').add({
      usuarioId,
      creadorId,
      postId,
      precio,
      fecha: new Date().toISOString(),
      estado: 'simulado'
    });

    // Actualizamos saldo del creador
    const creadorRef = db.collection('usuarios').doc(creadorId);
    const creadorSnap = await creadorRef.get();
    const saldoActual = creadorSnap.exists ? creadorSnap.data().saldo || 0 : 0;
    await creadorRef.set({ saldo: saldoActual + precio * 0.79 }, { merge: true });

    res.json({ success: true, mensaje: 'Compra registrada correctamente (modo demo) 💖' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('💻 Backend LovePlay (DemoPagos) corriendo en puerto ' + PORT));
