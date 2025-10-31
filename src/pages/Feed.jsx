import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setPosts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleBuy = (p) => {
    const total = p.price * 1.21; // +21% comisión al comprador
    const creador = p.price * 0.95; // el creador recibe 95%
    alert(`💖 Compraste contenido por $ ${total.toFixed(2)} (creador gana $ ${creador.toFixed(2)})`);
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Cargando contenido... 💞</p>;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg,#ff8de3,#c17bff)',
        minHeight: '100vh',
        overflowY: 'auto',
        color: '#fff',
        paddingBottom: '80px',
      }}
    >
      <h2 style={{ textAlign: 'center', paddingTop: '20px' }}>🔥 LovePlay Feed</h2>

      {posts.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '15px',
            margin: '20px auto',
            width: '90%',
            maxWidth: '400px',
            padding: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          }}
        >
          <h3 style={{ color: '#fff' }}>{p.title}</h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{p.desc}</p>
          {p.fileUrl && p.fileUrl.match(/\.mp4|\.webm|\.mov|\.avi/)
            ? <video src={p.fileUrl} controls style={{ width: '100%', borderRadius: '10px', marginTop: '10px' }} />
            : <img src={p.fileUrl} alt='Post' style={{ width: '100%', borderRadius: '10px', marginTop: '10px' }} />}
          
          {p.price > 0 ? (
            <button
              onClick={() => handleBuy(p)}
              style={{
                marginTop: '10px',
                background: '#ff4d4d',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 15px',
                width: '100%',
              }}
            >
              Comprar 💋 ($ {p.price})
            </button>
          ) : (
            <p style={{ textAlign: 'center', marginTop: '10px' }}>Gratis 💖</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
