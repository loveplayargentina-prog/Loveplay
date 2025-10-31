import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatorCard({ name, description, image }) {
  const navigate = useNavigate();
  return (
    <div style={{
      background: 'linear-gradient(135deg, #ff66b2, #ff99cc)',
      borderRadius: 20,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      margin: 10,
      padding: 15,
      width: 200,
      textAlign: 'center'
    }}>
      <img src={image} alt={name} style={{ width: '100%', borderRadius: 15 }} />
      <h3>💖 {name}</h3>
      <p>{description}</p>
      <button onClick={() => navigate(`/profile/${name}`)} style={{
        background: '#ff3366',
        color: 'white',
        border: 'none',
        borderRadius: 10,
        padding: '8px 12px',
        cursor: 'pointer'
      }}>Ver perfil</button>
    </div>
  );
}
