import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

export default function ConfigPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [nombre, setNombre] = useState('');
  const [foto, setFoto] = useState('');


  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'usuarios', user.uid), {
          nombre: nombre || 'Sin nombre',
          foto
        });
        alert('Datos actualizados 💾');
      }
    } catch (e) {
      alert('Error al guardar: ' + e.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    alert('Sesión cerrada 💋');
    window.location.href = '/';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: '100vh',
        padding: '30px 20px',
        background: darkMode ? '#121212' : 'linear-gradient(135deg,#ff8de3,#c17bff)',
        color: darkMode ? '#fff' : '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2 style={{ marginBottom: '20px' }}>⚙️ Configuración</h2>

      <label>Nombre:</label>
      <input 
        value={nombre}
        onChange={(e)=>setNombre(e.target.value)}
        placeholder='Tu nombre'
        style={inputStyle}
      />

      <label>URL de foto de perfil:</label>
      <input 
        value={foto}
        onChange={(e)=>setFoto(e.target.value)}
        placeholder='https://...'
        style={inputStyle}
      />

      <button onClick={handleSave} style={btnStyle}>Guardar cambios 💾</button>

      <div style={{ marginTop: '20px' }}>
        <button onClick={toggleTheme} style={btnStyle}>
          Cambiar a {darkMode ? 'modo claro ☀️' : 'modo oscuro 🌙'}
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <button onClick={handleLogout} style={{ ...btnStyle, background:'#ff4d4d' }}>
          Cerrar sesión 🚪
        </button>
      </div>

      <p style={{ marginTop:'40px', fontSize:'0.8rem', opacity:0.8 }}>Soporte: ayuda@loveplay.app 💬</p>
    </motion.div>
  );
}

const inputStyle = {
  margin:'8px',
  padding:'10px',
  borderRadius:'10px',
  border:'none',
  width:'220px',
  textAlign:'center'
};

const btnStyle = {
  background:'#c17bff',
  color:'#fff',
  border:'none',
  borderRadius:'10px',
  padding:'10px 20px',
  marginTop:'10px',
  cursor:'pointer'
};
