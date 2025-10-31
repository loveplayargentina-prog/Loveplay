import React from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaUser, FaChartPie, FaCog } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: <FaHome size={22} />, label: 'Feed', path: '/feed' },
    { icon: <FaUser size={22} />, label: 'Perfil', path: '/profile/yo' },
    { icon: <FaChartPie size={22} />, label: 'Stats', path: '/stats' },
    { icon: <FaCog size={22} />, label: 'Ajustes', path: '/config' }
  ];

  return (
    <motion.div 
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        background: 'linear-gradient(135deg, #c17bff, #ff8de3)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px 0',
        boxShadow: '0 -3px 10px rgba(0,0,0,0.2)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
      }}
    >
      {tabs.map((tab) => (
        <motion.div
          key={tab.path}
          whileTap={{ scale: 0.8 }}
          onClick={() => navigate(tab.path)}
          style={{
            color: location.pathname === tab.path ? '#fff' : '#eee',
            textAlign: 'center',
            flex: 1,
            cursor: 'pointer'
          }}
        >
          <div>{tab.icon}</div>
          <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>{tab.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
