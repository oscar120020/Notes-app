import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface PWAStatusProps {
  onUpdateAvailable?: () => void;
}

const PWAStatus: React.FC<PWAStatusProps> = ({ onUpdateAvailable }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // toast.success('Conexión restaurada');
    };

    const handleOffline = () => {
      setIsOnline(false);
      // toast.error('Sin conexión - Modo offline activado');
    };

    // Verificar si la app está instalada
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    // Escuchar eventos de red
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('load', checkIfInstalled);

    // Verificar estado inicial
    checkIfInstalled();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('load', checkIfInstalled);
    };
  }, []);

  useEffect(() => {
    // Escuchar actualizaciones del Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(false);
        toast.success('Aplicación actualizada');
      });
    }
  }, []);

  const handleInstall = () => {
    // Mostrar prompt de instalación si está disponible
    if ('beforeinstallprompt' in window) {
      const event = new Event('beforeinstallprompt');
      window.dispatchEvent(event);
    }
  };

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
    onUpdateAvailable?.();
  };

  if (!isOnline && !isInstalled) {
    return (
      <div className="fixed bottom-4 left-4 bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium">
            Instala la app para mejor experiencia offline
          </span>
          <button
            onClick={handleInstall}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Instalar
          </button>
        </div>
      </div>
    );
  }

  if (updateAvailable) {
    return (
      <div className="fixed bottom-4 left-4 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="text-sm font-medium">
            Nueva versión disponible
          </span>
          <button
            onClick={handleUpdate}
            className="text-green-600 hover:text-green-800 underline text-sm"
          >
            Actualizar
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAStatus; 