import React from 'react';
import { useParams } from 'react-router-dom';
import { BuyContentButton } from '../components/BuyContentButton';

export default function Profile() {
  const { nombre } = useParams();

  const creadorId = nombre.toLowerCase(); // simple id temporal
  const usuarioId = 'user-demo'; // en producción se toma del usuario logueado
  const precio = 1000; // precio ejemplo

  return (
    <div style={{
      textAlign:'center',
      background:'linear-gradient(135deg,#ff8de3,#c17bff)',
      color:'#fff', height:'100vh', paddingTop:'50px'
    }}>
      <h1>💖 Perfil de {nombre}</h1>
      <p>Contenido exclusivo 🔥</p>
      <BuyContentButton usuarioId={usuarioId} creadorId={creadorId} precio={precio}/>
    </div>
  );
}
