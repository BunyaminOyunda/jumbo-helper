import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          console.log('Service Worker update found');
        });
      })
      .catch((error) => {
        console.error('❌ SW registration failed:', error.message, error);
        // Fallback: PWA will work without offline support
      });
  });
} else {
  console.warn('Service Workers are not supported in this browser');
}

createRoot(document.getElementById("root")!).render(<App />);
