import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from '../config/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default async function UploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [uploading, setUploading] = useState(false);

  const storage = getStorage();

  const handleUpload = async () => {
    if (!file || !title) {
      alert('Falta archivo o título');
      return;
    }

    setUploading(true);
    try {
      const user = auth.currentUser;
      const fileRef = ref(storage, `posts/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        title,
        desc,
        price: Number(price),
        url,
        createdAt: serverTimestamp(),
      });

      alert('Contenido subido correctamente 💖');
      setFile(null);
      setTitle('');
      setDesc('');
      setPrice('');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg,#ffb6ff,#bfe9ff)',
      }}
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ color: '#fff', marginBottom: 20 }}
      >
        Subir nuevo contenido 📤
      </motion.h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: 10 }}
      />
      <input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
      />
      <textarea
        placeholder="Descripción"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        style={inputStyle}
      />
      <input
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={inputStyle}
      />

      <button onClick={handleUpload} style={btnStyle} disabled={uploading}>
        {uploading ? 'Subiendo...' : 'Subir 💎'}
      </button>
    </div>
  );
}

const inputStyle = {
  margin: '5px',
  padding: '10px',
  borderRadius: '10px',
  border: 'none',
  width: '250px',
};

const btnStyle = {
  background: '#6a11cb',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  padding: '10px 20px',
  marginTop: '10px',
  cursor: 'pointer',
};
