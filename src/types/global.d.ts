// Declaraciones globales para módulos sin tipos
declare module 'turndown';
declare module 'html2pdf.js';

// Extender la interfaz Window si es necesario
declare global {
  interface Window {
    html2pdf?: any;
  }
}

export {}; 