import React from 'react';

export const BuyContentButton = ({ usuarioId, creadorId, precio }) => {
  const handleBuy = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/pay-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId, creadorId, precio })
      });
      const data = await response.json();
      if (data.success) {
        alert('Redirigiendo a pago 💳');
        window.open(data.init_point, '_blank');
      } else {
        alert('Error en la compra 💔');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor 💥');
    }
  };

  return (
    <button
      onClick={handleBuy}
      style={{
        background: 'linear-gradient(135deg,#ff4d4d,#c17bff)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '10px',
        fontSize: '1rem',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        marginTop: '10px'
      }}
    >
      Comprar contenido 🔥
    </button>
  );
};
