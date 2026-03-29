import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, icon, text) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, icon, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toast-container" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`toast ${t.type}`}
              style={{
                background: t.type === 'success' ? '#10b981' : t.type === 'error' ? '#ef4444' : t.type === 'warning' ? '#f59e0b' : '#6366f1',
                backdropFilter: 'blur(16px)',
                padding: '14px 20px',
                borderRadius: '14px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.12)',
                minWidth: '300px',
                fontSize: '13px',
                fontWeight: '700',
                borderLeft: `4px solid ${t.type === 'success' ? '#059669' : t.type === 'error' ? '#dc2626' : t.type === 'info' ? '#4f46e5' : '#d97706'}`
              }}
            >
              <span style={{ fontSize: '20px' }}>{t.icon}</span>
              <span style={{ flex: 1 }}>{t.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
