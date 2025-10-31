import React, { useState } from 'react';
import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function LoginRegister() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'usuarios', userCredential.user.uid), { nombre, email });
        alert('Registro exitoso 💖');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Inicio de sesión correcto 💋');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(135deg,#ff8de3,#c17bff)',
        height: '100vh',
        justifyContent: 'center',
      }}
    >
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>
        {isRegister ? 'Crear cuenta 💖' : 'Iniciar sesión 🔥'}
      </h2>

      {isRegister && (
        <input
          style={inputStyle}
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      )}

      <input
        style={inputStyle}
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        style={inputStyle}
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSubmit} style={btnStyle}>
        {isRegister ? 'Registrarme 💘' : 'Entrar 💋'}
      </button>

      <p
        onClick={() => setIsRegister(!isRegister)}
        style={{ color: '#fff', marginTop: '10px', cursor: 'pointer' }}
      >
        {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
      </p>
    </div>
  );
}

const inputStyle = {
  margin: '5px',
  padding: '10px',
  borderRadius: '10px',
  border: 'none',
  width: '200px',
};

const btnStyle = {
  background: '#ff4d4d',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  padding: '10px 20px',
  marginTop: '10px',
};
